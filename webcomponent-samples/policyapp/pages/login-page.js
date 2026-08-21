/**
 * Copyright © 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary.
 */
/**
 * ApplicationLogin Custom Element
 * Manages the login screen layout, including a branded header and 
 * the authentication form with a custom background.
 */
class ApplicationLogin extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
  
      this.shadowRoot.innerHTML = `
        <style>
          /* Ensure the component itself has a block-level layout */
          :host {
            display: block;
            width: 100%;
          }

          .application-login {
            height: calc(100vh - 40px);
            background-color: var(--tib-semantic-color-surface-neutral-default);
          }

          /* Styling internal parts of bpme-navbar-header */
          bpme-navbar-header::part(application-title) {
            font-size: var(--tib-base-font-size-md, 1rem);
          }

          /* Styling internal parts of the bpme-login component */
          bpme-login::part(login-header) {
            color: #FFF;
          }
          
          bpme-login::part(sign-text) {
            text-transform: uppercase;
          }

          /* Labels for username/password fields */
          .username-label, .password-label {
            color: #1E1E1E;
            font-family: var(--tib-base-font-family-body, "Avenir Next", sans-serif);
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
          }          
        </style>

        <bpme-navbar-header 
            logoURL='./assets/images/companylogo.svg' 
            applicationTitle='Investment & Wealth Management'>
            <div slot="header-tools"></div>
        </bpme-navbar-header>

        <main class='application-login'>
          <bpme-login 
            redirectSuccessUrl='withdraw' 
            backgroundImageURL='./assets/images/login_background.png' 
            signInTitle='Policy Withdrawal or Surrender'>
            
            <div slot='username' class='username-label'>Username</div>
            <div slot='password' class='password-label'>Password</div>
          </bpme-login>
        </main>
        `;
    }
}
  
customElements.define("application-login", ApplicationLogin);