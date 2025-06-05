package com.naturegrain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.User;
import com.naturegrain.model.request.UpdateProfileRequest;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.ActivityService;
import com.naturegrain.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*",maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    @Operation(summary="Lấy ra user bằng username")
    public ResponseEntity<User> getuser(@RequestParam("username") String username){
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }    @PutMapping("/update")
    @Operation(summary="Cập nhật user")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request){
        User user = userService.updateUser(request);
        
        // Log activity for user profile update
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User currentUser = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (currentUser != null && user != null) {
                    String title = "Hồ sơ người dùng được cập nhật";
                    String description = String.format("Người dùng %s đã cập nhật hồ sơ", user.getUsername());
                    activityService.createActivity(ActivityType.USER_UPDATED, title, description, currentUser, "User", user.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the profile update
            System.err.println("Failed to log user profile update activity: " + e.getMessage());
        }

        return ResponseEntity.ok(user);
    }

    // @PutMapping("/password")
    // public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request){
    //     userService.changePassword(request);
    //     return ResponseEntity.ok(new MessageResponse("Change Password Success!"));
    // }
}
