/**
 * ConsentKit v1.1.0 - TypeScript Definitions
 * Drop-in cookie consent banner for GDPR and CCPA compliance
 */

/**
 * Consent categories available in ConsentKit
 */
export type ConsentCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

/**
 * Consent state object containing boolean values for each category
 */
export interface ConsentState {
  /** Always true - cannot be disabled */
  necessary: boolean;
  /** User preference for functional cookies */
  functional: boolean;
  /** User preference for analytics cookies */
  analytics: boolean;
  /** User preference for marketing cookies */
  marketing: boolean;
}

/**
 * Configuration options for ConsentKit initialization
 */
export interface ConsentKitConfig {
  /** Visual theme: 'dark', 'light', or 'colorful'. Default: 'dark' */
  theme?: 'dark' | 'light' | 'colorful';
  /** Banner position: 'bottom' or 'top'. Default: 'bottom' */
  position?: 'bottom' | 'top';
  /** URL to your privacy policy page. Default: '/privacy-policy' */
  privacyUrl?: string;
  /** Number of days before consent expires. Default: 365 */
  expireDays?: number;
  /** Automatically show banner if no consent stored. Default: true */
  autoShow?: boolean;
}

/**
 * Callback function type for consent event listeners
 */
export type ConsentCallback = (consent: ConsentState) => void;

/**
 * Main ConsentKit API interface
 */
export interface CookieConsentAPI {
  /**
   * Manually initialize ConsentKit with custom configuration.
   * Optional - ConsentKit auto-initializes on DOMContentLoaded.
   * Use this to override data-attribute settings at runtime.
   *
   * @param config - Configuration options
   *
   * @example
   * CookieConsent.init({
   *   theme: 'light',
   *   position: 'top',
   *   privacyUrl: '/privacy',
   *   expireDays: 180
   * });
   */
  init(config?: ConsentKitConfig): void;

  /**
   * Show the cookie consent banner
   */
  show(): void;

  /**
   * Hide the cookie consent banner
   */
  hide(): void;

  /**
   * Accept all cookie categories and hide the banner
   */
  acceptAll(): void;

  /**
   * Reject all non-essential cookie categories and hide the banner
   */
  rejectAll(): void;

  /**
   * Save the current toggle state from the Preference Centre
   */
  savePreferences(): void;

  /**
   * Open the Preference Centre modal
   */
  showPreferences(): void;

  /**
   * Close the Preference Centre modal
   */
  hidePreferences(): void;

  /**
   * Register a callback to execute when a specific consent category is granted.
   * If consent was already granted, the callback fires immediately.
   * Returns the CookieConsent object for method chaining.
   *
   * @param category - The consent category to listen for
   * @param callback - Function to execute when consent is granted
   * @returns The CookieConsent API object (chainable)
   *
   * @example
   * CookieConsent.on('analytics', (consent) => {
   *   // Initialize Google Analytics
   *   gtag('config', 'G-XXXXXXXXXX');
   * });
   *
   * @example
   * // Chainable
   * CookieConsent
   *   .on('analytics', initGA)
   *   .on('marketing', initPixel)
   *   .on('functional', initChat);
   */
  on(category: ConsentCategory, callback: ConsentCallback): CookieConsentAPI;

  /**
   * Get the current consent state.
   * Returns null if the user has not made a choice yet.
   *
   * @returns The current consent state or null
   *
   * @example
   * const consent = CookieConsent.getConsent();
   * if (consent && consent.analytics) {
   *   console.log('Analytics enabled');
   * }
   */
  getConsent(): ConsentState | null;

  /**
   * Check if a specific category has been consented to.
   *
   * @param category - The category to check
   * @returns true if consented, false otherwise
   *
   * @example
   * if (CookieConsent.hasConsent('marketing')) {
   *   // Load marketing scripts
   * }
   */
  hasConsent(category: ConsentCategory): boolean;

  /**
   * Clear all stored consent data and re-show the banner.
   * Useful for testing or providing a "withdraw consent" button.
   *
   * @example
   * // Add a "Withdraw Consent" button on your privacy page
   * document.getElementById('withdraw-btn').addEventListener('click', () => {
   *   CookieConsent.reset();
   * });
   */
  reset(): void;
}

/**
 * Global CookieConsent object available after ConsentKit loads
 */
declare global {
  interface Window {
    CookieConsent: CookieConsentAPI;
  }

  const CookieConsent: CookieConsentAPI;
}

export {};
