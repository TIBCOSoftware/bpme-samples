/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { PFECaseInfo } from './caseInfo';


/**
 * Summary information about a deployed caseaction.
 */
export interface PFECaseAction { 
    /**
     * The id of the process.
     */
    processId: string;
    /**
     * The name of the process.
     */
    processName: string;
  /**
   * The label of the process.
   */
  processLabel: string;
    /**
     * The external name of the process.
     */
    processExtName: string;
    /**
     * Type of the process pageflow or business service.
     */
    processType: PFECaseAction.ProcessTypeEnum;
    /**
     * Channels in which the following business services are available
     */
    channelIds?: Array<string>;
    /**
     * category of the process
     */
    category?: string;
    /**
     * privileges of who can access the business services
     */
    privileges?: Array<string>;
    /**
     * Case states in which the following business services are available
     */
    caseStates?: Array<string>;
    caseInfo?: PFECaseInfo;
    /**
     * The id of the module.
     */
    moduleId: string;
    /**
     * The name of the module.
     */
    moduleName: string;
    /**
     * The internal name of the module.
     */
    moduleInternalName: string;
    /**
     * The version numner of the module.
     */
    moduleVersion: string;
}
export namespace PFECaseAction {
    export type ProcessTypeEnum = 'PAGEFLOW' | 'BUSINESSSERVICE' | 'CASEACTION';
    export const ProcessTypeEnum = {
        PAGEFLOW: 'PAGEFLOW' as ProcessTypeEnum,
        BUSINESSSERVICE: 'BUSINESSSERVICE' as ProcessTypeEnum,
        CASEACTION: 'CASEACTION' as ProcessTypeEnum
    };
}


