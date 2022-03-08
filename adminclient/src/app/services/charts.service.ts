import { Injectable } from '@angular/core';
import { TicketsService } from './tickets.service';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {



  constructor(private tickets : TicketsService) { }




}
