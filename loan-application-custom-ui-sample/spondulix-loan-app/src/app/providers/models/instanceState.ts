/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

import { PFEFailedMessage } from './failedMessage';
/**
 * The current State and data for a Process Instance.
 */
export interface PFEInstanceState { 
    /**
     * The state of the instance.
     */
    state: PFEInstanceState.StateEnum;
    failedMessage?: PFEFailedMessage;
}
export namespace PFEInstanceState {
    export type StateEnum = 'STARTING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'HALTED' | 'UNKNOWN';
    export const StateEnum = {
        STARTING: 'STARTING' as StateEnum,
        ACTIVE: 'ACTIVE' as StateEnum,
        COMPLETED: 'COMPLETED' as StateEnum,
        CANCELLED: 'CANCELLED' as StateEnum,
        HALTED: 'HALTED' as StateEnum,
        UNKNOWN: 'UNKNOWN' as StateEnum
    };
}


