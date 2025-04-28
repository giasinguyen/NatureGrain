package com.naturegrain.service.impl;

import com.naturegrain.entity.Image;
import com.naturegrain.repository.ImageRepository;
import com.naturegrain.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Image getImageById(long id) {
        Optional<Image> imageOptional = imageRepository.findById(id);
        return imageOptional.orElse(null);
    }
}
