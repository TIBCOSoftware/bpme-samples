/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

/**
 * Information of the activity where the pageflow process has been passivated.
 */
export interface PFEActivityInfo { 
    /**
     * Id of the current activity where the process has been passivated
     */
    activityId: string;
    /**
     * Name of the current activity where the process has been passivated
     */
    activityName: string;
    /**
     * Package id of the activity related pageflow
     */
    activityProcessPackageId: string;
    /**
     * Package name of the activity related pageflow
     */
    activityProcessModuleName: string;
    /**
     * Package version of the activity related pageflow
     */
    activityProcessModuleVersion: string;
    /**
     * Name of the activity related pageflow
     */
    activityPageflowName: string;
    /**
     * Data for messages that are related to a specific task, e.g. completion of a user task.
     */
    activityData: string;
}

