import './toggle';
import './duration';
import './switch';
import './collapsable';

import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleSheet } from '../style';
import { readCookie, setCookie } from '../utils/cookie';
import { CookieConfig, CookiePurpose, CookieSolutionConfig } from '../types';
import clsx from 'clsx';
import { getContrastColor } from '../utils/colorContrast';

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
    private _showModal = false;

    @state()
    private _showModalStatus: ShowModalStatus = 'hidden';

    @state()
    private _tab = 0;

    @state()
    private _contrastColor: 'black' | 'white' = 'white';

    @state()
    private _status: AcceptStatus | undefined = undefined;

    @state()
    private _gtagRetries = 0;

    @state()
    private _fbqRetries = 0;

    async connectedCallback() {
        super.connectedCallback();

        await this._loadConfig();
        this._loadStatus();
        this._loadContrastColor();

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
    }

    private _loadContrastColor(): void {
        const highlightColor = getComputedStyle(this).getPropertyValue('--cs--color-highlight');

        this._contrastColor = getContrastColor(highlightColor);
    }

    private _loadStatus(): void {
        const status = readCookie(this.cookieName);
        this._status = status ? JSON.parse(status) : undefined;

        if (this._config?.digest != undefined && this._config.digest !== this._status?.digest) {
            this._status = undefined;
        }

        this._emitStatusChange();
    }

    private _saveStatus(): void {
        if (!this._status) {
            return;
        }

        this._status.digest = this._config?.digest;

        setCookie(this.cookieName, JSON.stringify(this._status), 365);

        this._emitStatusChange();
    }

    private _emitStatusChange(): void {
        this.dispatchEvent(
            new CustomEvent('cookie-solution-status-change', {
                bubbles: true,
                detail: this._status,
            })
        );

        const emitGtagEvent = () => {
            if (!this._config?.integrations?.google_tag_manager) {
                return;
            }

            if (this._gtagRetries > 10) {
                return;
            }

            if (typeof gtag !== 'function') {
                this._gtagRetries++;
                setTimeout(emitGtagEvent, 100 * this._gtagRetries);
                return;
            }

            try {
                gtag('consent', 'update', {
                    ad_storage: this._status?.purposes.marketing ? 'granted' : 'denied',
                    analytics_storage: this._status?.purposes.statistics ? 'granted' : 'denied',
                    functionality_storage: this._status?.purposes.necessary ? 'granted' : 'denied',
                    personalization_storage: this._status?.purposes.preferences ? 'granted' : 'denied',
                });
                window.dataLayer?.push({
                    event: 'cookie-solution-status-change',
                    status: this._status?.purposes,
                });
            } catch (e) {
                this._gtagRetries++;
                setTimeout(emitGtagEvent, 100 * this._gtagRetries);
            }
        };

        const emitFbqEvent = () => {
            if (!this._config?.integrations?.facebook_pixel) {
                return;
            }

            if (this._fbqRetries > 10) {
                return;
            }

            if (typeof fbq !== 'function') {
                this._fbqRetries++;
                setTimeout(emitFbqEvent, 100 * this._fbqRetries);
                return;
            }

            try {
                fbq('consent', this._status?.purposes.marketing ? 'grant' : 'revoke');
            } catch (e) {
                this._fbqRetries++;
                setTimeout(emitFbqEvent, 100 * this._fbqRetries);
            }
        };

        emitGtagEvent();
        emitFbqEvent();
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
                    class="${clsx('h-14 w-full text-sm font-medium duration-300', {
                        'aria-selected:text-highlight': this._contrastColor === 'white',
                    })}"
                    role="tab"
                    data-tab="0"
                    aria-selected="${this._tab === 0}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_consent}
                </button>
                <button
                    class="${clsx('h-14 w-full text-sm font-medium duration-300', {
                        'aria-selected:text-highlight': this._contrastColor === 'white',
                    })}"
                    role="tab"
                    data-tab="1"
                    aria-selected="${this._tab === 1}"
                    @click="${this._onTabSelected}"
                >
                    ${this._config.texts.tab_customize}
                </button>
                <button
                    class="${clsx('h-14 w-full text-sm font-medium duration-300', {
                        'aria-selected:text-highlight': this._contrastColor === 'white',
                    })}"
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
                        class="${clsx({
                            'block h-10 w-full bg-highlight text-sm font-bold duration-300 hover:opacity-90 md:h-12':
                                true,
                            'text-white': this._contrastColor === 'white',
                        })}"
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
            <cookie-solution-toggle
                position="${this._config?.toggle_position}"
                @open="${this.show}"
            ></cookie-solution-toggle>
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
            <cookie-solution--collapsable>
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
                            ? html` <cookie-solution--switch checked readonly></cookie-solution--switch> `
                            : html`
                                  <cookie-solution--switch
                                      ?checked="${this._status?.purposes?.[purpose]}"
                                      @change="${($event: CustomEvent) =>
                                          this._onPurposeChange(purpose, $event.detail)}"
                                  ></cookie-solution--switch>
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
            </cookie-solution--collapsable>
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
