import './components/banner';
import { CookieSolutionConfig } from './types';
import { CookieSolutionBanner } from './components/banner';

export type { CookieSolutionConfig, ServiceConfig, CookieConfig, CookiePurpose } from './types';

declare global {
    const gtag: Function | undefined;
    const fbq: Function | undefined;

    interface Window {
        _cookieSolution?: CookieSolutionConfig;
        dataLayer?: Record<string, any>[];
    }

    interface HTMLElementTagNameMap {
        'cookie-solution-banner': CookieSolutionBanner;
    }
}

const cookieSolutionBanner = document.createElement('cookie-solution-banner');
document.body.append(cookieSolutionBanner);
