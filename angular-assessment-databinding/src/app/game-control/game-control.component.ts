import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {

  @Output() intervalFired: EventEmitter<number> = new EventEmitter();

  interval: number;
  currentValue = 0;

  constructor() { }

  ngOnInit(): void {
  }

  gameStart() {
    this.interval = setInterval(() => { this.increment(); }, 1000);
  }


  private increment() {
    this.currentValue++;
    this.intervalFired.emit(this.currentValue);
  }

  gameStop() {
    clearInterval(this.interval);
  }
}
