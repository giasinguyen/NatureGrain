package com.naturegrain.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog,Long> {
    
    @Query("SELECT b FROM Blog b ORDER BY b.id DESC")
    List<Blog> getListNewest(Pageable pageable);
}
