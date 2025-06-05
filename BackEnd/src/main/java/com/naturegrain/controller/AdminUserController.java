package com.naturegrain.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.ERole;
import com.naturegrain.entity.Role;
import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateUserRequest;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.RoleRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.ActivityService;
import com.naturegrain.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin User Management", description = "Endpoints for admin to manage users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ActivityService activityService;

    @GetMapping("")
    @Operation(summary = "Get all users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/role")
    @Operation(summary = "Update user role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String roleName = payload.get("role");
        if (roleName == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Role is required"));
        }
        
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOpt.get();
        Set<Role> roles = user.getRoles();
        roles.clear();
        
        // Convert role string to ERole enum
        ERole eRole;
        switch (roleName) {
            case "ROLE_ADMIN":
                eRole = ERole.ROLE_ADMIN;
                break;
            case "ROLE_MODERATOR":
                eRole = ERole.ROLE_MODERATOR;
                break;
            default:
                eRole = ERole.ROLE_USER;
        }
        
        // Find role in repository
        Role role = roleRepository.findByName(eRole)
            .orElseThrow(() -> new RuntimeException("Error: Role not found"));
          roles.add(role);
        user.setRoles(roles);
        userRepository.save(user);
        
        // Log activity for user role change
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User adminUser = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (adminUser != null) {
                    String title = "Thay đổi quyền người dùng";
                    String description = String.format("Quyền của người dùng '%s' đã được thay đổi thành %s bởi %s", 
                                                      user.getUsername(), roleName, adminUser.getUsername());
                    activityService.createActivity(ActivityType.ADMIN_ACTION, title, description, adminUser, "User", user.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the role update
            System.err.println("Failed to log user role update activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("User role updated successfully"));
    }
    
    @PutMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle user active status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
          User user = userOpt.get();
        // Toggle active state
        boolean currentActive = user.isActive();
        user.setActive(!currentActive);
        userRepository.save(user);
        
        // Log activity for user status toggle
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User adminUser = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (adminUser != null) {
                    String action = !currentActive ? "kích hoạt" : "vô hiệu hóa";
                    String title = String.format("Thay đổi trạng thái người dùng");
                    String description = String.format("Tài khoản '%s' đã được %s bởi %s", 
                                                      user.getUsername(), action, adminUser.getUsername());
                    activityService.createActivity(ActivityType.ADMIN_ACTION, title, description, adminUser, "User", user.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the status toggle
            System.err.println("Failed to log user status toggle activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("User status toggled successfully"));
    }
      @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (!userOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        User userToDelete = userOpt.get();
        userRepository.deleteById(id);
        
        // Log activity for user deletion
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User adminUser = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (adminUser != null) {
                    String title = "Xóa người dùng";
                    String description = String.format("Tài khoản '%s' đã được xóa bởi %s", 
                                                      userToDelete.getUsername(), adminUser.getUsername());
                    activityService.createActivity(ActivityType.ADMIN_ACTION, title, description, adminUser, "User", userToDelete.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the user deletion
            System.err.println("Failed to log user deletion activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("User deleted successfully"));
    }
      @PostMapping("/create")
    @Operation(summary = "Create a new user")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            User newUser = userService.register(request);
            
            // Log activity for admin creating user
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated() && 
                    authentication.getPrincipal() instanceof UserDetailsImpl) {
                    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                    User admin = userRepository.findById(userDetails.getId()).orElse(null);
                    
                    if (admin != null && newUser != null) {
                        String title = "Người dùng được tạo bởi admin";
                        String description = String.format("Admin %s đã tạo tài khoản mới cho %s", 
                                                          admin.getUsername(), newUser.getUsername());
                        activityService.createActivity(ActivityType.ADMIN_ACTION, title, description, admin, "User", newUser.getId());
                    }
                }
            } catch (Exception e) {
                // Log error but don't fail the user creation
                System.err.println("Failed to log admin user creation activity: " + e.getMessage());
            }
            
            return ResponseEntity.ok(new MessageResponse("User created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    @Operation(summary = "Get user statistics")
    public ResponseEntity<?> getUserStats() {
        List<User> users = userRepository.findAll();
        
        long totalUsers = users.size();
        long activeUsers = users.stream().filter(User::isActive).count();
        long inactiveUsers = totalUsers - activeUsers;
        
        // Count users by role
        Map<String, Long> usersByRole = new HashMap<>();
        usersByRole.put("admin", users.stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_ADMIN))
            .count());
        usersByRole.put("moderator", users.stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_MODERATOR))
            .count());
        usersByRole.put("user", users.stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_USER))
            .count());
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", inactiveUsers);
        stats.put("usersByRole", usersByRole);
        
        return ResponseEntity.ok(stats);
    }
}
