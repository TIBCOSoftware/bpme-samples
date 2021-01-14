/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindCustomerPage } from './find-customer.page';

describe('FindCustomerPage', () => {
  let component: FindCustomerPage;
  let fixture: ComponentFixture<FindCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
