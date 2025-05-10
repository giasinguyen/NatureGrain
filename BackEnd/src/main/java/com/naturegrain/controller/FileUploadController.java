package com.naturegrain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class FileUploadController {
    
    @Autowired
    private UserAvatarController userAvatarController;
    
    @PostMapping("/avatar")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload avatar cho người dùng hiện tại - Chuyển hướng sang lưu vào DB dưới dạng Base64")
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file) {
        // Debug log chi tiết hơn
        System.out.println("FileUploadController received file: " + 
                          (file != null ? file.getOriginalFilename() + ", size: " + file.getSize() + " bytes" : "null"));
        
        // Chuyển hướng sang controller mới để lưu vào DB dưới dạng Base64 string
        return userAvatarController.uploadAvatar(file);
    }
}
