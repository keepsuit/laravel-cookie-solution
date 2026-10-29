import { mount } from './index';
import type { CookieSolutionConfig } from './types';

// Exposed as `window.CookieSolution` by the IIFE build (`lib.name`).
export { defineElements, getStatus, mount, onStatusChange, open } from './index';

declare global {
    interface Window {
        _cookieSolution?: CookieSolutionConfig;
    }
}

if (window._cookieSolution) {
    mount(window._cookieSolution);
} else {
    console.error('CookieSolution: No configuration found.');
}
