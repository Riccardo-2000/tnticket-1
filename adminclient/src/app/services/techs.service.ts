import { Injectable } from '@angular/core';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './../interfaces/user';
// => Import Environment URL
import { url } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class TechsService {

  url : String;
  constructor(private HttpClient : HttpClient) {
    this.url = url;
  }

 


  getSpecificTech(id:String){
    return this.HttpClient.get(this.url+'user/'+id);
  }
  
  getAlltechs():Observable<User[]>{
    return this.HttpClient.get<User[]>(this.url +'users/tech');
  }
}
