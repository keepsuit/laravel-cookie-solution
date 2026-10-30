import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { styleSheet } from '../style';

export class CookieSolutionSwitch extends LitElement {
    static styles = [styleSheet];

    @property({ type: Boolean })
    checked = false;

    @property({ type: Boolean })
    readonly: boolean = false;

    @property({ type: String })
    label: string | undefined = undefined;

    private _onClick(): void {
        if (this.readonly) {
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
                aria-disabled="${this.readonly}"
                aria-label="${this.label}"
                @click="${this._onClick}"
                class="${this.readonly ? 'opacity-[var(--cs-scheme-readonly-opacity,50%)]' : ''} ${
                    this.checked ? 'border-highlight-text bg-highlight-text' : 'border-gray-500 bg-white'
                } flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 duration-300"
            >
                <span
                    class="${
                        this.checked
                            ? 'translate-x-5 bg-on-highlight forced-colors:bg-[Highlight]'
                            : 'bg-gray-500 forced-colors:bg-[ButtonText]'
                    } block size-5 rounded-full duration-300"
                ></span>
            </button>
        `;
    }
}
