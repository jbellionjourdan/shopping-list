package fr.jbellion.shoppinglist.websocket.dto;

public record WebsocketMessage<T>(WebsocketMessageActionEnum action, T payload) {
}
