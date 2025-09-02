import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {RippleModule} from 'primeng/ripple';
import {WebsocketStatusComponent} from "./components/websocket-status/websocket-status.component";
import {PrimeNG} from "primeng/config";

@Component({
  selector: 'spl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, RippleModule, WebsocketStatusComponent]
})
export class AppComponent implements OnInit {

  private readonly primeng = inject(PrimeNG);

  ngOnInit(): void {
    this.primeng.ripple.set(true);
  }
}
