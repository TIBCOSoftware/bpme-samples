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
if (typeof(forms.samples.ionic.library.IonRange) == 'undefined') {
	forms.samples.ionic.library.IonRange = function() {};
	var wrapper = forms.samples.ionic.library.IonRange;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionErrors = [];
        this.lower = this.component.control.lowerRange ? this.component.control.lowerRange : 1000;
        this.upper = this.component.control.upperRange ? this.component.control.upperRange : 2000;
        this.ionRange = this.createIonicRangeElement(this.lower, this.upper);
        var ionItem = document.createElement("ion-item");
        var ionLabel = document.createElement("ion-label");
        ionLabel.setAttribute("position", "floating");
        ionLabel.innerHTML = this.component.control.label;
        ionItem.appendChild(ionLabel);
        ionItem.appendChild(this.ionRange);
        this.component.parentNode.appendChild(ionItem);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonRange: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (updates.includes("lowerRange") || updates.includes("upperRange")) {
        	this.lower = control.lowerRange;
        	this.upper = control.upperRange;
        	this.ionRange.setAttribute("min", "" + this.lower);
            this.ionRange.setAttribute("max", "" + this.upper);
        	this.component.parentNode.appendChild(this.ionRange);
        }
        if (Number(this.component.control.value) != this.ionRange.value)
        	this.ionRange.value = Number(this.component.control.value); 
        if (updates.includes("validation")) {
        	this.ionRange.className = this.ionRange.className.replace(/ion-invalid/g, "");
        	if (this.ionErrors) {
        		this.ionErrors.forEach(ionError => ionError.remove());
        	}
        	if (!this.component.control.valid) {
    			this.ionRange.className = this.ionRange.className + " ion-invalid ion-touched";
    			if (this.component.control.validationErrors && (this.component.control.validationErrors.length > 0)) {
    				this.component.control.validationErrors[0] && this.component.control.validationErrors[0].forEach(msg => {
    					const ionError = document.createElement("ion-item");
    					ionError.innerHTML = "<p class=\"ccl-ion-error\">" + msg + "</p>";
    					this.ionErrors.push(ionError);
    					this.ionRange.after(ionError);
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

    wrapper.prototype.createIonicRangeElement = function(lower, upper) {
    	var ionRange = document.createElement("ion-range");
    	ionRange.setAttribute("min", "" + this.lower);
        ionRange.setAttribute("max", "" + this.upper);
        if (this.component.control.steps) {
        	ionRange.setAttribute("step", this.component.control.steps);
        	ionRange.setAttribute("snaps", "true");
        }
        // ionRange.setAttribute("ticks", "true");
        //ionRange.setAttribute("color", "danger");
        if (this.component.control.dualKnobs)
        	ionRange.setAttribute("dualKnobs", "true");
        ionRange.addEventListener("ionChange", this.ionChange.bind(this));
        var icon1 = document.createElement("ion-label");
        icon1.setAttribute("slot", "start");
        icon1.style.textAlign = "center";
        icon1.innerText = 'Min \n' + this.lower;
        // icon1.setAttribute("size", "small");
        //icon1.setAttribute("color", "primary");
        //icon1.setAttribute("name", "thermometer");
        var icon2 = document.createElement("ion-label");
        icon2.setAttribute("slot", "end");
        icon2.style.textAlign = "center";
        icon2.innerText = 'Max \n' + this.upper;
        //icon2.setAttribute("color", "primary");
        //icon2.setAttribute("name", "thermometer");
        ionRange.appendChild(icon1);
        ionRange.appendChild(icon2);
        return ionRange;
    }
}
