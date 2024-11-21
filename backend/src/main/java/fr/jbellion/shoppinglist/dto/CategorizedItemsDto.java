package fr.jbellion.shoppinglist.dto;

import fr.jbellion.shoppinglist.dto.item.ItemDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@SuperBuilder
public class CategorizedItemsDto extends CategoryDto {

  private List<ItemDto> items = new ArrayList<>();
}
