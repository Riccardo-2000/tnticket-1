import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {

  token:Boolean = false;

  constructor(private auth : AuthService, private router : Router) { }


  checkToken(){
    const token = localStorage.getItem('token');
    if (token != null) {
      this.auth.isUserLogged = true;
      console.log(token);
      return true;
    } else {
      this.router.navigate(["/login"]);
      this.auth.isUserLogged = false;
      console.log(token);
      return false;
    }
  }
}
