import './components/duration';
import './components/banner';
import './components/toggle';
import './components/policyFormatter';
import { CookieSolutionConfig } from './types';
import { CookieSolutionBanner } from './components/banner';
import { CookieSolutionDuration } from './components/duration';
import { CookieSolutionToggle } from './components/toggle';
import { CookieSolutionPolicyFormatter } from './components/policyFormatter';

export type { CookieSolutionConfig, ServiceConfig, CookieConfig, CookiePurpose } from './types';

declare global {
    const gtag: Function | undefined;
    const fbq: Function | undefined;

    interface Window {
        _cookieSolution?: CookieSolutionConfig;
        dataLayer?: Record<string, any>[];
    }

    interface HTMLElementTagNameMap {
        'cookie-solution-toggle': CookieSolutionToggle;
        'cookie-solution-banner': CookieSolutionBanner;
        'cookie-solution-duration': CookieSolutionDuration;
        'cookie-solution-policy-formatter': CookieSolutionPolicyFormatter;
    }
}

(function() {
    if (!document.querySelector('cookie-solution-banner')) {
        const cookieSolutionBanner = document.createElement('cookie-solution-banner');
        document.body.append(cookieSolutionBanner);
    }
})();
