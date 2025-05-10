package com.naturegrain.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:${user.home}/uploads}")
    private String fileUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Đăng ký resource handler cho các file tải lên
        Path uploadDir = Paths.get(fileUploadDir);
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        
        // Các thư mục con trong upload dir
        registry.addResourceHandler("/api/files/avatars/**")
                .addResourceLocations("file:" + uploadPath + "/avatars/");
                
        registry.addResourceHandler("/api/files/photos/**")
                .addResourceLocations("file:" + uploadPath + "/photos/");
    }
}
