import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { CookiePurpose, CookieSolutionStatus } from '../types';

const PURPOSES: CookiePurpose[] = ['necessary', 'preferences', 'statistics', 'marketing'];
const SELECTOR = 'script[type="text/plain"][data-cookie-solution-purposes]';

/** Runs `<script type="text/plain" data-cookie-solution-purposes="…">` once all its purposes are granted. */
export class InertScriptsController implements ReactiveController {
    private _status?: CookieSolutionStatus;
    private _observer?: MutationObserver;
    private _handled = new WeakSet<HTMLScriptElement>();
    // One at a time, like the HTML parser: an inline script may need the external one before it.
    private _queue = Promise.resolve();

    constructor(host: ReactiveControllerHost) {
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

    setStatus(status: CookieSolutionStatus): void {
        this._status = status;
        this._run();
    }

    private _run(): void {
        const status = this._status;

        if (!status || !this._observer) {
            return;
        }

        for (const script of document.querySelectorAll<HTMLScriptElement>(SELECTOR)) {
            if (this._handled.has(script)) {
                continue;
            }

            const purposes = (script.dataset.cookieSolutionPurposes ?? '').split(/\s+/).filter(Boolean);

            if (purposes.length === 0 || purposes.some((purpose) => !PURPOSES.includes(purpose as CookiePurpose))) {
                this._handled.add(script);
                console.warn(
                    `CookieSolution: invalid data-cookie-solution-purposes "${purposes.join(' ')}", the script will never run.`,
                    script,
                );
                continue;
            }

            if (purposes.every((purpose) => status.purposes[purpose as CookiePurpose])) {
                this._handled.add(script);
                this._queue = this._queue.then(() => execute(script));
            }
        }
    }
}

function execute(inert: HTMLScriptElement): Promise<void> {
    if (!inert.isConnected) {
        return Promise.resolve();
    }

    const script = document.createElement('script');

    for (const { name, value } of inert.attributes) {
        if (name !== 'type' && name !== 'data-src' && name !== 'data-type') {
            script.setAttribute(name, value);
        }
    }

    if (inert.dataset.type) {
        script.type = inert.dataset.type;
    }

    // Browsers hide the `nonce` attribute: only the property holds it.
    script.nonce = inert.nonce;

    const src = inert.dataset.src;
    const done = src
        ? new Promise<void>((resolve) => {
              script.addEventListener('load', () => resolve(), { once: true });
              script.addEventListener('error', () => resolve(), { once: true });
          })
        : Promise.resolve();

    if (src) {
        script.src = src;
    } else {
        script.text = inert.text;
    }

    inert.replaceWith(script);

    return done;
}
