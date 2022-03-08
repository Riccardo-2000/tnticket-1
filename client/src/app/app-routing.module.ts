import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';


const routes : Routes = [

  {path:"", loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)},

  {path:'login', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule)},

  {path:"home" , loadChildren: () => import('./home/home.module').then( m => m.HomeModule)}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
