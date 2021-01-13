/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

/**
 * If the instance is HALTED this contains the message that caused the failure.
 */
export interface PFEFailedMessage { 
    /**
     * The message name.
     */
    msgName?: PFEFailedMessage.MsgNameEnum;
    /**
     * Message from root cause of exception
     */
    exceptionMsg?: string;
    /**
     * Full exception stack
     */
    exceptionStack?: string;
    /**
     * Contains any data being passed in the message.
     */
    msgData?: string;
    /**
     * Data for messages that are related to a specific task, e.g. completion of a user task.
     */
    activityData?: string;
}
export namespace PFEFailedMessage {
    export type MsgNameEnum = 'START' | 'UPDATE' | 'INJECT_EVENT';
    export const MsgNameEnum = {
        START: 'START' as MsgNameEnum,
        UPDATE: 'UPDATE' as MsgNameEnum,
        INJECTEVENT: 'INJECT_EVENT' as MsgNameEnum
    };
}


