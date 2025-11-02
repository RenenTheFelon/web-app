package com.wealthwise.finance.controller;

import com.wealthwise.finance.dto.CategoryDto;
import com.wealthwise.finance.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByUserId(@PathVariable Long userId) {
        List<CategoryDto> categories = categoryService.getAllCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByUserIdAndType(
            @PathVariable Long userId, 
            @PathVariable String type) {
        List<CategoryDto> categories = categoryService.getCategoriesByUserIdAndType(userId, type);
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Long id) {
        CategoryDto category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
    
    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto categoryDto) {
        CategoryDto createdCategory = categoryService.createCategory(categoryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id, 
            @Valid @RequestBody CategoryDto categoryDto) {
        CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
