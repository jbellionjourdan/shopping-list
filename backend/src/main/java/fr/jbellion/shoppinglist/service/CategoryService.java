package fr.jbellion.shoppinglist.service;

import fr.jbellion.shoppinglist.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAllCategories();

    CategoryDto createCategory(CategoryDto category);

    CategoryDto updateCategory(CategoryDto category);

    void deleteCategory(long id);
}
