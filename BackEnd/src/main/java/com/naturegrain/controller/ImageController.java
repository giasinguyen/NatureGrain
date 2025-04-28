package com.naturegrain.controller;

import com.naturegrain.entity.Image;
import com.naturegrain.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable("id") long id) {
        Image image = imageService.getImageById(id);
        
        if (image == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(image.getType()));
        headers.setContentLength(image.getSize());
        
        return new ResponseEntity<>(image.getData(), headers, HttpStatus.OK);
    }
}
