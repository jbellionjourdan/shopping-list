package fr.jbellion.shoppinglist.service;

import fr.jbellion.shoppinglist.dto.CategorizedItemsDto;
import fr.jbellion.shoppinglist.dto.item.ItemDto;

import java.util.List;

public interface ItemService {

  List<CategorizedItemsDto> getItemsListByCategories(long listId);

  ItemDto updateItem(long listId, ItemDto item, Long originClientId);

  void deleteItem(long listId, long id, Long originClientId);

  ItemDto createItem(long listId, long categoryId, ItemDto item, Long originClientId);
}
