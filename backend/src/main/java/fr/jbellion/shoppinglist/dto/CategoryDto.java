package fr.jbellion.shoppinglist.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

@Getter
@NoArgsConstructor
@SuperBuilder
public class CategoryDto extends AbstractDto {

    @NotNull(message = "Le nom de la catégorie ne peut être vide")
    @NotEmpty(message = "Le nom de la catégorie ne peut être vide")
    @Length(max = 32, message = "Le nom de la catégorie ne peut dépasser 32 caractères")
    private String name;
}
