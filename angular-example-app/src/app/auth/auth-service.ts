import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApplication from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

  tokenExpirationTimer: any;

  constructor(private store: Store<fromApplication.ApplicationState>) {
  }

  setLogoutTimer(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => this.store.dispatch(new AuthActions.Logout()), expirationDuration);
  }

  clearLogoutTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
