import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from './services/auth.service;
import { StorageService } from 'src/app/services/storage.service';

@Injectable({
    providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

    token:string;
    id:string;
    constructor(private router : Router, private storage :StorageService) { }

    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
        this.getToken();
        this.getId();
        if (this.token && this.id) {
            console.log(true);

            return true;
        } else {
            console.log(false);
            return false;
        }
    }


    private getToken(){
        return this.token = localStorage.getItem('token');
    }
    private getId(){
        return this.id = localStorage.getItem('id');
    }
}
