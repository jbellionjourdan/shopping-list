import {ItemModel} from "./item.model";
import {CategoryModel} from "./category.model";

export interface ItemWithListModel {
  item: ItemModel;
  listId: number;
}

export interface ItemWithCategoryAndListModel extends ItemWithListModel {
  category: CategoryModel;
}

export interface ItemIdWithListId {
  listId: number;
  id: number;
}
