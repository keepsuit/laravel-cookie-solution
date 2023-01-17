import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { styleSheet } from './style';

@customElement('cookie-solution-banner')
class CookieSolutionBanner extends LitElement {
    static styles = [styleSheet];

    @state()
    private _tab = 0;

    private _onTabSelected(event: Event): void {
        if (event.target instanceof HTMLButtonElement) {
            const tab = event.target.dataset['tab'];
            this._tab = Number.isNaN(tab) ? this._tab : Number(tab);
        }
    }

    protected render(): unknown {
        return html`
            <div
                class="fixed top-1/2 left-1/2 z-max max-h-[80vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4"
            >
                <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow">
                    ${this.header()}
                    <div class="flex-1 overflow-auto p-4">${this._tab === 0 ? this.consentTab() : null}</div>
                    ${this.footer()}
                </div>
            </div>
        `;
    }

    protected header(): unknown {
        return html`
            <div class="grid shrink-0 grid-cols-3 border-b border-gray-200">
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="0"
                    aria-selected="${this._tab === 0}"
                    @click="${this._onTabSelected}"
                >
                    Consenso
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    Personalizza
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="2"
                    aria-selected="${this._tab === 2}"
                    @click="${this._onTabSelected}"
                >
                    Rifiuta
                </button>
                <div class="relative">
                    <hr
                        class="absolute -bottom-[1px] w-full transform border-t-4 border-highlight duration-300"
                        style="--tw-translate-x: ${this._tab * 100}%"
                    />
                </div>
            </div>
        `;
    }

    protected footer(): unknown {
        return html`
            <div class="grid shrink-0 grid-cols-3 gap-2 border-t border-gray-200 p-4">
                <div>
                    <button
                        class="block h-12 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100"
                    >
                        <slot name="customize-button">Customize</slot>
                    </button>
                </div>
                <div>
                    <button
                        class="block h-12 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100"
                    >
                        <slot name="refuse-button">Refuse</slot>
                    </button>
                </div>
                <div>
                    <button
                        class="block h-12 w-full bg-highlight text-sm font-bold text-white duration-300 hover:opacity-90"
                    >
                        <slot name="accept-all-button">Accept all</slot>
                    </button>
                </div>
            </div>
        `;
    }

    protected consentTab(): unknown {
        return html`
            <div>
                <div class="text-sm font-bold">
                    <slot name="title">This site uses cookies</slot>
                </div>
                <div class="mt-2 text-sm">
                    <slot name="message">
                        We use cookies to customize content and ads, to provide social media features and to analyze our
                        traffic. We also share information about your use of our site with our social media, advertising
                        and analytics partners who may combine it with other information that you've provided to them or
                        that they've collected from your use of their services.
                    </slot>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'cookie-solution-banner': CookieSolutionBanner;
    }
}
