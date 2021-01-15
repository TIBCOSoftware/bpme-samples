/*
 * Copyright (c) 2020 TIBCO Software, Inc. All Rights Reserved.
 */
/*
 * TODO: Description about this class
 */

if (typeof(forms) == 'undefined') forms = new Object();
if (typeof(forms.samples) == 'undefined') forms.samples = new Object();
if (typeof(forms.samples.ionic) == 'undefined') forms.samples.ionic = new Object();
if (typeof(forms.samples.ionic.library) == 'undefined') forms.samples.ionic.library = new Object();
if (typeof(forms.samples.ionic.library.IonDatetime) == 'undefined') {
	forms.samples.ionic.library.IonDatetime = function() {};
	var wrapper = forms.samples.ionic.library.IonDatetime;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionErrors = [];
        this.ionDatetime = this.createIonDatetime();
        this.applyFormats();
        this.component.parentNode.appendChild(this.ionDatetime);
    }

    wrapper.prototype.getFormattedValue = function() {
        var value = this._getFormattedLabel(this.component.control.value);
        return value;
    }

    wrapper.prototype.getValue = function() {
        return "TODO: getValue";
    }

    wrapper.prototype.setFocus = function() {

    }

    wrapper.prototype.applyFormats = function() {
    	var control = this.component.control;
    	// GWT takes 'y' and 'd' whereas Ionic uses uppercase letters for them
        if (this.displayFormatGWT != control.displayFormat) {
        	this.displayFormatGWT = this.component.control.displayFormat;
        	this.displayFormatIonic = this.displayFormatGWT.replace(/y/g, 'Y').replace(/d/g, 'D');
        	this.ionDatetime.querySelector("ion-datetime").setAttribute("display-format", this.displayFormatIonic);
        	if (control.pickerFormat) {
        		this.pickerFormatGWT = this.component.control.pickerFormat;
            	this.pickerFormatIonic = this.pickerFormatGWT.replace(/y/g, 'Y').replace(/d/g, 'D');
            	this.ionDatetime.querySelector("ion-datetime").setAttribute("picker-format", this.pickerFormatIonic);
        	}
        	if (!this.component.control.placeholder)
        		this.ionDatetime.querySelector("ion-datetime").setAttribute("placeholder", this.displayFormatIonic);
        	this.onLocaleRefresh();
        }
    }

    wrapper.prototype.onLocaleRefresh = function() {
    	const idt = this.ionDatetime.querySelector("ion-datetime");
    	idt.cancelText = this.component.form.resource.common.spinner_cancel_label;
    	idt.doneText = this.component.form.resource.common.spinner_done_label;
    	idt.monthNames = eval(this.component.form.resource.common.date_month);
    	idt.monthShortNames = eval(this.component.form.resource.common.date_month_abbrev);
    	idt.monthShortNames = eval(this.component.form.resource.common.date_month_abbrev);
    	idt.dayNames = eval(this.component.form.resource.common.date_day);
    	idt.dayShortNames = eval(this.component.form.resource.common.date_day_abbrev);
    }

    wrapper.prototype.refresh = function(updates) {
        if (this.logger.isDebugEnabled()) this.logger.debug("IonDatetime: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        this.applyFormats();
        if (updates.includes("value")) {
			        this.currentServerCompatibleValue = this.getServerCompatibleValue(this.component.value);
			        if (this.currentServerCompatibleValue != this.ionDatetime.querySelector("ion-datetime").value)
			        	this.ionDatetime.querySelector("ion-datetime").value = this.currentServerCompatibleValue;
        }
        if (updates.includes("locale"))
        	this.onLocaleRefresh();
        if (updates.includes("readOnly"))
        	this.ionDatetime.querySelector("ion-datetime").readOnly = this.component.control.readOnly;
        if (updates.includes("required"))
        	this.ionDatetime.querySelector("ion-datetime").required = this.component.control.required;
        if (updates.includes("validation")) {
        	this.ionDatetime.className = this.ionDatetime.className.replace(/ion-invalid/g, "");
        	if (this.ionErrors) {
        		this.ionErrors.forEach(ionError => ionError.remove());
        	}
        	if (!this.component.control.valid) {
    			this.ionDatetime.className = this.ionDatetime.className + " ion-invalid ion-touched";
    			if (this.component.control.validationErrors && (this.component.control.validationErrors.length > 0)) {
    				this.component.control.validationErrors[0] && this.component.control.validationErrors[0].forEach(msg => {
    					const ionError = document.createElement("ion-item");
    					ionError.innerHTML = "<p class=\"ccl-ion-error\">" + msg + "</p>";
    					this.ionErrors.push(ionError);
    					this.ionDatetime.after(ionError);
    				})
    			}
        	}
        }
    }

    wrapper.prototype.destroy = function() {
    }

    wrapper.isReady = function() {
    	const ionicLoaded = window.Ionic ? true : false;
    	bpm.forms.Util.loadCSS("https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css", !ionicLoaded);
    	bpm.forms.Util.loadJS("https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js", true, !ionicLoaded);
    	return ionicLoaded;
    }

    wrapper.renderStatic = function(value, label, hint, labelId, propertySet, resources, textOnly, parentPaneType, logger) {
    	throw "ERR_MYANGCOM: TODO: Static mode support";
    }

    wrapper.prototype.getServerCompatibleValue = function(value /*: string|Date*/) {
    	if (value) {
	    	let modelFormat;
			if (this.component.baseType == "BomPrimitiveTypes.Date") {
				modelFormat = "yyyy-MM-dd";
			} else if (this.component.baseType == "BomPrimitiveTypes.Time") {
				modelFormat = "HH:mm:ss";
			} else /*if (this.component.baseType == "BomPrimitiveTypes.DateTimeTZ")*/ {
				modelFormat = "yyyy-MM-dd'T'HH:mm:ssZ";
			}
			return bpm.forms.Util.formatDate(modelFormat, value);
    	}
    	return value;
    }

    wrapper.prototype.ionChange = function(event) {
    	if (event.detail.value != this.currentServerCompatibleValue) {
    		this.currentServerCompatibleValue = this.getServerCompatibleValue(event.detail.value);
    		this.component.raiseEvent("update", this.currentServerCompatibleValue);
    	}
    }

    wrapper.prototype.createIonDatetime = function() {
    	// this.displayFormatGWT = this.component.control.displayFormat;
    	// this.displayFormatIonic = this.displayFormatGWT.replace(/y/g, 'Y').replace(/d/g, 'D');
    	var ionDatetime = document.createElement("ion-item");
    	ionDatetime.innerHTML = "<ion-label position=\"floating\">" + this.component.control.label
    		+ "</ion-label><ion-datetime " + (this.component.control.placeholder  ? "placeholder=\""
    				+ this.component.control.placeholder + "\" " : "")
    				+ (this.component.control.readOnly  ? " readonly" : "")
    				+ (this.component.control.required  ? " required" : "")
    				+ (this.component.control.min  ? " min=\"" + this.component.control.min + "\"" : "")
    				+ (this.component.control.max  ? " max=\"" + this.component.control.max + "\"" : "")
    				// + (this.displayFormatIonic  ? " display-format=\"" + this.displayFormatIonic + "\"" : "")
    				// + (this.displayFormatIonic  ? " picker-format=\"" + this.displayFormatIonic + "\"" : "")
    		+ "></ion-datetime>";
    	ionDatetime.querySelector("ion-datetime").addEventListener("ionChange", this.ionChange.bind(this));
    	return ionDatetime;
    }

//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
