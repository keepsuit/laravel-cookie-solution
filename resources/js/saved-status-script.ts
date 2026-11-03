import source from '../dist/saved-status.js?raw';
import type { CookieSolutionConfig, CookieSolutionStatus } from './types';

declare global {
    interface Window {
        /** The consent saved for the current config, read synchronously from the cookie. */
        cookieSolutionSavedStatus?: () => CookieSolutionStatus | undefined;
    }
}

/** Inline script defining `window.cookieSolutionSavedStatus()`, to render in the server-side `<head>`. */
export function savedStatusScript(config: Pick<CookieSolutionConfig, 'cookie_name' | 'digest'>): string {
    // `<` escaped: the config ends up inside a `<script>` element.
    const json = JSON.stringify({ cookie_name: config.cookie_name, digest: config.digest }).replace(/</g, '\\u003c');

    return `(function (__cookieSolutionConfig) { ${source.trim()} })(${json});`;
}
