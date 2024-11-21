import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ItemsStore} from "../../../stores/items.store";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'spl-websocket-status',
  standalone: true,
  imports: [
    NgStyle
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './websocket-status.component.html',
  styleUrl: './websocket-status.component.scss'
})
export class WebsocketStatusComponent {
  protected readonly itemsStore = inject(ItemsStore);

  protected getColor(status: "disconnected" | "connected" | "retrying"): string {
    switch (status) {
      case "connected":
        return 'green';
      case "retrying":
        return 'orange';
      case "disconnected":
        return 'red'
    }
  }
}
