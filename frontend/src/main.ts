import {enableProdMode, importProvidersFrom} from '@angular/core';
import {environment} from './environments/environment';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {APIInterceptor} from './app/common/api.interceptor';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {provideServiceWorker, ServiceWorkerModule} from '@angular/service-worker';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CardModule} from 'primeng/card';
import {SkeletonModule} from 'primeng/skeleton';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InplaceModule} from 'primeng/inplace';
import {MessageModule} from 'primeng/message';
import {FieldsetModule} from 'primeng/fieldset';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {AppComponent} from './app/app.component';
import {RouterModule} from "@angular/router";
import routes from "./app/routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {providePrimeNG} from "primeng/config";
import {PrimeNgPreset} from "./primeng-theme";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      RouterModule.forRoot(routes),
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }), SelectButtonModule, ScrollingModule, CardModule, SkeletonModule, ConfirmDialogModule, InplaceModule, MessageModule, FieldsetModule, DropdownModule, TableModule),
    {provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true},
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: true,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: PrimeNgPreset,
        options: {}
      }
    }),
  ]
})
  .catch(err => console.error(err));
