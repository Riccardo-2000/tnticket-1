import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { noop } from 'rxjs';
import { AuthStore } from 'src/app/store/auth.store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm = this.formBuilder.group({

    username : ['' , Validators.required],
    password : ['' , Validators.required]


  })

  showError : Boolean = false;
  constructor(private formBuilder : FormBuilder, private authStore : AuthStore) { }

  ngOnInit(): void {




  }


  login(){
    const payload : any = this.loginForm.value;

    return this.authStore.login(payload)
    .subscribe(
      res => this.showError ? this.showError = false : noop,
      err => this.showError = true
    );

  }

}
