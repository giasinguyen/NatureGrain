package com.naturegrain.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.naturegrain.exception.FileStorageException;
import com.naturegrain.exception.NotFoundException;

@Service
public class FileStorageService {
    
    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:${user.home}/uploads}") String fileUploadDir) {
        this.fileStorageLocation = Paths.get(fileUploadDir).toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }
    
    public String storeFile(MultipartFile file, String subDirectory) {
        Path targetLocation = this.fileStorageLocation;
        
        if (subDirectory != null && !subDirectory.isEmpty()) {
            targetLocation = Paths.get(this.fileStorageLocation.toString(), subDirectory);
            try {
                Files.createDirectories(targetLocation);
            } catch (Exception ex) {
                throw new FileStorageException("Could not create sub-directory " + subDirectory, ex);
            }
        }
        
        // Normalize file name
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        try {
            // Check if the filename contains invalid characters
            if (fileName.contains("..")) {
                throw new FileStorageException("Filename contains invalid path sequence " + fileName);
            }
            
            // Copy file to the target location
            Path filePath = targetLocation.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }
    
    public Resource loadFileAsResource(String fileName, String subDirectory) {
        Path filePath;
        
        if (subDirectory != null && !subDirectory.isEmpty()) {
            filePath = Paths.get(this.fileStorageLocation.toString(), subDirectory, fileName);
        } else {
            filePath = this.fileStorageLocation.resolve(fileName);
        }
        
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new NotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new NotFoundException("File not found " + fileName, ex);
        }
    }
}
