import {Component, inject, OnInit} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {RouterOutlet} from "@angular/router";
import {RippleModule} from 'primeng/ripple';
import {WebsocketStatusComponent} from "./components/shared/websocket-status/websocket-status.component";

@Component({
  selector: 'spl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RippleModule, WebsocketStatusComponent]
})
export class AppComponent implements OnInit {

  private readonly primengConfig = inject(PrimeNGConfig);

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }
}
