package fr.jbellion.shoppinglist.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@Getter
public class AbstractDto {

	private Long id;
}
