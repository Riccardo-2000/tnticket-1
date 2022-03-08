import { Injectable } from '@angular/core';
import {HttpClientModule,HttpClient} from '@angular/common/http';
import { url } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  url : String;
  constructor(private HttpClient : HttpClient) {
    //this.url = 'https://tn.salernodev.com:5000/';
    this.url = url;
  }

  getCategories(){
    return this.HttpClient.get(this.url+'categories');
  }

}
