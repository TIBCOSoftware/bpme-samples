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
if (typeof(forms.samples.ionic.library.IonButton) == 'undefined') {
	forms.samples.ionic.library.IonButton = function() {};
	var wrapper = forms.samples.ionic.library.IonButton;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionButton = this.createIonButton();
        this.applyColor();
        this.component.parentNode.appendChild(this.ionButton);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonButton: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (updates.includes("enabled"))
        	this.ionButton.setAttribute("disabled", !this.component.control.enabled);
        if (updates.includes("color"))
        	this.applyColor();
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

    wrapper.prototype.onButtonClick = function(event) {
    	this.component.raiseEvent("select", event.detail.value);
    }

    wrapper.prototype.applyColor= function() {
    	if (this.component.control.color) {
    		let color = "primary";
	    	switch (this.component.control.color) {
		    	case 2: color = "secondary"; break;
		    	case 3: color = "tertiary"; break;
		    	case 4: color = "success"; break;
		    	case 5: color = "warning"; break;
		    	case 6: color = "danger"; break;
		    	case 7: color = "light"; break;
		    	case 8: color = "medium"; break;
		    	case 9: color = "dark"; break;
	    	}
	    	this.ionButton.setAttribute("color", color);
    	}
    	
    }

    wrapper.prototype.createIonButton = function() {
    	var ionButton = document.createElement("ion-button");
    	ionButton.setAttribute("shape", "round");
    	ionButton.setAttribute("expand", "block");
    	//ionButton.setAttribute("fill", "outline");
    	ionButton.setAttribute("expand", "block");
    	if (!this.component.control.enabled)
        	ionButton.setAttribute("disabled", true);
    	ionButton.innerHTML = this.component.control.label;
    	ionButton.addEventListener("click", this.onButtonClick.bind(this));
    	return ionButton;
    }
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
