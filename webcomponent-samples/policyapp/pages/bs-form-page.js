/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * ApplicationFormDetails Custom Element
 * Handles the rendering of a business service form and toggles 
 * to an empty state based on user actions or form data.
 */
class ApplicationFormDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
  
        this.shadowRoot.innerHTML = `
        <style>
          :host {
              display: block; /* Ensures the custom element has a layout context */
              height: 100%;
          }
          .form-container {
              display: flex;
              gap: 1%;
              height: calc(100% - 36px);
              width: 99%;
          }
          bpme-business-service-form {
              min-width: 50%;
              flex: 1;
          }
          application-empty-state {
              width: 100%;
          }            
        </style>
        <div class='form-container'></div>
        `;

        // Cache the container reference once
        this.container = this.shadowRoot.querySelector('.form-container');
    }
  
    connectedCallback() {
        this.renderForm();
    }

    renderForm() {
        // Retrieve attributes with default fallbacks
        const mName = this.getAttribute('moduleName') || '';
        const pName = this.getAttribute('processName') || '';
        const mVersion = this.getAttribute('moduleVersion') || '';

        // Dynamically create the business service form element
        const form = document.createElement('bpme-business-service-form');
        
        // Map properties
        form.moduleName = mName;
        form.processName = pName;
        form.moduleVersion = mVersion;
        
        // Clear container and append
        this.container.innerHTML = '';
        this.container.appendChild(form);

        // Logic to show empty state
        const showEmptyState = () => {
            this.container.innerHTML = `<application-empty-state></application-empty-state>`;
        };

        // Event Listeners
        form.addEventListener('bpme-business-service-form-form-cancel', showEmptyState);

        form.addEventListener('bpme-business-service-form-form-submit', (event) => {
            // Check if SearchLastName is empty in the submission data
            const lastName = event.detail?.form?.data?.SearchLastName;
            if (lastName === '') {
                showEmptyState();
            }
        });
    }
}
  
customElements.define("application-form-details", ApplicationFormDetails);