import { Ingredient } from '../../shared/ingredient.model';
import { AddIngredient, DeleteIngredient, StartEdit, UpdateIngredient } from './shopping-list.actions';
import * as ShoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export interface ApplicationState {
  shoppingList: ShoppingListState;
}

const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions): ShoppingListState {
  console.log('>>> action payoad:', action);
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, (action as AddIngredient).payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...(action as ShoppingListActions.AddIngredients).payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const updatePayload = (action as UpdateIngredient).payload;
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient, // copy old date
        ...updatePayload // override with new data
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => {
          return igIndex !== state.editedIngredientIndex;
        }),
        editedIngredientIndex: -1,
        editedIngredient: null
      };
    case ShoppingListActions.START_EDIT:
      const editedIngredientIndex: number = (action as StartEdit).payload;
      const editedIngredient: Ingredient = {...state.ingredients[editedIngredientIndex]};
      return {
        ...state,
        editedIngredient,
        editedIngredientIndex
      };
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    default:
      return state;
  }
}
