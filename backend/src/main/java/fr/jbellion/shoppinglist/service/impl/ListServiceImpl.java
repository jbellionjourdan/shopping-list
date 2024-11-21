package fr.jbellion.shoppinglist.service.impl;

import fr.jbellion.shoppinglist.dto.ListDto;
import fr.jbellion.shoppinglist.exception.SPLNotFoundException;
import fr.jbellion.shoppinglist.jpa.repositories.ListRepository;
import fr.jbellion.shoppinglist.mappers.ListMapper;
import fr.jbellion.shoppinglist.service.ListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ListServiceImpl implements ListService {

	private final ListRepository listRepository;
	private final ListMapper listMapper;

	@Override
	@Transactional(readOnly = true)
	public ListDto getList(long id){
		return this.listMapper.toDto(
			this.listRepository.findById(id).orElseThrow(SPLNotFoundException::new)
		);
	}

	@Override
	@Transactional(readOnly = true)
	public List<ListDto> getAllLists() {
		return this.listMapper.toDtoList(
				this.listRepository.findAll()
		);
	}

	@Override
	@Transactional
	public ListDto updateList(ListDto list) {
		var listEntity = this.listRepository.findById(list.getId())
				.orElseThrow(SPLNotFoundException::new);

		listEntity.setName(list.getName());

		return this.listMapper.toDto(
				this.listRepository.save(listEntity)
		);
	}

	@Override
	@Transactional
	public void deleteList(long id) {
		if (!this.listRepository.existsById(id)) {
			throw new SPLNotFoundException();
		}
		this.listRepository.deleteById(id);
	}

	@Override
	@Transactional
	public ListDto createList(ListDto list) {
		return this.listMapper.toDto(
				this.listRepository.save(
						this.listMapper.toEntity(list)
				)
		);
	}
}

