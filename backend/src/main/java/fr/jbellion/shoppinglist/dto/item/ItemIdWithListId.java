package fr.jbellion.shoppinglist.dto.item;

import fr.jbellion.shoppinglist.dto.AbstractDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@SuperBuilder
@RequiredArgsConstructor
public class ItemIdWithListId extends AbstractDto {
  private final long listId;
}
