import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { styleSheet } from '../style';
import type { CookiePurpose, CookieSolutionConfig } from '../types';

/** Shown in place of an iframe waiting for consent; dispatches `grant` when its button is clicked. */
export class CookieSolutionEmbedPlaceholder extends LitElement {
    static styles = [
        styleSheet,
        css`
            :host {
                display: block;
                box-sizing: border-box;
                max-width: 100%;
                width: var(--cs-embed-width, auto);
                height: var(--cs-embed-height, auto);
            }
        `,
    ];

    @property({ attribute: false })
    config?: CookieSolutionConfig;

    @property({ attribute: false })
    purposes: CookiePurpose[] = [];

    protected willUpdate(changed: PropertyValues<this>): void {
        if (!changed.has('config') || !this.config) {
            return;
        }

        this.setAttribute('color-scheme', this.config.color_scheme ?? 'light');
        if (this.config.highlight_color) {
            this.style.setProperty('--cs--color-highlight', this.config.highlight_color);
        } else {
            this.style.removeProperty('--cs--color-highlight');
        }
    }

    private _grant(): void {
        this.dispatchEvent(new CustomEvent('grant'));
    }

    protected render(): unknown {
        const texts = this.config?.embed_texts;

        if (!texts) {
            return null;
        }

        const purposes = this.purposes.map((purpose) => texts.purposes[purpose]).join(', ');

        return html`
            <div
                part="embed-placeholder-root"
                class="flex size-full flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-700"
            >
                <p part="embed-placeholder-message" class="max-w-prose">
                    ${texts.message.replace(':purposes', purposes)}
                </p>
                <button
                    part="embed-placeholder-button"
                    type="button"
                    class="min-h-11 rounded-lg border border-transparent bg-highlight-text px-5 py-2 text-sm font-semibold text-on-highlight duration-300 hover:ring-4 hover:ring-highlight/25"
                    @click="${this._grant}"
                >
                    ${texts.button}
                </button>
            </div>
        `;
    }
}
