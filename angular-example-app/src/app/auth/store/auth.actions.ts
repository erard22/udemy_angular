import { Action } from '@ngrx/store';
import { Ingredient } from '../../shared/ingredient.model';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export type AuthActions = Login | Logout;

export class Login implements Action {
  readonly type: string = LOGIN;

  constructor(
    public payload: {
      email: string,
      userId: string,
      token: string,
      expirationDate: Date
    }
    ) {}
}

export class Logout implements Action {
  readonly type: string = LOGOUT;
}
