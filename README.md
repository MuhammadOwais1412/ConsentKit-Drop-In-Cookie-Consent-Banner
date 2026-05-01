# ConsentKit

**Drop-in cookie consent that installs in 30 seconds.**

ConsentKit is a professional GDPR and CCPA-compliant cookie consent system built for developers who want results without complexity. Add one script tag and your site has a fully working banner, a polished preference modal, and a built-in system for gating analytics scripts — all with zero dependencies and zero configuration files.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.txt)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](CHANGELOG.md)
[![Size](https://img.shields.io/badge/size-8KB%20gzipped-orange.svg)](#performance)

---

## ✨ Features

- **🚀 Zero Configuration** - Works out of the box with sensible defaults
- **🎨 Three Built-in Themes** - Dark, Light, and Colorful
- **♿ WCAG 2.1 AA Compliant** - Full keyboard navigation and screen reader support
- **📱 Fully Responsive** - Beautiful on mobile, tablet, and desktop
- **⚡ Lightweight** - Only 8KB gzipped, zero dependencies
- **🔒 Privacy-First** - Self-hosted, no data sent to third parties
- **🌐 localStorage Persistence** - Remembers user choice for 365 days (configurable)
- **🎯 Script Gating API** - Easy integration with Google Analytics, Facebook Pixel, etc.
- **⌨️ TypeScript Support** - Full type definitions included
- **🎭 White-Label Ready** - No branding, completely customizable

---

## 📦 What's Included

```
consentkit/
├── dist/
│   ├── consentkit.js          # Unminified source (29KB)
│   ├── consentkit.min.js      # Minified production build (29KB, 8KB gzipped)
│   └── consentkit.d.ts        # TypeScript definitions
├── docs/
│   ├── getting-started.md     # Quick start guide
│   ├── api-reference.md       # Complete API documentation
│   ├── customization.md       # Theming and styling guide
│   └── faq.md                 # Common questions
├── themes/
│   ├── kit-dark.html          # Dark theme standalone
│   ├── kit-light.html         # Light theme standalone
│   └── kit-colorful.html      # Colorful theme standalone
├── demo.html                  # Live interactive demo
├── README.md                  # This file
├── LICENSE.txt                # MIT License
├── CHANGELOG.md               # Version history
└── package.json               # npm metadata
```

---

## 🚀 Quick Start

### Step 1: Add the Script

Copy `dist/consentkit.min.js` into your project and add one script tag before your closing `</body>` tag:

```html
<script src="path/to/dist/consentkit.min.js" data-theme="dark"></script>
```

That's it! ConsentKit automatically injects its CSS and HTML, and shows the banner on first visit.

### Step 2: Gate Your Analytics Scripts

Wrap your tracking scripts inside `CookieConsent.on()` callbacks so they only run after consent is granted:

```html
<script src="path/to/dist/consentkit.min.js" data-theme="dark"></script>

<script>
  CookieConsent.on('analytics', function() {
    // Google Analytics - only runs after analytics consent
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  });

  CookieConsent.on('marketing', function() {
    // Facebook Pixel - only runs after marketing consent
    fbq('init', 'YOUR_PIXEL_ID');
    fbq('track', 'PageView');
  });
</script>
```

### Step 3: Test It

Open your page in a browser. You should see:
- ✅ Cookie banner at the bottom of the page
- ✅ Three action buttons: Reject All, Preferences, Accept All
- ✅ A floating "Cookie Settings" button (appears after making a choice)

---

## ⚙️ Configuration

All settings are configured via `data-` attributes on the script tag. No JavaScript configuration required.

```html
<script
  src="path/to/dist/consentkit.min.js"
  data-theme="dark"
  data-position="bottom"
  data-privacy-url="/privacy-policy"
  data-expire-days="365"
  data-auto-show="true">
</script>
```

### Available Attributes

| Attribute | Options | Default | Description |
|-----------|---------|---------|-------------|
| `data-theme` | `dark` · `light` · `colorful` | `dark` | Visual theme |
| `data-position` | `bottom` · `top` | `bottom` | Banner position |
| `data-privacy-url` | Any URL | `/privacy-policy` | Privacy Policy link |
| `data-expire-days` | Number | `365` | Days until consent expires |
| `data-auto-show` | `true` · `false` | `true` | Show banner if no consent stored |

### Theme Examples

```html
<!-- Dark theme (default) - Indigo accent on near-black background -->
<script src="dist/consentkit.min.js" data-theme="dark"></script>

<!-- Light theme - Teal accent on white background -->
<script src="dist/consentkit.min.js" data-theme="light"></script>

<!-- Colorful theme - Purple-to-pink gradient on deep purple -->
<script src="dist/consentkit.min.js" data-theme="colorful"></script>
```

---

## 🎯 JavaScript API

ConsentKit exposes a global `CookieConsent` object with the following methods:

### Core Methods

```javascript
// Show/hide the banner
CookieConsent.show()
CookieConsent.hide()

// Accept or reject all cookies
CookieConsent.acceptAll()
CookieConsent.rejectAll()

// Open/close the Preference Centre
CookieConsent.showPreferences()
CookieConsent.hidePreferences()

// Save current toggle state
CookieConsent.savePreferences()

// Get current consent state
CookieConsent.getConsent()
// Returns: { necessary: true, functional: false, analytics: true, marketing: false }
// Or null if no consent recorded yet

// Check specific category
CookieConsent.hasConsent('analytics')  // Returns: true or false

// Clear all consent and re-show banner
CookieConsent.reset()
```

### Script Gating (Most Important)

Use `CookieConsent.on()` to gate scripts on consent. Callbacks fire immediately if consent was already granted, or later when the user grants consent.

```javascript
CookieConsent.on('analytics', function(consent) {
  // This fires only after analytics consent is granted
  console.log('Analytics enabled!');
  initGoogleAnalytics();
});

// Chainable
CookieConsent
  .on('analytics', initGA)
  .on('marketing', initPixel)
  .on('functional', initChat);
```

---

## 📊 Consent Categories

ConsentKit provides four consent categories:

| Category | Default | Can Disable? | Purpose |
|----------|---------|--------------|---------|
| **Strictly Necessary** | ✅ Always On | ❌ No | Essential for site function (sessions, security) |
| **Functional** | ❌ Off | ✅ Yes | Personalization (language, theme, preferences) |
| **Analytics** | ❌ Off | ✅ Yes | Usage tracking (Google Analytics, Hotjar) |
| **Marketing** | ❌ Off | ✅ Yes | Advertising (Facebook Pixel, Google Ads) |

**GDPR Compliance:** All optional categories start as OFF, requiring active opt-in consent.

---

## 🔌 Common Integrations

### Google Analytics 4

```javascript
CookieConsent.on('analytics', function() {
  // Load gtag.js
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
  document.head.appendChild(script);

  // Initialize
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
});
```

### Facebook Pixel

```javascript
CookieConsent.on('marketing', function() {
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
});
```

### Google Tag Manager

```javascript
CookieConsent.on('analytics', function() {
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');
});
```

### Hotjar

```javascript
CookieConsent.on('analytics', function() {
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
});
```

---

## 🎨 Customization

### Change Colors

Override CSS custom properties to match your brand:

```html
<style>
  .cc-theme-dark {
    --cc-accent:      #e11d48;   /* Your brand color */
    --cc-accept-bg:   #e11d48;   /* Accept button */
    --cc-accept-hov:  #be123c;   /* Accept button hover */
    --cc-toggle-on:   #e11d48;   /* Toggle switch */
    --cc-locked-fg:   #fb7185;   /* "Always On" badge */
  }
</style>
```

### Change Text

Use the standalone theme files in `/themes/` for full control over HTML and text, or modify the DOM after ConsentKit loads:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    var title = document.querySelector('.cc-banner-title');
    if (title) title.textContent = 'Cookie Notice';
  }, 100);
});
```

See [docs/customization.md](docs/customization.md) for complete customization guide.

---

## 🌐 Platform Integration

### WordPress

Add the script tag to your theme's `footer.php` or use a plugin like "Insert Headers and Footers".

### Shopify

Add the script tag to your theme's `theme.liquid` file, just before `</body>`.

### Webflow

Add the script tag in Project Settings → Custom Code → Footer Code.

### React / Vue / Angular

ConsentKit works with all JavaScript frameworks. Load it via script tag in your `index.html` and access the global `CookieConsent` object.

```jsx
// React example
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (window.CookieConsent) {
      window.CookieConsent.on('analytics', () => {
        // Initialize analytics
      });
    }
  }, []);

  return <div>Your app</div>;
}
```

---

## 📱 Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Opera | 76+ |

**Not supported:** Internet Explorer

---

## ♿ Accessibility

ConsentKit is built to WCAG 2.1 AA standards:

- ✅ **ARIA attributes** - Proper `role`, `aria-label`, `aria-modal`, `aria-checked`
- ✅ **Keyboard navigation** - Full support with Tab, Shift+Tab, Enter, Escape
- ✅ **Focus trapping** - Modal traps focus within itself
- ✅ **Focus indicators** - Visible outlines on all interactive elements
- ✅ **Screen reader support** - Semantic HTML and descriptive labels
- ✅ **Reduced motion** - Respects `prefers-reduced-motion` media query

---

## 🔒 Privacy & Compliance

### GDPR Compliance

ConsentKit provides the technical foundation for GDPR compliance:
- ✅ Consent is opt-in (not pre-checked)
- ✅ Users can withdraw consent at any time
- ✅ Consent choices are stored and respected
- ✅ Clear categories and descriptions
- ✅ Link to Privacy Policy

**Note:** GDPR compliance also depends on your Privacy Policy and data practices. ConsentKit is a tool, not legal advice. Consult a privacy lawyer for complete compliance.

### CCPA Compliance

ConsentKit's "Reject All" button satisfies CCPA's "Do Not Sell My Personal Information" requirement.

### Data Storage

ConsentKit stores consent data in `localStorage` under the key `consentkit_v1`:

```json
{
  "version": "1.1.0",
  "timestamp": "2026-05-01T12:00:00.000Z",
  "expires": "2027-05-01T12:00:00.000Z",
  "consent": {
    "necessary": true,
    "functional": false,
    "analytics": true,
    "marketing": false
  }
}
```

**No data is sent to external servers.** Everything stays on the user's device.

---

## 📦 Installation Methods

### Method 1: Direct Download (Recommended)

1. Copy `dist/consentkit.min.js` to your project
2. Add the script tag to your HTML
3. Done!

### Method 2: CDN (Self-Host)

Upload to your own CDN and reference it:

```html
<script src="https://cdn.yoursite.com/consentkit.min.js" data-theme="dark"></script>
```

---

## 🎬 Live Demo

Open `demo.html` in your browser to see ConsentKit in action with:
- Live theme switching
- Interactive controls
- Code examples
- Full API demonstration

---

## 📚 Documentation

- **[Getting Started](docs/getting-started.md)** - Installation and basic usage
- **[API Reference](docs/api-reference.md)** - Complete API documentation
- **[Customization Guide](docs/customization.md)** - Theming and styling
- **[FAQ](docs/faq.md)** - Common questions and troubleshooting

---

## 🔧 TypeScript Support

ConsentKit includes full TypeScript definitions:

```typescript
import type { ConsentState, ConsentCategory, ConsentKitConfig } from 'consentkit';

const config: ConsentKitConfig = {
  theme: 'dark',
  position: 'bottom',
  expireDays: 365
};

CookieConsent.init(config);

CookieConsent.on('analytics', (consent: ConsentState) => {
  console.log(consent.analytics); // TypeScript knows this is a boolean
});
```

---

## ⚡ Performance

- **File size:** 29KB unminified, 8KB gzipped
- **Dependencies:** Zero
- **Load time impact:** Minimal (~50ms on average)
- **Runtime overhead:** Negligible

ConsentKit is optimized for performance and won't slow down your website.

---

## 🛠️ Development

### Building from Source

The unminified source is available in `dist/consentkit.js`. Modify it as needed for your project.

### Contributing

ConsentKit is a commercial product. Bug reports and feature requests are welcome via Codester's messaging system.

---

## 📄 License

ConsentKit is licensed under the MIT License. See [LICENSE.txt](LICENSE.txt) for details.

**What this means:**
- ✅ Use on unlimited websites (personal and commercial)
- ✅ Modify the source code as needed
- ✅ Use in unlimited client projects
- ✅ Sell websites/projects that include ConsentKit
- ✅ White-label (no attribution required)
- ✅ Full commercial freedom with standard MIT License

---

## 🆘 Support

- **Documentation:** [docs/](docs/)
- **FAQ:** [docs/faq.md](docs/faq.md)
- **Getting Started:** [docs/getting-started.md](docs/getting-started.md)
- **API Reference:** [docs/api-reference.md](docs/api-reference.md)
- **Contact:** Via Codester messaging system

---

## 📊 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

**Current Version:** 1.1.0 (May 2026)

---

## 🙏 Credits

ConsentKit is built with:
- Pure vanilla JavaScript (no dependencies)
- CSS custom properties for theming
- Modern web standards (ES5+ compatible)

---

## 🚀 Get Started Now

1. Copy `dist/consentkit.min.js` to your project
2. Add one script tag: `<script src="dist/consentkit.min.js" data-theme="dark"></script>`
3. Gate your analytics: `CookieConsent.on('analytics', initGA)`
4. You're done! ✨

**Questions?** Check the [FAQ](docs/faq.md) or [Getting Started Guide](docs/getting-started.md).

---

<p align="center">
  <strong>ConsentKit v1.1.0</strong><br>
  Vanilla JavaScript · Zero Dependencies · GDPR/CCPA Compliant · WCAG 2.1 AA<br>
  <a href="LICENSE.txt">MIT License</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="docs/">Documentation</a>
</p>
