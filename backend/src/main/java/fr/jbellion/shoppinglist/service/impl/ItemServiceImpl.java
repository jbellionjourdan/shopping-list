package fr.jbellion.shoppinglist.service.impl;

import fr.jbellion.shoppinglist.dto.CategorizedItemsDto;
import fr.jbellion.shoppinglist.dto.CategoryDto;
import fr.jbellion.shoppinglist.dto.item.ItemDto;
import fr.jbellion.shoppinglist.dto.item.ItemIdWithListId;
import fr.jbellion.shoppinglist.dto.item.ItemWithCategoryAndListDto;
import fr.jbellion.shoppinglist.exception.SPLNotFoundException;
import fr.jbellion.shoppinglist.jpa.entities.CategoryEntity;
import fr.jbellion.shoppinglist.jpa.entities.ItemEntity;
import fr.jbellion.shoppinglist.jpa.entities.ListEntity;
import fr.jbellion.shoppinglist.jpa.repositories.CategoryRepository;
import fr.jbellion.shoppinglist.jpa.repositories.ItemRepository;
import fr.jbellion.shoppinglist.jpa.repositories.ListRepository;
import fr.jbellion.shoppinglist.mappers.CategoryMapper;
import fr.jbellion.shoppinglist.mappers.ItemMapper;
import fr.jbellion.shoppinglist.service.ItemService;
import fr.jbellion.shoppinglist.websocket.ItemsWebSocketHandler;
import fr.jbellion.shoppinglist.websocket.dto.WebsocketMessage;
import fr.jbellion.shoppinglist.websocket.dto.WebsocketMessageActionEnum;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

  private final ItemRepository itemRepository;
  private final ListRepository listRepository;
  private final CategoryRepository categoryRepository;
  private final CategoryMapper categoryMapper;
  private final ItemMapper itemMapper;
  private final ItemsWebSocketHandler itemsWsHandler;

  @Override
  @Transactional(readOnly = true)
  public List<CategorizedItemsDto> getItemsListByCategories(long listId) {
    Map<Long, List<ItemEntity>> itemsByCategoryId = this.itemRepository.findAllForList(listId).stream().collect(
      Collectors.groupingBy(itemEntity -> itemEntity.getCategory().getId())
    );

    return itemsByCategoryId.values().stream().map(
      itemEntities -> CategorizedItemsDto.builder()
        .id(itemEntities.getFirst().getCategory().getId())
        .name(itemEntities.getFirst().getCategory().getName())
        .items(this.itemMapper.toDtoList(itemEntities))
        .build()
    ).collect(Collectors.toList());
  }

  @Transactional
  @Override
  public ItemDto updateItem(long listId, ItemDto item, Long originClientId) {
    var itemEntity = this.itemRepository.findByListIdAndItemId(listId, item.getId())
      .orElseThrow(SPLNotFoundException::new);

    itemEntity.setName(item.getName());
    itemEntity.setChecked(item.isChecked());

    ItemEntity updatedItemEntity = this.itemRepository.save(itemEntity);
    ItemDto updatedItemDto = this.itemMapper.toDto(updatedItemEntity);

    this.notifyWebsocketChange(
      WebsocketMessageActionEnum.UPDATE,
      updatedItemDto,
      updatedItemEntity.getList().getId(),
      null,
      originClientId
    );

    return updatedItemDto;
  }

  @Transactional
  @Override
  public void deleteItem(long listId, long id, Long originClientId) {
    if (!itemRepository.existsByListIdAndItemId(listId, id)) {
      throw new SPLNotFoundException();
    }

    this.itemRepository.deleteById(id);

    this.itemsWsHandler.sendDelete(ItemIdWithListId.builder().id(id).listId(listId).build(), originClientId);
  }

  @Transactional
  @Override
  public ItemDto createItem(long listId, long categoryId, ItemDto item, Long originClientId) {
    ListEntity list = this.listRepository.findById(listId)
      .orElseThrow(() -> new SPLNotFoundException("List with id " + listId + "not found"));

    CategoryEntity category = this.categoryRepository.findById(categoryId)
      .orElseThrow(() -> new SPLNotFoundException("Category with id " + categoryId + "not found"));

    ItemEntity itemEntity = this.itemMapper.toEntity(item);
    itemEntity.setList(list);
    itemEntity.setCategory(category);

    ItemEntity createdItemEntity = this.itemRepository.save(itemEntity);
    ItemDto createdItemDto = this.itemMapper.toDto(createdItemEntity);

    this.notifyWebsocketChange(
      WebsocketMessageActionEnum.CREATE,
      createdItemDto,
      createdItemEntity.getList().getId(),
      this.categoryMapper.toDto(createdItemEntity.getCategory()),
      originClientId
    );

    return createdItemDto;
  }

  private void notifyWebsocketChange(WebsocketMessageActionEnum action, ItemDto item, Long listid, CategoryDto category, Long originClientId) {
    var itemWithCategory = ItemWithCategoryAndListDto.builder().item(item).category(category).listId(listid).build();

    var message = new WebsocketMessage<>(action, itemWithCategory);

    this.itemsWsHandler.sendCreateUpdate(message, originClientId);
  }
}
