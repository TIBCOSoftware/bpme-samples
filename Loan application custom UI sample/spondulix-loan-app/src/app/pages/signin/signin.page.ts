/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import {Component, ChangeDetectorRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import {UserOptions} from '../../interfaces/user-options';
import {LoginService} from '../../services/login.service';
import {ToastController} from '@ionic/angular';

import {PfInstanceConfig} from '../../providers/models/pfInstance.config';
import {PFEInstanceInfo} from '../../providers/models/instanceInfo';
import {PageFlowData} from '../../providers/models/PageFlowData.model';
import {PageFlowService} from '../../providers/page-flow/page-flow.service';
import {FindCustomerPage} from '../find-customer/find-customer.page';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.page.html',
    styleUrls: ['./signin.page.scss'],
    providers: [FindCustomerPage]
})
export class SigninPage {
    login: UserOptions = {username: '', password: ''};
    submitted = false;

    processConfig: PfInstanceConfig;
    processInfo: PFEInstanceInfo;
    activityData: PFEInstanceInfo;
    activityInfo: PFEInstanceInfo;
    processData: PFEInstanceInfo;
    pfFormData: any;
    pfFormUrl: any;
    sendFormData: any;
    formRenderData: any;

    constructor(public router: Router,
                private loginService: LoginService,
                public toastController: ToastController,
                private pfService: PageFlowService,
                private ref: ChangeDetectorRef,
                private findCustomerPage: FindCustomerPage) {
    }

    async presentToast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color: 'warning'
        });
        toast.present();
    }

    onLogin(form: NgForm) {
        this.submitted = true;
        if (form.valid) {
            this.loginService.login(this.login).then(data => {
                localStorage.setItem('username', data.name);
                this.router.navigateByUrl('/find-customer');
                // Start Business Service
            }, error => {
                this.presentToast(error.error.errorMsg);
            });
        }
    }

    onSignup() {
        this.router.navigateByUrl('/signup');
    }

    startBusinessService() {
        this.findCustomerPage.startService();
    }
}
