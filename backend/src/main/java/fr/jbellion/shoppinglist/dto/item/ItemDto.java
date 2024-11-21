package fr.jbellion.shoppinglist.dto.item;

import fr.jbellion.shoppinglist.dto.AbstractDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Length;


@Getter
@NoArgsConstructor
@SuperBuilder
public class ItemDto extends AbstractDto {

  @NotNull(message = "Le nom de l'item ne peut être vide")
  @NotEmpty(message = "Le nom de l'item ne peut être vide")
  @Length(max = 64, message = "Le nom de l'item ne peut dépasser 64 caractères")
  private String name;

  @NotNull(message = "Please provide a checked value for this item")
  private boolean checked;
}
