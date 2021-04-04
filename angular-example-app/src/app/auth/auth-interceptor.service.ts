import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth-service';
import { User } from './user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take<User>(1),
      exhaustMap(user => {
        if (user === null) {
          return next.handle(req);
        }
        const clone = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(clone);
      })
    );
  }
}
