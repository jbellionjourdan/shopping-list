import {ItemIdWithListId, ItemWithCategoryAndListModel, ItemWithListModel} from "./item-with-category-and-list.model";

export enum WebSocketMessageActionEnum {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export interface WebsocketMessageModel<T> {
  action: WebSocketMessageActionEnum;
  payload: T;
}

export interface ItemCreateMessage extends WebsocketMessageModel<ItemWithCategoryAndListModel> {
  action: WebSocketMessageActionEnum.CREATE;
}

export interface ItemUpdateMessage extends WebsocketMessageModel<ItemWithListModel> {
  action: WebSocketMessageActionEnum.UPDATE;
}

export interface ItemDeleteMessage extends WebsocketMessageModel<ItemIdWithListId> {
  action: WebSocketMessageActionEnum.DELETE;
}

export type ItemWebsocketMessage = ItemCreateMessage | ItemUpdateMessage | ItemDeleteMessage;

export type WebSocketStatus = 'disconnected' | 'connected' | 'retrying';
