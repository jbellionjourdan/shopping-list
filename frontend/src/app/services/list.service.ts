import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateListModel, ListModel} from '../models/list.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private readonly http = inject(HttpClient);

  getList(id: number): Observable<ListModel> {
    return this.http.get<ListModel>(`/lists/${id}`);
  }

  getAllLists(): Observable<ListModel[]> {
    return this.http.get<ListModel[]>('/lists');
  }

  createList(list: CreateListModel): Observable<ListModel> {
    return this.http.post<ListModel>('/lists', list);
  }

  deleteList(id: number): Observable<void> {
    return this.http.delete<void>(`/lists/${id}`);
  }

  updateList(list: ListModel): Observable<ListModel> {
    return this.http.put<ListModel>(`/lists/${list.id}`, list);
  }
}
