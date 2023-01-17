import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleSheet } from './style';

@customElement('cookie-solution-banner')
class CookieSolutionBanner extends LitElement {
    static styles = [styleSheet];

    protected render(): unknown {
        return html`
            <div
                class="fixed top-1/2 left-1/2 z-max max-h-[80vh] max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4"
            >
                <div class="rounded-lg bg-white text-gray-900 shadow">
                    <div class="overflow-auto p-4">
                        <div class="col-span-2 text-sm font-bold">
                            <slot name="title">This site uses cookies</slot>
                        </div>
                        <div class="col-span-2 mt-2 text-sm">
                            <slot name="message">
                                We use cookies to customize content and ads, to provide social media features and to
                                analyze our traffic. We also share information about your use of our site with our
                                social media, advertising and analytics partners who may combine it with other
                                information that you've provided to them or that they've collected from your use of
                                their services.
                            </slot>
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-2 border-t border-gray-200 p-4">
                        <div>
                            <button
                                class="block h-12 w-full border-2 border-highlight text-sm font-medium hover:bg-gray-100"
                            >
                                <slot name="customize-button">Customize</slot>
                            </button>
                        </div>
                        <div>
                            <button
                                class="block h-12 w-full border-2 border-highlight text-sm font-medium hover:bg-gray-100"
                            >
                                <slot name="refuse-button">Refuse</slot>
                            </button>
                        </div>
                        <div>
                            <button
                                class="block h-12 w-full bg-highlight text-sm font-bold text-white hover:opacity-90"
                            >
                                <slot name="accept-all-button">Accept all</slot>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
