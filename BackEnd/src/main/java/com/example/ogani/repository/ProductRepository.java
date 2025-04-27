package com.example.ogani.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.ogani.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query(value = "Select * from Product order by id desc limit :number",nativeQuery = true)
    List<Product> getListNewest(int number);

    @Query(value = "Select * from Product order by price limit 8 ",nativeQuery = true)
    List<Product> getListByPrice();

    @Query(value ="Select * from Product where category_id = :id order by rand() limit 4",nativeQuery = true)
    List<Product> findRelatedProduct(long id);

    @Query(value ="Select * from Product where category_id = :id",nativeQuery = true)
    List<Product> getListProductByCategory(long id);

    @Query(value = "SELECT p.id, p.name, p.description, p.price, p.quantity, p.category_id FROM product p WHERE p.category_id = :id AND p.price BETWEEN :min AND :max", nativeQuery = true)
    List<Product> getListProductByPriceRange(@Param("id") long id, @Param("min") int min, @Param("max") int max);

    @Query(value= "Select p from Product p where p.name like %:keyword% order by id desc")
    List<Product> searchProduct(String keyword);

}
