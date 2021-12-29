import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth-service';
import * as fromApplication from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
  title = 'angular-example-app';

  loadedFeature = 'recipe';

  constructor(private store: Store<fromApplication.ApplicationState>) {
  }

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
  }

}
