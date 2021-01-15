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
if (typeof(forms.samples.ionic.library.IonicSearchbar) == 'undefined') {
	forms.samples.ionic.library.IonicSearchbar = function() {};
	var wrapper = forms.samples.ionic.library.IonicSearchbar;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        this.ionicSearchbar = this.createIonicSearchbar();
        this.component.parentNode.appendChild(this.ionicSearchbar);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("IonicSearchbar: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control;
        if (updates.includes("searchbarItemLabels")) {
        	this.populateSearchbar();
        }
        if (updates.includes("value") || (updates.includes("searchbarItemLabels"))) {
        	if ((this.selectedValue != control.value) || (control.value && updates.includes("searchbarItemLabels"))) {
        		this.ionicSearchbar.querySelectorAll("ion-item").forEach(item => {
        			if (item.hasAttribute("color"))
        				item.setAttribute("color", null);
        			if (control.value == item.getAttribute("item-name"))
        				item.setAttribute("color", "light");
        		});
        		this.selectedValue = control.value;
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

    wrapper.prototype.onItemClick = function(event) {
    	if (event.target.getAttribute("item-name") != this.component.control.value) {
    		/*this.ionicSearchbar.querySelectorAll("ion-item").forEach(item => {
    			if (item.innerHTML == event.detail.value)
    				this.component.raiseEvent("update", item.getAttribute("item-name"));
    		});*/
    		this.component.raiseEvent("update", event.target.getAttribute("item-name"));
    	}
    }

    wrapper.prototype.ionInput = function(event) {
    	const items = Array.from(this.ionicSearchbar.querySelector('ion-list').children);
    	const query = event.target.value.toLowerCase();
    	requestAnimationFrame(() => {
	        items.forEach(item => {
	          const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
	          item.style.display = shouldShow ? 'block' : 'none';
	        });
    	});
    }

    wrapper.prototype.createIonicSearchbar = function() {
    	var ionicSearchbar = document.createElement("div");
    	return ionicSearchbar;
    }
    
    wrapper.prototype.populateSearchbar = function() {
    	var markup = "<ion-header translucent><ion-searchbar placeholder=\""
    		+ this.component.control.label
    		+ "\"></ion-searchbar></ion-header>";
    	markup += "<ion-content fullscreen class=\"search-items\"> <ion-list>";
    	const searchbarItemLabels = this.component.control.searchbarItemLabels;
    	const searchbarItemValues = this.component.control.searchbarItemValues;
    	searchbarItemLabels.forEach((item, idx) =>{
    		markup += "<ion-item item-name=\"" + searchbarItemValues[idx] + "\">" + item + "</ion-item>";
    	});
    	markup += " </ion-list></ion-content>";
    	this.ionicSearchbar.innerHTML = markup;
    	this.ionicSearchbar.querySelectorAll("ion-item").forEach(item => {
    		item.addEventListener("click", this.onItemClick.bind(this));
    	});
    	this.ionicSearchbar.querySelector("ion-searchbar").addEventListener("ionInput", this.ionInput.bind(this));
    }
    
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
