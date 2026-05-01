/*!
 * ConsentKit v1.1.0 — Drop-In Cookie Consent
 * (c) 2025 ConsentKit | Zero dependencies
 * GDPR / CCPA Compliant | WCAG 2.1 AA
 *
 * USAGE — add one tag before </body>:
 *   <script src="consentkit.min.js"
 *     data-theme="dark"
 *     data-position="bottom"
 *     data-privacy-url="/privacy"
 *     data-expire-days="365"
 *     data-auto-show="true">
 *   </script>
 *
 * DATA ATTRIBUTES (all optional):
 *   data-theme         "dark" | "light" | "colorful"   default: "dark"
 *   data-position      "bottom" | "top"                default: "bottom"
 *   data-privacy-url   any URL string                  default: "/privacy-policy"
 *   data-expire-days   number                          default: 365
 *   data-auto-show     "true" | "false"                default: "true"
 *
 * JS API (same as before):
 *   CookieConsent.on('analytics', cb)
 *   CookieConsent.on('marketing', cb)
 *   CookieConsent.on('functional', cb)
 *   CookieConsent.acceptAll()
 *   CookieConsent.rejectAll()
 *   CookieConsent.showPreferences()
 *   CookieConsent.getConsent()   → { necessary, functional, analytics, marketing }
 *   CookieConsent.hasConsent(cat)
 *   CookieConsent.reset()
 */
(function (w, d) {
  'use strict';

  /* ── Read data attributes from the <script> tag ─────────────── */
  var scripts = d.querySelectorAll('script[src]');
  var thisScript = scripts[scripts.length - 1];

  function attr(name, fallback) {
    var v = thisScript && thisScript.getAttribute('data-' + name);
    return (v !== null && v !== '') ? v : fallback;
  }

  var THEME       = attr('theme',       'dark');
  var POSITION    = attr('position',    'bottom');
  var PRIVACY_URL = attr('privacy-url', '/privacy-policy');
  var EXPIRE_DAYS = parseInt(attr('expire-days', '365'), 10);
  var AUTO_SHOW   = attr('auto-show', 'true') !== 'false';

  /* ── CSS ─────────────────────────────────────────────────────── */
  var CSS = '\
.cc-theme-dark{--cc-bg:#16181f;--cc-bg2:#1e2130;--cc-bg3:#252839;--cc-border:rgba(255,255,255,0.08);--cc-border2:rgba(255,255,255,0.14);--cc-fg:#f1f5f9;--cc-fg2:#94a3b8;--cc-fg3:#475569;--cc-accent:#6366f1;--cc-accept-bg:#6366f1;--cc-accept-hov:#4f52d9;--cc-reject-bdr:rgba(255,255,255,0.12);--cc-reject-fg:#94a3b8;--cc-toggle-on:#6366f1;--cc-toggle-off:#2d3148;--cc-locked-bg:rgba(99,102,241,0.15);--cc-locked-fg:#818cf8;--cc-overlay:rgba(0,0,0,0.65);--cc-shadow:0 -2px 40px rgba(0,0,0,0.4);--cc-modal-sh:0 25px 60px rgba(0,0,0,0.6);--cc-radius:14px;--cc-font:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--cc-mono:"Courier New",monospace;--cc-ease:0.25s cubic-bezier(0.4,0,0.2,1)}\
.cc-theme-light{--cc-bg:#ffffff;--cc-bg2:#f8fafc;--cc-bg3:#f1f5f9;--cc-border:rgba(0,0,0,0.08);--cc-border2:rgba(0,0,0,0.14);--cc-fg:#0f172a;--cc-fg2:#475569;--cc-fg3:#94a3b8;--cc-accent:#0f766e;--cc-accept-bg:#0f766e;--cc-accept-hov:#0d6460;--cc-reject-bdr:rgba(0,0,0,0.12);--cc-reject-fg:#64748b;--cc-toggle-on:#0f766e;--cc-toggle-off:#e2e8f0;--cc-locked-bg:rgba(15,118,110,0.1);--cc-locked-fg:#0f766e;--cc-overlay:rgba(15,23,42,0.5);--cc-shadow:0 -2px 40px rgba(0,0,0,0.1);--cc-modal-sh:0 25px 60px rgba(0,0,0,0.15);--cc-radius:14px;--cc-font:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--cc-mono:"Courier New",monospace;--cc-ease:0.25s cubic-bezier(0.4,0,0.2,1)}\
.cc-theme-colorful{--cc-bg:#1a0533;--cc-bg2:#240844;--cc-bg3:#2e0d57;--cc-border:rgba(168,85,247,0.18);--cc-border2:rgba(168,85,247,0.30);--cc-fg:#faf5ff;--cc-fg2:#c4b5fd;--cc-fg3:#7c3aed;--cc-accent:#c084fc;--cc-accept-bg:linear-gradient(135deg,#a855f7,#ec4899);--cc-accept-hov:linear-gradient(135deg,#9333ea,#db2777);--cc-reject-bdr:rgba(168,85,247,0.25);--cc-reject-fg:#c4b5fd;--cc-toggle-on:#a855f7;--cc-toggle-off:#3b0764;--cc-locked-bg:rgba(168,85,247,0.15);--cc-locked-fg:#c084fc;--cc-overlay:rgba(10,0,25,0.75);--cc-shadow:0 -2px 60px rgba(168,85,247,0.25);--cc-modal-sh:0 25px 80px rgba(168,85,247,0.3);--cc-radius:14px;--cc-font:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--cc-mono:"Courier New",monospace;--cc-ease:0.25s cubic-bezier(0.4,0,0.2,1)}\
#cc-banner{position:fixed;left:0;right:0;z-index:99998;display:none;font-family:var(--cc-font)}\
#cc-banner.cc-bottom{bottom:0}#cc-banner.cc-top{top:0}\
#cc-banner.cc-visible{display:block;animation:cc-up .35s cubic-bezier(.34,1.56,.64,1) forwards}\
#cc-banner.cc-top.cc-visible{animation-name:cc-down}\
#cc-banner.cc-hiding{animation:cc-out-down .25s ease forwards}\
#cc-banner.cc-top.cc-hiding{animation-name:cc-out-up}\
@keyframes cc-up{from{transform:translateY(110%);opacity:0}to{transform:none;opacity:1}}\
@keyframes cc-down{from{transform:translateY(-110%);opacity:0}to{transform:none;opacity:1}}\
@keyframes cc-out-down{from{transform:none;opacity:1}to{transform:translateY(110%);opacity:0}}\
@keyframes cc-out-up{from{transform:none;opacity:1}to{transform:translateY(-110%);opacity:0}}\
.cc-banner-inner{background:var(--cc-bg);border-top:1px solid var(--cc-border);box-shadow:var(--cc-shadow);padding:18px 24px}\
#cc-banner.cc-top .cc-banner-inner{border-top:none;border-bottom:1px solid var(--cc-border)}\
.cc-banner-content{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:20px;flex-wrap:wrap}\
.cc-banner-text{flex:1;min-width:260px}\
.cc-banner-title{font-size:14px;font-weight:600;color:var(--cc-fg);margin-bottom:4px;display:flex;align-items:center;gap:7px}\
.cc-banner-title::before{content:"\\1F36A";font-size:15px}\
.cc-banner-desc{font-size:13px;color:var(--cc-fg2);line-height:1.55}\
.cc-banner-desc a{color:var(--cc-accent);text-decoration:underline;text-underline-offset:2px}\
.cc-theme-colorful .cc-banner-desc a{color:#c084fc}\
.cc-banner-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;flex-shrink:0}\
.cc-btn{font-family:var(--cc-font);font-size:13px;font-weight:500;padding:9px 20px;border-radius:8px;cursor:pointer;border:none;transition:all var(--cc-ease);white-space:nowrap;line-height:1;display:inline-flex;align-items:center}\
.cc-btn:focus-visible{outline:2px solid var(--cc-accent);outline-offset:2px}\
.cc-btn-accept{background:var(--cc-accept-bg);color:#fff}\
.cc-btn-accept:hover{background:var(--cc-accept-hov)}\
.cc-theme-colorful .cc-btn-accept{background:linear-gradient(135deg,#a855f7,#ec4899);border:none}\
.cc-theme-colorful .cc-btn-accept:hover{background:linear-gradient(135deg,#9333ea,#db2777)}\
.cc-btn-reject{background:transparent;border:1px solid var(--cc-reject-bdr);color:var(--cc-reject-fg)}\
.cc-btn-reject:hover{border-color:var(--cc-border2);color:var(--cc-fg)}\
.cc-btn-prefs{background:transparent;border:1px solid var(--cc-border);color:var(--cc-fg2)}\
.cc-btn-prefs:hover{border-color:var(--cc-border2);color:var(--cc-fg)}\
#cc-overlay{position:fixed;inset:0;z-index:99999;background:var(--cc-overlay);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:1rem}\
#cc-overlay.cc-visible{display:flex;animation:cc-fi .2s ease forwards}\
#cc-overlay.cc-hiding{animation:cc-fo .2s ease forwards}\
@keyframes cc-fi{from{opacity:0}to{opacity:1}}\
@keyframes cc-fo{from{opacity:1}to{opacity:0}}\
#cc-modal{background:var(--cc-bg);border:1px solid var(--cc-border);border-radius:var(--cc-radius);box-shadow:var(--cc-modal-sh);width:100%;max-width:560px;max-height:88vh;display:flex;flex-direction:column;font-family:var(--cc-font);overflow:hidden;animation:cc-mi .3s cubic-bezier(.34,1.56,.64,1) forwards}\
@keyframes cc-mi{from{opacity:0;transform:scale(.94) translateY(10px)}to{opacity:1;transform:none}}\
.cc-modal-header{padding:22px 24px 18px;border-bottom:1px solid var(--cc-border);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-shrink:0}\
.cc-modal-title{font-size:17px;font-weight:700;color:var(--cc-fg);margin-bottom:3px}\
.cc-modal-subtitle{font-size:12px;color:var(--cc-fg3);font-family:var(--cc-mono);letter-spacing:.04em}\
.cc-close-btn{background:var(--cc-bg3);border:1px solid var(--cc-border);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--cc-fg2);font-size:16px;flex-shrink:0;transition:all var(--cc-ease);line-height:1}\
.cc-close-btn:hover{background:var(--cc-border);color:var(--cc-fg)}\
.cc-close-btn:focus-visible{outline:2px solid var(--cc-accent);outline-offset:2px}\
.cc-status-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 24px;background:var(--cc-bg2);border-bottom:1px solid var(--cc-border);font-size:11px;flex-shrink:0;gap:4px;flex-wrap:wrap}\
.cc-status-text{color:var(--cc-fg3);font-family:var(--cc-mono);letter-spacing:.04em}\
.cc-status-date{color:var(--cc-fg3);font-family:var(--cc-mono);font-size:10px}\
.cc-modal-body{overflow-y:auto;flex:1}\
.cc-modal-body::-webkit-scrollbar{width:4px}\
.cc-modal-body::-webkit-scrollbar-thumb{background:var(--cc-border2);border-radius:4px}\
.cc-category{padding:18px 24px;border-bottom:1px solid var(--cc-border);display:flex;align-items:flex-start;gap:14px;transition:background var(--cc-ease)}\
.cc-category:last-child{border-bottom:none}\
.cc-category:hover{background:rgba(128,128,128,0.04)}\
.cc-category-info{flex:1;min-width:0}\
.cc-category-header{display:flex;align-items:center;gap:8px;margin-bottom:5px}\
.cc-category-name{font-size:14px;font-weight:600;color:var(--cc-fg)}\
.cc-badge-required{font-size:10px;font-weight:500;padding:2px 8px;border-radius:99px;font-family:var(--cc-mono);letter-spacing:.05em;text-transform:uppercase;background:var(--cc-locked-bg);color:var(--cc-locked-fg)}\
.cc-category-desc{font-size:12.5px;color:var(--cc-fg2);line-height:1.6}\
.cc-category-examples{margin-top:6px;font-size:11px;color:var(--cc-fg3);font-family:var(--cc-mono)}\
.cc-toggle-wrap{flex-shrink:0;margin-top:2px}\
.cc-toggle{position:relative;display:inline-block;width:44px;height:24px}\
.cc-toggle input{opacity:0;width:0;height:0;position:absolute}\
.cc-toggle-track{position:absolute;inset:0;border-radius:24px;background:var(--cc-toggle-off);cursor:pointer;transition:background var(--cc-ease);border:1px solid var(--cc-border)}\
.cc-toggle-track::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform var(--cc-ease);box-shadow:0 1px 3px rgba(0,0,0,.3)}\
.cc-toggle input:checked+.cc-toggle-track{background:var(--cc-toggle-on);border-color:var(--cc-toggle-on)}\
.cc-toggle input:checked+.cc-toggle-track::after{transform:translateX(20px)}\
.cc-toggle input:disabled+.cc-toggle-track{opacity:.7;cursor:not-allowed}\
.cc-toggle input:focus-visible+.cc-toggle-track{outline:2px solid var(--cc-accent);outline-offset:2px}\
.cc-modal-footer{padding:16px 24px;border-top:1px solid var(--cc-border);display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;flex-shrink:0;background:var(--cc-bg2)}\
.cc-btn-save{background:var(--cc-accept-bg);color:#fff}\
.cc-btn-save:hover{background:var(--cc-accept-hov)}\
.cc-theme-colorful .cc-btn-save{background:linear-gradient(135deg,#a855f7,#ec4899);border:none}\
.cc-theme-colorful .cc-btn-save:hover{background:linear-gradient(135deg,#9333ea,#db2777)}\
.cc-btn-accept-all-modal{background:transparent;border:1px solid var(--cc-border);color:var(--cc-fg2)}\
.cc-btn-accept-all-modal:hover{border-color:var(--cc-border2);color:var(--cc-fg)}\
#cc-settings-trigger{position:fixed;bottom:24px;left:24px;z-index:99997;background:var(--cc-bg);border:1px solid var(--cc-border2);border-radius:99px;padding:8px 14px 8px 10px;display:none;align-items:center;gap:7px;cursor:pointer;font-family:var(--cc-font);font-size:12px;font-weight:500;color:var(--cc-fg2);box-shadow:0 4px 20px rgba(0,0,0,.3);transition:all var(--cc-ease)}\
#cc-settings-trigger.cc-visible{display:flex;animation:cc-fi .3s ease forwards}\
#cc-settings-trigger:hover{color:var(--cc-fg);border-color:var(--cc-accent);transform:translateY(-1px)}\
#cc-settings-trigger:focus-visible{outline:2px solid var(--cc-accent);outline-offset:2px}\
.cc-settings-icon{font-size:15px;line-height:1;transition:transform .4s ease;display:inline-block}\
#cc-settings-trigger:hover .cc-settings-icon{transform:rotate(60deg)}\
@media(max-width:560px){\
.cc-banner-content{flex-direction:column;align-items:flex-start}\
.cc-banner-actions{width:100%}\
.cc-banner-actions .cc-btn{flex:1;justify-content:center}\
.cc-modal-footer{flex-direction:column-reverse}\
.cc-modal-footer .cc-btn{width:100%;justify-content:center}\
#cc-settings-trigger span:last-child{display:none}\
#cc-settings-trigger{padding:10px;border-radius:50%}}\
@media(prefers-reduced-motion:reduce){\
#cc-banner,#cc-overlay,#cc-modal,#cc-settings-trigger{animation:none!important;transition:none!important}}\
';

  /* ── HTML template ───────────────────────────────────────────── */
  function buildHTML(theme, privacyUrl) {
    var tc = 'cc-theme-' + theme;
    return '\
<div id="cc-banner" class="' + tc + ' cc-bottom" role="region" aria-label="Cookie consent" aria-hidden="true">\
  <div class="cc-banner-inner">\
    <div class="cc-banner-content">\
      <div class="cc-banner-text">\
        <div class="cc-banner-title">We use cookies</div>\
        <div class="cc-banner-desc">We use cookies to improve your experience, analyze traffic, and personalize content. Choose which categories to allow. <a href="' + privacyUrl + '" id="cc-privacy-link" target="_blank" rel="noopener">Privacy Policy</a></div>\
      </div>\
      <div class="cc-banner-actions">\
        <button class="cc-btn cc-btn-reject" id="cc-btn-reject" aria-label="Reject all non-essential cookies">Reject All</button>\
        <button class="cc-btn cc-btn-prefs"  id="cc-btn-prefs"  aria-label="Open cookie preferences">Preferences</button>\
        <button class="cc-btn cc-btn-accept" id="cc-btn-accept" aria-label="Accept all cookies">Accept All</button>\
      </div>\
    </div>\
  </div>\
</div>\
<div id="cc-overlay" role="dialog" aria-modal="true" aria-labelledby="cc-modal-title" aria-describedby="cc-modal-subtitle" aria-hidden="true">\
  <div id="cc-modal" class="' + tc + '">\
    <div class="cc-modal-header">\
      <div>\
        <div class="cc-modal-title" id="cc-modal-title">&#9881;&#65039; Cookie Preferences</div>\
        <div class="cc-modal-subtitle" id="cc-modal-subtitle">Manage consent per category</div>\
      </div>\
      <button class="cc-close-btn" id="cc-modal-close" aria-label="Close preferences">&#x2715;</button>\
    </div>\
    <div class="cc-status-bar">\
      <span class="cc-status-text" id="cc-status-text">No preferences saved yet</span>\
      <span class="cc-status-date" id="cc-status-date"></span>\
    </div>\
    <div class="cc-modal-body">\
      <div class="cc-category">\
        <div class="cc-category-info">\
          <div class="cc-category-header"><span class="cc-category-name">Strictly Necessary</span><span class="cc-badge-required">Always On</span></div>\
          <div class="cc-category-desc">Essential for the website to function. Cannot be disabled.</div>\
          <div class="cc-category-examples">Session management &middot; Security tokens &middot; Load balancing</div>\
        </div>\
        <div class="cc-toggle-wrap"><label class="cc-toggle" aria-label="Strictly necessary \u2014 always enabled"><input type="checkbox" id="cc-toggle-necessary" checked disabled aria-checked="true"><span class="cc-toggle-track"></span></label></div>\
      </div>\
      <div class="cc-category">\
        <div class="cc-category-info">\
          <div class="cc-category-header"><span class="cc-category-name">Functional</span></div>\
          <div class="cc-category-desc">Remembers your choices to provide personalised features.</div>\
          <div class="cc-category-examples">Language &middot; Theme &middot; Saved preferences</div>\
        </div>\
        <div class="cc-toggle-wrap"><label class="cc-toggle" aria-label="Toggle functional cookies"><input type="checkbox" id="cc-toggle-functional" aria-checked="false"><span class="cc-toggle-track"></span></label></div>\
      </div>\
      <div class="cc-category">\
        <div class="cc-category-info">\
          <div class="cc-category-header"><span class="cc-category-name">Analytics</span></div>\
          <div class="cc-category-desc">Collects anonymous data to help us improve the site.</div>\
          <div class="cc-category-examples">Google Analytics &middot; Hotjar &middot; Mixpanel</div>\
        </div>\
        <div class="cc-toggle-wrap"><label class="cc-toggle" aria-label="Toggle analytics cookies"><input type="checkbox" id="cc-toggle-analytics" aria-checked="false"><span class="cc-toggle-track"></span></label></div>\
      </div>\
      <div class="cc-category">\
        <div class="cc-category-info">\
          <div class="cc-category-header"><span class="cc-category-name">Marketing</span></div>\
          <div class="cc-category-desc">Tracks visits to show relevant targeted advertisements.</div>\
          <div class="cc-category-examples">Facebook Pixel &middot; Google Ads &middot; LinkedIn Insight</div>\
        </div>\
        <div class="cc-toggle-wrap"><label class="cc-toggle" aria-label="Toggle marketing cookies"><input type="checkbox" id="cc-toggle-marketing" aria-checked="false"><span class="cc-toggle-track"></span></label></div>\
      </div>\
    </div>\
    <div class="cc-modal-footer">\
      <button class="cc-btn cc-btn-accept-all-modal" id="cc-modal-accept-all">Accept All</button>\
      <button class="cc-btn cc-btn-save" id="cc-modal-save">Save Preferences</button>\
    </div>\
  </div>\
</div>\
<button id="cc-settings-trigger" class="' + tc + '" aria-label="Open cookie settings">\
  <span class="cc-settings-icon">&#9881;</span>\
  <span>Cookie Settings</span>\
</button>';
  }

  /* ── Inject CSS ──────────────────────────────────────────────── */
  function injectCSS() {
    var style = d.createElement('style');
    style.id  = 'consentkit-css';
    style.textContent = CSS;
    (d.head || d.documentElement).appendChild(style);
  }

  /* ── Inject HTML ─────────────────────────────────────────────── */
  function injectHTML() {
    var wrap = d.createElement('div');
    wrap.id  = 'consentkit-root';
    wrap.innerHTML = buildHTML(THEME, PRIVACY_URL);
    d.body.appendChild(wrap);
  }

  /* ── Core engine ─────────────────────────────────────────────── */
  var KEY = 'consentkit_v1', VER = '1.1.0';
  var _consent = null, _listeners = {}, _trap = null;

  function $el(id) { return d.getElementById(id); }

  function expISO(days) {
    var x = new Date();
    x.setDate(x.getDate() + days);
    return x.toISOString();
  }

  function isExpired(s) { return s ? new Date() > new Date(s) : true; }

  function fmtDate(s) {
    return new Date(s).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  function saveRecord(state) {
    var r = {
      version:   VER,
      timestamp: new Date().toISOString(),
      expires:   expISO(EXPIRE_DAYS),
      consent:   state
    };
    try { localStorage.setItem(KEY, JSON.stringify(r)); } catch(e) {}
    return r;
  }

  function loadRecord() {
    try {
      var r = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!r) return null;
      if (isExpired(r.expires)) { localStorage.removeItem(KEY); return null; }
      return r;
    } catch(e) { return null; }
  }

  function dispatch(c) {
    Object.keys(c).forEach(function(k) {
      if (c[k] && _listeners[k]) {
        _listeners[k].forEach(function(fn) { try { fn(c); } catch(e) {} });
      }
    });
  }

  function trapFocus(el) {
    var sel = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    var ns = el.querySelectorAll(sel);
    var first = ns[0], last = ns[ns.length - 1];
    function onTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) { if (d.activeElement === first) { e.preventDefault(); last.focus(); } }
      else            { if (d.activeElement === last)  { e.preventDefault(); first.focus(); } }
    }
    function onEsc(e) { if (e.key === 'Escape') CC.hidePreferences(); }
    el.addEventListener('keydown', onTab);
    el.addEventListener('keydown', onEsc);
    if (first) first.focus();
    return function() {
      el.removeEventListener('keydown', onTab);
      el.removeEventListener('keydown', onEsc);
    };
  }

  function setToggle(id, v) {
    var el = $el(id);
    if (!el) return;
    el.checked = v;
    el.setAttribute('aria-checked', v ? 'true' : 'false');
  }

  function getToggles() {
    return {
      necessary:  true,
      functional: !!($el('cc-toggle-functional') && $el('cc-toggle-functional').checked),
      analytics:  !!($el('cc-toggle-analytics')  && $el('cc-toggle-analytics').checked),
      marketing:  !!($el('cc-toggle-marketing')  && $el('cc-toggle-marketing').checked)
    };
  }

  function syncToggles(c) {
    setToggle('cc-toggle-functional', c.functional);
    setToggle('cc-toggle-analytics',  c.analytics);
    setToggle('cc-toggle-marketing',  c.marketing);
  }

  function updateStatusBar(r) {
    var t = $el('cc-status-text'), dt = $el('cc-status-date');
    if (!t || !dt) return;
    if (r) {
      t.textContent  = 'Preferences saved';
      dt.textContent = 'Updated: ' + fmtDate(r.timestamp) + ' \u00B7 Expires: ' + fmtDate(r.expires);
    } else {
      t.textContent  = 'No preferences saved yet';
      dt.textContent = '';
    }
  }

  function animHide(el, cb) {
    if (!el || !el.classList.contains('cc-visible')) return;
    el.classList.add('cc-hiding');
    function done() { el.classList.remove('cc-visible', 'cc-hiding'); if (cb) cb(); }
    el.addEventListener('animationend', function h() {
      el.removeEventListener('animationend', h);
      done();
    }, { once: true });
    setTimeout(function() { if (el.classList.contains('cc-hiding')) done(); }, 400);
  }

  /* ── Public API ──────────────────────────────────────────────── */
  var CC = {

    /**
     * Manually initialise (optional — auto-runs on DOMContentLoaded).
     * Use this if you need to override data-attribute settings at runtime.
     */
    init: function(opts) {
      if (opts) {
        if (opts.theme)      THEME       = opts.theme;
        if (opts.position)   POSITION    = opts.position;
        if (opts.privacyUrl) PRIVACY_URL = opts.privacyUrl;
        if (opts.expireDays) EXPIRE_DAYS = opts.expireDays;
        if (typeof opts.autoShow !== 'undefined') AUTO_SHOW = opts.autoShow;
      }
    },

    show: function() {
      var b = $el('cc-banner');
      if (!b) return;
      b.classList.remove('cc-top', 'cc-bottom');
      b.classList.add('cc-' + POSITION);
      b.classList.remove('cc-hiding');
      b.classList.add('cc-visible');
      b.setAttribute('aria-hidden', 'false');
    },

    hide: function() {
      animHide($el('cc-banner'), function() {
        var b = $el('cc-banner');
        if (b) b.setAttribute('aria-hidden', 'true');
      });
    },

    acceptAll: function() {
      this._commit({ necessary: true, functional: true, analytics: true, marketing: true });
      this.hide();
      this._showTrigger();
    },

    rejectAll: function() {
      this._commit({ necessary: true, functional: false, analytics: false, marketing: false });
      this.hide();
      this._showTrigger();
    },

    savePreferences: function() {
      this._commit(getToggles());
      this.hide();
      this.hidePreferences();
      this._showTrigger();
    },

    _commit: function(c) {
      _consent = c;
      var r = saveRecord(c);
      syncToggles(c);
      updateStatusBar(r);
      dispatch(c);
    },

    showPreferences: function() {
      var ov = $el('cc-overlay'), mo = $el('cc-modal');
      if (!ov) return;
      if (_consent) syncToggles(_consent);
      updateStatusBar(loadRecord());
      ov.classList.remove('cc-hiding');
      ov.classList.add('cc-visible');
      ov.setAttribute('aria-hidden', 'false');
      d.body.style.overflow = 'hidden';
      if (_trap) _trap();
      if (mo) _trap = trapFocus(mo);
    },

    hidePreferences: function() {
      animHide($el('cc-overlay'), function() {
        var ov = $el('cc-overlay');
        if (ov) ov.setAttribute('aria-hidden', 'true');
        d.body.style.overflow = '';
      });
      if (_trap) { _trap(); _trap = null; }
    },

    _showTrigger: function() {
      var t = $el('cc-settings-trigger');
      if (t) t.classList.add('cc-visible');
    },

    /**
     * Gate a script on a specific consent category.
     * Fires immediately if consent was already granted.
     *
     * @param {string}   category  'analytics' | 'marketing' | 'functional' | 'necessary'
     * @param {Function} callback
     * @returns {Object} CookieConsent (chainable)
     *
     * @example
     * CookieConsent.on('analytics', function() {
     *   gtag('config', 'G-XXXXXXXXXX');
     * });
     */
    on: function(category, callback) {
      if (!_listeners[category]) _listeners[category] = [];
      _listeners[category].push(callback);
      if (_consent && _consent[category]) {
        try { callback(_consent); } catch(e) {}
      }
      return this;
    },

    /** @returns {{ necessary, functional, analytics, marketing } | null} */
    getConsent: function() {
      return _consent ? Object.assign({}, _consent) : null;
    },

    /** @returns {boolean} */
    hasConsent: function(category) {
      return _consent ? !!_consent[category] : false;
    },

    /** Clear all consent and re-show the banner. */
    reset: function() {
      try { localStorage.removeItem(KEY); } catch(e) {}
      _consent  = null;
      _listeners = {};
      syncToggles({ necessary: true, functional: false, analytics: false, marketing: false });
      updateStatusBar(null);
      var t = $el('cc-settings-trigger');
      if (t) t.classList.remove('cc-visible');
      this.hidePreferences();
      this.show();
    }
  };

  /* ── Boot ────────────────────────────────────────────────────── */
  function boot() {
    injectCSS();
    injectHTML();

    // Set banner position class
    var banner = $el('cc-banner');
    if (banner) {
      banner.classList.remove('cc-top', 'cc-bottom');
      banner.classList.add('cc-' + POSITION);
    }

    // Set privacy link
    var link = $el('cc-privacy-link');
    if (link) link.href = PRIVACY_URL;

    // Load stored consent
    var record = loadRecord();
    _consent = record ? record.consent : null;

    if (_consent) {
      syncToggles(_consent);
      updateStatusBar(record);
      CC._showTrigger();
      dispatch(_consent);
    } else if (AUTO_SHOW) {
      CC.show();
    }

    // Wire banner buttons
    function on(id, fn) { var el = $el(id); if (el) el.addEventListener('click', fn); }
    on('cc-btn-accept',        function() { CC.acceptAll(); });
    on('cc-btn-reject',        function() { CC.rejectAll(); });
    on('cc-btn-prefs',         function() { CC.showPreferences(); });
    on('cc-modal-save',        function() { CC.savePreferences(); });
    on('cc-modal-accept-all',  function() { CC.acceptAll(); CC.hidePreferences(); });
    on('cc-modal-close',       function() { CC.hidePreferences(); });
    on('cc-settings-trigger',  function() { CC.showPreferences(); });

    // Close on overlay backdrop click
    var ov = $el('cc-overlay');
    if (ov) ov.addEventListener('click', function(e) { if (e.target === ov) CC.hidePreferences(); });

    // Sync aria-checked on toggle change
    ['functional', 'analytics', 'marketing'].forEach(function(cat) {
      var el = $el('cc-toggle-' + cat);
      if (el) el.addEventListener('change', function() {
        this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
      });
    });
  }

  /* ── Run when DOM is ready ───────────────────────────────────── */
  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ── Expose globally ─────────────────────────────────────────── */
  w.CookieConsent = CC;

}(window, document));
