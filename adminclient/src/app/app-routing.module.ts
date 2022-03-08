import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './pages/customers/customers.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { OperatorsComponent } from './pages/operators/operators.component';
import { TechsComponent } from './pages/techs/techs.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

import { CheckTokenService } from './services/check-token.service';
import { RouteGuardService } from './services/route-guard.service';
import { TechDetailComponent } from './pages/tech-detail/tech-detail.component';
import { CustomerDetailComponent } from './pages/customer-detail/customer-detail.component';
const routes: Routes = [
  {path : '', redirectTo : 'login' , pathMatch:'full'},
  {path : 'login', redirectTo : 'login' , pathMatch:'full'},
  {path : 'home' , component : HomeComponent, canActivate:[RouteGuardService]},
  {path : 'tickets' , component : TicketsComponent,canActivate:[RouteGuardService]},
  {path : 'operators' , component : OperatorsComponent,canActivate:[RouteGuardService]},
  {path : 'techs' , component : TechsComponent,canActivate:[RouteGuardService]},
  {path : 'techDetail/:id' , component : TechDetailComponent,canActivate:[RouteGuardService]},
  {path : 'customerDetail/:id/:oldcontract' , component : CustomerDetailComponent,canActivate:[RouteGuardService]},
  {path : 'customers' , component : CustomersComponent,canActivate:[RouteGuardService]},
  {path : 'login', component:LoginComponent},


  //404 Page Not Found Route
  { path: '**', pathMatch   : 'full', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[RouteGuardService,CheckTokenService]
})
export class AppRoutingModule { }
