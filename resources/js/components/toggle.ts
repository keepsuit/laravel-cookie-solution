import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleSheet } from '../style';

@customElement('cookie-solution-toggle')
export class CookieSolutionToggle extends LitElement {
    static styles = [styleSheet];

    @property({ type: Boolean })
    checked = false;

    @property({ type: Boolean })
    disabled: boolean = false;

    @property({ type: Boolean })
    readonly: boolean = false;

    private _onClick(): void {
        if (this.disabled || this.readonly) {
            return;
        }

        this.checked = !this.checked;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: this.checked,
                bubbles: true,
                composed: true,
            })
        );
    }

    protected render(): unknown {
        return html`
            <button
                type="button"
                role="switch"
                aria-checked="${this.checked}"
                @click="${this._onClick}"
                class="${this.checked
                    ? 'bg-highlight'
                    : 'bg-gray-200'} flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 duration-300 focus:shadow"
            >
                <span
                    class="${this.checked
                        ? 'translate-x-5 bg-white'
                        : 'bg-gray-400'} block h-5 w-5 transform rounded-full duration-300"
                ></span>
            </button>
        `;
    }
}
