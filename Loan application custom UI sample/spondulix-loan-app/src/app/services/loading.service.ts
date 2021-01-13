/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: '<ion-img class="rot" src="assets/img/loader.svg" alt="Processing your request, please wait..."></ion-img><p>Processing your request, please wait...</p>',
     // duration: 1005000,
      spinner: null,
      cssClass: 'loader-custom-css',

    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
   let delay;
    setTimeout(()=>{
      this.isLoading = false;
      delay = this.loadingController.dismiss().then(() => console.log('dismissed'));
       }, 500);
       return await delay; 
  }
}
