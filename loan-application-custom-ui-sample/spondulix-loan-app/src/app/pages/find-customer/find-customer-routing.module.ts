/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindCustomerPage } from './find-customer.page';

const routes: Routes = [
  {
    path: '',
    component: FindCustomerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindCustomerPageRoutingModule {}
