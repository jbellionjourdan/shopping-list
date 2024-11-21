package fr.jbellion.shoppinglist.mappers;

import fr.jbellion.shoppinglist.dto.AbstractDto;
import fr.jbellion.shoppinglist.jpa.entities.AbstractEntity;

import java.util.List;

public abstract class AbstractMapper <E extends AbstractEntity, D extends AbstractDto> {

	public abstract D toDto(E entity);
	public abstract E toEntity(D dto);

	public List<D> toDtoList(List<E> entities){
		return entities.stream().map(this::toDto).toList();
	}
}
