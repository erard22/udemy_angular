import {Injectable} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApplication from '../store/app.reducer';

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApplication.ApplicationState>) { }

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(id: number): Recipe {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShippingList(ingredients: Ingredient[]): void {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

}
