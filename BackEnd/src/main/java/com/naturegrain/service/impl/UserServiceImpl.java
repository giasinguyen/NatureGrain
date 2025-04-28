package com.naturegrain.service.impl;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.naturegrain.entity.ERole;
import com.naturegrain.entity.Role;
import com.naturegrain.entity.User;
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
    private PasswordEncoder encoder;

    @Override
    public void register(CreateUserRequest request) {
        // TODO Auto-generated method stub
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
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
          userRepository.save(user);
    }

    @Override
    public User getUserByUsername(String username) {
      // TODO Auto-generated method stub
      User user = userRepository.findByUsername(username).orElseThrow(() -> new NotFoundException("Not Found User"));
      return user;
    }

    @Override
    public User updateUser(UpdateProfileRequest request) {
      // TODO Auto-generated method stub
      User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User"));
      user.setFirstname(request.getFirstname());
      user.setLastname(request.getLastname());
      user.setEmail(request.getEmail());
      user.setCountry(request.getCountry());
      user.setState(request.getState());
      user.setAddress(request.getAddress());
      user.setPhone(request.getPhone());
      userRepository.save(user);
      return user;
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
      // TODO Auto-generated method stub
      // User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new NotFoundException("Not Found User"));

      // if(encoder.encode(request.getOldPassword()) != user.getPassword()){
      //   throw new BadRequestException("Old Passrword Not Same");
      // }
      // user.setPassword(encoder.encode(request.getNewPassword()));

      // userRepository.save(user);
      
    }


    
}
