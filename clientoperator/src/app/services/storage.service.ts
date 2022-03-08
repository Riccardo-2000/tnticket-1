import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  userData;
  constructor() { }

  async setItem(userData) {
    Storage.set({
      key: 'userData',
      value: JSON.stringify(userData)
    });
  }
  async setToken(k,token) {
    Storage.set({
      key: k,
      value: JSON.stringify(token)
    });
  }
  async setId(k,id) {
    Storage.set({
      key: k,
      value: JSON.stringify(id)
    });
  }
  async getToken( k ) {
    const item = await Storage.get({ key: k });
    this.userData = item.value;
    return item.value;
  }
  async getItem( k ) {
    const item = await Storage.get({ key: k });
    this.userData = item.value;
    return item.value;
  }

  removeItem( k ) {
    Storage.remove({ key: k });
  }



}
