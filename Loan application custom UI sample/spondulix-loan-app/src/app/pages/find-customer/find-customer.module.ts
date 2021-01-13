/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FindCustomerPageRoutingModule } from './find-customer-routing.module';

import { FindCustomerPage } from './find-customer.page';

import{PageFlowService} from '../../providers/page-flow/page-flow.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindCustomerPageRoutingModule
  ],
  declarations: [FindCustomerPage],
  providers: [PageFlowService],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class FindCustomerPageModule {}
