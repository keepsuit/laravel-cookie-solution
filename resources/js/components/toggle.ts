import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import clsx from 'clsx';
import { styleSheet } from '../style';

@customElement('cookie-solution-toggle')
export class CookieSolutionToggle extends LitElement {
    static styles = [styleSheet];

    @property({ type: String })
    position = 'right';

    @property({ type: String })
    label: string | undefined = undefined;

    private _open(): void {
        this.dispatchEvent(
            new CustomEvent('open', {
                bubbles: true,
                composed: true,
            }),
        );
    }

    protected render(): unknown {
        return html`
            <div
                part="toggle-root"
                class="${clsx(
                    'fixed bottom-toggle-bottom z-toggle print:hidden',
                    this.position === 'left' ? 'left-toggle-x' : 'right-toggle-x',
                )}"
            >
                <button
                    part="toggle-button"
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow hover:shadow-xl"
                    aria-label="${this.label}"
                    @click="${this._open}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-full w-full fill-highlight" viewBox="0 0 48 48">
                        <path
                            d="M21 20.1q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9Zm-4 10q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9ZM30 32q.85 0 1.425-.575Q32 30.85 32 30q0-.85-.575-1.425Q30.85 28 30 28q-.85 0-1.425.575Q28 29.15 28 30q0 .85.575 1.425Q29.15 32 30 32Zm-6 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.6 1.95-8.6t5.225-6.775q3.275-2.775 7.55-4T27.6 4.3q-.3 2.25.4 4.25t2.125 3.4q1.425 1.4 3.425 2.05 2 .65 4.2.3-1 3.05 1.1 5.475t5.1 2.675q.4 4.35-1.025 8.25-1.425 3.9-4.175 6.85-2.75 2.95-6.55 4.7T24 44Zm0-3q7.1 0 11.8-4.675 4.7-4.675 5.25-11.525-2.7-1-4.375-2.975Q35 19.85 34.6 17.3q-4.05-.55-6.825-3.5Q25 10.85 24.6 6.95q-3.7-.15-6.925 1.2-3.225 1.35-5.6 3.7Q9.7 14.2 8.35 17.375 7 20.55 7 24q0 7.1 4.95 12.05Q16.9 41 24 41Zm.05-17.25Z"
                        />
                    </svg>
                </button>
            </div>
        `;
    }
}
