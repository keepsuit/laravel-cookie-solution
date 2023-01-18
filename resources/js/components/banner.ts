import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleSheet } from '../style';
import { readCookie, setCookie } from '../utils/cookie';
import { CookieConfig, CookiePurpose, CookieSolutionConfig } from '../types';

interface AcceptStatus {
    timestamp: string;
    purposes: Record<CookiePurpose, boolean>;
}

type ShowModalStatus = 'hidden' | 'hiding' | 'showing' | 'visible';

function newEmptyStatus(): AcceptStatus {
    return {
        timestamp: new Date().toISOString(),
        purposes: {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false,
        },
    };
}

@customElement('cookie-solution-banner')
export class CookieSolutionBanner extends LitElement {
    static styles = [styleSheet];

    @property({ type: String, attribute: 'cookie-name' })
    cookieName: string = 'laravel_cookie_solution';

    @state()
    private _config?: CookieSolutionConfig;

    @state()
    private _showModal = false;

    @state()
    private _showModalStatus: ShowModalStatus = 'hidden';

    @state()
    private _tab = 0;

    @state()
    private _status: AcceptStatus | undefined = undefined;

    connectedCallback() {
        super.connectedCallback();

        this._loadConfig();
        this._loadStatus();

        if (!this._status) {
            this.show();
        }
    }

    private _loadConfig(): void {
        this._config = window._cookieSolution;
    }

    private _loadStatus(): void {
        const status = readCookie(this.cookieName);
        this._status = status ? JSON.parse(status) : undefined;
    }

    private _saveStatus(): void {
        setCookie(this.cookieName, JSON.stringify(this._status), 365);
    }

    private show(): void {
        this._showModal = true;
        this._showModalStatus = 'showing';
        setTimeout(() => (this._showModalStatus = 'visible'), 1);
    }

    private hide(): void {
        this._showModalStatus = 'hiding';

        const dialog = this.renderRoot.querySelector('[role="dialog"]');
        if (dialog instanceof HTMLElement) {
            dialog.addEventListener(
                'transitionend',
                () => {
                    this._showModalStatus = 'hidden';
                    this._showModal = false;
                },
                { once: true }
            );
        }

        setTimeout(() => {
            this._showModalStatus = 'hidden';
            this._showModal = false;
        }, 500);
    }

    private _onTabSelected(event: Event): void {
        if (event.target instanceof HTMLButtonElement) {
            const tab = event.target.dataset['tab'];
            this._tab = Number.isNaN(tab) ? this._tab : Number(tab);
        }
    }

    private _onAcceptAll(): void {
        this._status = {
            timestamp: new Date().toISOString(),
            purposes: {
                necessary: true,
                preferences: true,
                statistics: true,
                marketing: true,
            },
        };

        this._saveStatus();
        this.hide();
    }

    private _onAcceptSelected(): void {
        if (!this._status) {
            this._status = newEmptyStatus();
        }

        this._status.timestamp = new Date().toISOString();

        this._saveStatus();
        this.hide();
    }

    private _onRefuse(): void {
        this._status = newEmptyStatus();

        this._saveStatus();
        this.hide();
    }

    private _onPurposeChange(purpose: CookiePurpose, value: boolean): void {
        if (!this._status) {
            this._status = newEmptyStatus();
        }

        this._status.purposes[purpose] = value;
    }

    protected render(): unknown {
        if (!this._showModal) {
            return this.modalToggle();
        }

        return html`
            <div
                role="dialog"
                class="${this._showModalStatus === 'showing' || this._showModalStatus === 'hiding'
                    ? 'opacity-0 scale-75'
                    : ''} fixed top-1/2 left-1/2 z-max max-h-[80vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300"
            >
                <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow">
                    ${this.header()}
                    <div class="flex-1 overflow-auto p-4">
                        ${this._tab === 0 ? this.consentTab() : null} ${this._tab === 1 ? this.customizeTab() : null}
                    </div>
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
                    ${this._config?.texts?.tab_consent ?? 'Consent'}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config?.texts?.tab_customize ?? 'Customize'}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="2"
                    aria-selected="${this._tab === 2}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config?.texts?.tab_information ?? 'Information'}
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
        const customizeButton = html`
            <div>
                <button
                    class="block h-12 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100"
                    @click="${() => (this._tab = 1)}"
                >
                    ${this._config?.texts?.button_customize ?? 'Customize'}
                </button>
            </div>
        `;

        const acceptSelectedButton = html`
            <div>
                <button
                    class="block h-12 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100"
                    @click="${this._onAcceptSelected}"
                >
                    ${this._config?.texts?.button_accept_selected ?? 'Accept selected'}
                </button>
            </div>
        `;

        return html`
            <div class="grid shrink-0 grid-cols-3 gap-2 border-t border-gray-200 p-4">
                <div>
                    <button
                        class="block h-12 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100"
                        @click="${this._onRefuse}"
                    >
                        ${this._config?.texts?.button_refuse ?? 'Refuse'}
                    </button>
                </div>
                ${this._tab === 1 ? acceptSelectedButton : customizeButton}
                <div>
                    <button
                        class="block h-12 w-full bg-highlight text-sm font-bold text-white duration-300 hover:opacity-90"
                        @click="${this._onAcceptAll}"
                    >
                        ${this._config?.texts?.button_accept_all ?? 'Accept all'}
                    </button>
                </div>
            </div>
        `;
    }

    protected consentTab(): unknown {
        return html`
            <div>
                <div class="text-sm font-bold">${this._config?.texts?.consent_title ?? 'This site uses cookies'}</div>
                <div class="mt-2 text-sm">
                    ${this._config?.texts?.consent_message ??
                    `
                        We use cookies to customize content and ads, to provide social media features and to analyze our
                        traffic. We also share information about your use of our site with our social media, advertising
                        and analytics partners who may combine it with other information that you've provided to them or
                        that they've collected from your use of their services.
                    `}
                </div>
            </div>
        `;
    }

    protected customizeTab(): unknown {
        return html`
            <div class="divide-y divide-gray-100">
                <div class="flex h-16 items-center">
                    <div class="flex-1">Necessari</div>
                    <div>
                        <cookie-solution-toggle checked readonly></cookie-solution-toggle>
                    </div>
                </div>
                <div class="flex h-16 items-center">
                    <div class="flex-1">Preferenze</div>
                    <div>
                        <cookie-solution-toggle
                            ?checked="${this._status?.purposes?.preferences}"
                            @change="${($event: CustomEvent) => this._onPurposeChange('preferences', $event.detail)}"
                        ></cookie-solution-toggle>
                    </div>
                </div>
                <div class="flex h-16 items-center">
                    <div class="flex-1">Statistiche</div>
                    <div>
                        <cookie-solution-toggle
                            ?checked="${this._status?.purposes?.statistics}"
                            @change="${($event: CustomEvent) => this._onPurposeChange('statistics', $event.detail)}"
                        ></cookie-solution-toggle>
                    </div>
                </div>
                <div class="flex h-16 items-center">
                    <div class="flex-1">Marketing</div>
                    <div>
                        <cookie-solution-toggle
                            ?checked="${this._status?.purposes?.marketing}"
                            @change="${($event: CustomEvent) => this._onPurposeChange('marketing', $event.detail)}"
                        ></cookie-solution-toggle>
                    </div>
                </div>
            </div>
        `;
    }

    protected modalToggle(): unknown {
        return html`
            <div class="fixed bottom-4 right-4 z-max">
                <button
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow hover:shadow-xl"
                    @click="${() => this.show()}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-highlight" viewBox="0 0 48 48">
                        <path
                            d="M21 20.1q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9Zm-4 10q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9ZM30 32q.85 0 1.425-.575Q32 30.85 32 30q0-.85-.575-1.425Q30.85 28 30 28q-.85 0-1.425.575Q28 29.15 28 30q0 .85.575 1.425Q29.15 32 30 32Zm-6 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.6 1.95-8.6t5.225-6.775q3.275-2.775 7.55-4T27.6 4.3q-.3 2.25.4 4.25t2.125 3.4q1.425 1.4 3.425 2.05 2 .65 4.2.3-1 3.05 1.1 5.475t5.1 2.675q.4 4.35-1.025 8.25-1.425 3.9-4.175 6.85-2.75 2.95-6.55 4.7T24 44Zm0-3q7.1 0 11.8-4.675 4.7-4.675 5.25-11.525-2.7-1-4.375-2.975Q35 19.85 34.6 17.3q-4.05-.55-6.825-3.5Q25 10.85 24.6 6.95q-3.7-.15-6.925 1.2-3.225 1.35-5.6 3.7Q9.7 14.2 8.35 17.375 7 20.55 7 24q0 7.1 4.95 12.05Q16.9 41 24 41Zm.05-17.25Z"
                        />
                    </svg>
                </button>
            </div>
        `;
    }
}
