package fr.jbellion.shoppinglist.service;

import fr.jbellion.shoppinglist.dto.ListDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ListService {

	ListDto getList(long id);
	List<ListDto> getAllLists();
	ListDto updateList(ListDto list);
	void deleteList(long id);
	ListDto createList(ListDto list);
}
