import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ClientConfig {
  clientId = Math.round(Math.random() * 100000000);
}

@Injectable()
export class APIInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const apiReq = req.clone({
      url: `/api${req.url}`,
      headers: req.headers.append('Spl-Client-Id', inject(ClientConfig).clientId.toString())
    });
    return next.handle(apiReq);
  }
}
