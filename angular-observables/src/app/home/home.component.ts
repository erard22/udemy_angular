import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private interval: Subscription;

  constructor() { }

  ngOnInitWithBuiltInInterval() {
    this.interval = interval(1000).subscribe(count => {
      console.log(count);
      }
    );
  }

  ngOnInitWithOwnObservable() {
    const customIntervalObservable = new Observable(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        if (count === 2) {
          observer.complete();
        }
        if (count > 3) {
          observer.error(new Error('count is greater 3!'))
        }
        count++;
      }, 1000);
    });

    this.interval = customIntervalObservable.subscribe(count => {
      console.log(count);
    }, error => {
      alert(error);
    }, () => {
      console.log('completed')
    })
  }

  ngOnInit() { // WithOperators
    const customIntervalObservable = new Observable(observer => {
      let count = 0;
      setInterval(() => {
        observer.next(count);
        count++;
      }, 1000);
    });

    this.interval = customIntervalObservable.pipe(map(data => {
        return 'Round: ' + data;
      }
    )).subscribe(count => {
      console.log(count);
    }, error => {
      alert(error);
    }, () => {
      console.log('completed')
    })
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
  }

}
