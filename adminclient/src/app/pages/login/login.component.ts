import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { startWith,debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorMessage:String;
  getEmail(){
    return this.logIn.get('email');
  }
  getPassword(){
    return this.logIn.get('password');
  }



  logIn=this.FormBuilder.group({
    email:["",[
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30),
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9-.]+\\.[a-z]{2,}$')
    ]],
    password:["",[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]]
  })


  private userData:any;

  constructor(private FormBuilder : FormBuilder, private auth : AuthService, private router : Router) {

  }

  ngOnInit(): void {


  }
  logInRqe(){
   this.auth.signIn(this.logIn.value)
   .subscribe(res => {
    console.log(res);
    this.userData = res;
    if (res && this.userData) {
      console.log(this.userData)
      localStorage.setItem('id', this.userData.userId);
      localStorage.setItem('token', this.userData.token);
      this.auth.isUserLoggedIn();
      this.router.navigate(["/home"]);
    } else {
      this.auth.isUserLogged == false;
      return false;
    }
  },
  (error) => {
    console.log(error.error.message);
    this.errorMessage = "Autenticazione Fallita";
  }
  );
  }



}
