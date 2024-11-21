export class WebSocketUtils {
  static getWebSocketBaseUri(): string {
    const loc = window.location;

    let proto;

    if (loc.protocol === "https:") {
      proto = "wss:";
    } else {
      proto = "ws:";
    }

    const host = loc.host === 'localhost:4200' ? 'localhost:8090' : loc.host;
    return `${proto}//${host}/api/ws`;
  }
}
