package com.naturegrain.controller;

import com.naturegrain.entity.CloudinaryImage;
import com.naturegrain.entity.User;
import com.naturegrain.model.response.ApiResponse;
import com.naturegrain.model.response.CloudinaryImageResponse;
import com.naturegrain.repository.CloudinaryImageRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class CloudinaryImageController {
    
    private static final Logger log = LoggerFactory.getLogger(CloudinaryImageController.class);

    private final CloudinaryService cloudinaryService;
    private final CloudinaryImageRepository cloudinaryImageRepository;

    /**
     * Tải lên một hoặc nhiều hình ảnh lên Cloudinary
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadImages(
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            List<CloudinaryImageResponse> uploadedImages = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Tải lên Cloudinary
                String imageUrl = cloudinaryService.uploadImage(file);
                
                // Tạo đối tượng CloudinaryImage
                CloudinaryImage image = CloudinaryImage.builder()
                        .name(file.getOriginalFilename())
                        .publicId(extractPublicIdFromUrl(imageUrl))
                        .url(imageUrl)
                        .secureUrl(imageUrl)  // Cloudinary đã trả về secure URL
                        .format(getFileExtension(file.getOriginalFilename()))
                        .resourceType("image")
                        .size(file.getSize())
                        .createdAt(LocalDateTime.now())
                        .uploadedBy(new User(userDetails.getId()))
                        .build();
                
                // Lưu vào database
                CloudinaryImage savedImage = cloudinaryImageRepository.save(image);
                
                // Thêm vào danh sách response
                uploadedImages.add(mapToCloudinaryImageResponse(savedImage));
            }
            
            // Trả về kết quả
            Map<String, Object> response = new HashMap<>();
            response.put("images", uploadedImages);
            response.put("count", uploadedImages.size());
            
            return ResponseEntity.ok(new ApiResponse<>(true, "Tải lên hình ảnh thành công", response));
            
        } catch (IOException e) {
            log.error("Lỗi khi tải lên hình ảnh", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi tải lên hình ảnh: " + e.getMessage(), null));
        }
    }
    
    /**
     * Tải lên hình ảnh sản phẩm lên Cloudinary và trả về danh sách ID
     */
    @PostMapping("/product-images/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadProductImages(
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            List<CloudinaryImage> savedImages = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Tải lên Cloudinary
                String imageUrl = cloudinaryService.uploadImage(file);
                
                // Tạo đối tượng CloudinaryImage
                CloudinaryImage image = CloudinaryImage.builder()
                        .name(file.getOriginalFilename())
                        .publicId(extractPublicIdFromUrl(imageUrl))
                        .url(imageUrl)
                        .secureUrl(imageUrl)
                        .format(getFileExtension(file.getOriginalFilename()))
                        .resourceType("image")
                        .size(file.getSize())
                        .createdAt(LocalDateTime.now())
                        .uploadedBy(new User(userDetails.getId()))
                        .build();
                
                // Lưu vào database
                CloudinaryImage savedImage = cloudinaryImageRepository.save(image);
                savedImages.add(savedImage);
            }
            
            // Trả về ID hình ảnh giống endpoint hiện tại của ứng dụng
            List<Long> imageIds = savedImages.stream()
                    .map(CloudinaryImage::getId)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("imageIds", imageIds);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Lỗi khi tải lên hình ảnh sản phẩm", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi tải lên hình ảnh sản phẩm: " + e.getMessage(), null));
        }    }

    /**
     * Upload images for blog posts
     */
    @PostMapping("/blog-images/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> uploadBlogImages(
            @RequestParam("files") MultipartFile[] files,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        try {
            List<CloudinaryImage> savedImages = new ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    continue;
                }

                // Upload to Cloudinary with blog-specific folder
                String imageUrl = cloudinaryService.uploadImage(file);
                
                // Create CloudinaryImage object
                CloudinaryImage image = CloudinaryImage.builder()
                        .name(file.getOriginalFilename())
                        .publicId(extractPublicIdFromUrl(imageUrl))
                        .url(imageUrl)
                        .secureUrl(imageUrl)
                        .format(getFileExtension(file.getOriginalFilename()))
                        .resourceType("image")
                        .size(file.getSize())
                        .createdAt(LocalDateTime.now())
                        .uploadedBy(new User(userDetails.getId()))
                        .build();
                
                // Save to database
                CloudinaryImage savedImage = cloudinaryImageRepository.save(image);
                savedImages.add(savedImage);
            }
            
            // Return image information for blog use
            if (savedImages.size() == 1) {
                // Single image upload - return the image data directly
                CloudinaryImage image = savedImages.get(0);
                Map<String, Object> response = new HashMap<>();
                response.put("id", image.getId());
                response.put("url", image.getImageUrl());
                response.put("name", image.getName());
                return ResponseEntity.ok(new ApiResponse<>(true, "Blog image uploaded successfully", response));
            } else {
                // Multiple images - return list
                List<Map<String, Object>> imageList = savedImages.stream()
                        .map(image -> {
                            Map<String, Object> imageData = new HashMap<>();
                            imageData.put("id", image.getId());
                            imageData.put("url", image.getImageUrl());
                            imageData.put("name", image.getName());
                            return imageData;
                        })
                        .collect(Collectors.toList());
                
                return ResponseEntity.ok(new ApiResponse<>(true, "Blog images uploaded successfully", imageList));
            }
            
        } catch (IOException e) {
            log.error("Error uploading blog images", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error uploading blog images: " + e.getMessage(), null));
        }
    }

    /**
     * Lấy thông tin hình ảnh Cloudinary theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getImageById(@PathVariable("id") Long id) {
        Optional<CloudinaryImage> imageOpt = cloudinaryImageRepository.findById(id);
        
        if (imageOpt.isPresent()) {
            CloudinaryImageResponse response = mapToCloudinaryImageResponse(imageOpt.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy hình ảnh với ID: " + id, null));
        }
    }
    
    /**
     * Direct image access endpoint that redirects to the Cloudinary URL
     */    @GetMapping("/redirect/{id}")
    public ResponseEntity<?> redirectToImage(@PathVariable("id") Long id) {
        Optional<CloudinaryImage> imageOpt = cloudinaryImageRepository.findById(id);
        
        if (imageOpt.isPresent()) {
            CloudinaryImage image = imageOpt.get();
            String imageUrl = image.getSecureUrl() != null ? image.getSecureUrl() : image.getUrl();
            
            // Add cache control headers to prevent caching issues
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(imageUrl));
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy hình ảnh với ID: " + id, null));
        }
    }      /**
     * Legacy endpoint for backward compatibility
     * Redirects to the actual Cloudinary URL with cache control headers
     */
    @GetMapping("/image/{id}")
    public ResponseEntity<?> redirectToImageLegacy(@PathVariable("id") Long id) {
        Optional<CloudinaryImage> imageOpt = cloudinaryImageRepository.findById(id);
        
        if (imageOpt.isPresent()) {
            CloudinaryImage image = imageOpt.get();
            String imageUrl = image.getImageUrl();
            
            // Add cache control headers to prevent caching issues
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(URI.create(imageUrl));
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy hình ảnh với ID: " + id, null));
        }
    }
    
    /**
     * Xóa hình ảnh Cloudinary
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteImage(@PathVariable("id") Long id) {
        Optional<CloudinaryImage> imageOpt = cloudinaryImageRepository.findById(id);
        
        if (imageOpt.isPresent()) {
            CloudinaryImage image = imageOpt.get();
            
            // Xóa khỏi Cloudinary
            boolean deleted = cloudinaryService.deleteImage(image.getPublicId());
            
            if (deleted) {
                // Xóa khỏi database
                cloudinaryImageRepository.delete(image);
                return ResponseEntity.ok(new ApiResponse<>(true, "Xóa hình ảnh thành công", null));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ApiResponse<>(false, "Không thể xóa hình ảnh khỏi Cloudinary", null));
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy hình ảnh với ID: " + id, null));
        }
    }
    
    /**
     * Map CloudinaryImage sang CloudinaryImageResponse
     */
    private CloudinaryImageResponse mapToCloudinaryImageResponse(CloudinaryImage image) {
        return CloudinaryImageResponse.builder()
                .id(image.getId())
                .name(image.getName())
                .url(image.getImageUrl())
                .format(image.getFormat())
                .size(image.getSize())
                .width(image.getWidth())
                .height(image.getHeight())
                .createdAt(image.getCreatedAt())
                .build();
    }
    
    /**
     * Trích xuất public_id từ URL
     */
    private String extractPublicIdFromUrl(String url) {
        // Ví dụ URL: https://res.cloudinary.com/cloud-name/image/upload/v1/folder/file.jpg
        if (url == null || url.isEmpty()) {
            return "";
        }
        
        // Trích xuất phần sau v1/
        int uploadIndex = url.indexOf("/upload/");
        if (uploadIndex != -1) {
            String afterUpload = url.substring(uploadIndex + 8); // +8 for "/upload/"
            
            // Tìm phần sau v1/ hoặc v[number]/
            int versionIndex = afterUpload.indexOf("/");
            if (versionIndex != -1) {
                String path = afterUpload.substring(versionIndex + 1);
                if (path.contains(".")) {
                    return path.substring(0, path.lastIndexOf("."));
                }
                return path;
            }
        }
        
        return "unknown"; // Trả về unknown nếu không thể phân tích
    }
    
    /**
     * Lấy phần mở rộng của tệp
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.isEmpty() || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }
}
