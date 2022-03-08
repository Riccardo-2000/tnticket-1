import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

import { url } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url:String;
  constructor(private http : HttpClient)
  {
    this.url = url;
    }
  sendHolidayUserStatus(id:String,statusHoliday){
    return this.http.post(this.url +'user/'+id,statusHoliday);
  }

  updateUserData(id:String,newUserData){
    return this.http.post(this.url +'user/'+id,newUserData);
  }
  getUserDataStatus(id:String){
    return this.http.get(this.url +'user/'+id);
}
}
