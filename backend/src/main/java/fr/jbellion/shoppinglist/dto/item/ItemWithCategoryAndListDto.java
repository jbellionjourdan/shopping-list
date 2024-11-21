package fr.jbellion.shoppinglist.dto.item;

import fr.jbellion.shoppinglist.dto.CategoryDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;

@Getter
@AllArgsConstructor
@SuperBuilder
public class ItemWithCategoryAndListDto {
  private final ItemDto item;
  private final CategoryDto category;
  private final Long listId;
}
