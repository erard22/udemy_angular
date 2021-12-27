import { ActionReducerMap } from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface ApplicationState {
  auth: fromAuth.AuthState;
  shoppingList: fromShoppingList.ShoppingListState;
}

export const applicationReducers: ActionReducerMap<ApplicationState> = {
  auth: fromAuth.authReducer,
  shoppingList: fromShoppingList.shoppingListReducer
};
