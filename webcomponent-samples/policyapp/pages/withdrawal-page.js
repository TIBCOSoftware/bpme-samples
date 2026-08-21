/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * ApplicationWithdrawal Custom Element
 * Manages the specific business service workflow for "Withdrawals".
 */
class ApplicationWithdrawal extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                height: 100%;
                width: 100%;
            }

            .withdrawal-container {
                height: 100%;
                display: flex;
                flex-direction: row;
            }          

            bpme-business-services {
                border-right: solid 1px #e6e6e6;
                width: 30%;
                height: 100%;
            }

            .withdrawal-details-container {
                width: 70%; /* Matches the remaining width */
                flex: 1;
                overflow: hidden;
            }

            application-empty-state {
                display: block;
                height: 100%;
            }    
        </style>

        <div class='withdrawal-container'>
            <bpme-business-services></bpme-business-services>
            <div class='withdrawal-details-container'></div>
        </div>
        `;

        // Cache persistent elements
        this.detailElement = this.shadowRoot.querySelector('.withdrawal-details-container');
    }
  
    connectedCallback() {
        // Set initial view
        if (!this.processDetails) {
          this.detailElement.innerHTML = `<application-empty-state></application-empty-state>`;
        }

        const bizService = this.shadowRoot.querySelector('bpme-business-services');
        
        // Listen for the service selection
        bizService.addEventListener('bpme-business-services-start', (event) => {
            this.processDetails = event.detail;
            this.renderDetail();
        });
    }

    /**
     * Private helper to render the form details component
     */
    renderDetail() {
        // Clear container before injecting new component
        this.detailElement.innerHTML = '';

        const formDetails = document.createElement('application-form-details');
        
        // Using attributes to pass data to the detail component
        formDetails.setAttribute('moduleName', this.processDetails.moduleName);
        formDetails.setAttribute('processName', this.processDetails.processName);
        formDetails.setAttribute('processLabel', this.processDetails.processLabel);
        formDetails.setAttribute('moduleVersion', this.processDetails.moduleVersion);

        this.detailElement.appendChild(formDetails);
    }
  }
  
  customElements.define("application-withdrawal", ApplicationWithdrawal);