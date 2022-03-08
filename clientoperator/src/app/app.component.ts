import { Component, OnInit, Output } from '@angular/core';

import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CheckTokenService } from './services/check-token.service';
import { StorageService } from './services/storage.service';


import { Plugins } from '@capacitor/core';

const { Network } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage : StorageService,
    public alertController : AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    this.getStatus();
}
async presentAlert() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Attenzione ',
    message: 'Nessuna connessione rilevata',
    buttons: ['OK']
  });

  await alert.present();
}
async getStatus() {
  let handler = Network.addListener('networkStatusChange', (status) => {
    if (status.connected === false) {
      this.presentAlert();
    }

  });
}


}
