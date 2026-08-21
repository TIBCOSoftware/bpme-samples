/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * ApplicationEmptyState Custom Element
 * Provides a visual placeholder and instructions when no specific 
 * form or case is selected in the main application view.
 */
class ApplicationEmptyState extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.shadowRoot.innerHTML = `
        <style>
          /* Set the host element to block to ensure it occupies space correctly */
          :host {
            display: block;
            height: 100%;
            width: 100%;
          }

          .empty-state-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start; /* Aligns content to top with margin */
            gap: 90px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }
          
          .main-title {
            color: #2E2E2E;
            font-size: 32px;
            font-weight: 400;
            line-height: 40px;
            /* Fallback to serif if LibreBaskerville isn't loaded globally */
            font-family: 'LibreBaskerville', serif;
            margin-bottom: 8px;
          }
          
          .sub-title {
            color: #2E2E2E;
            text-align: center;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
          }
          
          .title-container {
            margin-top: 4%;
            text-align: center;
          }           
        </style>
        
        <div class='empty-state-container'>
          <div class='title-container'>
            <div class='main-title'>Welcome back</div>
            <div class='sub-title'>Select service from the sidebar to get started</div>
          </div>
          
          <img src="./assets/images/empty_state.png" 
               alt="Welcome Illustration" 
               loading="lazy" />
        </div>
        `;
    }
}
  
customElements.define("application-empty-state", ApplicationEmptyState);