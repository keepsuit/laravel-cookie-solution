import './components/toggle';
import './components/banner';
import { CookieSolutionConfig } from './types';
import { CookieSolutionBanner } from './components/banner';

export type { CookieSolutionConfig, ServiceConfig, CookieConfig, CookiePurpose } from './types';

declare global {
    interface Window {
        _cookieSolution?: CookieSolutionConfig;
    }

    interface HTMLElementTagNameMap {
        'cookie-solution-banner': CookieSolutionBanner;
    }
}
