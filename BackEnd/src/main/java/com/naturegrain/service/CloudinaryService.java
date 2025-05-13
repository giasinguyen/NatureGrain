package com.naturegrain.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;
    private final CloudinaryAvailabilityService availabilityService;
    private final FileStorageService fileStorageService;    @Value("${cloudinary.folder:${CLOUDINARY_FOLDER:naturegrain}}")
    private String folder;
    
    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;/**
     * Tải một tệp hình ảnh lên Cloudinary
     * 
     * @param file MultipartFile cần tải lên
     * @return URL của hình ảnh đã tải lên
     * @throws IOException nếu có lỗi khi tải lên
     */
    public String uploadImage(MultipartFile file) throws IOException {
        // Kiểm tra xem Cloudinary có khả dụng không
        if (!availabilityService.isCloudinaryAvailable()) {
            // Fallback to local file storage
            log.info("Cloudinary unavailable, using local storage fallback");
            return uploadToLocalStorage(file);
        }
        
        try {
            // Tạo tên tệp ngẫu nhiên để tránh trùng lặp
            String fileName = generateFileName(file);
            
            // Thiết lập các tùy chọn tải lên
            Map<String, Object> options = new HashMap<>();
            options.put("public_id", folder + "/" + fileName);
            options.put("overwrite", true);
            options.put("resource_type", "auto");
            options.put("quality", "auto:good"); // Sử dụng tính năng tự động tối ưu hóa chất lượng
              // Tải lên Cloudinary và nhận kết quả
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            log.info("Image uploaded to Cloudinary: {}", uploadResult.get("public_id"));
            
            // Trả về URL của hình ảnh
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            log.error("Failed to upload image to Cloudinary, using local storage fallback", e);
            // Set Cloudinary as unavailable for future requests
            availabilityService.recheckAvailability();
            // Fallback to local file storage
            return uploadToLocalStorage(file);
        }
    }
    
    /**
     * Backup upload method to local storage when Cloudinary is unavailable
     */
    private String uploadToLocalStorage(MultipartFile file) throws IOException {
        String fileName = fileStorageService.storeFile(file, "photos");
        log.info("Image uploaded to local storage: {}", fileName);
        return "/api/files/photos/" + fileName;
    }

    /**
     * Tải nhiều tệp hình ảnh lên Cloudinary
     * 
     * @param files Danh sách MultipartFile cần tải lên
     * @return Danh sách URL của các hình ảnh đã tải lên
     * @throws IOException nếu có lỗi khi tải lên
     */
    public List<String> uploadImages(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        
        for (MultipartFile file : files) {
            String url = uploadImage(file);
            urls.add(url);
        }
        
        return urls;
    }
    
    /**
     * Xóa một hình ảnh khỏi Cloudinary
     * 
     * @param publicId ID công khai của hình ảnh (lấy từ URL)
     * @return true nếu xóa thành công, false nếu có lỗi
     */
    public boolean deleteImage(String publicId) {
        try {
            // Trích xuất public_id từ URL nếu cần
            String actualPublicId = extractPublicIdFromUrl(publicId);
              // Xóa hình ảnh từ Cloudinary
            Map<String, Object> result = cloudinary.uploader().destroy(actualPublicId, ObjectUtils.emptyMap());
            
            // Kiểm tra kết quả
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            log.error("Failed to delete image from Cloudinary", e);
            return false;
        }
    }
    
    /**
     * Tạo tên file ngẫu nhiên cho hình ảnh
     */
    private String generateFileName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String extension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        return UUID.randomUUID().toString() + extension;
    }
    
    /**
     * Trích xuất public_id từ URL Cloudinary
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
                return afterUpload.substring(versionIndex + 1, afterUpload.lastIndexOf("."));
            }
        }
        
        return url; // Trả về url gốc nếu không thể phân tích
    }
}
