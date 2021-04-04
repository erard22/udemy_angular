import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('request intercepted');
    const modifiedRequest = req.clone({
      headers: req.headers.append('foo', 'bar')
    })
    return next.handle(modifiedRequest)
      // handle the response
      .pipe(
        tap(event => {
          console.log(event);
          if (event.type === HttpEventType.Response) {
            console.log('response:');
            console.log(event.body)
          }
        })
      );
  }

}
