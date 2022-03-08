import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RouteGuardService } from './route-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'tecnico-area',
    loadChildren: () => import('./tecnico-area/tecnico-area.module').then( m => m.TecnicoAreaPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'ticket/:id',
    loadChildren: () => import('./ticket/ticket.module').then( m => m.TicketPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'operatore-area',
    loadChildren: () => import('./operatore-area/operatore-area.module').then( m => m.OperatoreAreaPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'create-ticket',
    loadChildren: () => import('./create-ticket/create-ticket.module').then( m => m.CreateTicketPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'search-ticket',
    loadChildren: () => import('./search-ticket/search-ticket.module').then( m => m.SearchTicketPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'clienti',
    loadChildren: () => import('./clienti/clienti.module').then( m => m.ClientiPageModule),
    canActivate:[RouteGuardService]
  },
  {
    path: 'modify-user-profile',
    loadChildren: () => import('./modify-user-profile/modify-user-profile.module').then( m => m.ModifyUserProfilePageModule),
    canActivate:[RouteGuardService]
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
