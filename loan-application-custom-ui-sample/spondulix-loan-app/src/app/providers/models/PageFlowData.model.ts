/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import {PFEInstanceInfo} from './instanceInfo';
import {PageFlowActivity} from './PageFlowActivity.model';

export class PageFlowData {
  processData: PFEInstanceInfo;
  formData: PageFlowActivity;
  error: any;
}
