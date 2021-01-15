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
if (typeof(forms.samples.ionic.library.GridOfAdvancedCards) == 'undefined') {
	forms.samples.ionic.library.GridOfAdvancedCards = function() {};
	var wrapper = forms.samples.ionic.library.GridOfAdvancedCards;

	wrapper.prototype.initialize = function(component, renderMode) {
        this.component = component;
        this.logger = this.component.logger;
        // this.gridOfAdvancedCards = this.createGridOfAdvancedCards();
        // this.component.parentNode.appendChild(this.gridOfAdvancedCards);
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
        if (this.logger.isDebugEnabled()) this.logger.debug("GridOfAdvancedCards: refresh: " + updates);
        if (updates == null || updates.length == 0) return;
        var theWrapper = this;
        var control = this.component.control; 
        if (updates.includes("value")) {
        	this.populateGridOfAdvancedCards();
        }
        if (updates.includes("value") || updates.includes("selectionIndex")) {
        	this.expandSelectedCard();
        }
        /*if (updates.includes("value") || updates.includes("selectedCardName")) {
        	this.gridOfAdvancedCards && this.gridOfAdvancedCards.querySelectorAll("ion-card").forEach(card => {
        		if (card.hasAttribute("color"))
        			card.setAttribute("color", null);
        		if (this.component.control.selectedCardName == card.querySelector("ion-icon").getAttribute("cardname"))
        			card.setAttribute("color", "primary");
        	});
        }*/
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
    	let cardIdx = event.target.getAttribute("cardidx");
    	let el = event.target;
    	let found = false;
    	while (el.parentElement) {
    		if (el.hasAttribute("cardidx")) {
    			cardIdx = el.getAttribute("cardidx");
    			found = true;
    			break;
    		}
    		el = el.parentElement;
    	}
    	if (found) {
	    	//Temporary work around 
    		//this.component.control.selectionIndex = Number(cardIdx);
    		this.component.form.getControl(this.component.control.name).selectionIndex = Number(cardIdx);
	    	this.component.raiseEvent("select", Number(cardIdx));
    	} else
    		logger.error("ERR_GRIDOFADVANCEDCARDS_ONSELECTCARD: Could not find out card index");
    }

    wrapper.prototype.createGridOfAdvancedCards = function() {
    	var gridOfAdvancedCards = document.createElement("ion-grid");
    	return gridOfAdvancedCards;
    }

    wrapper.prototype.populateGridOfAdvancedCards = function() {
    	this.gridOfAdvancedCards = document.createElement("ion-grid");
    	var markup = "";
    	var col = 0;
    	this.component.control.value.forEach((val, cardIdx) => {
    		const valObj = JSON.parse(val);
    		markup += "<ion-card cardidx=\"" + cardIdx + "\">";
    		markup += "	<ion-grid>";
    		markup += "		<ion-row>";
    		if (valObj.main.icon) {
    		markup += "			<ion-col class=\"card-icon-container\" size=\"4\">";
    		markup += "				<ion-icon class=\"card-icon card-icon-" + valObj.main.rightClass + "\" src=\"" + this.component.presentationURL + valObj.main.icon + "\"></ion-icon>";
    		markup += "			</ion-col>";
    		}
    		markup += "			<ion-col size=\"4\">";
    		for (let attr in valObj.main.middle) {
    			markup += "				<ion-text class=\"card-table-title\">" + valObj.main.middle[attr] + "</ion-text>";
    		}
    		markup += "			</ion-col>";
    		if (valObj.main.right) {
    		markup += "			<ion-col size=\"4\">";
    		markup += "				<ion-text class=\"card-table-title statusLabel " + valObj.main.rightClass+ "\">" + valObj.main.right + "</ion-text>";
    		markup += "			</ion-col>";
    		}
    		markup += "		</ion-row>";
    		markup += "		<div class=\"line-seperator\"></div>";
    		markup += "		<ion-row class=\"row-detail\">";
    		for (let idx in valObj.detail) {
    			const detailAttr = valObj.detail[idx];
    			markup += "			<ion-col size=\"4\">";
    			markup += "				<ion-text class=\"card-table-title\">" + detailAttr.label + "</ion-text>";
    			markup += "				<ion-text class=\"card-table-title\">" + detailAttr.value + "</ion-text>";
    			markup += "			</ion-col>";
    		}
    		markup += "		</ion-row>";
    		markup += "	</ion-grid>";
    		markup += "</ion-card>";
    		cardIdx++;
    	});
    	this.gridOfAdvancedCards.innerHTML = markup;
    	if (this.component.control.selectable)
    		this.gridOfAdvancedCards.querySelectorAll("ion-card").forEach(card => card.addEventListener("click", this.onSelectCard.bind(this)));
    	this.component.parentNode.appendChild(this.gridOfAdvancedCards);
    }
    
    wrapper.prototype.expandSelectedCard = function() {
    	if (this.component.control.selectable) {
	    	this.gridOfAdvancedCards.querySelectorAll("ion-card").forEach(card => {
	    		if (this.component.control.selectionIndex == Number(card.getAttribute("cardidx")))
	    			card.className = card.className + " card-selected";
	    		else
	    			card.className = card.className.replace(/card-selected/g, "");
	    		card.querySelectorAll(".line-seperator").forEach(ls => {
	    			ls.className = ls.className.replace(/invisible/g, "");
	    			if (this.component.control.selectionIndex != Number(card.getAttribute("cardidx")))
	    				ls.className = ls.className + " invisible";
	    		});
	    		card.querySelectorAll(".row-detail").forEach(rd => {
	    			rd.className = rd.className.replace(/invisible/g, "");
	    			if (this.component.control.selectionIndex != Number(card.getAttribute("cardidx")))
	    				rd.className = rd.className + " invisible";
	    		});
	    	});
    	}
    }
//    var scrTagForInoic = document.createElement('script');
//    scrTagForInoic.setAttribute('type','module');
//    scrTagForInoic.setAttribute('src','https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js');
//    document.head.appendChild(scrTagForInoic);
}
