package com.naturegrain.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.naturegrain.entity.Category;
import com.naturegrain.entity.Image;
import com.naturegrain.entity.Product;
import com.naturegrain.exception.NotFoundException;
import com.naturegrain.model.request.CreateProductRequest;
import com.naturegrain.repository.CategoryRepository;
import com.naturegrain.repository.ImageRepository;
import com.naturegrain.repository.ProductRepository;
import com.naturegrain.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public List<Product> getList() {
        // TODO Auto-generated method stub
        return productRepository.findAll(Sort.by("id").descending());
    }

    @Override
    public Product getProduct(long id) {
        // TODO Auto-generated method stub
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + id));

        return product;
    }

    @Override
    public Product createProduct(CreateProductRequest request) {
        // TODO Auto-generated method stub
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Not Found Category With Id: " + request.getCategoryId()));
        product.setCategory(category);

        Set<Image> images = new HashSet<>();
        for (long imageId : request.getImageIds()) {
            Image image = imageRepository.findById(imageId)
                    .orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + imageId));
            images.add(image);
        }
        product.setImages(images);
        productRepository.save(product);
        return product;
    }

    @Override
    public Product updateProduct(long id, CreateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + id));
        
        // Update basic product information
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        
        // Update category
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Not Found Category With Id: " + request.getCategoryId()));
        product.setCategory(category);

        // Handle image IDs - ensure imageIds is not null and properly processed
        if (request.getImageIds() != null && !request.getImageIds().isEmpty()) {
            Set<Image> images = new HashSet<>();
            for (long imageId : request.getImageIds()) {
                try {
                    Image image = imageRepository.findById(imageId)
                            .orElseThrow(() -> new NotFoundException("Not Found Image With Id: " + imageId));
                    images.add(image);
                } catch (Exception e) {
                    // Log the error but continue with other images
                    System.err.println("Error finding image with ID " + imageId + ": " + e.getMessage());
                }
            }
            
            if (!images.isEmpty()) {
                // Only update if we found at least one valid image
                product.setImages(images);
            }
        }
        
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(long id) {
        // TODO Auto-generated method stub
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not Found Product With Id: " + id));
        // Clear the product-image relationship but don't delete the actual images
        product.setImages(new HashSet<>());
        productRepository.delete(product);
    }

    @Override
    public List<Product> getListNewst(int number) {
        // TODO Auto-generated method stub
        List<Product> list = productRepository.getListNewest(number);
        return list;
    }

    @Override
    public List<Product> getListByPrice() {
        // TODO Auto-generated method stub
        return productRepository.getListByPrice();
    }

    @Override
    public List<Product> findRelatedProduct(long id) {
        List<Product> list = productRepository.findRelatedProduct(id);
        return list;

    }

    @Override
    public List<Product> getListProductByCategory(long id) {
        List<Product> list = productRepository.getListProductByCategory(id);
        return list;
    }

    @Override
    public List<Product> getListByPriceRange(long id, int min, int max) {
        List<Product> list = productRepository.getListProductByPriceRange(id, min, max);
        return list;
    }

    @Override
    public List<Product> searchProduct(String keyword) {
        // TODO Auto-generated method stub
        List<Product> list = productRepository.searchProduct(keyword);
        return list;
    }

    @Override
    public List<Product> getListLatest() {
        // Sử dụng phương thức có sẵn để lấy sản phẩm mới nhất
        return getListNewst(8); // Lấy 8 sản phẩm mới nhất
    }

    @Override
    public List<Product> getListTopRated() {
        List<Product> products = getList();
        products.sort((p1, p2) -> Double.compare(p2.getPrice(), p1.getPrice()));
        return products.stream().limit(8).collect(Collectors.toList());
    }

}
