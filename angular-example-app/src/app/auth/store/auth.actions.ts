import { Action } from '@ngrx/store';

export const LOGIN_START = 'LOGIN_START';
export const AUTO_LOGIN = 'AUTO_LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const SIGNUP_START = 'SIGNUP_START';
export const HANDLE_ERROR = 'HANDLE_ERROR';
export const LOGOUT = 'LOGOUT';

export type AuthActions = LoginStart
  | Authenticate
  | AuthenticateFail
  | HandleError
  | AutoLogin
  | Logout;

export class SignupStart implements Action {
  readonly type: string = SIGNUP_START;

  constructor(public payload: {email: string, password: string}) {
  }
}

export class LoginStart implements Action {
  readonly type: string = LOGIN_START;

  constructor(public payload: {email: string, password: string}) {
  }
}

export class Authenticate implements Action {
  readonly type: string = AUTHENTICATE;

  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }
    ) {}
}

export class AuthenticateFail implements Action {
  readonly type: string = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class AutoLogin implements Action {
  readonly type: string = AUTO_LOGIN;
}

export class HandleError implements Action {
  readonly type: string = HANDLE_ERROR;
}

export class Logout implements Action {
  readonly type: string = LOGOUT;
}
