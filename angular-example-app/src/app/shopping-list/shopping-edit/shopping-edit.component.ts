import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Store } from '@ngrx/store';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingList from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  // old solution
  // @ViewChild('nameInput')
  // nameInputRef: ElementRef;

  // @ViewChild('amountInput')
  // amountInputRef: ElementRef;

  @ViewChild('formElement')
  private form: NgForm;
  private editSubscription: Subscription;
  editMode: boolean;
  private editedIngredient: Ingredient;

  constructor(private store: Store<fromShoppingList.ApplicationState>) { }

  ngOnInit(): void {
    this.editSubscription = this.store.select('shoppingList').subscribe(stateData => {
      console.log('>>>', stateData);
      if (stateData.editedIngredientIndex >= 0) {
        this.editMode = true;
        this.editedIngredient = stateData.editedIngredient;
        this.form.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  /*
   old solution
   onAddItem() {
    this.shoppingListService.addIngredient(new Ingredient(this.nameInputRef.nativeElement.value, this.amountInputRef.nativeElement.value));
   }
  */

  onAddItem(form: NgForm): void {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.onReset();
  }

  onReset(): void {
    this.form.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onReset();
  }
}
