import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { CookiePurpose, CookieSolutionConfig, CookieSolutionStatus } from '../types';
import { parsePurposes } from './inert-scripts';
import type { CookieSolutionEmbedPlaceholder } from './embedPlaceholder';

const SELECTOR = 'iframe[data-cookie-solution-purposes]';

interface Blocked {
    placeholder: CookieSolutionEmbedPlaceholder;
    display: string;
    priority: string;
}

/**
 * Loads `<iframe data-cookie-solution-purposes="…" data-src="…">` while all its purposes are granted,
 * and shows a placeholder in its place otherwise.
 */
export class EmbedsController implements ReactiveController {
    private _status?: CookieSolutionStatus;
    private _config?: CookieSolutionConfig;
    private _observer?: MutationObserver;
    private _invalid = new WeakSet<HTMLIFrameElement>();
    private _blocked = new Map<HTMLIFrameElement, Blocked>();

    constructor(
        host: ReactiveControllerHost,
        private readonly _grant: (purposes: CookiePurpose[]) => void,
    ) {
        host.addController(this);
    }

    hostConnected(): void {
        this._observer = new MutationObserver(() => this._run());
        this._observer.observe(document.documentElement, { childList: true, subtree: true });
        this._run();
    }

    hostDisconnected(): void {
        this._observer?.disconnect();
        this._observer = undefined;
    }

    setState(status: CookieSolutionStatus, config: CookieSolutionConfig): void {
        this._status = status;
        this._config = config;
        this._run();
    }

    private _run(): void {
        const status = this._status;
        const config = this._config;

        if (!status || !config || !this._observer) {
            return;
        }

        for (const [iframe, { placeholder }] of this._blocked) {
            if (!iframe.isConnected) {
                placeholder.remove();
                this._blocked.delete(iframe);
            }
        }

        for (const iframe of document.querySelectorAll<HTMLIFrameElement>(SELECTOR)) {
            if (this._invalid.has(iframe)) {
                continue;
            }

            const purposes = parsePurposes(iframe);

            if (!purposes) {
                this._invalid.add(iframe);
                continue;
            }

            if (purposes.every((purpose) => status.purposes[purpose])) {
                this._load(iframe);
            } else {
                this._block(iframe, purposes, config);
            }
        }
    }

    private _load(iframe: HTMLIFrameElement): void {
        const blocked = this._blocked.get(iframe);

        if (blocked) {
            blocked.placeholder.remove();
            iframe.style.setProperty('display', blocked.display, blocked.priority);
            this._blocked.delete(iframe);
        }

        const src = iframe.dataset.src;

        if (src !== undefined && iframe.getAttribute('src') !== src) {
            iframe.src = src;
        }
    }

    private _block(iframe: HTMLIFrameElement, purposes: CookiePurpose[], config: CookieSolutionConfig): void {
        // Removing `src` would leave the loaded page in place.
        if (iframe.hasAttribute('src') && iframe.getAttribute('src') !== 'about:blank') {
            iframe.src = 'about:blank';
        }

        const blocked = this._blocked.get(iframe);
        const placeholder = blocked?.placeholder ?? document.createElement('cookie-solution-embed-placeholder');

        placeholder.config = config;
        placeholder.purposes = purposes;

        if (blocked) {
            return;
        }

        // Same box as the iframe: its classes and inline style, its size attributes as overridable defaults.
        placeholder.className = iframe.className;
        placeholder.style.cssText = iframe.style.cssText;
        for (const dimension of ['width', 'height'] as const) {
            const value = iframe.getAttribute(dimension);
            if (value) {
                placeholder.style.setProperty(`--cs-embed-${dimension}`, /^\d+$/.test(value) ? `${value}px` : value);
            }
        }
        placeholder.addEventListener('grant', () => this._grant(placeholder.purposes));

        this._blocked.set(iframe, {
            placeholder,
            display: iframe.style.getPropertyValue('display'),
            priority: iframe.style.getPropertyPriority('display'),
        });
        iframe.style.setProperty('display', 'none', 'important');
        iframe.after(placeholder);
    }
}
