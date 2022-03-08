import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

import { url } from './../../environments/environment';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isUserLogged:Boolean;
    url:String;
    constructor(private http : HttpClient, private storage : StorageService,private router : Router) {
        this.url = url;
    }


    sendLoginReq(loginObject : Object){
        return this.http.post(this.url +'login', loginObject)
    }
    isUserLoggedIn(){
        this.isUserLogged = true;
    }
    logOut(){
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        this.storage.removeItem('userData');
        this.router.navigate(["/login"]);
        this.isUserLogged = false;
        console.log(this.isUserLogged);
    }
}
