package com.softserve.pfm.service;

import com.softserve.pfm.model.Category;
import com.softserve.pfm.model.Transactions;
import com.softserve.pfm.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public Category getCategoryById(Long id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if(optionalCategory.isEmpty())
            throw new IllegalStateException("Category with id = " + id + " does not exist");
        return optionalCategory.get();
    }

    public Category getCategoryWithName(String name) {
        Category category = categoryRepository.getCategoryWithName(name);
        if(category == null) return new Category(null, null, null, new ArrayList<Transactions>());
        return category;
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Category category) {
        if(category.getId() != null && categoryRepository.existsById(category.getId())) return categoryRepository.save(category);
        else throw new IllegalStateException("Category with id = " + category.getId() + " does not exist");
    }

    @Override
    public void deleteCategoryById(Long id) {
        if(!categoryRepository.existsById(id)) {
            throw new IllegalStateException("Category with id = " + id + " does not exist");
        }
        categoryRepository.deleteById(id);
    }
}
