package com.naturegrain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    
    @Query("SELECT c FROM Category c WHERE c.enable = true")
    List<Category> findALLByEnabled();
}
