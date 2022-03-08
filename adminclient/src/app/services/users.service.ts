import { Injectable } from '@angular/core';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { url } from './../../environments/environment';
import { Observable } from 'rxjs';

import { User } from './../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url : String;
  constructor(private HttpClient : HttpClient) {
    this.url = url;
  }


  getAllUsers():Observable<User[]>{
    return this.HttpClient.get<User[]>(this.url +'users');
  }

  getSpecificUser(id:String){
    return this.HttpClient.get(this.url+'user/'+id);
  }

  createNewUser(newUser:User):Observable<User>{
    return this.HttpClient.post<User>(this.url+'user',newUser);
  }
  updateUser(id:String, newData:User):Observable<User>{
    return this.HttpClient.post<User>(this.url+'user/'+id,newData);
  }
  deleteUser(id:String){
    return this.HttpClient.delete(this.url+'user/'+id);
  }
}

