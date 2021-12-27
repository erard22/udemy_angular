import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User;
}

const initialState: AuthState = {
  user: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions): AuthState {
  switch (action.type) {
    case AuthActions.LOGIN:
      const payload = (action as AuthActions.Login).payload;
      const user = new User(
        payload.email,
        payload.userId,
        payload.token,
        payload.expirationDate
      );
      return {
        ...state,
        user: user
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
