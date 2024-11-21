package fr.jbellion.shoppinglist.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Getter
@NoArgsConstructor
@SuperBuilder
public class ListDto extends AbstractDto {

	@NotNull(message = "Le nom de la liste ne peut être vide")
	@NotEmpty(message = "Le nom de la liste ne peut être vide")
	@Length(max = 32, message = "Le nom de la liste ne peut dépasser 32 caractères")
	private String name;
}
