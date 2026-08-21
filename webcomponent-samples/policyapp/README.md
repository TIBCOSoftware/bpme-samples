# Policy App (Demo)

A framework-free (vanilla) demo application that showcases how to compose the
**BPME web components** (`bpme-components-lib`) and the **BPM Forms client**
(`formsclient`) into a complete, branded business application. It ships with a
sample **Policy Management** look and feel, but the branding is only an example —
the same shell works with any BPME project's business services, work items and
cases.

The app uses no build step and no framework. Each screen is a native
[Custom Element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
that assembles pre-built BPME components in its Shadow DOM.

It is not tied to a specific Studio project — it can surface any business
services, work items or cases available in the connected BPME environment.

## Getting started

The app is a set of static files. It expects the BPME shared assets and the
Forms client to be served from the same origin under `/apps/...`, because
`index.html` loads them by absolute path:

- `/apps/web-cdn/...` — BPME styles, fonts, icons and `bpme-components-lib/index.js`
- `/apps/bpm-forms/formsclient/formsclient.nocache.js` — BPM Forms client

Serve this folder behind a host (or reverse proxy) that also exposes those
`/apps/...` routes, then open `index.html`. On first load you are routed to the
main layout; navigate to `#/login` to see the login screen.

> This is a demo/reference app. It is not a standalone deployable — it relies on
> a running BPME environment to resolve the `/apps/...` resources and to serve
> real case/business-service data.

## Routing

Routing is hash-based and defined inline in [index.html](index.html):

| Hash        | Screen rendered                                     |
| ----------- | --------------------------------------------------- |
| `#/login`   | `<application-login>` — the sign-in screen          |
| _(any other)_ | `<application-layout>` — the main application shell |

`routesDefinition()` runs on load and on every `hashchange`, swapping the
contents of `#application-container`. The whole app is wrapped in
`<bpme-language-context>` and a `<bpme-http-interceptor>` for localization and
authenticated HTTP handling.

> **Note:** This is only a simple hash route, not a full-fledged routing
> implementation — it just swaps the top-level element based on the hash.

## Screens (custom elements)

Each file under [pages/](pages/) defines one custom element:

| Element                     | File                                                   | Purpose                                                                                             |
| --------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `<application-login>`        | [pages/login-page.js](pages/login-page.js)             | Branded login screen built on `bpme-login` and `bpme-navbar-header`.                                |
| `<application-layout>`       | [pages/layout-page.js](pages/layout-page.js)           | Primary shell: header (app switcher + user profile) and left nav switching between the three areas below. |
| `<application-withdrawal>`   | [pages/withdrawal-page.js](pages/withdrawal-page.js)   | "Business services" area — lists services via `bpme-business-services` and renders the selected one. |
| `<application-form-details>` | [pages/bs-form-page.js](pages/bs-form-page.js)         | Renders a selected business-service form with `bpme-business-service-form`; handles submit/cancel.  |
| `<application-empty-state>`  | [pages/empty-state-page.js](pages/empty-state-page.js) | Placeholder ("Welcome back") shown when no service/case is selected.                                |
| `<application-cases>`        | [pages/cases-page.js](pages/cases-page.js)             | Case-management flow: case types → case list (`bpme-cases`) → case details (`bpme-case-details`). Currently a reference wrapper; the layout uses `bpme-case-manager` directly. |

### Navigation areas (left nav in `application-layout`)

- **Business services** — renders `<application-withdrawal>` (the default view).
- **Cases** — renders `bpme-case-manager` and toggles between list and detail
  views based on the navigation hash.
- **Work items** — renders `bpme-work-items` inside `bpme-system-actions`.

The header also provides an **application switcher** (links to Work Manager and
Withdraw Application) and a **user profile** menu (languages, sign-out,
product version, copyright).

## Project structure

```
policyapp/
├── index.html              # Entry point: loads deps, defines hash routing
├── pages/                  # One custom element per screen
│   ├── login-page.js
│   ├── layout-page.js
│   ├── withdrawal-page.js
│   ├── bs-form-page.js
│   ├── empty-state-page.js
│   └── cases-page.js
├── assets/
│   ├── policy.theme.css    # App-specific theme overrides
│   ├── fonts/              # Libre Baskerville (branding font)
│   ├── images/             # Logo, login background, empty-state illustration
│   └── l10n/               # UI localization (en, de, es, fr, nl)
└── policyapp.zip           # Packaged copy of the app
```

## Theming & localization

- **Theme** — the root elements use the `policy-bpm-theme` class;
  [assets/policy.theme.css](assets/policy.theme.css) layers app-specific
  overrides on top of the shared `bpme-styles.css`. Per-screen styling is scoped
  inside each element's Shadow DOM. For a complete guide on creating and
  customizing themes, refer to the
  [Theming documentation](https://docs.tibco.com/pub/bpme/5.7.0/doc/apps/components-api/docs.html#/theming/theming.md).
- **Localization** — `<bpme-language-context>` wraps the app and drives the
  component library's strings; app-level translations live in
  [assets/l10n/](assets/l10n/) (`locale_en`, `locale_de`, `locale_es`,
  `locale_fr`, `locale_nl`).

  > **Note:** Localization currently demonstrates only the strings coming from
  > the BPME web components — not the app's own strings. Text hard-coded in the
  > custom elements (e.g. titles, labels, the empty-state copy) is not yet wired
  > through `<bpme-language-context>` and therefore does not switch language.

## Deployment

1. Create a zip of the app (the contents of this `policyapp/` folder).
2. In **appdev**, upload the zip.
3. Launch the app from App Dev.

## Dependencies

This app consumes, but does not bundle, the following (loaded from `/apps/...`):

- `bpme-components-lib` — the BPME web-component library (`bpme-*` elements).
  For detailed information on available components, their properties, events and
  usage examples, refer to the
  [Web Components API Reference](https://docs.tibco.com/pub/bpme/5.7.0/doc/apps/components-api/docs.html#/components/overview.md).
- `formsclient` — the BPM Forms runtime used to render business-service forms
- BPME shared styles, themes, fonts and icons
