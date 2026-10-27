import type { CookieSolutionConfig, CookieSolutionStatus } from './types';
import { CookieSolutionBanner } from './components/banner';
import { CookieSolutionCollapsable } from './components/collapsable';
import { CookieSolutionDuration } from './components/duration';
import { CookieSolutionPolicyFormatter } from './components/policyFormatter';
import { CookieSolutionSwitch } from './components/switch';
import { CookieSolutionToggle } from './components/toggle';
import { readStatus } from './utils/cookie';

export type {
    CookieSolutionConfig,
    CookieSolutionStatus,
    CookieSolutionPolicies,
    CookiePurpose,
    ServiceConfig,
    CookieConfig,
} from './types';
export {
    CookieSolutionBanner,
    CookieSolutionCollapsable,
    CookieSolutionDuration,
    CookieSolutionPolicyFormatter,
    CookieSolutionSwitch,
    CookieSolutionToggle,
};

declare global {
    interface Window {
        _cookieSolution?: CookieSolutionConfig;
    }

    interface HTMLElementTagNameMap {
        'cookie-solution-toggle': CookieSolutionToggle;
        'cookie-solution-banner': CookieSolutionBanner;
        'cookie-solution-duration': CookieSolutionDuration;
        'cookie-solution-policy-formatter': CookieSolutionPolicyFormatter;
        'cookie-solution--switch': CookieSolutionSwitch;
        'cookie-solution--collapsable': CookieSolutionCollapsable;
    }

    interface GlobalEventHandlersEventMap {
        'cookie-solution-status-change': CustomEvent<CookieSolutionStatus>;
    }
}

let mountedConfig: CookieSolutionConfig | undefined;

export function defineElements(): void {
    const elements: Record<string, CustomElementConstructor> = {
        'cookie-solution-banner': CookieSolutionBanner,
        'cookie-solution-toggle': CookieSolutionToggle,
        'cookie-solution-duration': CookieSolutionDuration,
        'cookie-solution-policy-formatter': CookieSolutionPolicyFormatter,
        'cookie-solution--switch': CookieSolutionSwitch,
        'cookie-solution--collapsable': CookieSolutionCollapsable,
    };

    for (const [name, element] of Object.entries(elements)) {
        if (!customElements.get(name)) {
            customElements.define(name, element);
        }
    }
}

export function mount(config: CookieSolutionConfig): void {
    if (config.enabled === false) {
        mountedConfig = undefined;
        document.querySelector('cookie-solution-banner')?.remove();
        return;
    }

    defineElements();

    mountedConfig = config;

    let banner = document.querySelector('cookie-solution-banner');

    if (banner) {
        banner.config = config;
    } else {
        banner = document.createElement('cookie-solution-banner');
        // Set before connecting, so the banner doesn't fall back to `window._cookieSolution`.
        banner.config = config;
        document.body.append(banner);
    }
}

export function open(): void {
    if (!mountedConfig) {
        return;
    }

    document.querySelector('cookie-solution-banner')?.show();
}

export function getStatus(): CookieSolutionStatus | undefined {
    if (typeof document === 'undefined' || !mountedConfig) {
        return undefined;
    }

    return readStatus(mountedConfig);
}

export function onStatusChange(callback: (status: CookieSolutionStatus) => void): () => void {
    if (typeof document === 'undefined') {
        return () => {};
    }

    const listener = (event: CustomEvent<CookieSolutionStatus>) => callback(event.detail);

    document.addEventListener('cookie-solution-status-change', listener);

    // The banner emits the stored status once on load: replay it for late subscribers.
    const status = getStatus();
    if (status) {
        callback(status);
    }

    return () => document.removeEventListener('cookie-solution-status-change', listener);
}
