package com.naturegrain.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.naturegrain.entity.ERole;
import com.naturegrain.entity.Role;
import com.naturegrain.entity.User;
import com.naturegrain.exception.BadRequestException;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.ChangePasswordRequest;
import com.naturegrain.model.request.CreateUserRequest;
import com.naturegrain.model.request.UpdateProfileRequest;
import com.naturegrain.repository.RoleRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;    @Override
    @Transactional
    public User register(CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        
        // Set additional user information
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        
        Set<String> strRoles = request.getRole();
        Set<Role> roles = new HashSet<>();
      
        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                case "admin":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
          
                    break;
                case "mod":
                    Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(modRole);
          
                    break;
                default:
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                }
            });
        }
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return savedUser;
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new NotFoundException("Not Found User With Username: " + username));
        return user;
    }    @Override
    @Transactional
    public User updateUser(UpdateProfileRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new NotFoundException("Not Found User With Username: " + request.getUsername()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setEmail(request.getEmail());
        user.setCountry(request.getCountry());
        user.setState(request.getState());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        
        // Cập nhật avatar nếu có
        if (request.getAvatar() != null && !request.getAvatar().isEmpty()) {
            user.setAvatar(request.getAvatar());
        }
        
        userRepository.save(user);
        return user;
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new NotFoundException("Not Found User With Username: " + request.getUsername()));

        // Kiểm tra mật khẩu cũ - phải dùng matches để so sánh với mật khẩu đã mã hóa
        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Old Password Is Incorrect");
        }
        
        // Kiểm tra mật khẩu mới có giống mật khẩu cũ không
        if (encoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New Password Must Be Different From Old Password");
        }
        
        // Mã hóa và cập nhật mật khẩu mới
        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
