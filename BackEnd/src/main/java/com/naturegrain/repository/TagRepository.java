package com.naturegrain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag,Long> {
    
}
