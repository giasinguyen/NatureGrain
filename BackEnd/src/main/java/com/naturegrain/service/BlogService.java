package com.naturegrain.service;

import java.util.List;

import com.naturegrain.entity.Blog;
import com.naturegrain.model.request.CreateBlogRequest;

public interface BlogService {
    
    List<Blog> getList();

    List<Blog> getListNewest(int limit);

    Blog getBlog(long id);

    Blog createBlog(CreateBlogRequest request);

    Blog updateBlog(long id,CreateBlogRequest request);

    void deleteBlog(long id);

}
