package fr.jbellion.shoppinglist.jpa.repositories;

import fr.jbellion.shoppinglist.jpa.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
