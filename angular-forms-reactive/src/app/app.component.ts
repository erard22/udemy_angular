import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.usernameValidator()]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmailsValidator()),
      }),
      'gender': new FormControl('male', Validators.required),
      'hobbies': new FormArray([])
    });

    /*this.signupForm.valueChanges.subscribe(
      (value) => console.log(value)
    );*/

    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  get controls() {
    return (this.signupForm.get('hobbies') as FormArray).controls;
  }

  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return this.forbiddenUsernames.indexOf(control.value) > 0 ? {'nameIsForbidden': true} : null;
    };
  }

  forbiddenEmailsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return new Promise<ValidationErrors>(resolve => {
        setTimeout(() => {
          if (control.value === 'test@test.com') {
            resolve({'emailIsForbidden': true});
          } else {
            resolve(null);
          }
        }, 1500);
      });
    };
  }
}
