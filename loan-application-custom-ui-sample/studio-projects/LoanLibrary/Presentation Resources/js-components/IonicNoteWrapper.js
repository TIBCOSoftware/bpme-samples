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
if (typeof(forms.samples.ionic.library.IonNote) == 'undefined') {
	forms.samples.ionic.library.IonNote = function() {};
	var wrapper = forms.samples.ionic.library.IonNote;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionNote = this.createIonNote();
        this.applyColor();
        this.component.parentNode.appendChild(this.ionNote);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonNote: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control; 
        if (updates.includes("value")) {
        	this.ionNote.querySelector("ion-note").innerHTML = this.component.control.value;
        }
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

    wrapper.prototype.applyColor= function() {
    	if (this.component.control.color) {
    		let color = "dark";
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
	    	this.ionNote.querySelector("ion-note").setAttribute("color", color);
    	}
    }

    wrapper.prototype.createIonNote = function() {
    	var ionNote = document.createElement("ion-item");
    	ionNote.innerHTML = "<ion-label>" + this.component.control.label
    		+ "</ion-label><ion-note slot=\"end\"></ion-note>";
    	return ionNote;
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
