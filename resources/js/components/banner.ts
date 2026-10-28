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

    // Read by the `card:` and `modal:` style variants, on the banner and on the toggle.
    private get _layout(): 'modal' | 'card' {
        return this.config?.layout === 'card' ? 'card' : 'modal';
    }

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

        this.setAttribute('layout', this._layout);
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

        const transitioning = this._showModalStatus === 'showing' || this._showModalStatus === 'hiding';

        return html`
            <dialog
                class="${
                    transitioning ? 'card:bg-transparent' : 'card:bg-gray-950/20'
                } fixed inset-0 z-max m-0 h-full max-h-none w-full max-w-none border-0 bg-gray-900/40 p-0 backdrop-blur-xs backdrop:bg-transparent print:hidden card:backdrop-blur-none card:duration-300"
                part="banner-root"
                aria-label="${this._content.texts.consent_title}"
                @cancel="${this._onCancel}"
                @close="${this._onClose}"
                ${ref(this._dialogRef)}
            >
                <div
                    part="banner-dialog"
                    class="${
                        transitioning
                            ? 'modal:scale-95 modal:opacity-0 card:translate-y-full sm:card:translate-y-4 sm:card:scale-[0.98] sm:card:opacity-0'
                            : 'card:translate-y-0'
                    } ${
                        this.config.toggle_position === 'left'
                            ? 'sm:card:right-auto sm:card:left-6'
                            : 'sm:card:right-6 sm:card:left-auto'
                    } fixed top-1/2 left-1/2 z-max flex max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden p-4 duration-300 card:inset-x-0 card:top-auto card:bottom-0 card:max-h-[85dvh] card:max-w-none card:translate-x-0 card:overflow-visible card:p-0 card:ease-sheet sm:card:bottom-6 sm:card:max-h-[calc(100dvh-3rem)] sm:card:w-[440px]"
                >
                    <div
                        class="flex w-full flex-col rounded-2xl border border-gray-200 bg-white font-sans text-gray-900 card:overflow-hidden card:rounded-t-3xl card:rounded-b-none card:border-transparent card:shadow-card sm:card:rounded-3xl modal:shadow-xl modal:shadow-gray-900/5"
                    >
                        ${this.header(this._content)}
                        <div
                            class="flex-1 overflow-auto rounded-lg px-4 py-5 focus-visible:-outline-offset-4 md:px-8 card:rounded-2xl card:p-5"
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
        // Below 24rem a third of the screen is too narrow for "Consentimiento" at 13px with an inset focus ring.
        const tab = (index: number, label: string) => html`
            <button
                class="${
                    this._contrastColor === 'white'
                        ? 'aria-selected:text-highlight-text'
                        : 'aria-selected:text-gray-900'
                } min-h-10 w-full rounded-lg py-1 text-[13px] font-medium break-words hyphens-auto text-gray-700 duration-300 hover:text-gray-900 focus-visible:-outline-offset-5 max-[24rem]:text-xs max-[24rem]:focus-visible:outline-offset-0 sm:text-sm card:min-h-8 card:rounded-full card:px-1 card:py-1.5 card:text-[13px]/tight card:focus-visible:outline-offset-0 max-[24rem]:card:text-xs/tight"
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
            <div
                class="shrink-0 border-b border-gray-200 p-4 md:px-8 md:py-5 card:border-b-0 card:px-5 card:pt-5 card:pb-0"
            >
                <div class="rounded-xl border border-gray-200 bg-gray-100 p-1 card:rounded-full card:border-0">
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 w-1/3 rounded-lg border border-gray-200 bg-white shadow-xs duration-300 card:rounded-full card:border-transparent card:shadow-sm card:ease-sheet"
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
            'block min-h-11 w-full rounded-lg border border-transparent bg-highlight-text px-3 py-2 text-sm font-semibold text-on-highlight duration-300 hover:ring-4 hover:ring-highlight/25 md:min-w-32 md:px-5 card:rounded-full card:bg-highlight/10 card:px-4 card:leading-tight card:font-medium card:text-gray-900 card:ring-1 card:ring-highlight/25 card:ring-inset card:hover:bg-highlight/20 card:focus-visible:bg-highlight/20 sm:card:min-h-10';
        const secondary =
            'block min-h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold duration-300 hover:bg-gray-50 md:w-auto md:px-5 card:w-full card:rounded-full card:border-gray-200 card:px-4 card:font-medium card:text-gray-700 card:hover:bg-gray-50 card:hover:text-gray-900 card:focus-visible:bg-gray-50 sm:card:min-h-10';

        return html`
            <div
                class="flex shrink-0 flex-col gap-2 border-t border-gray-200 px-4 py-4 md:flex-row md:items-center md:justify-between md:gap-3 md:px-8 md:py-5 card:flex-col card:items-stretch card:gap-2 card:border-gray-100 card:px-5 card:pt-4 card:pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
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
                <div class="grid grid-cols-2 gap-2 md:gap-3 card:gap-2">
                    <button class="${primary}" @click="${this._onRefuse}">${content.texts.button_refuse}</button>
                    <button class="${primary}" @click="${this._onAcceptAll}">${content.texts.button_accept_all}</button>
                </div>
            </div>
        `;
    }

    protected consentTab(content: CookieSolutionContent): unknown {
        return html`
            <div part="banner-tab-consent">
                <h2
                    class="text-xl/tight font-semibold tracking-tight text-balance md:text-2xl/tight card:text-[15px]/snug"
                >
                    ${content.texts.consent_title}
                </h2>
                <p
                    class="mt-3 text-sm/6 text-gray-700 md:text-base/7 card:mt-1.5 card:text-sm/relaxed card:text-gray-600"
                >
                    ${content.texts.consent_message}
                </p>
            </div>
        `;
    }

    protected customizeTab(content: CookieSolutionContent): unknown {
        return html`
            <div class="grid gap-3 card:block card:divide-y card:divide-gray-100" part="banner-tab-customize">
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
                layout="${this._layout}"
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
                class="block bg-white modal:rounded-xl modal:border modal:border-gray-200 modal:px-4"
                ?open="${expanded}"
            >
                <div class="flex items-center gap-4 pt-2 card:pt-0">
                    <div class="flex min-h-11 flex-1 items-center card:min-h-12">
                        ${
                            hasCookies
                                ? html`
                                      <button
                                          class="-ml-1 flex min-h-11 items-center gap-1.5 rounded-md px-1 text-base font-semibold card:ml-0 card:min-h-12 card:gap-2 card:rounded-lg card:px-0 card:text-left card:text-sm"
                                          aria-expanded="${expanded}"
                                          aria-controls="cookie-solution-purpose-${purpose}"
                                          @click="${() => (this._expanded = { ...this._expanded, [purpose]: !expanded })}"
                                      >
                                          ${label}
                                          <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 48 48"
                                              class="${
                                                  expanded ? 'rotate-180' : ''
                                              } size-5 fill-current text-gray-600 duration-300 card:order-first card:size-6 card:shrink-0 card:fill-gray-500 card:ease-sheet"
                                              aria-hidden="true"
                                          >
                                              <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
                                          </svg>
                                      </button>
                                  `
                                : html`<div class="text-base font-semibold card:pl-8 card:text-sm">${label}</div>`
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

                <p class="pb-4 text-sm/6 text-gray-600 md:pr-16 card:pr-0 card:pl-8 card:text-[13px]/relaxed">
                    ${content.texts[`customize_purpose_${purpose}_description`]}
                </p>

                <div slot="content" id="cookie-solution-purpose-${purpose}" aria-hidden="${!expanded}">
                    <div class="grid gap-2 pb-4 card:pl-8">
                        ${content.services[purpose].map(
                            (service) => html`
                                <div
                                    class="rounded-lg bg-gray-50 px-3 py-2.5 card:rounded-xl card:border card:border-transparent"
                                >
                                    <div class="card:text-[13px]/snug">
                                        <span
                                            class="block text-sm font-semibold md:inline card:inline card:text-[1em] card:font-medium"
                                            >${service.name}</span
                                        >
                                        <span
                                            class="block text-xs text-gray-600 md:inline md:text-sm card:inline card:text-[1em]"
                                            >(${service.provider})</span
                                        >
                                    </div>
                                    <div class="mt-1.5 divide-y divide-gray-200 card:mt-1 card:divide-gray-200/70">
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
            <div
                class="grid grid-cols-2 items-center gap-x-2 gap-y-1 py-1.5 sm:grid-cols-4 card:grid-cols-2 card:gap-y-0.5 card:py-2"
            >
                <div>
                    <span class="text-xs font-semibold card:break-all">${cookie.name}</span>
                </div>
                <div class="flex justify-end sm:justify-start card:justify-end">
                    <span
                        class="rounded-md bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200 card:rounded-full card:border card:border-transparent card:text-[11px] card:text-gray-600 card:shadow-xs card:ring-0"
                    >
                        <cookie-solution-duration
                            duration="${cookie.duration}"
                            locale="${this.config?.locale}"
                            session-label="${content.texts.duration_session}"
                        ></cookie-solution-duration>
                    </span>
                </div>
                <div class="col-span-2 text-xs text-gray-600 card:leading-relaxed">${cookie.description}</div>
            </div>
        `;
    }
}
