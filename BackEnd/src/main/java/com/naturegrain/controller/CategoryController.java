package com.naturegrain.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.bind.annotation.RestController;

import com.naturegrain.entity.ActivityType;
import com.naturegrain.entity.Category;
import com.naturegrain.entity.User;
import com.naturegrain.model.request.CreateCategoryRequest;
import com.naturegrain.model.response.MessageResponse;
import com.naturegrain.repository.UserRepository;
import com.naturegrain.security.service.UserDetailsImpl;
import com.naturegrain.service.ActivityService;
import com.naturegrain.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = "*",maxAge = 3600)
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    @Operation(summary="Lấy danh sách danh mục")
    public ResponseEntity<?> getListCategory(){
        List<Category> categories = categoryService.findAll();
        return ResponseEntity.ok(categories);
    }    @GetMapping("/enabled")
    @Operation(summary="Lấy ra danh sách danh mục đã kích hoạt")
    public ResponseEntity<List<Category>> getListEnabled(){
        List<Category> categories = categoryService.getListEnabled();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @Operation(summary="Lấy danh mục bằng id")
    public ResponseEntity<Category> getCategoryById(@PathVariable long id){
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
    @PostMapping("/create")
    @Operation(summary="Tạo mới danh mục")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CreateCategoryRequest request){
        Category category = categoryService.createCategory(request);
        
        // Log activity for category creation
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (user != null && category != null) {
                    String title = "Danh mục mới được tạo";
                    String description = String.format("Danh mục '%s' đã được tạo bởi %s", 
                                                      category.getName(), user.getUsername());
                    activityService.createActivity(ActivityType.CATEGORY_CREATED, title, description, user, "Category", category.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the category creation
            System.err.println("Failed to log category creation activity: " + e.getMessage());
        }

        return ResponseEntity.ok(category);
    }    @PutMapping("/update/{id}")
    @Operation(summary="Tìm danh mục bằng id và cập nhật danh mục đó")
    public ResponseEntity<?> updateCategory(@PathVariable long id, @Valid @RequestBody CreateCategoryRequest request){
        Category category = categoryService.updateCategory(id, request);
        
        // Log activity for category update
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (user != null && category != null) {
                    String title = "Danh mục được cập nhật";
                    String description = String.format("Danh mục '%s' đã được cập nhật bởi %s", 
                                                      category.getName(), user.getUsername());
                    activityService.createActivity(ActivityType.CATEGORY_UPDATED, title, description, user, "Category", category.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the category update
            System.err.println("Failed to log category update activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(category);
    }    @PutMapping("/enable/{id}")
    @Operation(summary="Kích hoạt danh mục bằng id")
    public ResponseEntity<?> enabled(@PathVariable long id){
        Category category = categoryService.getCategoryById(id); // Get category info before enabling
        categoryService.enableCategory(id);
        
        // Log activity for category enable/disable
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                  if (user != null && category != null) {
                    // Get updated category to check new status
                    Category updatedCategory = categoryService.getCategoryById(id);
                    String action = updatedCategory.isEnable() ? "kích hoạt" : "vô hiệu hóa";
                    String title = String.format("Danh mục được %s", action);
                    String description = String.format("Danh mục '%s' đã được %s bởi %s", 
                                                      category.getName(), action, user.getUsername());
                    activityService.createActivity(ActivityType.CATEGORY_UPDATED, title, description, user, "Category", category.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the category enable/disable
            System.err.println("Failed to log category enable/disable activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("Cập nhật thành công"));
    }    @DeleteMapping("/delete/{id}")
    @Operation(summary="Xóa danh mục bằng id")
    public ResponseEntity<?> delete(@PathVariable long id){
        Category category = categoryService.getCategoryById(id); // Get category info before deletion
        categoryService.deleteCategory(id);
        
        // Log activity for category deletion
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                authentication.getPrincipal() instanceof UserDetailsImpl) {
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                User user = userRepository.findById(userDetails.getId()).orElse(null);
                
                if (user != null && category != null) {
                    String title = "Danh mục được xóa";
                    String description = String.format("Danh mục '%s' đã được xóa bởi %s", 
                                                      category.getName(), user.getUsername());
                    activityService.createActivity(ActivityType.CATEGORY_DELETED, title, description, user, "Category", category.getId());
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the category deletion
            System.err.println("Failed to log category deletion activity: " + e.getMessage());
        }
        
        return ResponseEntity.ok(new MessageResponse("Xóa thành công"));
    }


}
