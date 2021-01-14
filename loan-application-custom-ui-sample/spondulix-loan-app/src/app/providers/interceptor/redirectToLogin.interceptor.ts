/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/internal/operators/tap';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class RedirectToLoginInterceptor implements HttpInterceptor {
  constructor(public router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(
          event => {
          },
          error => {
            if (error.status === 403) {
              // we need to reload the page for now as otherwise range control
              // seem to have issues on re-visit
              this.router.navigateByUrl('/signin').then(() => window.location.reload());
            }
          }
        )
      );
  }
}
