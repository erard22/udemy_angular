import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => this.handleAuthentication(email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => this.handleAuthentication(email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  autoLogin(): void {
    const userData: {
      email: string,
      id: string,
      _token: string,
      tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData.tokenExpirationDate));

    if (loadedUser.token) {
      this.autoLogout(new Date(userData.tokenExpirationDate).getTime() - new Date().getTime());
      this.user.next(loadedUser);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => this.logout(), expirationDuration);
  }

  logout(): void {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number): void {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.autoLogout(expiresIn * 1000);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<AuthResponseData> {
    let errorMessage = 'An unknown error occured!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}
