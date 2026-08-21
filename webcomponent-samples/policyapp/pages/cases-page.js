/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * Used the wrapper element so its unsed as of now
 * ApplicationCases Custom Element
 * Orchestrates the "Case Management" lifecycle: 
 * 1. Selecting a Case Type -> 2. Viewing a List of Cases -> 3. Viewing Case Details
 */
class ApplicationCases extends HTMLElement {

    /**
     * Configuration for the bpme-cases component (the list view).
     * Defines which UI elements (search, filter, etc.) are visible.
     */
    caseConfig = {
      "property": [
        { "name": "show-cases-search", "type": "boolean", "value": true, "defaultValue": true },
        { "name": "show-cases-filter", "type": "boolean", "value": true, "defaultValue": true },
        { "name": "show-cases-columns-selector", "type": "boolean", "value": true, "defaultValue": true },
        { "name": "show-cases-refresh", "type": "boolean", "value": true, "defaultValue": true }
      ]
    }

    /**
     * Configuration for the bpme-case-details component.
     * Toggles various sub-widgets like Audit, Documents, and Linked Cases.
     */
    detailsConfigProp = [
      { "name": "show-adhoc-tasks", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-details-refresh", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-state-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-actions-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-data-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-work-items-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-linked-cases-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-document-component", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-case-audit-component", "type": "boolean", "value": true, "defaultValue": true }
    ]

    // Sub-configurations for Document management within a Case
    caseDocumentsProperties = [
      { "name": "show-case-documents-delete", "type": "boolean", "value": true },
      { "name": "show-case-documents-download", "type": "boolean", "value": true }
    ];

    caseDocumentsViewerProperties = [
      { "name": "show-case-documents-description-container", "type": "boolean", "value": true }
    ]

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.shadowRoot.innerHTML = `
        <style>  
          .cases-container {
            height: 100%;
            display: flex;
            flex: 1;
            width: 100%;
          }
          .types-container { height: 100%; }
          bpme-case-types { padding-top: 16px; padding-bottom: 16px; }
          .pane-container { width: 100%; }                                
        </style>
        
        <div class='cases-container'>
          <div class='types-container'>
            <twc-sidebar label="Applications" class="sidebar" style="--size: 24rem;" open >
              <bpme-case-types></bpme-case-types>
            </twc-sidebar>
          </div>
          <div class="pane-container">
            <twc-content-pane label="Content Pane" class="pane">
              <div class="pane-content" slot="content"></div>
            </twc-content-pane>
          </div>
        </div>`
    }
  
    /**
     * Set up listeners for the Sidebar (Case Types).
     */
    connectedCallback() {
      let selectedType;
      const caseTypes = this.shadowRoot.querySelector('bpme-case-types');

      // Handle the initial fetch of types (auto-select the first one)
      caseTypes.addEventListener('bpm-case-types-fetched', (event) => {
        selectedType = event.detail[0];
        this.handleSelectedType(selectedType);
      });

      // Handle manual user clicks on a case type
      caseTypes.addEventListener('bpm-case-type-selected', (event) => {
        this.handleSelectedType(event.detail);
      });
    }
    
    /**
     * Renders the List of Cases based on a selected Case Type.
     */
    handleSelectedType(selectedType) {
      const casesContainer = this.shadowRoot.querySelector('.pane-content');
      
      // Setup the OData-style filter for the list component
      let tempfilter = {};
      tempfilter.caseType = selectedType.namespace + '.' + selectedType.name;
      tempfilter.applicationMajorVersion = selectedType.applicationMajorVersion;
      tempfilter.isInTerminalState = 'FALSE'; // Only show active cases

      let casesConfig = {};
      casesConfig.filter = tempfilter;
      casesConfig.top = 100; // Limit results

      // Create and inject the bpme-cases list component
      const cases = document.createElement('bpme-cases');
      cases.type = selectedType;
      cases.configProperties = this.caseConfig.property;
      cases.config = casesConfig;

      // Clear previous view and append list
      casesContainer.innerHTML = ``;
      casesContainer.appendChild(cases);

      /**
       * Listener: When a specific Case is clicked in the list,
       * switch to the Case Details view.
       */
      cases.addEventListener('bpm-case-selected', (event) => {
        const selectedCase = event.detail;
        const caseDetail = document.createElement('bpme-case-details');

        // Configuration identifying which specific case to load
        const detailConfig = {
          "caseType": selectedType.namespace + '.' + selectedType.name,
          "caseRef": selectedCase.caseReference
        }

        // Aggregate all property sets for the detail view
        let detailsConfigProp = {
          "caseDetailsProperties" : this.detailsConfigProp,
          "caseDocumentsProperties" : this.caseDocumentsProperties,
          "caseDocumentsViewerProperties" : this.caseDocumentsViewerProperties
        }

        caseDetail.detailConfig = detailConfig;
        caseDetail.detailsConfigProp = detailsConfigProp;

        // Clear list and show details
        casesContainer.innerHTML = ``;
        casesContainer.appendChild(caseDetail);
      });
    }
  }
  
  customElements.define("application-cases", ApplicationCases);