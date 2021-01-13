/*
* Copyright © 2021. TIBCO Software Inc.
* This file is subject to the license terms contained
* in the license file that is distributed with this file.
*/

/**
 * Information about the case that case actions are associated.
 */
export interface PFECaseInfo { 
    /**
     * Name of the case class
     */
    caseClassName?: string;
    /**
     * Version of the case
     */
    caseVersion?: string;
    /**
     * Name of the case reference
     */
    caseRefParamName?: string;
}

