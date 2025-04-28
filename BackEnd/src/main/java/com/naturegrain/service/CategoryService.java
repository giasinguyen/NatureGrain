package com.naturegrain.service;

import java.util.List;

import com.naturegrain.entity.Category;
import com.naturegrain.model.request.CreateCategoryRequest;

public interface CategoryService {
    List<Category> findAll();

    List<Category> getListEnabled();

    Category createCategory(CreateCategoryRequest request);

    Category updateCategory(long id,CreateCategoryRequest request);

    void enableCategory(long id);

    void deleteCategory(long id);
}
