package com.naturegrain.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.DependsOn;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:}")
    private String cloudNameFromProperties;

    @Value("${cloudinary.api-key:}")
    private String apiKeyFromProperties;

    @Value("${cloudinary.api-secret:}")
    private String apiSecretFromProperties;
    
    @Value("${cloudinary.folder:}")
    private String folderFromProperties;    @Bean
    @DependsOn("dotenv")
    public Cloudinary cloudinary(Dotenv dotenv) {
        // Ưu tiên sử dụng biến môi trường từ file .env
        String cloudName = dotenv.get("CLOUDINARY_CLOUD_NAME", cloudNameFromProperties);
        String apiKey = dotenv.get("CLOUDINARY_API_KEY", apiKeyFromProperties);
        String apiSecret = dotenv.get("CLOUDINARY_API_SECRET", apiSecretFromProperties);
        String folder = dotenv.get("CLOUDINARY_FOLDER", folderFromProperties);
        
        System.out.println("Configuring Cloudinary with cloud name: " + cloudName + ", folder: " + folder);
        
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        
        return new Cloudinary(config);
    }
}
