/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import {Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef} from '@angular/core';
import {PageFlowService} from '../../providers/page-flow/page-flow.service';
import {PfInstanceConfig} from '../../providers/models/pfInstance.config';
import {PFEInstanceInfo} from '../../providers/models/instanceInfo';
import {PageFlowData} from '../../providers/models/PageFlowData.model';
import {LoadingService} from '../../services/loading.service';
import {LoginService} from '../../services/login.service';

@Component({
    selector: 'app-find-customer',
    templateUrl: './find-customer.page.html',
    styleUrls: ['./find-customer.page.scss']
})
export class FindCustomerPage implements OnInit {
    processConfig: PfInstanceConfig;
    processInfo: PFEInstanceInfo;
    activityData: PFEInstanceInfo;
    activityInfo: PFEInstanceInfo;
    processData: PFEInstanceInfo;
    pfFormData: any;
    pfFormUrl: string;
    sendFormData: any;
    formRenderData: any;
    show: boolean = false;
    pageTitle: string = 'Find Customer';
    @ViewChild('tibcoFormContainer', {'static': false})
    tibcoFormContainer: ElementRef;
    /** Save last name from NoLoansExisting task to use it later in the Thank You form. */
    private lastName: string;

    constructor(public pfService: PageFlowService, private ref: ChangeDetectorRef,
                public loading: LoadingService, private loginService: LoginService) {
    }

    ngOnInit() {
        this.startService();
    }

    startService() {
        this.loading.present();
        this.processConfig = new PfInstanceConfig();
        // Pass major version to pick the latest version of business service within the major version range
        this.processConfig.moduleVersion = '1';
        // Pass the relevant loan application module name and process name
        this.processConfig.moduleName = '/LoanApplication/Process Packages/LoanApplication.xpdl';
        this.processConfig.processName = 'LoanApplication';
        this.pfService.createProcessInstanceAndFormDetails(this.processConfig);
        this.pfService.processSubject.subscribe((data: PageFlowData) => {
                if (data && data.processData) {
                    if (data.processData.state.state == 'COMPLETED') {
                        this.pfFormUrl = this.pfFormUrl.substring(0, this.pfFormUrl.lastIndexOf('/') + 1) + '../ThankYou/ThankYou.gwt.json';
                        const tf = document.createElement('tibco-form');
                        tf.setAttribute('formurl', this.pfFormUrl);
                        tf.setAttribute('bomjspath', '/bpmresources');
                        tf.addEventListener('submit', this.onThankYouFormSubmit.bind(this));
                        tf.addEventListener('load', this.onThankYouFormLoad.bind(this));
                        this.loading.dismiss();
                        this.tibcoFormContainer.nativeElement.appendChild(tf);
                    }
                }
                if (data && data.formData) {
                    this.ref.detectChanges();
                    console.log(data);
                    this.renderForm(data);
                    this.show = true;
                    this.ref.detectChanges();
                    const tf = document.createElement('tibco-form');
                    tf.setAttribute('formurl', this.pfFormUrl);
                    tf.setAttribute('initdata', this.pfFormData);
                    tf.setAttribute('bomjspath', '/bpmresources');
                    tf.addEventListener('submit', this.submit.bind(this));
                    tf.addEventListener('load', this.load.bind(this));
                    this.loading.dismiss();
                    this.tibcoFormContainer.nativeElement.appendChild(tf);
                } else if (data && data.error) {
                    this.loading.dismiss();
                } else {
                    console.log(data);
                }
            }
        );
    }

    renderForm(pfForm) {
        this.pfFormData = pfForm.processData.activityInfo.activityData;
        this.pfFormUrl = '/bpmresources/' + pfForm.formData.formIdentifier;
        this.sendFormData = pfForm.processData;
    }

    submit($event) {
        this.loading.present();
        const formUpdatedData = $event.detail.form.getSerializedParameters();
        $event.detail.form.updateDataContainer((formUpdatedData: any) => {
            this.sendFormData.activityInfo.activityData = '{"body":' + formUpdatedData + '}';
            this.processInfo = this.sendFormData;
            this.pfService.updateProcessInstanceAndFormDetails(this.processInfo);
            // destroy the form here
            $event.detail.form.destroy();
            this.pfService.submitSubject.subscribe((data: PageFlowData) => {
                    if (data !== undefined) {
                        if (data !== null) {
                            if (data && data.processData) {
                                this.processInfo = data.processData;
                                this.formRenderData = data.formData;
                                if (data.processData.state.state == 'COMPLETED') {
                                    this.show = false;
                                    // this.ref.detectChanges();
                                    this.pfFormUrl = this.pfFormUrl.substring(0, this.pfFormUrl.lastIndexOf('/') + 1) + '../ThankYou/ThankYou.gwt.json';
                                    const tf = document.createElement('tibco-form');
                                    tf.setAttribute('formurl', this.pfFormUrl);
                                    tf.setAttribute('bomjspath', '/bpmresources');
                                    tf.addEventListener('submit', this.onThankYouFormSubmit.bind(this));
                                    tf.addEventListener('load', this.onThankYouFormLoad.bind(this));
                                    this.loading.dismiss();
                                    this.tibcoFormContainer.nativeElement.appendChild(tf);
                                } else if (data.processData.state.state == 'ACTIVE') {
                                    this.renderForm(data);
                                    // add the tibco form element to dom to render the form

                                    const tf = document.createElement('tibco-form');
                                    tf.setAttribute('formurl', this.pfFormUrl);
                                    tf.setAttribute('initdata', this.pfFormData);
                                    tf.setAttribute('bomjspath', '/bpmresources');
                                    tf.addEventListener('submit', this.submit.bind(this));
                                    tf.addEventListener('load', this.load.bind(this));

                                    // save last name for thank you form
                                    if (data.processData.activityInfo.activityName == 'NoLoansExisting') {
                                        const activityData = JSON.parse(this.pfFormData);
                                        activityData.body.inouts.forEach(inoutData => {
                                            if (inoutData.name == 'LastName') {
                                                this.lastName = inoutData.simple[0];
                                            }
                                        });
                                    }
                                    this.loading.dismiss();
                                    this.tibcoFormContainer.nativeElement.appendChild(tf);
                                    // added the form element to dom finished
                                    this.show = true;
                                    this.ref.detectChanges();
                                } else {
                                    this.ref.detectChanges();
                                    this.loading.dismiss();
                                }
                            } else if (data && data.error) {
                                this.show = false;
                                this.loading.dismiss();
                                this.ref.detectChanges();
                            } else {
                            }
                        } else {
                            this.show = false;
                            this.loading.dismiss();
                            this.ref.detectChanges();
                        }
                    }
                    this.ref.detectChanges();
                },
            );
        });
        this.ref.detectChanges();
    }

    load($event) {
        this.pageTitle = $event.detail.form.getPane('content').label;
        this.ref.detectChanges();
    }

    onThankYouFormLoad($event) {
        $event.detail.form.getControl('thankYou').value = this.lastName;
        this.load($event);
    }

    onThankYouFormSubmit($event) {
        let signout = true;
        // check form data to find out whether to sign out or start a new application
        JSON.parse($event.detail.form.getSerializedParameters()).outputs.forEach(element => {
            if (element.name == 'logOff') {
                signout = element.simple[0];
            }
        });
        // we need to reload the page as range control has an issue otherwise!
        if (signout) {
            this.loginService.logout();
        } else {
            window.location.reload();
        }
    }
}
