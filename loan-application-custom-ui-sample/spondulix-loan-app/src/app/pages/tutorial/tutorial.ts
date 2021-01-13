/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, IonSlides } from '@ionic/angular';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;
  splash = false;
  showLogin = false;

  @ViewChild('slides', { static: true }) slides: IonSlides;

  constructor(
    public menu: MenuController,
    public router: Router,
    public storage: Storage
  ) {}

  startApp() {
    // this.router
    //   .navigateByUrl('/app/tabs/home', { replaceUrl: true })
    //   .then(() => this.storage.set('ion_did_tutorial', true));
  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
      this.showLogin = isEnd;
    });
  }

  ionViewWillEnter() {
     setTimeout(() => {
      this.splash = false;
     }, 4000);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

  next() {
    this.slides.slideNext();
  }

  login() {
    this.router
       .navigateByUrl('/signin', { replaceUrl: true });
  }
}
