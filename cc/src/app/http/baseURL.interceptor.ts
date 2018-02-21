import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BASE_URL } from '../app.constant';

@Injectable()
export class BaseURLIntercept implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('://') === -1) {
            req = req.clone({
                url: BASE_URL + req.url,
            });
        }
        return next.handle(req);
    }
}
