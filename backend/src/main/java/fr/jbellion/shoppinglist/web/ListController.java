package fr.jbellion.shoppinglist.web;

import fr.jbellion.shoppinglist.dto.ListDto;
import fr.jbellion.shoppinglist.exception.SPLBadRequestException;
import fr.jbellion.shoppinglist.service.ListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Controller
@RequestMapping("/lists")
@RequiredArgsConstructor
@Validated
public class ListController implements ControllerInterface {

	private final ListService listService;

	@GetMapping("/{id}")
	public ResponseEntity<ListDto> getList(@PathVariable long id) {
		return ResponseEntity.ok(this.listService.getList(id));
	}

	@GetMapping
	public ResponseEntity<List<ListDto>> getAllLists() {
		return ResponseEntity.ok(this.listService.getAllLists());
	}

	@PostMapping
	public ResponseEntity<ListDto> createList(@RequestBody @Valid ListDto list) throws URISyntaxException {
		if(list.getId() != null) {
			throw new SPLBadRequestException("No id must be set for a creation");
		}

		ListDto created = this.listService.createList(list);

		return ResponseEntity.created(
				new URI("/lists/" + created.getId())
		).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ListDto> updateList(@PathVariable long id,
											  @RequestBody @Valid ListDto list) {
		if (list.getId() != id) {
			throw new SPLBadRequestException("ID mismatch");
		}

		return ResponseEntity.ok(
				this.listService.updateList(list)
		);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteList(@PathVariable long id){
		this.listService.deleteList(id);

		return ResponseEntity.noContent().build();
	}
}
