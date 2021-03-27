import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // usefull to use this approach when you use the form not only while submitting it
  @ViewChild('f')
  myForm: NgForm;

  defaultQuestion = 'pet';
  answer = '';
  genders = ['male', 'female'];

  user = {
    username: '',
    email: '',
    secret: '',
    answer: '',
    gender: ''
  };

  submitted = false;

  suggestUserName() {
    const suggestedName = 'Superuser';
    /*this.myForm.setValue({
      userData: {
        username: suggestedName,
        email: ''
      },
      secret: 'pet',
      questionAnswer: '',
      gender: 'female'
    });*/
    this.myForm.form.patchValue({
      userData: {
        username: suggestedName
      }
    });
  }

  onSubmit(form: NgForm) {
    this.user.username = this.myForm.value.userData.username;
    this.user.email = this.myForm.value.userData.email;
    this.user.secret = this.myForm.value.secret;
    this.user.answer = this.myForm.value.answer;
    this.user.gender = this.myForm.value.gender;
    this.submitted = true;

    this.myForm.reset();
  }
}
