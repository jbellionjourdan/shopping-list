package fr.jbellion.shoppinglist.jpa.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "t_itm_item")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "itmid"))
public class ItemEntity extends AbstractEntity {

	@Column(name = "itmva_name")
	private String name;

	@Column(name = "itmbo_checked")
	private boolean checked = false;

	@ManyToOne
	@JoinColumn(name = "lstid")
	private ListEntity list;

	@ManyToOne
	@JoinColumn(name = "catid")
	private CategoryEntity category;

}
