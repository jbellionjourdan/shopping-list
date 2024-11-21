package fr.jbellion.shoppinglist.web;

import fr.jbellion.shoppinglist.dto.CategoryDto;
import fr.jbellion.shoppinglist.exception.SPLBadRequestException;
import fr.jbellion.shoppinglist.service.CategoryService;
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
@RequestMapping("/categories")
@RequiredArgsConstructor
@Validated
public class CategoryController implements ControllerInterface{

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        return ResponseEntity.ok(this.categoryService.getAllCategories());
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto category) throws URISyntaxException {

        if (category.getId() != null) {
            throw new SPLBadRequestException("No id must be set for a creation");
        }

        var created = this.categoryService.createCategory(category);

        return ResponseEntity.created(
                new URI("/api/categories/"+created.getId())
        ).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable long id, @Valid @RequestBody CategoryDto category){
        if(category.getId() != id){
            throw new SPLBadRequestException("ID mismatch");
        }

        return ResponseEntity.ok(
                this.categoryService.updateCategory(category)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable long id){
        this.categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }

}
