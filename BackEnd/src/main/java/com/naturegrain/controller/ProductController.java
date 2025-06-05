package com.naturegrain.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.Product;
import com.naturegrain.entity.User;
import com.naturegrain.model.request.CreateProductRequest;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.ActivityService;
import com.naturegrain.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "*",maxAge = 3600)
public class ProductController {    @Autowired
    private ProductService productService;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private UserRepository userRepository;


    @GetMapping("/")
    @Operation(summary="Lấy ra danh sách sản phẩm")
    public ResponseEntity<List<Product>> getList(){
        List<Product> list = productService.getList();

        return ResponseEntity.ok(list);
    }

    @GetMapping("/newest/{number}")
    @Operation(summary="Lấy ra danh sách sản phẩm mới nhất giới hạn số lượng = number")
    public ResponseEntity<List<Product>> getListNewst(@PathVariable int number){
        List<Product> list =productService.getListNewst(number);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/latest")
    @Operation(summary = "Lấy ra danh sách sản phẩm mới nhất")
    public ResponseEntity<List<Product>> getListLatest() {
        List<Product> list = productService.getListLatest();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Lấy ra danh sách sản phẩm được đánh giá cao nhất")
    public ResponseEntity<List<Product>> getListTopRated() {
        List<Product> list = productService.getListTopRated();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/price")
    @Operation(summary="Lấy ra danh sách 8 sản phẩm có giá từ thấp nhất đến cao")
    public ResponseEntity<List<Product>> getListByPrice(){
        List<Product> list = productService.getListByPrice();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/related/{id}")
    @Operation(summary="Lấy ra ngẫu nhiên 4 sản phẩm bằng category_id")
    public ResponseEntity<List<Product>> getListRelatedProduct(@PathVariable long id){
        List<Product> list = productService.findRelatedProduct(id);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/category/{id}")
    @Operation(summary="Lấy ra danh sách sản phẩm bằng id của danh mục")
    public ResponseEntity<List<Product>> getListProductByCategory(@PathVariable long id){
        List<Product> list =  productService.getListProductByCategory(id);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/range")
    @Operation(summary="Lấy ra danh sách sản phẩm ở các mức giá từ min đến max")
    public ResponseEntity<List<Product>> getListProductByPriceRange(@RequestParam("id") long id,@RequestParam("min") int min, @RequestParam("max") int max){
        List<Product> list = productService.getListByPriceRange(id, min, max);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @Operation(summary="Lấy sản phẩm bằng id")
    public ResponseEntity<Product> getProduct(@PathVariable long id){
        Product product = productService.getProduct(id);

        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    @Operation(summary="Tìm kiếm sản phẩm bằng keyword")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam("keyword") String keyword){
        List<Product> list = productService.searchProduct(keyword);
        return ResponseEntity.ok(list);
    }    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Tạo mới sản phẩm")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest request){
        Product product = productService.createProduct(request);
        
        // Log activity for product creation
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (user != null && product != null) {
                    String title = "Sản phẩm mới được tạo";
                    String description = String.format("Sản phẩm '%s' đã được tạo bởi %s", 
                                                      product.getName(), user.getUsername());
                    activityService.createActivity(ActivityType.PRODUCT_CREATED, title, description, user, "Product", product.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the product creation
            System.err.println("Failed to log product creation activity: " + e.getMessage());
        }

        return ResponseEntity.ok(product);
    }    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Tìm sản phẩm bằng id và cập nhật sản phẩm đó")
    public ResponseEntity<?> updateProduct(@PathVariable long id, @RequestBody CreateProductRequest request){
        try {
            // Log incoming request data for debugging
            System.out.println("Updating product " + id + " with imageIds: " + 
                (request.getImageIds() != null ? request.getImageIds() : "null"));
            
            Product product = productService.updateProduct(id, request);
            
            // Log activity for product update
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated() && 
                    authentication.getPrincipal() instanceof UserDetailsImpl) {
                    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                    User user = userRepository.findById(userDetails.getId()).orElse(null);
                    
                    if (user != null && product != null) {
                        String title = "Sản phẩm được cập nhật";
                        String description = String.format("Sản phẩm '%s' đã được cập nhật bởi %s", 
                                                          product.getName(), user.getUsername());
                        activityService.createActivity(ActivityType.PRODUCT_UPDATED, title, description, user, "Product", product.getId());
                    }
                }
            } catch (Exception e) {
                // Log error but don't fail the product update
                System.err.println("Failed to log product update activity: " + e.getMessage());
            }
            
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            // Log the error and return a meaningful response
            System.err.println("Error updating product " + id + ": " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Error updating product: " + e.getMessage()));
        }
    }    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Xóa sản phẩm bằng id")
    public ResponseEntity<?> deleteProduct(@PathVariable long id){
        // Get product info before deletion for logging
        Product product = null;
        try {
            product = productService.getProduct(id);
        } catch (Exception e) {
            // Product might not exist
        }
        
        productService.deleteProduct(id);
        
        // Log activity for product deletion
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (user != null) {
                    String title = "Sản phẩm đã bị xóa";
                    String description = String.format("Sản phẩm %s đã bị xóa bởi %s", 
                                                      product != null ? "'" + product.getName() + "'" : "#" + id, 
                                                      user.getUsername());
                    activityService.createActivity(ActivityType.PRODUCT_DELETED, title, description, user, "Product", id);
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the product deletion
            System.err.println("Failed to log product deletion activity: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse("Product is deleted"));
    }


}
