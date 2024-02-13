package com.softserve.pfm.control;

import com.softserve.pfm.model.Category;
import com.softserve.pfm.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/")
    public List<Category> getAllCategory() {
        return categoryService.getAllCategory();
    }
    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable("id") Long id) {
        return categoryService.getCategoryById(id);
    }
    @GetMapping("/name={name}")
    public Category getCategoryWithName(@PathVariable("name") String name) {
        return categoryService.getCategoryWithName(name);
    }
    @PutMapping("/")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
    @PostMapping("/")
    public Category updateCategory(@RequestBody Category category) {
        return categoryService.updateCategory(category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategoryById(@PathVariable("id") Long id) {
        categoryService.deleteCategoryById(id);
    }
}
