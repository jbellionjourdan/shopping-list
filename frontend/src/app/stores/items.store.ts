import {computed, DestroyRef, inject, Injectable, signal, Signal} from "@angular/core";
import {ItemService} from "../services/item.service";
import {CategorizedItemsModel, CategoryModel} from "../models/category.model";
import {Observable, of, retry, tap} from "rxjs";
import {CreateItemModel, ItemModel} from "../models/item.model";
import {webSocket} from "rxjs/webSocket";
import {WebSocketUtils} from "../utils/web-socket.utils";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ItemWebsocketMessage, WebSocketMessageActionEnum, WebSocketStatus} from "../models/websocket.model";
import {ClientConfig} from "../common/api.interceptor";

@Injectable({providedIn: 'root'})
export class ItemsStore {

  private listItems = signal<Record<number, CategorizedItemsModel[]>>({});

  private readonly itemsService = inject(ItemService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly clientConfig = inject(ClientConfig);

  private readonly _socketStatus = signal<WebSocketStatus | null>(null);

  get socketStatus() {
    return this._socketStatus.asReadonly();
  }

  getItemsSignalForList(listId: number): Signal<CategorizedItemsModel[] | null> {
    return computed(() => this.listItems()[listId] ?? null);
  }

  loadItemsForList(listId: number): Observable<CategorizedItemsModel[]> {
    const existingValue = this.listItems()[listId];

    this.handleWebSocket();

    return existingValue ? of(existingValue) : this.itemsService.getItemsForList(listId).pipe(
      tap(loaded => this.listItems.update(
        catItems => ({
          ...catItems,
          [listId]: loaded
        })
      ))
    );
  }

  updateItem(listId: number, item: ItemModel): Observable<ItemModel> {
    return this.itemsService.updateItem(listId, item).pipe(
      tap(updatedItem => this.applyUpdatedItem(listId, updatedItem))
    );
  }

  deleteItem(listId: number, itemId: number): Observable<void> {

    return this.itemsService.deleteItem(listId, itemId).pipe(
      tap(() => this.applyDeletedItem(listId, itemId))
    );
  }

  createItem(listId: number, category: CategoryModel, item: CreateItemModel): Observable<ItemModel> {

    return this.itemsService.createItem(listId, category.id, item).pipe(
      tap(createdItem => this.applyCreatedItem(listId, category, createdItem))
    );
  }

  purgeItemsCache(listId: number) {
    this.listItems.update(
      catItems => {
        const result = {...catItems};
        delete result[listId];
        return result;
      }
    )
  }

  private handleWebSocket(): void {
    if (this._socketStatus() && this._socketStatus() !== 'disconnected') {
      return;
    }

    this._socketStatus.set('retrying');

    webSocket<ItemWebsocketMessage>({
      url: `${WebSocketUtils.getWebSocketBaseUri()}/items?clientId=${this.clientConfig.clientId}`,
      openObserver: {
        next: () => this._socketStatus.set('connected')
      }
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap({
        error: () => this._socketStatus.set('retrying')
      }),
      retry({
        delay: 5000,
        count: 5,
        resetOnSuccess: true
      })
    ).subscribe({
      next: message => this.handleWebSocketMessage(message),
      error: () => this._socketStatus.set('disconnected'),
      complete: () => this._socketStatus.set('disconnected')
    });
  }

  private handleWebSocketMessage(message: ItemWebsocketMessage): void {

    switch (message.action) {
      case WebSocketMessageActionEnum.CREATE:
        this.applyCreatedItem(message.payload.listId, message.payload.category, message.payload.item);
        break;
      case WebSocketMessageActionEnum.UPDATE:
        this.applyUpdatedItem(message.payload.listId, message.payload.item);
        break;
      case WebSocketMessageActionEnum.DELETE:
        this.applyDeletedItem(message.payload.listId, message.payload.id);
        break;
    }
  }

  private applyCreatedItem(listId: number, category: CategoryModel, createdItem: ItemModel) {
    this.listItems.update(
      catItemsByList => {
        let resultForAffectedList = catItemsByList[listId];

        if (!resultForAffectedList.some(catItems => catItems.id === category.id)) {
          resultForAffectedList.push({
            ...category,
            items: []
          });
        }

        resultForAffectedList = resultForAffectedList.map(
          existingCategorizedItems => existingCategorizedItems.id !== category.id ? existingCategorizedItems : {
            ...existingCategorizedItems,
            items: [...existingCategorizedItems.items, createdItem]
          }
        );

        return {
          ...catItemsByList,
          [listId]: resultForAffectedList
        };
      }
    );
  }

  private applyUpdatedItem(listId: number, updatedItem: ItemModel) {
    this.listItems.update(
      catItemsByList => ({
        ...catItemsByList,
        [listId]: catItemsByList[listId].map(
          existingCategorizedItems => ({
            ...existingCategorizedItems,
            items: existingCategorizedItems.items.map(
              existingItem => existingItem.id === updatedItem.id ? updatedItem : existingItem
            )
          })
        )
      })
    );
  }

  private applyDeletedItem(listId: number, itemId: number) {
    this.listItems.update(
      catItemsByList => {

        let resultForAffectedList = catItemsByList[listId].map(
          existingCategorizedItems => ({
            ...existingCategorizedItems,
            items: existingCategorizedItems.items.filter(item => item.id !== itemId)
          })
        );

        resultForAffectedList = resultForAffectedList.filter(catItems => catItems.items.length);

        return {
          ...catItemsByList,
          [listId]: resultForAffectedList
        };
      }
    );
  }
}
