import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { url } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatusesService {
  url:String;
  constructor(private HttpClient : HttpClient)
  {
    this.url = url;
  }

  getStatuses(){
    return this.HttpClient.get(this.url+'statuses');
}

}
