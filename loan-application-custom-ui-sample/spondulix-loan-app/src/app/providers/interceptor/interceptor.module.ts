/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {RedirectToLoginInterceptor} from './redirectToLogin.interceptor';

@NgModule({
  declarations: [],
  imports: [
  ],
  exports: [],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RedirectToLoginInterceptor, multi: true}
  ]
})
export class HttpInterceptorModule { }
