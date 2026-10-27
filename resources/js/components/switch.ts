import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { styleSheet } from '../style';
import clsx from 'clsx';

export class CookieSolutionSwitch extends LitElement {
    static styles = [styleSheet];

    @property({ type: Boolean })
    checked = false;

    @property({ type: Boolean })
    disabled: boolean = false;

    @property({ type: Boolean })
    readonly: boolean = false;

    @property({ type: String })
    label: string | undefined = undefined;

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
            }),
        );
    }

    protected render(): unknown {
        return html`
            <button
                type="button"
                role="switch"
                aria-checked="${this.checked}"
                aria-disabled="${this.disabled || this.readonly}"
                aria-label="${this.label}"
                @click="${this._onClick}"
                class="${clsx({
                    'flex h-6 w-11 cursor-pointer items-center rounded-full px-0.5 duration-300 focus:shadow-sm': true,
                    'opacity-50': this.readonly,
                    'bg-highlight': this.checked,
                    'bg-gray-200': !this.checked,
                })}"
            >
                <span
                    class="${clsx({
                        'block h-5 w-5 transform rounded-full duration-300': true,
                        'translate-x-5 bg-white': this.checked,
                        'bg-gray-400': !this.checked,
                    })}"
                ></span>
            </button>
        `;
    }
}
