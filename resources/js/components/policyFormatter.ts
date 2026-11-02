import { html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { styleSheet } from '../style';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class CookieSolutionPolicyFormatter extends LitElement {
    static styles = [styleSheet];

    /** Any CSS color; without it the page's `--cs--color-highlight` applies. */
    @property({ type: String, attribute: 'highlight-color' })
    highlightColor: string | null = null;

    protected willUpdate(changed: PropertyValues<this>): void {
        if (this.highlightColor) {
            this.style.setProperty('--cs--color-highlight', this.highlightColor);
        } else if (changed.get('highlightColor')) {
            // Only what the attribute set: an inline variable set by the page stays.
            this.style.removeProperty('--cs--color-highlight');
        }
    }

    protected render(): unknown {
        return html` <div>${unsafeHTML(this.innerHTML)}</div> `;
    }
}
