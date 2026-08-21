/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * ApplicationLayout Custom Element
 * The primary shell of the application.
 */
class ApplicationLayout extends HTMLElement {  
  
  profileConfig = {
    "name": "userProfile",
    "label": { "default": "User profile", "localeKey": "bpme.userProfile.#userProfileLabel" },
    "type": "COMPONENT",
    "property": [
      { "name": "show-themes", "type": "boolean", "value": false, "defaultValue": false },
      { "name": "show-languages", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-sign-out", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-product-version", "type": "boolean", "value": true, "defaultValue": true },
      { "name": "show-copy-right", "type": "boolean", "value": true, "defaultValue": true }
    ]
  };

  appSwitcherConfig = {
    "applications": [
        {
            "groupTitle": { "default": "BPME applications" },
            "menuItems": [
                {
                    "label": { "default": "Work manager" },
                    "icons": { "library": "twc-cdn", "default": "work-manager-default" },
                    "url": "/apps/bpmeapp/#/work-manager"
                },
                {
                    "label": { "default": "Withdraw application" },
                    "icons": { "library": "twc-cdn", "default": "case-manager-default" }
                }
            ]
        }
    ]
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .layout {
          height: calc(100vh - 119px);
          background-color: var(--tib-semantic-color-surface-neutral-default);
          display: flex;
          flex-direction: row;
        }
        bpme-breather::part(base) {
          border: none;
          background-color: #ededed;
          border-radius: 0;
        }
        .service-details-container { width: 100%; }
        .left-nav-bar {
          height: 100%;
          border-right: solid 1px #e6e6e6;
        }
        twc-navmenu { height: 100%; }
        .menu-icon { width: 1.5rem; height: 1.5rem; }
        /* Styling internal parts of bpme-navbar-header */
        bpme-navbar-header::part(application-title) {
          font-size: var(--tib-base-font-size-md, 1rem);
        }
      </style>

      <bpme-navbar-header logoURL='./assets/images/companylogo.svg' applicationTitle='Policy Management'>
      </bpme-navbar-header>
      
      <bpme-breather></bpme-breather>

      <div class='layout'>
        <aside class='left-nav-bar'>
          <twc-navmenu id="LEFT_NAV" position="left" displayLabel="false" labelPosition="bottom">
            <twc-navmenu-item class='business-menu' selected tooltipContent="Policy services">
                <twc-icon class='menu-icon' slot="icon" name="business_services" library="twc-cdn"></twc-icon>
            </twc-navmenu-item>
            <twc-navmenu-item class='cases-menu' label="Cases" tooltipContent="Cases">
                <twc-icon class='menu-icon' slot="icon" name="case_manager" library="twc-cdn"></twc-icon>
            </twc-navmenu-item>
            <twc-navmenu-item class='tasks-menu' tooltipContent="Work Items">
                <twc-icon class='menu-icon' slot="icon" name="work_list" library="twc-cdn"></twc-icon>
            </twc-navmenu-item>
          </twc-navmenu>
        </aside>

        <main class='service-details-container'></main>
      </div>
    `;
  }

  connectedCallback() {
    this.initHeader();
    this.initNavigation();
  }

  initHeader() {
    const header = this.shadowRoot.querySelector('bpme-navbar-header');
    const headerToolsSlot = document.createElement('div');
    headerToolsSlot.slot = 'header-tools';

    const headerToolsComponent = document.createElement('bpme-navbar-header-tools');
    
    // Application Switcher Setup
    headerToolsComponent.showApplicationSwitcher = true;
    const appSwitcherSlot = document.createElement('div');
    appSwitcherSlot.slot = 'application-switcher';
    const appSwitcherComponent = document.createElement('bpme-application-switcher');
    appSwitcherComponent.applications = this.appSwitcherConfig.applications;
    appSwitcherSlot.appendChild(appSwitcherComponent);
    headerToolsComponent.appendChild(appSwitcherSlot);
    
    // User Profile Setup
    headerToolsComponent.showProfile = true;
    const profileSlot = document.createElement('div');
    profileSlot.slot = 'profile-details';
    const profileComponent = document.createElement('bpme-user-profile');
    profileComponent.configData = this.profileConfig;
    profileSlot.appendChild(profileComponent);
    headerToolsComponent.appendChild(profileSlot);

    headerToolsSlot.appendChild(headerToolsComponent);
    header.appendChild(headerToolsSlot);
    const detailElement = this.shadowRoot.querySelector('.service-details-container');
    if (detailElement) {
        detailElement.innerHTML = `<application-withdrawal></application-withdrawal>`;
    }
  }

  initNavigation() {
    const detailElement = this.shadowRoot.querySelector('.service-details-container');

    // Business Services
    this.shadowRoot.querySelector('.business-menu').addEventListener('twc-navmenu-item-clicked', () => {
      detailElement.innerHTML = '<application-withdrawal></application-withdrawal>';
    });

    // Case Management
    this.shadowRoot.querySelector('.cases-menu').addEventListener('twc-navmenu-item-clicked', () => {
      detailElement.innerHTML = '';
      const casesComponent = document.createElement('bpme-case-manager');
      
      casesComponent.addEventListener('caseSelectionHandler', (event) => {
        // Automatically toggle view based on navigation path
        const isListRoot = event.detail.hash[0].endsWith('nav-menu/bpmCaseManager');
        casesComponent.showCaseDetailsHandler(!isListRoot);
      });

      detailElement.appendChild(casesComponent);
    });

    // Work Items / Tasks
    this.shadowRoot.querySelector('.tasks-menu').addEventListener('twc-navmenu-item-clicked', () => {
      detailElement.innerHTML = '';
      const sysActions = document.createElement('bpme-system-actions');
      sysActions.appendChild(document.createElement('bpme-work-items'));
      detailElement.appendChild(sysActions);
    });
  }
}

customElements.define("application-layout", ApplicationLayout);