import { LitElement, html, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleSheet } from '../style';
import { deleteCookie, readStatus, writeStatus } from '../utils/cookie';
import { CookieConfig, CookiePurpose, CookieSolutionConfig, CookieSolutionStatus } from '../types';
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

    @state()
    private _expanded: Partial<Record<CookiePurpose, boolean>> = {};

    @state()
    private _hasPageToggle = false;

    private _dialogRef = createRef<HTMLDialogElement>();

    private _pageToggleObserver?: MutationObserver;

    private _hideTimer?: ReturnType<typeof setTimeout>;

    // The floating toggle is re-created when the banner closes, so it can't be stored as an element.
    private _opener?: HTMLElement | 'toggle';

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
        this._pageToggleObserver?.disconnect();
        this._pageToggleObserver = undefined;

        super.disconnectedCallback();
    }

    protected willUpdate(changed: PropertyValues<this>): void {
        if (!changed.has('config') || !this.config) {
            return;
        }

        this._loadContrastColor();
        this._syncPageToggleObserver();

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

    // With `toggle_enabled: 'auto'` the floating toggle hides while the page has its own trigger (SPA navigations included).
    private _syncPageToggleObserver(): void {
        if (this.config?.toggle_enabled !== 'auto') {
            this._pageToggleObserver?.disconnect();
            this._pageToggleObserver = undefined;
            return;
        }

        if (this._pageToggleObserver) {
            return;
        }

        let scheduled = false;
        const check = () => {
            scheduled = false;
            this._hasPageToggle = document.querySelector('[data-cookie-solution-toggle]') !== null;
        };

        this._pageToggleObserver = new MutationObserver(() => {
            if (!scheduled) {
                scheduled = true;
                requestAnimationFrame(check);
            }
        });
        this._pageToggleObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-cookie-solution-toggle'],
        });
        check();
    }

    private _initListeners(): void {
        document.addEventListener(
            'click',
            (event) => {
                if (!(event.target instanceof Element) || !event.target.closest('[data-cookie-solution-toggle]')) {
                    return;
                }

                event.preventDefault();

                this._opener = event.target.closest<HTMLElement>('[data-cookie-solution-toggle]') ?? undefined;
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
        clearTimeout(this._hideTimer);
        this._showModal = true;
        this._showModalStatus = 'showing';
        setTimeout(() => (this._showModalStatus = 'visible'), 1);
    }

    private hide(): void {
        this._showModalStatus = 'hiding';

        const finish = () => {
            // The banner may have been reopened while hiding.
            if (this._showModalStatus !== 'hiding') {
                return;
            }

            this._showModalStatus = 'hidden';
            this._dialogRef.value?.close();
            this._showModal = false;
            this._restoreFocus();
        };

        // Nothing to animate when transitions are off or the browser already closed the dialog.
        if (matchMedia('(prefers-reduced-motion: reduce)').matches || !this._dialogRef.value?.open) {
            finish();
            return;
        }

        this.renderRoot.querySelector('[part="banner-dialog"]')?.addEventListener('transitionend', finish, {
            once: true,
        });

        this._hideTimer = setTimeout(finish, 500);
    }

    private async _restoreFocus(): Promise<void> {
        const opener = this._opener;
        this._opener = undefined;

        await this.updateComplete;

        if (opener === 'toggle') {
            this.renderRoot.querySelector('cookie-solution-toggle')?.focus();
        } else {
            opener?.focus();
        }
    }

    protected updated(): void {
        const dialog = this._dialogRef.value;

        if (dialog && !dialog.open && this._showModalStatus === 'showing') {
            dialog.showModal();
            this._focusSelectedTab();
        }
    }

    private async _onCustomize(): Promise<void> {
        this._tab = 1;
        // The clicked button is replaced by "accept selected": keep keyboard focus inside the dialog.
        await this.updateComplete;
        this._focusSelectedTab();
    }

    private _focusSelectedTab(): void {
        this.renderRoot.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')?.focus();
    }

    private _onTabSelected(event: Event): void {
        if (event.currentTarget instanceof HTMLButtonElement) {
            this._tab = Number(event.currentTarget.dataset['tab']);
        }
    }

    private async _onTabKeydown(event: KeyboardEvent): Promise<void> {
        const last = 2;
        const tab = {
            ArrowLeft: this._tab === 0 ? last : this._tab - 1,
            ArrowRight: this._tab === last ? 0 : this._tab + 1,
            Home: 0,
            End: last,
        }[event.key];

        if (tab === undefined) {
            return;
        }

        event.preventDefault();
        this._tab = tab;
        await this.updateComplete;
        this._focusSelectedTab();
    }

    private _onCancel(event: Event): void {
        event.preventDefault();

        if (this._showModalStatus !== 'hiding') {
            this._onRefuse();
        }
    }

    // Chromium doesn't let `cancel` be prevented without user activation (e.g. Esc right after load).
    private _onClose(): void {
        if (this._showModalStatus !== 'hiding' && this._showModalStatus !== 'hidden') {
            this._onRefuse();
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
            const showToggle =
                this.config.toggle_enabled === true || (this.config.toggle_enabled === 'auto' && !this._hasPageToggle);

            return showToggle ? this.modalToggle() : null;
        }

        return html`
            <dialog
                class="fixed inset-0 z-max m-0 h-full max-h-none w-full max-w-none border-0 bg-gray-900/30 p-0 backdrop:bg-transparent print:hidden"
                part="banner-root"
                aria-label="${this.config.texts.consent_title}"
                @cancel="${this._onCancel}"
                @close="${this._onClose}"
                ${ref(this._dialogRef)}
            >
                <div
                    part="banner-dialog"
                    class="${
                        this._showModalStatus === 'showing' || this._showModalStatus === 'hiding'
                            ? 'scale-75 opacity-0'
                            : ''
                    } fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300"
                >
                    <div class="flex w-full flex-col rounded-lg bg-white font-sans text-gray-900 shadow-sm">
                        ${this.header()}
                        <div
                            class="flex-1 overflow-auto p-4"
                            role="tabpanel"
                            id="cookie-solution-tabpanel"
                            aria-labelledby="cookie-solution-tab-${this._tab}"
                            tabindex="0"
                        >
                            ${this._tab === 0 ? this.consentTab() : null}
                            ${this._tab === 1 ? this.customizeTab() : null}
                            ${this._tab === 2 ? this.informationTab() : null}
                        </div>
                        ${this.footer()}
                    </div>
                </div>
            </dialog>
        `;
    }

    protected header(): unknown {
        if (!this.config) {
            return;
        }

        const tab = (index: number, label: string) => html`
            <button
                class="${
                    this._contrastColor === 'white' ? 'aria-selected:text-highlight-text' : ''
                } h-14 w-full px-1 text-sm font-medium break-words hyphens-auto duration-300"
                role="tab"
                id="cookie-solution-tab-${index}"
                aria-controls="cookie-solution-tabpanel"
                aria-selected="${this._tab === index}"
                tabindex="${this._tab === index ? 0 : -1}"
                data-tab="${index}"
                @click="${this._onTabSelected}"
            >
                ${label}
            </button>
        `;

        return html`
            <div class="flex shrink-0">
                <div class="relative flex-1">
                    <div
                        class="grid grid-cols-3 border-b border-gray-200"
                        role="tablist"
                        @keydown="${this._onTabKeydown}"
                    >
                        ${tab(0, this.config.texts.tab_consent)} ${tab(1, this.config.texts.tab_customize)}
                        ${tab(2, this.config.texts.tab_information)}
                    </div>
                    <hr
                        class="absolute -bottom-[1px] w-1/3 border-t-4 border-highlight duration-300"
                        style="${`translate: ${this._tab * 100}% 0`}"
                        aria-hidden="true"
                    />
                </div>
                <button
                    class="flex h-14 w-12 shrink-0 items-center justify-center rounded-tr-lg border-b border-gray-200 text-gray-700 duration-300 hover:bg-gray-100 hover:text-highlight"
                    aria-label="${this.config.texts.button_close}"
                    @click="${this._onRefuse}"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        class="h-6 w-6 fill-current"
                        aria-hidden="true"
                    >
                        <path
                            d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
                        />
                    </svg>
                </button>
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
                    @click="${this._onCustomize}"
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
                <div class="text-sm font-bold">${this.config.texts.consent_title}</div>
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
                @open="${() => {
                    this._opener = 'toggle';
                    this.show();
                }}"
            ></cookie-solution-toggle>
        `;
    }

    protected cookiePurposeRow(purpose: CookiePurpose): unknown {
        if (!this.config) {
            return;
        }

        const hasCookies = this.config.services[purpose].length > 0;
        const expanded = this._expanded[purpose] ?? false;
        const label = this.config.texts[`customize_purpose_${purpose}`];

        return html`
            <cookie-solution--collapsable ?open="${expanded}">
                <div class="flex gap-8">
                    <div class="flex h-12 flex-1 items-center">
                        ${
                            hasCookies
                                ? html`
                                      <button
                                          class="flex h-12 items-center text-sm font-bold"
                                          aria-expanded="${expanded}"
                                          aria-controls="cookie-solution-purpose-${purpose}"
                                          @click="${() => (this._expanded = { ...this._expanded, [purpose]: !expanded })}"
                                      >
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 48 48"
                                              class="mr-4 h-6 w-6 fill-current"
                                              aria-hidden="true"
                                          >
                                              <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                          </svg>
                                          ${label}
                                      </button>
                                  `
                                : html`
                                      <div class="md:mr-4 md:w-6"></div>
                                      <div class="text-sm font-bold">${label}</div>
                                  `
                        }
                    </div>
                    <div class="flex h-12 w-12 items-center">
                        ${
                            purpose === 'necessary'
                                ? html`
                                      <cookie-solution--switch
                                          checked
                                          readonly
                                          label="${label}"
                                      ></cookie-solution--switch>
                                  `
                                : html`
                                      <cookie-solution--switch
                                          label="${label}"
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

                <div slot="content" id="cookie-solution-purpose-${purpose}" aria-hidden="${!expanded}">
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
