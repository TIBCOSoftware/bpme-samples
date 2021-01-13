/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { PFEInstanceState } from './instanceState';
import { PFEActivityInfo } from './activityInfo';
/**
 * Basic information about a Process Instance.
 */
export interface PFEInstanceInfo { 
    /**
     * The unique id of the Process Instance.
     */
    instanceId: string;
    /**
     * The id of the package for this instance.
     */
    packageId: string;
    /**
     * The id of the process for this instance.
     */
    processId: string;
    /**
     * The name of the package for this instance.
     */
    moduleName: string;
    /**
     * The version of the package for this instance.
     */
    moduleVersion: string;
    /**
     * The name of the process for this instance.
     */
    processName: string;
    /**
     * The date/time the instance was started.
     */
    startDate: string;
    state: PFEInstanceState;
    activityInfo?: PFEActivityInfo;
    /**
     * If set, contains the id of this instance\'s parent instance.
     */
    parentId: string;
}

