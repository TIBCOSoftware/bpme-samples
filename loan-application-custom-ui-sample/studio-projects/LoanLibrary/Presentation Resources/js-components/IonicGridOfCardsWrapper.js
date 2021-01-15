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
if (typeof(forms.samples.ionic.library.GridOfCards) == 'undefined') {
	forms.samples.ionic.library.GridOfCards = function() {};
	var wrapper = forms.samples.ionic.library.GridOfCards;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        // this.gridOfCards = this.createGridOfCards();
        // this.component.parentNode.appendChild(this.gridOfCards);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("GridOfCards: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control; 
        if (updates.includes("value")) {
        	this.populateGridOfCards();
        }
        if (updates.includes("value") || updates.includes("selectedCardName")) {
        	this.gridOfCards && this.gridOfCards.querySelectorAll("ion-card").forEach(card => {
        		if (card.hasAttribute("color"))
        			card.setAttribute("color", null);
        		if (this.component.control.selectedCardName == card.querySelector("ion-icon").getAttribute("cardname"))
        			card.setAttribute("color", "primary");
        	});
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

    wrapper.prototype.onSelectCard = function(event) {
    	this.component.raiseEvent("select", event.target.hasAttribute("cardname") ? event.target.getAttribute("cardname") : event.target.querySelector("ion-icon").getAttribute("cardname"));
    }

    wrapper.prototype.createGridOfCards = function() {
    	var gridOfCards = document.createElement("ion-grid");
    	return gridOfCards;
    }

    wrapper.prototype.populateGridOfCards = function() {
    	const getNumberOfCol= this.component.control.columns
    	this.gridOfCards = document.createElement("ion-grid");
    	 this.gridOfCards.classList.add("col-"+getNumberOfCol);
    	var markup = "";
    	var col = 0;
    	
    	this.component.control.value.forEach(val => {
    		const valObj = JSON.parse(val);
    		const rowStart = col == 0 ? "<ion-row>" : "";
    		const rowEnd = col == (this.component.control.columns - 1) ? "</ion-row>" : "";
    		const selMarkup = valObj.name == this.component.control.value ? "color=\"primary\"" : ""
    		markup += rowStart + "<ion-col><ion-card " + selMarkup + ">"
    			+ "<ion-icon cardname=\"" + valObj.name + "\" src=\"" + this.component.presentationURL + valObj.icon
    			+ "\"></ion-icon><span cardname=\"" + valObj.name + "\">"
    			+ valObj.title+" </span></ion-card></ion-col>" + rowEnd;
    		col = (col == (this.component.control.columns - 1)) ? 0 : col+1;
    	});
    	this.gridOfCards.innerHTML = markup;
    	this.gridOfCards.querySelectorAll("ion-card").forEach(card => card.addEventListener("click", this.onSelectCard.bind(this)));
    	this.component.parentNode.appendChild(this.gridOfCards);
    }
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
