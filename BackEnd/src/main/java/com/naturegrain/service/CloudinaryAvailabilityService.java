package com.naturegrain.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Service to check and track Cloudinary availability
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryAvailabilityService {
    
    private final Cloudinary cloudinary;
    private AtomicBoolean cloudinaryAvailable = new AtomicBoolean(false);
    
    /**
     * Check if Cloudinary is available with valid credentials
     */    @PostConstruct
    public void checkCloudinaryAvailability() {
        try {
            // Try a simple ping to verify credentials - need to pass an empty map
            Object result = cloudinary.api().ping(java.util.Collections.emptyMap());
            log.info("Cloudinary connection verified: {}", result);
            cloudinaryAvailable.set(true);
        } catch (Exception e) {
            log.error("Failed to connect to Cloudinary. Image uploads will use local storage: {}", e.getMessage());
            cloudinaryAvailable.set(false);
        }
    }
    
    /**
     * Returns whether Cloudinary is available
     */
    public boolean isCloudinaryAvailable() {
        return cloudinaryAvailable.get();
    }
    
    /**
     * Force recheck of Cloudinary availability
     */    public boolean recheckAvailability() {
        try {
            Object result = cloudinary.api().ping(java.util.Collections.emptyMap());
            cloudinaryAvailable.set(true);
            log.info("Cloudinary reconnection successful");
            return true;
        } catch (Exception e) {
            cloudinaryAvailable.set(false);
            log.error("Cloudinary still unavailable: {}", e.getMessage());
            return false;
        }
    }
}
