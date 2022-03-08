import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  userData:any;
  constructor(public storage : StorageService, private router : Router) { }
 async checkToken(){
    this.userData = await this.storage.getItem("userData")
    .then(res => {
      if (!res) {
        this.router.navigate(["/login"]);
      }
    })
  }
}
