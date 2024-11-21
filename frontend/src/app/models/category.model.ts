import {ItemModel} from "./item.model";
import {FormControl} from "@angular/forms";

export interface CreateCategoryModel {
  name: string;
}

export interface CategoryModel extends CreateCategoryModel {
  id: number;
}

export interface CategorizedItemsModel extends CategoryModel {
  items: ItemModel[];
}

export interface CategoryFormModel {
  id: FormControl<number>;
  name: FormControl<string>;
}
