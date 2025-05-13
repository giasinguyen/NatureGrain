package com.naturegrain.repository;

import com.naturegrain.entity.CloudinaryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CloudinaryImageRepository extends JpaRepository<CloudinaryImage, Long> {
    List<CloudinaryImage> findByUploadedById(Long userId);
    Optional<CloudinaryImage> findByPublicId(String publicId);
    Optional<CloudinaryImage> findByUrl(String url);
}
