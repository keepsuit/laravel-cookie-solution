import { defineElements, getStatus, mount, onStatusChange, open } from './index';

declare global {
    interface Window {
        CookieSolution: typeof CookieSolution;
    }
}

const CookieSolution = { defineElements, mount, open, getStatus, onStatusChange };

// Assigned explicitly: the Blade view loads this bundle as a module script, where the IIFE's top-level `var` stays local.
window.CookieSolution = CookieSolution;

if (window._cookieSolution) {
    mount(window._cookieSolution);
} else {
    console.error('CookieSolution: No configuration found.');
}
