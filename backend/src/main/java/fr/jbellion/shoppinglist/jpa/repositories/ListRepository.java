package fr.jbellion.shoppinglist.jpa.repositories;

import fr.jbellion.shoppinglist.jpa.entities.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListRepository extends JpaRepository<ListEntity, Long> {
}
