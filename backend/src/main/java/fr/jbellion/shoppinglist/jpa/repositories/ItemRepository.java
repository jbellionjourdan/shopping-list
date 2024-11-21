package fr.jbellion.shoppinglist.jpa.repositories;

import fr.jbellion.shoppinglist.jpa.entities.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {

	@Query("FROM ItemEntity itm WHERE itm.list.id = :listId")
	List<ItemEntity> findAllForList(long listId);

	@Query("SELECT count(itm)>0 FROM ItemEntity itm WHERE itm.id = :itmId AND itm.list.id = :listId")
	boolean existsByListIdAndItemId(long listId, long itmId);

	@Query("FROM ItemEntity itm WHERE itm.id = :itmId AND itm.list.id = :listId")
	Optional<ItemEntity> findByListIdAndItemId(long listId, long itmId);

	@Modifying
	@Query("UPDATE ItemEntity itm SET itm.category.id = 1 WHERE itm.category.id = :categoryId")
	void moveToDefaultCategory(long categoryId);
}
