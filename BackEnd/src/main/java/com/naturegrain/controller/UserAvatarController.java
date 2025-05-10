package com.naturegrain.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/avatar")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class UserAvatarController {

    @Autowired
    private UserRepository userRepository;
      @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload avatar cho người dùng hiện tại và lưu vào database dưới dạng Base64")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Debug log
            System.out.println("UserAvatarController received file: " + (file != null ? file.getOriginalFilename() : "null"));
            
            // Kiểm tra file null
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Không có file được tải lên"));
            }
            
            // Kiểm tra xem file có phải là hình ảnh không
            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Chỉ chấp nhận file hình ảnh"));
            }
            
            // Giới hạn kích thước file (5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Kích thước file không được vượt quá 5MB"));
            }
            
            // Lấy thông tin người dùng hiện tại
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Lấy user từ database
            User user = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new NotFoundException("User not found"));
            
            // Chuyển đổi file thành Base64 String để lưu trữ (thay vì byte array)            // Trước khi xử lý, kiểm tra kích thước tệp
            if (file.getSize() > 1024 * 1024) { // Nếu > 1MB, thực hiện nén
                // Cần import thư viện để xử lý ảnh như Thumbnailator hoặc ImageIO
                // Đây là hướng tiếp cận đơn giản hơn - chỉ giới hạn kích thước
                if (file.getSize() > 2 * 1024 * 1024) { // Nếu > 2MB
                    throw new IllegalArgumentException("File quá lớn để lưu dưới dạng Base64. Vui lòng chọn file nhỏ hơn 2MB");
                }
            }
            
            byte[] fileBytes = file.getBytes();
            String base64Avatar = java.util.Base64.getEncoder().encodeToString(fileBytes);
            
            // Format thành Data URL để dùng trực tiếp trong HTML
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64Avatar;
            
            // Log kích thước của data URL
            System.out.println("Data URL length: " + dataUrl.length() + " characters");
            
            // Lưu Data URL vào trường avatar thay vì lưu dưới dạng byte array
            user.setAvatar(dataUrl);
            
            // Không cần lưu avatar data và content type nữa vì đã nhúng trong Data URL
            user.setAvatarData(null);
            user.setAvatarContentType(null);
            
            userRepository.save(user);
            
            return ResponseEntity.ok(new MessageResponse("Avatar đã được cập nhật thành công"));
        } catch (Exception e) {
            e.printStackTrace(); // Log lỗi chi tiết
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                    .body(new MessageResponse("Không thể upload avatar: " + e.getMessage()));
        }
    }
      @GetMapping("/{userId}")
    @Operation(summary = "Lấy avatar của người dùng từ database - Hỗ trợ tương thích ngược")
    public ResponseEntity<?> getAvatar(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                
                // Kiểm tra xem avatar có phải dạng Data URL không
                if (user.getAvatar() != null && user.getAvatar().startsWith("data:")) {
                    // Chuyển hướng người dùng đến endpoint mới 
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .header("Location", "/api/avatar/data/" + userId)
                            .build();
                }
                
                // Nếu có dữ liệu avatar dạng cũ (byte array)
                if (user.getAvatarData() != null) {
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(user.getAvatarContentType()))
                            .body(user.getAvatarData());
                }
            }
            
            // Trả về 404 nếu không tìm thấy avatar
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/data/{userId}")
    @Operation(summary = "Trả về Data URL của avatar để sử dụng trực tiếp trong HTML/CSS")
    public ResponseEntity<?> getAvatarDataUrl(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            
            if (userOptional.isPresent() && userOptional.get().getAvatar() != null 
                && userOptional.get().getAvatar().startsWith("data:")) {
                User user = userOptional.get();
                
                // Tạo một đối tượng JSON đơn giản chứa data URL
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(new MessageResponse(user.getAvatar()));
            }
            
            // Trả về 404 nếu không tìm thấy avatar
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
