package com.naturegrain.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.naturegrain.entity.Blog;
import com.naturegrain.entity.Image;
import com.naturegrain.entity.CloudinaryImage;
import com.naturegrain.entity.Tag;
import com.naturegrain.entity.User;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateBlogRequest;
import com.naturegrain.repository.BlogRepository;
import com.naturegrain.repository.ImageRepository;
import com.naturegrain.repository.CloudinaryImageRepository;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.repository.TagRepository;
import com.naturegrain.service.BlogService;
import java.sql.Timestamp;


@Service
public class BlogServiceImpl implements BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private TagRepository tagRepository;    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private CloudinaryImageRepository cloudinaryImageRepository;

    @Autowired
    private UserRepository userRepository;    @Override
    public List<Blog> getList() {
        // Use findAll without sorting first to avoid circular reference issues
        List<Blog> blogs = blogRepository.findAll();
        // Sort manually if needed
        blogs.sort((b1, b2) -> Long.compare(b2.getId(), b1.getId()));
        return blogs;
    }

    @Override
    public Blog getBlog(long id){
        // Use EntityGraph query to eagerly fetch image, user, and tags
        Blog blog = blogRepository.findByIdWithRelations(id);
        if (blog == null) {
            throw new NotFoundException("Not Found Blog");
        }
        return blog;
    }@Override
    public Blog createBlog(CreateBlogRequest request) {
        // TODO Auto-generated method stub
        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setDescription(request.getDescription());
        blog.setContent(request.getContent());
        
        // Try to find CloudinaryImage first, fallback to legacy Image if not found
        try {
            CloudinaryImage cloudinaryImage = cloudinaryImageRepository.findById(request.getImageId())
                .orElseThrow(() -> new NotFoundException("Not Found CloudinaryImage"));
            // Create and save a legacy Image object from CloudinaryImage for compatibility
            Image image = new Image();
            image.setName(cloudinaryImage.getName());
            image.setType(cloudinaryImage.getFormat());
            image.setUrl(cloudinaryImage.getImageUrl());
            image.setSize(cloudinaryImage.getSize() != null ? cloudinaryImage.getSize() : 0);
            image.setUploadedBy(cloudinaryImage.getUploadedBy());
            image = imageRepository.save(image);
            blog.setImage(image);
        } catch (NotFoundException e) {
            // Fallback to legacy Image table
            Image image = imageRepository.findById(request.getImageId())
                .orElseThrow(() -> new NotFoundException("Not Found Image"));
            blog.setImage(image);
        }
        
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(()-> new NotFoundException("Not Found User"));
        blog.setUser(user);
        blog.setCreateAt(new Timestamp(System.currentTimeMillis()));
        Set<Tag> tags = new HashSet<>();
        for(Long tagId : request.getTags()){
            Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new NotFoundException("Not Found Tag"));
            tags.add(tag);
        }
        blog.setTags(tags);
        blogRepository.save(blog);
        return blog;
    }    @Override
    public Blog updateBlog(long id, CreateBlogRequest request) {
        // TODO Auto-generated method stub
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new NotFoundException("Not Found Blog"));
        blog.setTitle(request.getTitle());
        blog.setDescription(request.getDescription());
        blog.setContent(request.getContent());
        
        // Handle image update - only update if imageId is provided
        if (request.getImageId() != null) {
            // Try to find CloudinaryImage first, fallback to legacy Image if not found
            try {
                CloudinaryImage cloudinaryImage = cloudinaryImageRepository.findById(request.getImageId())
                    .orElseThrow(() -> new NotFoundException("Not Found CloudinaryImage"));
                // Create and save a legacy Image object from CloudinaryImage for compatibility
                Image image = new Image();
                image.setName(cloudinaryImage.getName());
                image.setType(cloudinaryImage.getFormat());
                image.setUrl(cloudinaryImage.getImageUrl());
                image.setSize(cloudinaryImage.getSize() != null ? cloudinaryImage.getSize() : 0);
                image.setUploadedBy(cloudinaryImage.getUploadedBy());
                image = imageRepository.save(image);
                blog.setImage(image);
            } catch (NotFoundException e) {
                // Fallback to legacy Image table
                Image image = imageRepository.findById(request.getImageId())
                    .orElseThrow(() -> new NotFoundException("Not Found Image"));
                blog.setImage(image);
            }
        }
        // If imageId is null, keep the existing image unchanged
        
        Set<Tag> tags = new HashSet<>();
        for(Long tagId : request.getTags()){
            Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new NotFoundException("Not Found Tag"));
            tags.add(tag);
        }
        blog.setTags(tags);
        blogRepository.save(blog);
        return blog;
    }@Override
    public void deleteBlog(long id) {
        // TODO Auto-generated method stub
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new NotFoundException("Not Found Blog"));
        // Clear tag associations before deleting
        blog.getTags().clear();
        blogRepository.delete(blog);
    }

    @Override
    public List<Blog> getListNewest(int limit) {
        // Atualizado para usar PageRequest em vez do parâmetro limit na consulta SQL
        PageRequest pageable = PageRequest.of(0, limit);
        return blogRepository.getListNewest(pageable);
    }
}
