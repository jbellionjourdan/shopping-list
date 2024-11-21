package fr.jbellion.shoppinglist.service.impl;

import fr.jbellion.shoppinglist.dto.CategoryDto;
import fr.jbellion.shoppinglist.exception.SPLBadRequestException;
import fr.jbellion.shoppinglist.exception.SPLNotFoundException;
import fr.jbellion.shoppinglist.jpa.repositories.CategoryRepository;
import fr.jbellion.shoppinglist.jpa.repositories.ItemRepository;
import fr.jbellion.shoppinglist.mappers.CategoryMapper;
import fr.jbellion.shoppinglist.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final ItemRepository itemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return this.categoryMapper.toDtoList(
                this.categoryRepository.findAll()
        );
    }

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryDto category) {
        return this.categoryMapper.toDto(
                this.categoryRepository.save(
                        this.categoryMapper.toEntity(category)
                )
        );
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(CategoryDto category) {
        var categoryEntity = this.categoryRepository.findById(category.getId())
                .orElseThrow(SPLNotFoundException::new);

        categoryEntity.setName(category.getName());

        return this.categoryMapper.toDto(
                this.categoryRepository.save(categoryEntity)
        );
    }

    @Override
    @Transactional
    public void deleteCategory(long id) {

        if(id == 1){
            throw new SPLBadRequestException("Il est interdit de supprimer la catégorie par défaut");
        }

        if(!this.categoryRepository.existsById(id)){
            throw new SPLNotFoundException();
        }

        // Move all items from the deleted category to the default category
        this.itemRepository.moveToDefaultCategory(id);

        this.categoryRepository.deleteById(id);
    }
}
