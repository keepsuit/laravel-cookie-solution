import { LitElement, html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleSheet } from '../style';
import { deleteCookie, readStatus, writeStatus } from '../utils/cookie';
import { CookieConfig, CookiePurpose, CookieSolutionConfig, CookieSolutionStatus } from '../types';
import clsx from 'clsx';
import { getContrastColor } from '../utils/colorContrast';

type ShowModalStatus = 'hidden' | 'hiding' | 'showing' | 'visible';

function newEmptyStatus(): CookieSolutionStatus {
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

export class CookieSolutionBanner extends LitElement {
    static styles = [styleSheet];

    protected disconnectedController?: AbortController;

    @property({ attribute: false })
    config?: CookieSolutionConfig;

    @state()
    private _showModal = false;

    @state()
    private _showModalStatus: ShowModalStatus = 'hidden';

    @state()
    private _tab = 0;

    @state()
    private _contrastColor: 'black' | 'white' = 'white';

    @state()
    private _status: CookieSolutionStatus | undefined = undefined;

    connectedCallback() {
        super.connectedCallback();

        this.disconnectedController = new AbortController();

        this._initListeners();

        this.config ??= window._cookieSolution;

        if (!this.config) {
            console.error('CookieSolution: No configuration found.');
        }
    }

    disconnectedCallback() {
        this.disconnectedController?.abort();

        super.disconnectedCallback();
    }

    protected willUpdate(changed: PropertyValues<this>): void {
        if (!changed.has('config') || !this.config) {
            return;
        }

        this._loadContrastColor();

        const previous = changed.get('config');

        // A new config with the same cookie (e.g. locale change) only updates texts.
        if (previous?.digest === this.config.digest && previous?.cookie_name === this.config.cookie_name) {
            return;
        }

        this._loadStatus();

        if (!this._status) {
            this.show();
        }
    }

    private _initListeners(): void {
        document.addEventListener(
            'click',
            (event) => {
                if (!(event.target instanceof Element) || !event.target.closest('[data-cookie-solution-toggle]')) {
                    return;
                }

                event.preventDefault();

                this.show();
            },
            { signal: this.disconnectedController?.signal },
        );
    }

    private _loadContrastColor(): void {
        const highlightColor = getComputedStyle(this).getPropertyValue('--cs--color-highlight');

        this._contrastColor = getContrastColor(highlightColor);
    }

    private _loadStatus(): void {
        if (!this.config) {
            return;
        }

        this._status = readStatus(this.config);

        if (!this._status) {
            deleteCookie(this.config.cookie_name);
        }

        this._emitStatusChange();
    }

    private _saveStatus(): void {
        if (!this._status || !this.config) {
            return;
        }

        writeStatus(this.config, this._status);

        this._emitStatusChange();
    }

    private _emitStatusChange(): void {
        if (this._status == null) {
            return;
        }

        this.dispatchEvent(
            new CustomEvent('cookie-solution-status-change', {
                bubbles: true,
                // Listeners must not share the banner's state object.
                detail: structuredClone(this._status),
            }),
        );
    }

    show(): void {
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
                { once: true },
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
                preferences: this.config != undefined && this.config.services.preferences.length > 0,
                statistics: this.config != undefined && this.config.services.statistics.length > 0,
                marketing: this.config != undefined && this.config.services.marketing.length > 0,
            },
        };

        this._saveStatus();
        this.hide();
    }

    private _onAcceptSelected(): void {
        this._status = { ...(this._status ?? newEmptyStatus()), timestamp: new Date().toISOString() };

        this._saveStatus();
        this.hide();
    }

    private _onRefuse(): void {
        this._status = newEmptyStatus();

        this._saveStatus();
        this.hide();
    }

    private _onPurposeChange(purpose: CookiePurpose, value: boolean): void {
        const status = this._status ?? newEmptyStatus();

        this._status = { ...status, purposes: { ...status.purposes, [purpose]: value } };
    }

    protected render(): unknown {
        if (!this.config) {
            return null;
        }

        if (!this._showModal) {
            return !this.config.toggle_enabled ? null : this.modalToggle();
        }

        return html`
            <div class="fixed inset-0 z-max bg-gray-900/30 print:hidden" part="banner-root">
                <div
                    part="banner-dialog"
                    role="dialog"
                    aria-labelledby="cookie-solution-consent-title"
                    class="${clsx({
                        'opacity-0 scale-75': this._showModalStatus === 'showing' || this._showModalStatus === 'hiding',
                        'fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300': true,
                    })}"
                >
                    <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow-sm">
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
        if (!this.config) {
            return;
        }

        return html`
            <div class="relative">
                <div class="grid shrink-0 grid-cols-3 border-b border-gray-200" role="tablist">
                    <button
                        class="${clsx('h-14 w-full text-sm font-medium duration-300', {
                            'aria-selected:text-highlight': this._contrastColor === 'white',
                        })}"
                        role="tab"
                        data-tab="0"
                        aria-selected="${this._tab === 0}"
                        @click="${this._onTabSelected}"
                    >
                        ${this.config.texts.tab_consent}
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
                        ${this.config.texts.tab_customize}
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
                        ${this.config.texts.tab_information}
                    </button>
                </div>
                <hr
                    class="absolute -bottom-[1px] w-1/3 border-t-4 border-highlight duration-300"
                    style="${`translate: ${this._tab * 100}% 0`}"
                />
            </div>
        `;
    }

    protected footer(): unknown {
        if (!this.config) {
            return;
        }

        const customizeButton = html`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${() => (this._tab = 1)}"
                >
                    ${this.config.texts.button_customize}
                </button>
            </div>
        `;

        const acceptSelectedButton = html`
            <div>
                <button
                    class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                    @click="${this._onAcceptSelected}"
                >
                    ${this.config.texts.button_accept_selected}
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
                        ${this.config.texts.button_refuse}
                    </button>
                </div>
                ${this._tab === 1 ? acceptSelectedButton : customizeButton}
                <div>
                    <button
                        class="block h-10 w-full border-2 border-highlight text-sm font-medium duration-300 hover:bg-gray-100 md:h-12"
                        @click="${this._onAcceptAll}"
                    >
                        ${this.config.texts.button_accept_all}
                    </button>
                </div>
            </div>
        `;
    }

    protected consentTab(): unknown {
        if (!this.config) {
            return;
        }

        return html`
            <div part="banner-tab-consent">
                <div id="cookie-solution-consent-title" class="text-sm font-bold">
                    ${this.config.texts.consent_title}
                </div>
                <div class="mt-2 text-sm">${this.config.texts.consent_message}</div>
            </div>
        `;
    }

    protected customizeTab(): unknown {
        if (!this.config) {
            return null;
        }

        return html`
            <div class="divide-y divide-gray-100" part="banner-tab-customize">
                ${this.cookiePurposeRow('necessary')}
                ${this.config.services.preferences.length > 0 ? this.cookiePurposeRow('preferences') : null}
                ${this.config.services.statistics.length > 0 ? this.cookiePurposeRow('statistics') : null}
                ${this.config.services.marketing.length > 0 ? this.cookiePurposeRow('marketing') : null}
            </div>
        `;
    }

    protected informationTab(): unknown {
        if (!this.config) {
            return null;
        }

        return html`
            <div class="prose prose-sm" part="banner-tab-information">
                ${unsafeHTML(this.config.texts.information_text)}
            </div>
        `;
    }

    protected modalToggle(): unknown {
        return html`
            <cookie-solution-toggle
                exportparts="toggle-root, toggle-button"
                position="${this.config?.toggle_position}"
                label="${this.config?.texts.button_show_banner}"
                @open="${this.show}"
            ></cookie-solution-toggle>
        `;
    }

    protected cookiePurposeRow(purpose: CookiePurpose): unknown {
        if (!this.config) {
            return;
        }

        const hasCookies = this.config.services[purpose].length > 0;

        const dispatchOpenEvent = (event: Event) =>
            event.target?.dispatchEvent(
                new CustomEvent('toggle-open', {
                    bubbles: true,
                    composed: true,
                }),
            );

        return html`
            <cookie-solution--collapsable>
                <div class="flex gap-8">
                    <div class="flex h-12 flex-1 items-center">
                        ${
                            hasCookies
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
                                : html` <div class="md:mr-4 md:w-6"></div>`
                        }

                        <button
                            class="${clsx({
                                'block flex h-12 items-center text-sm font-bold': true,
                                'cursor-default': !hasCookies,
                            })}"
                            @click="${hasCookies ? dispatchOpenEvent : undefined}"
                        >
                            ${this.config.texts[`customize_purpose_${purpose}`]}
                        </button>
                    </div>
                    <div class="flex h-12 w-12 items-center">
                        ${
                            purpose === 'necessary'
                                ? html` <cookie-solution--switch checked readonly></cookie-solution--switch> `
                                : html`
                                      <cookie-solution--switch
                                          ?checked="${this._status?.purposes?.[purpose]}"
                                          @change="${($event: CustomEvent) =>
                                              this._onPurposeChange(purpose, $event.detail)}"
                                      ></cookie-solution--switch>
                                  `
                        }
                    </div>
                </div>

                <div class="mb-4 md:pr-20 md:pl-10">
                    <p class="text-sm text-gray-800">
                        ${this.config.texts[`customize_purpose_${purpose}_description`]}
                    </p>
                </div>

                <div slot="content">
                    <div class="mb-8 md:mr-16 md:ml-10">
                        ${this.config.services[purpose].map(
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
                            `,
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
                        <cookie-solution-duration
                            duration="${cookie.duration}"
                            locale="${this.config?.locale}"
                            session-label="${this.config?.texts.duration_session}"
                        ></cookie-solution-duration>
                    </span>
                </div>
                <div class="col-span-2 text-xs">${cookie.description}</div>
            </div>
        `;
    }
}
