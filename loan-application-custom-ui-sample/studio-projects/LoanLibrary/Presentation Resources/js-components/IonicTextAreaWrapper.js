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
if (typeof(forms.samples.ionic.library.IonTextArea) == 'undefined') {
	forms.samples.ionic.library.IonTextArea = function() {};
	var wrapper = forms.samples.ionic.library.IonTextArea;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionErrors = [];
        this.ionTextArea = this.createIonTextArea();
        this.component.parentNode.appendChild(this.ionTextArea);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonTextArea: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (this.component.value != this.ionTextArea.querySelector("ion-input").value)
        	this.ionTextArea.querySelector("ion-input").value = this.component.value; 
        if (updates.includes("readOnly"))
        	this.ionTextArea.querySelector("ion-input").readOnly = this.component.control.readOnly;
        if (updates.includes("required"))
        	this.ionTextArea.querySelector("ion-input").required = this.component.control.required;
        if (updates.includes("validation")) {
        	this.ionTextArea.className = this.ionTextArea.className.replace(/ion-invalid/g, "");
        	if (this.ionErrors) {
        		this.ionErrors.forEach(ionError => ionError.remove());
        	}
        	if (!this.component.control.valid) {
    			this.ionTextArea.className = this.ionTextArea.className + " ion-invalid ion-touched";
    			if (this.component.control.validationErrors && (this.component.control.validationErrors.length > 0)) {
    				this.component.control.validationErrors[0] && this.component.control.validationErrors[0].forEach(msg => {
    					const ionError = document.createElement("ion-item");
    					ionError.innerHTML = "<p class=\"ccl-ion-error\">" + msg + "</p>";
    					this.ionErrors.push(ionError);
    					this.ionTextArea.after(ionError);
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

    wrapper.prototype.createIonTextArea = function() {
    	var ionTextArea = document.createElement("ion-item");
    	ionTextArea.innerHTML = "<ion-label position=\"floating\">" + this.component.control.label
    		+ "</ion-label><ion-textarea "
			+ (this.component.control.readOnly  ? " readonly" : "")
			+ (this.component.control.required  ? " required" : "")
    		+ "></ion-textarea>";
    	ionTextArea.querySelector("ion-textarea").addEventListener("ionChange", this.ionChange.bind(this));
    	return ionTextArea;
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
