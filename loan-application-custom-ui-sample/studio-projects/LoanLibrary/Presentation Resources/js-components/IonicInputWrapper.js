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
if (typeof(forms.samples.ionic.library.IonInput) == 'undefined') {
	forms.samples.ionic.library.IonInput = function() {};
	var wrapper = forms.samples.ionic.library.IonInput;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionErrors = [];
        this.ionInput = this.createIonInput();
        this.component.parentNode.appendChild(this.ionInput);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonInput: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (this.component.value != this.ionInput.querySelector("ion-input").value)
        	this.ionInput.querySelector("ion-input").value = this.component.value; 
        if (updates.includes("readOnly"))
        	this.ionInput.querySelector("ion-input").readOnly = this.component.control.readOnly;
        if (updates.includes("required"))
        	this.ionInput.querySelector("ion-input").required = this.component.control.required;
        if (updates.includes("validation")) {
        	this.ionInput.className = this.ionInput.className.replace(/ion-invalid/g, "");
        	if (this.ionErrors) {
        		this.ionErrors.forEach(ionError => ionError.remove());
        	}
        	if (!this.component.control.valid) {
    			this.ionInput.className = this.ionInput.className + " ion-invalid ion-touched";
    			if (this.component.control.validationErrors && (this.component.control.validationErrors.length > 0)) {
    				this.component.control.validationErrors[0] && this.component.control.validationErrors[0].forEach(msg => {
    					const ionError = document.createElement("ion-item");
    					ionError.innerHTML = "<p class=\"ccl-ion-error\">" + msg + "</p>";
    					this.ionErrors.push(ionError);
    					this.ionInput.after(ionError);
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

    wrapper.prototype.createIonInput = function() {
    	var ionInput = document.createElement("ion-item");
    	ionInput.innerHTML = "<ion-label position=\"floating\">" + this.component.control.label
    		+ "</ion-label><ion-input " + (this.component.control.placeholder ? "placeholder=\""
    				+ this.component.control.placeholder + "\" " : "")
    				+ (this.component.control.readOnly  ? " readonly" : "")
    				+ (this.component.control.required  ? " required" : "")
    		+ "></ion-input>";
    	ionInput.querySelector("ion-input").addEventListener("ionChange", this.ionChange.bind(this));
    	return ionInput;
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
