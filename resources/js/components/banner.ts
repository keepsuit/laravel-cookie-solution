import { LitElement, html, nothing, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { styleSheet } from '../style';
import { deleteCookie, readStatus, writeStatus } from '../utils/cookie';
import { fetchContent } from '../utils/content';
import {
    CookieConfig,
    CookiePurpose,
    CookieSolutionConfig,
    CookieSolutionContent,
    CookieSolutionStatus,
} from '../types';
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

    loadContent: (config: CookieSolutionConfig) => Promise<CookieSolutionContent> = fetchContent;

    @state()
    private _content?: CookieSolutionContent;

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

        if (this.config.content) {
            this._content = this.config.content;
        } else if (previous?.content_url !== this.config.content_url) {
            // An open banner keeps the old content until the new one arrives.
            if (this._showModal) {
                void this._loadContent();
            } else {
                this._content = undefined;
            }
        }

        // A new config with the same cookie (e.g. locale change) only updates texts.
        if (previous?.digest === this.config.digest && previous?.cookie_name === this.config.cookie_name) {
            return;
        }

        this._loadStatus();

        if (!this._status) {
            void this.show();
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
                void this.show();
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

    private async _loadContent(): Promise<boolean> {
        const config = this.config;

        if (!config) {
            return false;
        }

        try {
            const content = config.content ?? (await this.loadContent(config));

            if (config !== this.config) {
                return this._loadContent();
            }

            this._content = content;

            return true;
        } catch (error) {
            console.error('CookieSolution: Unable to load the banner content.', error);

            return false;
        }
    }

    async show(): Promise<void> {
        if (!this._content && !(await this._loadContent())) {
            return;
        }

        if (this._showModal && this._showModalStatus !== 'hiding') {
            return;
        }

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
            this._onDismiss();
        }
    }

    // Chromium doesn't let `cancel` be prevented without user activation (e.g. Esc right after load).
    private _onClose(): void {
        if (this._showModalStatus !== 'hiding' && this._showModalStatus !== 'hidden') {
            this._onDismiss();
        }
    }

    // Closing refuses on the first visit, but must not revoke a choice the user is only reviewing.
    private _onDismiss(): void {
        const stored = this.config ? readStatus(this.config) : undefined;

        if (!stored) {
            this._onRefuse();
            return;
        }

        this._status = stored;
        this.hide();
    }

    private _onAcceptAll(): void {
        this._status = {
            timestamp: new Date().toISOString(),
            purposes: {
                necessary: true,
                preferences: this._content != undefined && this._content.services.preferences.length > 0,
                statistics: this._content != undefined && this._content.services.statistics.length > 0,
                marketing: this._content != undefined && this._content.services.marketing.length > 0,
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

        if (!this._showModal || !this._content) {
            const showToggle =
                this.config.toggle_enabled === true || (this.config.toggle_enabled === 'auto' && !this._hasPageToggle);

            return showToggle ? this.modalToggle() : null;
        }

        return html`
            <dialog
                class="fixed inset-0 z-max m-0 h-full max-h-none w-full max-w-none border-0 bg-gray-900/40 p-0 backdrop-blur-xs backdrop:bg-transparent print:hidden"
                part="banner-root"
                aria-label="${this._content.texts.consent_title}"
                @cancel="${this._onCancel}"
                @close="${this._onClose}"
                ${ref(this._dialogRef)}
            >
                <div
                    part="banner-dialog"
                    class="${
                        this._showModalStatus === 'showing' || this._showModalStatus === 'hiding'
                            ? 'scale-95 opacity-0'
                            : ''
                    } fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300"
                >
                    <div
                        class="flex w-full flex-col rounded-2xl border border-gray-200 bg-white font-sans text-gray-900 shadow-xl shadow-gray-900/5"
                    >
                        ${this.header(this._content)}
                        <div
                            class="flex-1 overflow-auto rounded-lg px-4 py-5 focus-visible:-outline-offset-4 md:px-8"
                            role="tabpanel"
                            id="cookie-solution-tabpanel"
                            aria-labelledby="cookie-solution-tab-${this._tab}"
                            tabindex="${
                                // Keyboard users reach the customize panel through its controls.
                                this._tab === 1 ? nothing : 0
                            }"
                        >
                            ${this._tab === 0 ? this.consentTab(this._content) : null}
                            ${this._tab === 1 ? this.customizeTab(this._content) : null}
                            ${this._tab === 2 ? this.informationTab(this._content) : null}
                        </div>
                        ${this.footer(this._content)}
                    </div>
                </div>
            </dialog>
        `;
    }

    protected header(content: CookieSolutionContent): unknown {
        const tab = (index: number, label: string) => html`
            <button
                class="${
                    this._contrastColor === 'white'
                        ? 'aria-selected:text-highlight-text'
                        : 'aria-selected:text-gray-900'
                } min-h-10 w-full rounded-lg py-1 text-[13px] font-medium break-words hyphens-auto text-gray-700 duration-300 hover:text-gray-900 focus-visible:outline-offset-0 sm:text-sm"
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
            <div class="shrink-0 border-b border-gray-200 px-4 pt-5 pb-4 md:px-8 md:pt-7 md:pb-5">
                <div class="flex items-start gap-4">
                    <h2 class="flex-1 text-2xl/tight font-semibold tracking-tight text-balance md:text-3xl/tight">
                        ${content.texts.consent_title}
                    </h2>
                    <button
                        class="-mt-1 -mr-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-gray-600 duration-300 hover:bg-gray-100 hover:text-gray-900"
                        aria-label="${content.texts.button_close}"
                        @click="${this._onDismiss}"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            class="size-6 fill-current"
                            aria-hidden="true"
                        >
                            <path
                                d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"
                            />
                        </svg>
                    </button>
                </div>
                <div class="mt-5 rounded-xl border border-gray-200 bg-gray-100 p-1">
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 w-1/3 rounded-lg border border-gray-200 bg-white shadow-xs duration-300"
                            style="${`translate: ${this._tab * 100}% 0`}"
                            aria-hidden="true"
                        ></div>
                        <div class="relative grid grid-cols-3" role="tablist" @keydown="${this._onTabKeydown}">
                            ${tab(0, content.texts.tab_consent)} ${tab(1, content.texts.tab_customize)}
                            ${tab(2, content.texts.tab_information)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    protected footer(content: CookieSolutionContent): unknown {
        // Refuse and accept all share a style: consent rules require equal prominence.
        const primary =
            'block h-11 w-full rounded-lg border border-transparent bg-highlight-text px-3 text-sm font-semibold text-on-highlight duration-300 hover:ring-4 hover:ring-highlight/25';
        const secondary =
            'block h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-semibold duration-300 hover:bg-gray-50';

        return html`
            <div class="grid shrink-0 gap-2 border-t border-gray-200 px-4 py-4 md:grid-cols-3 md:gap-3 md:px-8 md:py-5">
                <div>
                    <button class="${primary}" @click="${this._onRefuse}">${content.texts.button_refuse}</button>
                </div>
                <div>
                    ${
                        this._tab === 1
                            ? html`
                                  <button class="${secondary}" @click="${this._onAcceptSelected}">
                                      ${content.texts.button_accept_selected}
                                  </button>
                              `
                            : html`
                                  <button class="${secondary}" @click="${this._onCustomize}">
                                      ${content.texts.button_customize}
                                  </button>
                              `
                    }
                </div>
                <div>
                    <button class="${primary}" @click="${this._onAcceptAll}">${content.texts.button_accept_all}</button>
                </div>
            </div>
        `;
    }

    protected consentTab(content: CookieSolutionContent): unknown {
        return html`
            <div part="banner-tab-consent">
                <p class="text-sm/6 text-gray-700 md:text-base/7">${content.texts.consent_message}</p>
            </div>
        `;
    }

    protected customizeTab(content: CookieSolutionContent): unknown {
        return html`
            <div class="grid gap-3" part="banner-tab-customize">
                ${this.cookiePurposeRow(content, 'necessary')}
                ${content.services.preferences.length > 0 ? this.cookiePurposeRow(content, 'preferences') : null}
                ${content.services.statistics.length > 0 ? this.cookiePurposeRow(content, 'statistics') : null}
                ${content.services.marketing.length > 0 ? this.cookiePurposeRow(content, 'marketing') : null}
            </div>
        `;
    }

    protected informationTab(content: CookieSolutionContent): unknown {
        return html`
            <div class="prose prose-sm" part="banner-tab-information">
                ${unsafeHTML(content.texts.information_text)}
            </div>
        `;
    }

    protected modalToggle(): unknown {
        return html`
            <cookie-solution-toggle
                exportparts="toggle-root, toggle-button"
                position="${this.config?.toggle_position}"
                label="${this.config?.toggle_label}"
                @open="${() => {
                    this._opener = 'toggle';
                    void this.show();
                }}"
            ></cookie-solution-toggle>
        `;
    }

    protected cookiePurposeRow(content: CookieSolutionContent, purpose: CookiePurpose): unknown {
        const hasCookies = content.services[purpose].length > 0;
        const expanded = this._expanded[purpose] ?? false;
        const label = content.texts[`customize_purpose_${purpose}`];

        return html`
            <cookie-solution--collapsable
                class="block rounded-xl border border-gray-200 bg-white px-4"
                ?open="${expanded}"
            >
                <div class="flex items-center gap-4 pt-2">
                    <div class="flex min-h-11 flex-1 items-center">
                        ${
                            hasCookies
                                ? html`
                                      <button
                                          class="-ml-1 flex min-h-11 items-center gap-1.5 rounded-md px-1 text-base font-semibold"
                                          aria-expanded="${expanded}"
                                          aria-controls="cookie-solution-purpose-${purpose}"
                                          @click="${() => (this._expanded = { ...this._expanded, [purpose]: !expanded })}"
                                      >
                                          ${label}
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 48 48"
                                              class="${expanded ? 'rotate-180' : ''} size-5 fill-current text-gray-600 duration-300"
                                              aria-hidden="true"
                                          >
                                              <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                          </svg>
                                      </button>
                                  `
                                : html`<div class="text-base font-semibold">${label}</div>`
                        }
                    </div>
                    ${
                        purpose === 'necessary'
                            ? html`
                                  <cookie-solution--switch checked readonly label="${label}"></cookie-solution--switch>
                              `
                            : html`
                                  <cookie-solution--switch
                                      label="${label}"
                                      ?checked="${this._status?.purposes?.[purpose]}"
                                      @change="${($event: CustomEvent) => this._onPurposeChange(purpose, $event.detail)}"
                                  ></cookie-solution--switch>
                              `
                    }
                </div>

                <p class="pb-4 text-sm/6 text-gray-600 md:pr-16">
                    ${content.texts[`customize_purpose_${purpose}_description`]}
                </p>

                <div slot="content" id="cookie-solution-purpose-${purpose}" aria-hidden="${!expanded}">
                    <div class="grid gap-2 pb-4">
                        ${content.services[purpose].map(
                            (service) => html`
                                <div class="rounded-lg bg-gray-50 px-3 py-2.5">
                                    <div>
                                        <span class="block text-sm font-semibold md:inline">${service.name}</span>
                                        <span class="block text-xs text-gray-600 md:inline md:text-sm"
                                            >(${service.provider})</span
                                        >
                                    </div>
                                    <div class="mt-1.5 divide-y divide-gray-200">
                                        ${service.cookies.map((cookie) => this.cookieRow(content, cookie))}
                                    </div>
                                </div>
                            `,
                        )}
                    </div>
                </div>
            </cookie-solution--collapsable>
        `;
    }

    protected cookieRow(content: CookieSolutionContent, cookie: CookieConfig): unknown {
        return html`
            <div class="grid grid-cols-2 items-center gap-x-2 gap-y-1 py-1.5 sm:grid-cols-4">
                <div>
                    <span class="text-xs font-semibold">${cookie.name}</span>
                </div>
                <div class="flex justify-end sm:justify-start">
                    <span
                        class="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200"
                    >
                        <cookie-solution-duration
                            duration="${cookie.duration}"
                            locale="${this.config?.locale}"
                            session-label="${content.texts.duration_session}"
                        ></cookie-solution-duration>
                    </span>
                </div>
                <div class="col-span-2 text-xs text-gray-600">${cookie.description}</div>
            </div>
        `;
    }
}
