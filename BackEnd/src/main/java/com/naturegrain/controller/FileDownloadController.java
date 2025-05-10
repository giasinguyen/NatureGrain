package com.naturegrain.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.service.FileStorageService;

import io.swagger.v3.oas.annotations.Operation;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileDownloadController {

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/avatars/{fileName:.+}")
    @Operation(summary = "Download avatar của người dùng")
    public ResponseEntity<Resource> downloadAvatar(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, "avatars", request);
    }

    @GetMapping("/photos/{fileName:.+}")
    @Operation(summary = "Download ảnh sản phẩm")
    public ResponseEntity<Resource> downloadProductPhoto(@PathVariable String fileName, HttpServletRequest request) {
        return downloadFile(fileName, "photos", request);
    }

    private ResponseEntity<Resource> downloadFile(String fileName, String subDirectory, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName, subDirectory);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Log the error but continue
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
