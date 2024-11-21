import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateItemModel, ItemModel} from '../models/item.model';
import {CategorizedItemsModel} from "../models/category.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private readonly http = inject(HttpClient);

  getItemsForList(id: number): Observable<CategorizedItemsModel[]> {
    return this.http.get<CategorizedItemsModel[]>(`/lists/${id}/categories/items`);
  }

  updateItem(listId: number, item: ItemModel): Observable<ItemModel> {
    return this.http.put<ItemModel>(`/lists/${listId}/items/${item.id}`, item);
  }

  createItem(listId: number, categoryId: number, item: CreateItemModel): Observable<ItemModel> {
    return this.http.post<ItemModel>(`/lists/${listId}/categories/${categoryId}/items`, item);
  }

  deleteItem(listId: number, id: number): Observable<void> {
    return this.http.delete<void>(`/lists/${listId}/items/${id}`);
  }
}
