import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: {id: number, name: string};

  //done by angular for us
  paramsSubscription: Subscription

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    /* only changed on init, not if it changes on the same page.
    this.user = {
      id: this.route.snapshot.params['id'],
      name: this.route.snapshot.params['name']
    };
    */
    // with observable
    this.paramsSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.user = {
          id: params['id'],
          name: params['name']
        }
      }
    )
  }

  ngOnDestroy() {
    // not needed, happens behind the scenes.
    this.paramsSubscription.unsubscribe();
  }

}
