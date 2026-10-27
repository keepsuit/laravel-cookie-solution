import { html, LitElement } from 'lit';
import { styleSheet } from '../style';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

export class CookieSolutionPolicyFormatter extends LitElement {
    static styles = [styleSheet];

    async connectedCallback() {
        super.connectedCallback();
    }

    protected render(): unknown {
        return html` <div>${unsafeHTML(this.innerHTML)}</div> `;
    }
}
