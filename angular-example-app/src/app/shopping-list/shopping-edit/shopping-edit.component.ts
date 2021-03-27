import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list-service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

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
  private editIndex: number;
  private editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.editSubscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editMode = true;
      this.editIndex = index;
      this.editedIngredient = this.shoppingListService.getIngredient(this.editIndex);
      this.form.setValue({
        name: this.editedIngredient.name,
        amount: this.editedIngredient.amount
      });
    });
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
  }

  /*
   old solution
   onAddItem() {
    this.shoppingListService.addIngredient(new Ingredient(this.nameInputRef.nativeElement.value, this.amountInputRef.nativeElement.value));
   }
  */

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.onReset();
  }

  onReset(): void {
    this.form.reset();
    this.editMode = false;
  }

  onDelete(): void {
    this.shoppingListService.deleteIngredient(this.editIndex);
    this.onReset();
  }
}
