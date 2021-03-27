import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list-service';

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Schnitzel', 'Super tasty Schnitzel', 'https://www.gutekueche.ch/upload/rezept/170/1600x1200_wiener-schnitzel.jpg', [new Ingredient('Meat', 1), new Ingredient('French Fries', 1)]),
    new Recipe('Burger', 'Big Burger', 'https://image.essen-und-trinken.de/11939912/t/yC/v10/w1440/r1.5/-/klassischer-burger-jpg--58617-.jpg', [new Ingredient('Meat', 1), new Ingredient('Buns', 2)])
  ];

  constructor(private shoppingListService: ShoppingListService){}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShippingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

}
