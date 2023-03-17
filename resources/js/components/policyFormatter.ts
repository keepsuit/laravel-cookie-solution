import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { styleSheet } from '../style';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

@customElement('cookie-solution-policy-formatter')
export class CookieSolutionPolicyFormatter extends LitElement {
    static styles = [styleSheet];

    async connectedCallback() {
        super.connectedCallback();
    }

    protected render(): unknown {
        return html` <div>${unsafeHTML(this.innerHTML)}</div> `;
    }
}
