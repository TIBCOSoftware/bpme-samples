/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TutorialPage} from './pages/tutorial/tutorial';

const routes: Routes = [
    {
        path: '',
        component: TutorialPage,
        pathMatch: 'full'
    },
    {
        path: 'signin',
        loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninPageModule)
    },
    {
        path: 'find-customer',
        loadChildren: () => import('./pages/find-customer/find-customer.module').then(m => m.FindCustomerPageModule)
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/find-customer/find-customer.module').then(m => m.FindCustomerPageModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
