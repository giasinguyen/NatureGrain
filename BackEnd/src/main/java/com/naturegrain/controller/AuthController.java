package com.naturegrain.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.User;
import com.naturegrain.model.request.CreateUserRequest;
import com.naturegrain.model.request.LoginRequest;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.model.response.UserInfoResponse;
import com.naturegrain.security.jwt.JwtUtils;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/auth")
// Cấu hình CORS tương thích với frontend
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @Operation(summary="Đăng nhập")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);
        
        logger.info("User {} logged in successfully", userDetails.getUsername());        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        
        // Lấy thêm thông tin người dùng từ database
        User user = userService.getUserByUsername(userDetails.getUsername());

        // Trả về đầy đủ thông tin người dùng
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(new UserInfoResponse(
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles,
                        user.getFirstname(),
                        user.getLastname(),
                        user.getAvatar(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getCountry(),
                        user.getState()));
    }

    @PostMapping("/register")
    @Operation(summary="Đăng ký")
    public ResponseEntity<?> register(@Valid @RequestBody CreateUserRequest request){
      
        userService.register(request);
      
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/logout")
    @Operation(summary="Đăng xuất")
    public ResponseEntity<?> logoutUser() {
      ResponseCookie cookie = jwtUtils.getCleanJwtCookie();
      logger.info("User logged out successfully");
      return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
          .body(new MessageResponse("You've been logged out!"));
    }

    @GetMapping("/me")
    @Operation(summary="Get current authenticated user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication, HttpServletRequest request) {
        logger.debug("GET /api/auth/me được gọi");
        
        // Ghi log để debug các header và cookie
        String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authHeader);
          if (authentication != null && authentication.isAuthenticated()) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            logger.debug("User authenticated: {}", userDetails.getUsername());
            
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());
            
            // Lấy thêm thông tin người dùng từ database
            User user = userService.getUserByUsername(userDetails.getUsername());

            // Trả về đầy đủ thông tin người dùng
            return ResponseEntity.ok(new UserInfoResponse(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    user.getFirstname(),
                    user.getLastname(),
                    user.getAvatar(),
                    user.getPhone(),
                    user.getAddress(),
                    user.getCountry(),
                    user.getState()));
        } else {
            logger.warn("Yêu cầu đến /api/auth/me nhưng người dùng không được xác thực");
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }
    }
}
