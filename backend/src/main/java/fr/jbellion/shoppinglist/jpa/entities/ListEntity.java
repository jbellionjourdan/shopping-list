package fr.jbellion.shoppinglist.jpa.entities;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;

@Entity
@Table(name = "t_lst_list")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "lstid"))
public class ListEntity extends AbstractEntity{

	@Column(name = "lstva_name")
	private String name;

	@OneToMany(mappedBy = "list", cascade = CascadeType.REMOVE)
	List<ItemEntity> items;

}
