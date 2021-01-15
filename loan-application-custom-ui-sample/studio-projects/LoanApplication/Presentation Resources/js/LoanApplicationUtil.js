/*
 * Copyright (c) 2020 TIBCO Software, Inc. All Rights Reserved.
 */

// ---------------------------------------------------------------------------------
// Used by:
//			DisplayCurrentLoansAndChallengeForLoan.form
// ---------------------------------------------------------------------------------
function onDisplayCurrentLoansAndChallengeForLoanOpen(factory, pkg, form, resource, data, control, gridOfAdvancedCardsControl,
		reasonLabelsControl, statusLabelsControl, loanAmountControl, interestRateControl, payoffdateControl) {
	gridOfAdvancedCardsControl.value.pushAll(data.ExistingLoans.map(loanApplication => {
		let reason = loanApplication.reason;
		for (var idx in reasonLabelsControl.optionValues) {
			if (reasonLabelsControl.optionValues[idx] == loanApplication.reason) {
				reason = reasonLabelsControl.optionLabels[idx];
				break;
			}
		}
		let status = loanApplication.status;
		for (var idx in statusLabelsControl.optionValues) {
			if (statusLabelsControl.optionValues[idx] == loanApplication.status) {
				status = statusLabelsControl.optionLabels[idx];
				break;
			}
		}
		const loanAppWrapper = {
			"main": {"icon": "/icons/loantype-" + loanApplication.reason.toLowerCase() + ".svg",
				"middle": {"attr1": reason,"attr2": loanApplication.applicationID, "attr3": "Bank Name"
				}, "right": status, "rightClass": loanApplication.status.toLowerCase()},
			"detail": [{"label": loanAmountControl.label, "value":
					bpm.forms.Util.formatNumber(resource.common.format_currency, loanApplication.amount)},
				{"label": interestRateControl.label, "value": "Not available"},
				{"label": payoffdateControl.label, "value": loanApplication.date ?
					bpm.forms.Util.formatDate(resource.common.date_format, loanApplication.date) : ""}]};

		return JSON.stringify(loanAppWrapper);
	}));
}

// ---------------------------------------------------------------------------------
// Used by:
//			SelectAccount.form
// ---------------------------------------------------------------------------------
function onSelectAccountOpen(factory, pkg, form, resource, data, control, gridOfAdvancedCardsControl, selectcontinueControl,
		banksControl, accountStatusControl, sortCodeControl, acsubtypeControl, currencyControl, openingDateControl) {
	gridOfAdvancedCardsControl.value.pushAll(data.CustomersAccounts.map((customerAccount, accIdx) => {
		let bank = customerAccount.bankName;
		if (data.AccountId == customerAccount.accountId) {
			gridOfAdvancedCardsControl.selectionIndex = accIdx;
			selectcontinueControl.enabled = true;
		}
		for (var idx in banksControl.optionValues) {
			if (banksControl.optionValues[idx] == customerAccount.bankName) {
				bank = banksControl.optionLabels[idx];
				break;
			}
		}
		let status = customerAccount.accountState;
		for (var idx in accountStatusControl.optionValues) {
			if (accountStatusControl.optionValues[idx] == customerAccount.accountState) {
				status = accountStatusControl.optionLabels[idx];
				break;
			}
		}
		const loanAppWrapper = {"main": {"icon": "/icons/" + customerAccount.bankName.toLowerCase() + ".svg",
			"middle": {"attr1": bank,"attr2": customerAccount.accountNumber,
				"attr3": customerAccount.accountType
			}, "right": status, "rightClass": customerAccount.accountState},
			"detail": [{"label": sortCodeControl.label, "value": customerAccount.sortCode},
				{"label": acsubtypeControl.label, "value": customerAccount.accountSubType},
				{"label": currencyControl.label, "value": customerAccount.currency},
				{"label": openingDateControl.label, "value": customerAccount.openingDate}
			]};

		return JSON.stringify(loanAppWrapper);
	}));	
}

// ---------------------------------------------------------------------------------
// Used by:
//			NoLoansExisting.form
// ---------------------------------------------------------------------------------
function onNoLoansExistingOpen(factory, pkg, form, resource, data, control, gridOfAdvancedCardsControl) {
	const loanDetailWrapper = {"main": {
		"middle": {"attr1": "<custom-circle-progress percent=\"71\"></custom-circle-progress>"}},
		"detail": [{"label": "Loan amount", "value": "Not available"},
			{"label": "Loan paid off", "value": "Not available"},
			{"label": "Loan balance", "value": "Not available"},
			{"label": "Start date", "value": "Not available"},
			{"label": "Payoff date", "value": "Not available"},
			{"label": "Interest rate", "value": "Not available"}
		]};
	gridOfAdvancedCardsControl.value.pushAll([JSON.stringify(loanDetailWrapper)]);
}
