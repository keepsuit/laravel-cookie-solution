import './duration';
import './toggle';
import './collapsable';

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleSheet } from '../style';
import { readCookie, setCookie } from '../utils/cookie';
import { CookieConfig, CookiePurpose, CookieSolutionConfig } from '../types';
import clsx from 'clsx';

interface AcceptStatus {
    timestamp: string;
    digest?: string;
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
    private _configHash?: string;

    @state()
    private _showModal = false;

    @state()
    private _showModalStatus: ShowModalStatus = 'hidden';

    @state()
    private _tab = 0;

    @state()
    private _status: AcceptStatus | undefined = undefined;

    async connectedCallback() {
        super.connectedCallback();

        await this._loadConfig();
        this._loadStatus();

        if (!this._config) {
            console.error('CookieSolution: No configuration found.');
            return;
        }

        if (!this._status) {
            this.show();
        }
    }

    private async _loadConfig(): Promise<void> {
        this._config = window._cookieSolution;
        this._configHash = await this._generateConfigHash();
    }

    private async _generateConfigHash(): Promise<string | undefined> {
        if (!this._config) {
            return undefined;
        }

        if (crypto.subtle == undefined) {
            return undefined;
        }

        try {
            const data = new TextEncoder().encode(JSON.stringify(this._config.cookies));

            const hash = await crypto.subtle.digest('SHA-256', data);

            return Array.from(new Uint8Array(hash))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (e) {
            return undefined;
        }
    }

    private _loadStatus(): void {
        const status = readCookie(this.cookieName);
        this._status = status ? JSON.parse(status) : undefined;

        if (this._configHash != undefined && this._configHash !== this._status?.digest) {
            this._status = undefined;
        }

        this._emitStatusChange();
    }

    private _saveStatus(): void {
        if (!this._status) {
            return;
        }

        this._status.digest = this._configHash;

        setCookie(this.cookieName, JSON.stringify(this._status), 365);

        this._emitStatusChange();
    }

    private _emitStatusChange(): void {
        this.dispatchEvent(
            new CustomEvent('cookie-solution-status-change', {
                detail: this._status,
            })
        );

        try {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    ad_storage: this._status?.purposes.marketing ? 'granted' : 'denied',
                    analytics_storage: this._status?.purposes.statistics ? 'granted' : 'denied',
                    functionality_storage: this._status?.purposes.necessary ? 'granted' : 'denied',
                    personalization_storage: this._status?.purposes.preferences ? 'granted' : 'denied',
                });
            }
        } catch (e) {}

        try {
            if (typeof fbq === 'function') {
                fbq('consent', this._status?.purposes.marketing ? 'grant' : 'revoke');
            }
        } catch (e) {}
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
                preferences: this._config != undefined && this._config.cookies.preferences.length > 0,
                statistics: this._config != undefined && this._config.cookies.statistics.length > 0,
                marketing: this._config != undefined && this._config.cookies.marketing.length > 0,
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
        if (!this._config) {
            return null;
        }

        if (!this._showModal) {
            return this.modalToggle();
        }

        return html`
            <div class="fixed inset-0 z-max bg-gray-900/30">
                <div
                    role="dialog"
                    class="${clsx({
                        'opacity-0 scale-75': this._showModalStatus === 'showing' || this._showModalStatus === 'hiding',
                        'fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300':
                            true,
                    })}"
                >
                    <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow">
                        ${this.header()}
                        <div class="flex-1 overflow-auto p-4">
                            ${this._tab === 0 ? this.consentTab() : null}
                            ${this._tab === 1 ? this.customizeTab() : null}
                            ${this._tab === 2 ? this.informationTab() : null}
                        </div>
                        ${this.footer()}
                    </div>
                </div>
            </div>
        `;
    }

    protected header(): unknown {
        if (!this._config) {
            return;
        }

        return html`
            <div class="grid shrink-0 grid-cols-3 border-b border-gray-200">
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="0"
                    aria-selected="${this._tab === 0}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_consent}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_customize}
                </button>
                <button
                    class="h-14 w-full text-sm font-medium duration-300 aria-selected:text-highlight"
                    role="tab"
                    data-tab="2"
                    aria-selected="${this._tab === 2}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_information}
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
        if (!this._config) {
            return;
        }

        const customizeButton = html`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${() => (this._tab = 1)}"
                >
                    ${this._config.texts.button_customize}
                </button>
            </div>
        `;

        const acceptSelectedButton = html`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${this._onAcceptSelected}"
                >
                    ${this._config.texts.button_accept_selected}
                </button>
            </div>
        `;

        return html`
            <div class="grid shrink-0 gap-2 border-t border-gray-200 p-4 md:grid-cols-3">
                <div>
                    <button
                        class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                        @click="${this._onRefuse}"
                    >
                        ${this._config.texts.button_refuse}
                    </button>
                </div>
                ${this._tab === 1 ? acceptSelectedButton : customizeButton}
                <div>
                    <button
                        class="block h-10 w-full bg-highlight text-sm font-bold text-white duration-300 hover:opacity-90 md:h-12"
                        @click="${this._onAcceptAll}"
                    >
                        ${this._config.texts.button_accept_all}
                    </button>
                </div>
            </div>
        `;
    }

    protected consentTab(): unknown {
        if (!this._config) {
            return;
        }

        return html`
            <div>
                <div class="text-sm font-bold">${this._config.texts.consent_title}</div>
                <div class="mt-2 text-sm">${this._config.texts.consent_message}</div>
            </div>
        `;
    }

    protected customizeTab(): unknown {
        if (!this._config) {
            return null;
        }

        return html`
            <div class="divide-y divide-gray-100">
                ${this.cookiePurposeRow('necessary')}
                ${this._config.cookies.preferences.length > 0 ? this.cookiePurposeRow('preferences') : null}
                ${this._config.cookies.statistics.length > 0 ? this.cookiePurposeRow('statistics') : null}
                ${this._config.cookies.marketing.length > 0 ? this.cookiePurposeRow('marketing') : null}
            </div>
        `;
    }

    protected informationTab(): unknown {
        if (!this._config) {
            return null;
        }

        return html` <div class="prose prose-sm">${unsafeHTML(this._config.texts.information_text)}</div> `;
    }

    protected modalToggle(): unknown {
        return html`
            <div class="fixed bottom-4 right-4 z-max">
                <button
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-white p-2 shadow hover:shadow-xl"
                    @click="${() => this.show()}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-highlight w-full h-full" viewBox="0 0 48 48">
                        <path
                            d="M21 20.1q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9Zm-4 10q1.3 0 2.2-.9.9-.9.9-2.2 0-1.3-.9-2.2-.9-.9-2.2-.9-1.3 0-2.2.9-.9.9-.9 2.2 0 1.3.9 2.2.9.9 2.2.9ZM30 32q.85 0 1.425-.575Q32 30.85 32 30q0-.85-.575-1.425Q30.85 28 30 28q-.85 0-1.425.575Q28 29.15 28 30q0 .85.575 1.425Q29.15 32 30 32Zm-6 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.6 1.95-8.6t5.225-6.775q3.275-2.775 7.55-4T27.6 4.3q-.3 2.25.4 4.25t2.125 3.4q1.425 1.4 3.425 2.05 2 .65 4.2.3-1 3.05 1.1 5.475t5.1 2.675q.4 4.35-1.025 8.25-1.425 3.9-4.175 6.85-2.75 2.95-6.55 4.7T24 44Zm0-3q7.1 0 11.8-4.675 4.7-4.675 5.25-11.525-2.7-1-4.375-2.975Q35 19.85 34.6 17.3q-4.05-.55-6.825-3.5Q25 10.85 24.6 6.95q-3.7-.15-6.925 1.2-3.225 1.35-5.6 3.7Q9.7 14.2 8.35 17.375 7 20.55 7 24q0 7.1 4.95 12.05Q16.9 41 24 41Zm.05-17.25Z"
                        />
                    </svg>
                </button>
            </div>
        `;
    }

    protected cookiePurposeRow(purpose: CookiePurpose): unknown {
        if (!this._config) {
            return;
        }

        const hasCookies = this._config.cookies[purpose].length > 0;

        const dispatchOpenEvent = (event: Event) =>
            event.target?.dispatchEvent(
                new CustomEvent('toggle-open', {
                    bubbles: true,
                    composed: true,
                })
            );

        return html`
            <cookie-solution-collapsable>
                <div class="flex gap-8">
                    <div class="flex h-12 flex-1 items-center">
                        ${hasCookies
                            ? html`
                                  <button @click="${dispatchOpenEvent}">
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 48 48"
                                          class="mr-4 h-6 w-6 fill-current"
                                      >
                                          <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                      </svg>
                                  </button>
                              `
                            : html` <div class="md:mr-4 md:w-6"></div>`}

                        <button
                            class="${clsx({
                                'block flex h-12 items-center text-sm font-bold': true,
                                'cursor-default': !hasCookies,
                            })}"
                            @click="${hasCookies ? dispatchOpenEvent : undefined}"
                        >
                            ${this._config.texts[`customize_purpose_${purpose}`]}
                        </button>
                    </div>
                    <div class="flex h-12 w-12 items-center">
                        ${purpose === 'necessary'
                            ? html` <cookie-solution-toggle checked readonly></cookie-solution-toggle> `
                            : html`
                                  <cookie-solution-toggle
                                      ?checked="${this._status?.purposes?.[purpose]}"
                                      @change="${($event: CustomEvent) =>
                                          this._onPurposeChange(purpose, $event.detail)}"
                                  ></cookie-solution-toggle>
                              `}
                    </div>
                </div>

                <div class="mb-4 md:pl-10 md:pr-20">
                    <p class="text-sm text-gray-800">
                        ${this._config.texts[`customize_purpose_${purpose}_description`]}
                    </p>
                </div>

                <div slot="content">
                    <div class="mb-8 md:ml-10 md:mr-16">
                        ${this._config.cookies[purpose].map(
                            (service) => html`
                                <div class="mt-4 border-l-4 border-gray-300 px-4">
                                    <div>
                                        <span class="block text-sm font-medium md:inline">${service.name}</span>
                                        <span class="block text-xs md:inline md:text-sm">(${service.provider})</span>
                                    </div>
                                    <div class="mt-2 divide-y divide-gray-100">
                                        ${service.cookies.map((cookie) => this.cookieRow(cookie))}
                                    </div>
                                </div>
                            `
                        )}
                    </div>
                </div>
            </cookie-solution-collapsable>
        `;
    }

    protected cookieRow(cookie: CookieConfig): unknown {
        return html`
            <div class="grid grid-cols-2 items-center gap-2 py-1 sm:grid-cols-4">
                <div>
                    <span class="text-xs font-bold italic">${cookie.name}</span>
                </div>
                <div class="flex justify-end sm:justify-start">
                    <span class="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                        <cookie-solution-duration duration="${cookie.duration}"></cookie-solution-duration>
                    </span>
                </div>
                <div class="col-span-2 text-xs">${cookie.description}</div>
            </div>
        `;
    }
}
