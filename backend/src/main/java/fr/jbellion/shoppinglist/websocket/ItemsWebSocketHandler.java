package fr.jbellion.shoppinglist.websocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.jbellion.shoppinglist.dto.item.ItemIdWithListId;
import fr.jbellion.shoppinglist.dto.item.ItemWithCategoryAndListDto;
import fr.jbellion.shoppinglist.websocket.dto.WebsocketMessage;
import fr.jbellion.shoppinglist.websocket.dto.WebsocketMessageActionEnum;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
@RequiredArgsConstructor
public class ItemsWebSocketHandler extends TextWebSocketHandler {

  public static final String CLIENT_ID_KEY = "ClientId";

  private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  private final ObjectMapper objectMapper;

  private final Pattern clientIdPattern = Pattern.compile("clientId=([0-9]+)");

  @Override
  public void afterConnectionEstablished(@NonNull WebSocketSession session) {
    URI uri = session.getUri();
    if (null != uri) {
      Matcher matcher = this.clientIdPattern.matcher(uri.getQuery());

      if (matcher.matches()) {
        session.getAttributes().put(CLIENT_ID_KEY, Long.parseLong(matcher.group(1)));
      }
    }

    this.sessions.add(session);
  }

  @Async
  public void sendCreateUpdate(WebsocketMessage<ItemWithCategoryAndListDto> message, @Nullable Long originClientId) {
    this.internalSend(message, originClientId);
  }

  @Async
  public void sendDelete(ItemIdWithListId item, @Nullable Long originClientId) {
    this.internalSend(
      new WebsocketMessage<>(WebsocketMessageActionEnum.DELETE, item),
      originClientId
    );
  }

  private void internalSend(WebsocketMessage<?> message, @Nullable Long originClientId) {
    try {
      var textMessage = new TextMessage(this.objectMapper.writeValueAsString(message));

      this.sessions.forEach(
        session -> {
          if (!session.isOpen()) {
            this.sessions.remove(session);
          } else {
            if (null != originClientId && session.getAttributes().get(CLIENT_ID_KEY).equals(originClientId)) {
              //Do not send a message to the client that triggered the action
              return;
            }

            try {
              session.sendMessage(textMessage);
            } catch (IOException e) {
              log.error("Can't send socket message", e);
            }
          }
        }
      );
    } catch (JsonProcessingException e) {
      log.error("Can't send socket message", e);
    }
  }
}
