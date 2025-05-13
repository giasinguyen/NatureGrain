package com.naturegrain.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.naturegrain.entity.Image;
import com.naturegrain.entity.Product;
import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.response.ImageInfoResponse;
import com.naturegrain.model.response.ImageUploadResponse;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.ImageRepository;
import com.naturegrain.repository.ProductRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/product-images")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductImageController {    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;@PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload hình ảnh cho sản phẩm")
    public ResponseEntity<?> uploadProductImage(
            @RequestParam("files") MultipartFile[] files) {
        
        try {
            List<Long> imageIds = new ArrayList<>();
            List<String> imageNames = new ArrayList<>();
            
            // Lấy thông tin người dùng hiện tại để ghi log người upload
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));
            
            for (MultipartFile file : files) {
                // Kiểm tra xem file có trống không
                if (file.isEmpty()) {
                    continue;
                }
                
                // Kiểm tra định dạng file
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    continue; // Bỏ qua nếu không phải là hình ảnh
                }
                
                // Tạo bản ghi hình ảnh mới
                Image image = new Image();
                image.setName(file.getOriginalFilename());
                image.setType(file.getContentType());
                image.setSize(file.getSize());
                image.setData(file.getBytes());
                image.setUploadedBy(user); // Lưu người upload
                
                // Lưu vào database
                Image savedImage = imageRepository.save(image);
                imageIds.add(savedImage.getId());
                imageNames.add(savedImage.getName());
            }
            
            if (imageIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Không có hình ảnh nào được upload");
            }
            
            return ResponseEntity.ok(new ImageUploadResponse(
                "Upload hình ảnh thành công", 
                imageIds, 
                imageNames
            ));
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Không thể upload hình ảnh: " + e.getMessage());        }
    }
      @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Lấy danh sách tất cả hình ảnh cho dashboard quản lý")
    public ResponseEntity<?> getAllImages() {
        try {
            List<Image> images = imageRepository.findAll();
            
            // Convert to lightweight response objects without image data
            List<ImageInfoResponse> response = images.stream()
                .map(image -> new ImageInfoResponse(
                    image.getId(),
                    image.getName(),
                    image.getType(),
                    image.getSize()
                ))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Không thể lấy danh sách hình ảnh: " + e.getMessage());
        }    }
    
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Xóa hình ảnh theo ID")
    public ResponseEntity<?> deleteImage(@PathVariable("id") long id) {
        try {
            // Kiểm tra xem hình ảnh có tồn tại không
            Image image = imageRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy hình ảnh với ID: " + id));
            
            // Kiểm tra xem hình ảnh có đang được sử dụng bởi sản phẩm nào không
            List<Product> productsUsingImage = productRepository.findAll().stream()
                    .filter(product -> product.getImages().stream()
                            .anyMatch(img -> img.getId() == id))
                    .collect(Collectors.toList());
            
            if (!productsUsingImage.isEmpty()) {
                // Xóa liên kết hình ảnh khỏi sản phẩm thay vì trả về lỗi
                for (Product product : productsUsingImage) {
                    product.setImages(product.getImages().stream()
                            .filter(img -> img.getId() != id)
                            .collect(Collectors.toSet()));
                    productRepository.save(product);
                }
            }
            
            // Xóa hình ảnh
            imageRepository.delete(image);
            
            return ResponseEntity.ok(new MessageResponse("Xóa hình ảnh thành công"));
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Không thể xóa hình ảnh: " + e.getMessage());
        }
    }
}
