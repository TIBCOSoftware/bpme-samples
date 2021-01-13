/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CaseActionsConfig} from '../models/caseActions.config';
import {PFECaseAction} from '../models/caseAction';
import {PfInstanceConfig} from '../models/pfInstance.config';
import {BehaviorSubject, Subject, Observable} from 'rxjs';
import {PageFlowData} from '../models/PageFlowData.model';
import {PageFlowWP} from '../models/PageFlowWP.model';
import {CancelProcessConfig} from '../models/cancelProcess.config';
import {PFEInstanceInfo} from '../models/instanceInfo';

@Injectable()
export class PageFlowService {
  location = Location;
  basePath = location.origin;
  // configUrlActions = this.basePath + '/bpm/pageflow/v1';
  configUrlActions = window.location.origin + '/bpm/pageflow/v1';
  wpURL = this.basePath + '/bpm/workpresentation/v1/workItemPageFlow';
  pageFlowData: PageFlowData;
  processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
  submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);

  constructor(protected http: HttpClient) {}

  getCaseActions(config: CaseActionsConfig) {
    let actionsURL = this.configUrlActions + '/caseActions';
    if (config.filter) {
      actionsURL = actionsURL + '?$filter=' + config.filter;
    }
    return this.http.get<Array<PFECaseAction>>(actionsURL);
  }

  createProcessInstance(config: PfInstanceConfig) {
    const instanceURL = this.configUrlActions + '/instances';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');
    let body: any;
    if (config.formalParameterName && config.caseRef) {
      const formalData = {};
      formalData[config.formalParameterName] = config.caseRef;
      body = {
        'moduleName': config.moduleName,
        'processName': config.processName,
        'moduleVersion': config.moduleVersion,
        'data': JSON.stringify(formalData)
      };
    } else {
      body = {
        'moduleName': config.moduleName,
        'processName': config.processName,
        'moduleVersion': config.moduleVersion
      };
    }
    return this.http.post<PFEInstanceInfo>(instanceURL, body, {'headers': headers});
  }

  createProcessInstanceAndFormDetails(config: PfInstanceConfig) {
    this.createProcessInstance(config).subscribe((data: PFEInstanceInfo) => {
      this.pageFlowData = new PageFlowData();
      this.pageFlowData.processData = data;
      if (data.state === null || data.state === undefined ||  data.state.state === 'COMPLETED') {
        this.processSubject.next(this.pageFlowData);
        this.pageFlowData = new PageFlowData();
        this.processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
      } else {
        const config1 = new CaseActionsConfig();
        config1.filter = 'processName eq \'' + data.activityInfo.activityPageflowName + '\' and moduleName eq \''
          + data.activityInfo.activityProcessModuleName + '\' and channelId eq \'openspaceGWTPull_DefaultChannel\' and moduleVersion eq \''
          + data.activityInfo.activityProcessModuleVersion + '\'';
        let pageFlowURL = this.wpURL;
        if (config1.filter) {
          pageFlowURL = this.wpURL + '?$filter=' + config1.filter;
        }
        this.http.get<Array<PageFlowWP>>(pageFlowURL).subscribe((data1: PageFlowWP[]) => {
          if (data1.length === 1) {
            let activityFound = false;
            for (let i = 0; i < data1[0].pageflowActivities.length; i++) {
              if (this.pageFlowData.processData.activityInfo.activityName === data1[0].pageflowActivities[i].activityName) {
                activityFound = true;
                this.pageFlowData.formData = data1[0].pageflowActivities[i];
                this.processSubject.next(this.pageFlowData);
                this.pageFlowData = new PageFlowData();
                this.processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
                break;
              }
            }
            if (!activityFound) {
              this.processSubject.next(this.pageFlowData);
              this.pageFlowData = new PageFlowData();
              this.processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
            }
          } else {
            console.log('This case of multiple instances need to be handled');
          }
        }, error1 => {
          this.pageFlowData = new PageFlowData();
          this.pageFlowData.error = error1;
          this.processSubject.next(this.pageFlowData);
          this.pageFlowData = new PageFlowData();
          this.processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
        });
      }
    }, (error1) => {
      this.pageFlowData = new PageFlowData();
      this.pageFlowData.error = error1;
      this.processSubject.next(this.pageFlowData);
      this.pageFlowData = new PageFlowData();
      this.processSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
    });
  }
  updateProcessInstance(instanceData: PFEInstanceInfo) {
    const instanceURL = this.configUrlActions + '/instances';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<PFEInstanceInfo>(instanceURL, instanceData, {headers});
  }

  updateProcessInstanceAndFormDetails(config: PFEInstanceInfo) {
    this.updateProcessInstance(config).subscribe((data: PFEInstanceInfo) => {
      this.pageFlowData = new PageFlowData();
      this.pageFlowData.processData = data;
      if (data.state === null || data.state === undefined ||  data.state.state === 'COMPLETED') {
        this.submitSubject.next(this.pageFlowData);
        this.pageFlowData = new PageFlowData();
        this.submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
      } else {
        const config1 = new CaseActionsConfig();
        config1.filter = 'processName eq \'' + data.activityInfo.activityPageflowName + '\' and moduleName eq \''
          + data.activityInfo.activityProcessModuleName + '\' and channelId eq \'openspaceGWTPull_DefaultChannel\' and moduleVersion eq \''
          + data.activityInfo.activityProcessModuleVersion + '\'';
        let pageFlowURL = this.wpURL;
        if (config1.filter) {
          pageFlowURL = this.wpURL + '?$filter=' + config1.filter;
        }
        this.http.get<Array<any>>(pageFlowURL).subscribe((data1: PageFlowWP[]) => {
          if (data1.length === 1) {
            let activityFound = false;
            for (let i = 0; i < data1[0].pageflowActivities.length; i++) {
              if (this.pageFlowData.processData.activityInfo.activityName === data1[0].pageflowActivities[i].activityName) {
                activityFound = true;
                this.pageFlowData.formData = data1[0].pageflowActivities[i];
                this.submitSubject.next(this.pageFlowData);
                this.pageFlowData = new PageFlowData();
                this.submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
                break;
              }
            }
            if (!activityFound) {
              this.submitSubject.next(this.pageFlowData);
              this.pageFlowData = new PageFlowData();
              this.submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
            }
          } else {
            console.log('This case of multiple instances need to be handled');
          }
        },
          error1 => {
            this.pageFlowData = new PageFlowData();
            this.pageFlowData.error = error1;
            this.submitSubject.next(this.pageFlowData);
            this.pageFlowData = new PageFlowData();
            this.submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
          });
      }
    },
      error1 => {
      this.pageFlowData = new PageFlowData();
      this.pageFlowData.error = error1;
      this.submitSubject.next(this.pageFlowData);
      this.pageFlowData = new PageFlowData();
      this.submitSubject = new BehaviorSubject<PageFlowData>(this.pageFlowData);
      });
  }
  getFormsDetails(config) {
    let pageFlowURL = this.wpURL;
    if (config.filter) {
      pageFlowURL = this.wpURL + '?$filter=' + config.filter;
    }
    return this.http.get<Array<any>>(pageFlowURL);
  }

  cancelProcess(config: CancelProcessConfig) {
    const instanceURL = this.configUrlActions + '/instances/' + config.instanceId;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.delete<any>(instanceURL, options);
  }


}
