/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {
  }

  login(loginOptions) {
    const loginURL = window.location.origin + '/bpm/auth/v1/authenticate';
    const authCredentials = loginOptions.username + ':' + loginOptions.password;
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(authCredentials)
      })
    };
    return this.http.get<any>(loginURL, httpHeaders).toPromise();
  }

  logout() {
    const logoutURL = window.location.origin + '/bpm/auth/v1/logout';
    return this.http.get<any>(logoutURL).toPromise().then(
      event => {
        window.location.reload();
      },
      error => {
        // if it is error, most likely 403 in which case, the interceptor will reload the
        // page after navigating to signin page
      }
    );
  }
}
