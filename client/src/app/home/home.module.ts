import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { HeroCardComponent } from './hero-card/hero-card.component';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerDataComponent } from './customer-data/customer-data.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const routes : Routes = [
  {path : '', component:HomepageComponent},
]

@NgModule({
  declarations: [HomepageComponent,HeroCardComponent, MyTicketsComponent, CustomerDataComponent, TicketDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ]
})
export class HomeModule { }
