import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth-service';
import * as fromApplication from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authServie: AuthService, private router: Router, private store: Store<fromApplication.ApplicationState>) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
      const isAuth = !!authState.user;
      if (isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/auth']);
    }));
  }

}
