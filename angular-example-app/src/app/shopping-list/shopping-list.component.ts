import {Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import {Ingredient} from '../shared/ingredient.model';
import { Observable } from 'rxjs';
import * as ShoppingActions from './store/shopping-list.actions';
import * as fromApplication from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Observable<({ingredients: Ingredient[]})>;

  constructor(private store: Store<fromApplication.ApplicationState>) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onSelection(index: number): void {
    this.store.dispatch(new ShoppingActions.StartEdit(index));
  }
}
