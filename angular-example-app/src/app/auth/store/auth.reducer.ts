import { act } from '@ngrx/effects';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
  loading: boolean;
  authError: string;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  authError: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        loading: true,
        authError: null
      };
    case AuthActions.AUTHENTICATE:
      const payload = (action as AuthActions.Authenticate).payload;
      const user = new User(
        payload.email,
        payload.userId,
        payload.token,
        payload.expirationDate
      );
      return {
        ...state,
        user,
        loading: false,
        authError: null
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        loading: false,
        authError: (action as AuthActions.AuthenticateFail).payload
      };
    case AuthActions.HANDLE_ERROR:
      return {
        ...state,
        authError: null
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}
