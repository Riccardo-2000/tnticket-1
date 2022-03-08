import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// => Import Environment URL
import { url } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  isUserLogged:Boolean;
  url:String;

  constructor(private http : HttpClient) {
    this.url = url;
   }

  isUserLoggedIn(){
    this.isUserLogged = true;
  }

  signIn(userData : Object ){
    return this.http.post(this.url +'login', userData);
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    console.log(this.isUserLogged);
    this.isUserLogged = false;
    console.log(this.isUserLogged);
  }

}




