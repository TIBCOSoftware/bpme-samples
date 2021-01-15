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
if (typeof(forms.samples.ionic.library.IonSelect) == 'undefined') {
	forms.samples.ionic.library.IonSelect = function() {};
	var wrapper = forms.samples.ionic.library.IonSelect;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionErrors = [];
        this.ionSelect = this.createIonSelect();
        this.component.parentNode.appendChild(this.ionSelect);
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

    wrapper.prototype.refresh = function(updates) {
        if (this.logger.isDebugEnabled()) this.logger.debug("IonSelect: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (updates.includes("value") && this.component.control.value)
    		this.ionSelect.querySelector("ion-select").value = this.component.control.value;
        if (updates.includes("readOnly"))
        	this.ionSelect.querySelector("ion-select").readOnly = this.component.control.readOnly;
        if (updates.includes("required"))
        	this.ionSelect.querySelector("ion-select").required = this.component.control.required;
        if (updates.includes("validation")) {
        	this.ionSelect.className = this.ionSelect.className.replace(/ion-invalid/g, "");
        	if (this.ionErrors) {
        		this.ionErrors.forEach(ionError => ionError.remove());
        	}
        	if (!this.component.control.valid) {
    			this.ionSelect.className = this.ionSelect.className + " ion-invalid ion-touched";
    			if (this.component.control.validationErrors && (this.component.control.validationErrors.length > 0)) {
    				this.component.control.validationErrors[0] && this.component.control.validationErrors[0].forEach(msg => {
    					const ionError = document.createElement("ion-item");
    					ionError.innerHTML = "<p class=\"ccl-ion-error\">" + msg + "</p>";
    					this.ionErrors.push(ionError);
    					this.ionSelect.after(ionError);
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

    wrapper.prototype.ionChange = function(event) {
    	if (event.detail.value != this.component.control.value) {
    		this.component.raiseEvent("update", event.detail.value);
    	}
    }

    wrapper.prototype.createIonSelect = function() {
    	var ionSelect = document.createElement("ion-item");
    	ionSelect.innerHTML = "<ion-label position=\"floating\">" + this.component.control.label
    		+ "</ion-label><ion-select></ion-select>";
    	var olabels = this.component.control.selectOptionLabels;
    	var ovalues = this.component.control.selectOptionValues;
    	var optionsMarkup = "";
    	for(var index=0;index < olabels.length;index++){
    		optionsMarkup += "<ion-select-option value=\"" + ovalues[index] + "\">" +olabels[index]+ "</ion-select-option>";
    	}
    	
    	if (this.component.control.value)
    		ionSelect.querySelector("ion-select").value = this.component.control.value;
    	ionSelect.querySelector("ion-select").innerHTML = optionsMarkup;
    	ionSelect.querySelector("ion-select").addEventListener("ionChange", this.ionChange.bind(this));
    	return ionSelect;
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
