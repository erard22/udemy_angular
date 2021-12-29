import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth-service';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  signup = createEffect(() => this.actions.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          map((responseData: AuthResponseData) => {
            return this.handleAuthentication(responseData);
          }), catchError(errorResponse => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorResponse.error || !errorResponse.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage));
            }
            switch (errorResponse.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists!';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists!';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password was not the right one';
            }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }));
      }),
    )
  );

  autoLogin = createEffect(() => this.actions.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string,
          id: string,
          _token: string,
          tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
          return { type: 'noop'};
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData.tokenExpirationDate));

        if (loadedUser.token) {
          const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.Authenticate({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData.tokenExpirationDate)
          });
        }
        return { type: 'noop'};
      })
    )
  );

  authLogin = createEffect(() => this.actions.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http.post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          map((responseData: AuthResponseData) => {
            return this.handleAuthentication(responseData);
          }), catchError(errorResponse => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorResponse.error || !errorResponse.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage));
            }
            switch (errorResponse.error.error.message) {
              case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists!';
                break;
              case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists!';
                break;
              case 'INVALID_PASSWORD':
                errorMessage = 'This password was not the right one';
            }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          }));
      }),
    )
  );

  authSuccess = createEffect(() => this.actions.pipe(
      ofType(AuthActions.AUTHENTICATE),
      tap(() => this.router.navigate(['/']))
    ),
    { dispatch: false }
  );

  authLogout = createEffect(() => this.actions.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        localStorage.removeItem('userData');
        this.authService.clearLogoutTimer();
        this.router.navigate(['/auth']);
      })
    ),
    { dispatch: false }
  );

  constructor(private actions: Actions,
              private http: HttpClient,
              private router: Router,
              private authService: AuthService) {
  }

  private handleAuthentication(responseData: AuthResponseData): Action {
    const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
    const user = new User(responseData.email, responseData.localId, responseData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
    return new AuthActions.Authenticate({
      email: responseData.email,
      userId: responseData.localId,
      token: responseData.idToken,
      expirationDate
    });
  }
}
