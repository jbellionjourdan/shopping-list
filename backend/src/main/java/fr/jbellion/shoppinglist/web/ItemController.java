package fr.jbellion.shoppinglist.web;

import fr.jbellion.shoppinglist.dto.CategorizedItemsDto;
import fr.jbellion.shoppinglist.dto.item.ItemDto;
import fr.jbellion.shoppinglist.exception.SPLBadRequestException;
import fr.jbellion.shoppinglist.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/lists/{listId}")
@Validated
public class ItemController implements ControllerInterface {

  private final ItemService itemService;

  @GetMapping("/categories/items")
  public ResponseEntity<List<CategorizedItemsDto>> getItemsList(@PathVariable long listId) {
    return ResponseEntity.ok(
      this.itemService.getItemsListByCategories(listId)
    );
  }

  @PostMapping("/categories/{categoryId}/items")
  public ResponseEntity<ItemDto> createItem(@PathVariable long listId,
                                            @PathVariable long categoryId,
                                            @RequestHeader(value = "Spl-Client-Id", required = false) Long originClientId,
                                            @Valid @RequestBody ItemDto item) throws URISyntaxException {

    if (item.getId() != null) {
      throw new SPLBadRequestException("No id must be set for a creation");
    }

    ItemDto created = this.itemService.createItem(listId, categoryId, item, originClientId);

    return ResponseEntity.created(
        new URI("/lists/" + listId + "/categories/" + categoryId + "/items/" + created.getId())
      )
      .body(created);
  }

  @PutMapping("/items/{id}")
  public ResponseEntity<ItemDto> updateItem(
    @PathVariable long listId,
    @PathVariable long id,
    @RequestHeader(value = "Spl-Client-Id", required = false) Long originClientId,
    @Valid @RequestBody ItemDto item
  ) {
    if (item.getId() != id) {
      throw new SPLBadRequestException("ID mismatch");
    }

    return ResponseEntity.ok(
      this.itemService.updateItem(listId, item, originClientId)
    );
  }

  @DeleteMapping("/items/{id}")
  public ResponseEntity<Void> deleteItem(@PathVariable long listId,
                                         @PathVariable long id,
                                         @RequestHeader(value = "Spl-Client-Id", required = false) Long originClientId
  ) {
    this.itemService.deleteItem(listId, id, originClientId);

    return ResponseEntity.noContent().build();
  }
}
