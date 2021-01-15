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
if (typeof(forms.samples.ionic.library.FormHeader) == 'undefined') {
	forms.samples.ionic.library.FormHeader = function() {};
	var wrapper = forms.samples.ionic.library.FormHeader;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.logger.info("Using Ionic Custom Controls Library v1.0.0.20200820_2205");
        this.formHeader = this.createFormHeader();
        this.component.parentNode.appendChild(this.formHeader);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("FormHeader: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control; 
        if (updates.includes("title")) {
        	this.formHeader.querySelector("ion-card-title").innerHTML = this.component.control.title;
        }
        if (updates.includes("subtitle")) {
        	this.formHeader.querySelector("ion-card-subtitle").innerHTML = this.component.control.subtitle;
        }
        if (updates.includes("content")) {
        	this.formHeader.querySelector("ion-card-content").innerHTML = this.component.control.content;
        }
        if (updates.includes("icon")) {
        	if (this.formHeader.querySelector("ion-icon"))
        		this.formHeader.querySelector("ion-icon").setAttribute("src", this.component.presentationURL + this.component.control.icon);
        	if (this.formHeader.querySelector("img"))
        		this.formHeader.querySelector("img").setAttribute("src", this.component.presentationURL + this.component.control.icon);
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

    wrapper.prototype.createFormHeader = function() {
    	var formHeader = document.createElement("ion-card");
    	var markup = "  <ion-card-header>";
    	if (this.component.control.icon && this.component.control.showIconOnTop)
    		if (this.component.control.icon.toLowerCase().endsWith(".svg"))
    			markup += "   <ion-icon src=\"" + this.component.presentationURL + this.component.control.icon + "\"></ion-icon>";
    		else
    			markup += "   <img src=\"" + this.component.presentationURL + this.component.control.icon + "\">";
    	if (this.component.control.title)
    		markup += "    <ion-card-title>" + this.component.control.title + "</ion-card-title>";
    	else
    		markup += "    <ion-card-title></ion-card-title>";
    	if (this.component.control.subtitle)
    		markup += "   <ion-card-subtitle>" + this.component.control.subtitle + "</ion-card-subtitle>";
    	else
    		markup += "   <ion-card-subtitle></ion-card-subtitle>";
    	markup += "  </ion-card-header>";
    	if (this.component.control.icon && !this.component.control.showIconOnTop)
    		if (this.component.control.icon.toLowerCase().endsWith(".svg"))
    			markup += "   <ion-icon src=\"" + this.component.presentationURL + this.component.control.icon + "\"></ion-icon>";
    		else
    			markup += "   <img src=\"" + this.component.presentationURL + this.component.control.icon + "\">";
    	markup += "  <ion-card-content>";
    	if (this.component.control.content)
    		markup += this.component.control.content;
    	markup += "  </ion-card-content>";
    	formHeader.innerHTML = markup;
    	return formHeader;
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
