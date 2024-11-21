import {computed, inject, Injectable, Signal, signal} from "@angular/core";
import {ListService} from "../services/list.service";
import {CreateListModel, ListModel} from "../models/list.model";
import {Observable, of, tap} from "rxjs";
import {ItemsStore} from "./items.store";

@Injectable({providedIn: 'root'})
export class ListsStore {

  private readonly _lists = signal<Record<number, ListModel>>({});

  lists: Signal<ListModel[]> = computed(() => {
    return Object.values(this._lists());
  });

  private readonly listService = inject(ListService);
  private readonly itemsStore = inject(ItemsStore);

  private listsLoaded = false;

  getListSignalById(listId: number): Signal<ListModel | null> {
    return computed(() => {
      return this._lists()[listId] ?? null
    });
  }

  loadLists(): Observable<ListModel[]> {
    if (this.listsLoaded) {
      return of(this.lists());
    }

    return this.listService.getAllLists().pipe(
      tap(lists => {
        const map: Record<number, ListModel> = {};
        lists.forEach(list => map[list.id] = list);
        this._lists.set(map);
        this.listsLoaded = true;
      })
    );
  }

  createList(newList: CreateListModel): Observable<ListModel> {
    return this.listService.createList(newList).pipe(
      tap(created => this._lists.update(
        lists => ({
          ...lists,
          [created.id]: created
        })
      ))
    );
  }

  deleteList(id: number): Observable<void> {
    return this.listService.deleteList(id).pipe(
      tap(() => {
        this._lists.update(
          lists => {
            const result = {...lists};
            delete result[id];
            return result;
          }
        );
        this.itemsStore.purgeItemsCache(id);
      })
    );
  }

  updateList(list: ListModel): Observable<ListModel> {
    return this.listService.updateList(list).pipe(
      tap(updated => this._lists.update(
        lists => ({
          ...lists,
          [updated.id]: updated
        })
      ))
    );
  }

  getList(listId: number): Observable<ListModel> {
    const existingList = this._lists()[listId];

    return existingList ? of(existingList) : this.listService.getList(listId).pipe(
      tap(loaded => this._lists.update(
        lists => ({
          ...lists,
          [loaded.id]: loaded
        })
      ))
    );
  }
}
