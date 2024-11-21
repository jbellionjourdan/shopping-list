package fr.jbellion.shoppinglist.jpa.entities;

import lombok.Getter;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public class AbstractEntity {

	@Id
	@Getter
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
}
