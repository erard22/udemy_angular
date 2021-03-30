import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../recipe.model';
import {RecipeService} from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  form: FormGroup;

  constructor(private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.editMode = params.id != null;
        this.initForm();
      }
    );
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          recipeIngredients.push(new FormGroup({
            name: new FormControl(ingredient.name, Validators.required),
            amount: new FormControl(ingredient.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
          }));
        }
      }
    }

    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  get controls() { // a getter!
    return (this.form.get('ingredients') as FormArray).controls;
  }

  onSubmit(): void {
    console.log(this.form.value);
    const newRecipe = new Recipe(this.form.value.name, this.form.value.description, this.form.value.imagePath, this.form.value.ingredients);
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      // alternative as the value has the same java script object format
      // this.recipeService.updateRecipe(this.id, value);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  onAddIngredient() {
    (this.form.get('ingredients') as FormArray).push(new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      }
    ));
  }

  onCancel(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(i: number): void {
    (this.form.get('ingredients') as FormArray).removeAt(i);
  }
}
