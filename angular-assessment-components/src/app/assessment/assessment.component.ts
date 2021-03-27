import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {

  username;

  constructor() {
    this.resetUsername();
  }

  ngOnInit(): void {
  }

  resetUsername = (): void => {
    this.username = '';
  }
}
