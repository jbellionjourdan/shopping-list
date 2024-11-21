package fr.jbellion.shoppinglist.mappers;

import fr.jbellion.shoppinglist.dto.CategoryDto;
import fr.jbellion.shoppinglist.jpa.entities.CategoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class CategoryMapper extends AbstractMapper<CategoryEntity, CategoryDto> {
}
