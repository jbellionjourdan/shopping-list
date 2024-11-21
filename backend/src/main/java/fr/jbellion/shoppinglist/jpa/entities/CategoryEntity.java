package fr.jbellion.shoppinglist.jpa.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "t_cat_category")
@Getter
@Setter
@AttributeOverride(name = "id", column = @Column(name = "catid"))
public class CategoryEntity extends AbstractEntity{

    @Column(name = "catva_name")
    private String name;
}
