package fr.jbellion.shoppinglist.mappers;

import fr.jbellion.shoppinglist.dto.item.ItemDto;
import fr.jbellion.shoppinglist.jpa.entities.ItemEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class ItemMapper extends AbstractMapper<ItemEntity, ItemDto> {
}
