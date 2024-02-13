package com.softserve.pfm.service;

import com.softserve.pfm.model.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategory();
    Category getCategoryById(Long id);
    public Category getCategoryWithName(String name);
    Category createCategory(Category category);
    Category updateCategory(Category category);
    void deleteCategoryById(Long id);
}
