import { Injectable } from '@angular/core';
import {HttpClientModule,HttpClient} from '@angular/common/http';
// => Import Environment URL
import { url } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class StatusesService {
  url : String;
  constructor(private HttpClient : HttpClient) {
    this.url = url;
   }

   getStatuses(){
    return this.HttpClient.get(this.url+'statuses');
   }
}
