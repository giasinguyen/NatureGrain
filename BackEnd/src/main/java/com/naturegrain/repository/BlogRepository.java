package com.naturegrain.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.naturegrain.entity.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog,Long> {
    
    // Usar EntityGraph para carregar relações de forma otimizada
    @EntityGraph(attributePaths = {"image", "user", "tags"})
    @Query("SELECT b FROM Blog b ORDER BY b.id DESC")
    List<Blog> getListNewest(Pageable pageable);
    
    // Adicionar método personalizado para buscar todos com EntityGraph
    @EntityGraph(attributePaths = {"image", "user", "tags"})
    @Override
    List<Blog> findAll();
    
    // Método para buscar todos com ordenação e EntityGraph
    @EntityGraph(attributePaths = {"image", "user", "tags"})
    @Query("SELECT b FROM Blog b ORDER BY b.id DESC")
    List<Blog> findAllOrderByIdDesc();
    
    // Método para buscar por ID com EntityGraph
    @EntityGraph(attributePaths = {"image", "user", "tags"})
    @Query("SELECT b FROM Blog b WHERE b.id = :id")
    Blog findByIdWithRelations(Long id);
}
