import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy} from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedComponentsModule } from './shared-components/shared-components.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CheckTokenService } from './services/check-token.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { TokenInterceptorService } from './token-interceptor.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';



@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: 
  [
    AppRoutingModule,
    BrowserModule,
    IonicModule.forRoot({animated:false}),
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    CommonModule,
    HttpClientModule,
    
    
  ],
  
  providers: [
    PDFGenerator,
    StatusBar,
    SplashScreen,
    CheckTokenService,
    CallNumber,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
        provide:HTTP_INTERCEPTORS,
        useClass:TokenInterceptorService,
        multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
