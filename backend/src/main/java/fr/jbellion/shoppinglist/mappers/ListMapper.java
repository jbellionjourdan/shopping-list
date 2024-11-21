package fr.jbellion.shoppinglist.mappers;

import fr.jbellion.shoppinglist.dto.ListDto;
import fr.jbellion.shoppinglist.jpa.entities.ListEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class ListMapper extends AbstractMapper<ListEntity, ListDto> {
}
