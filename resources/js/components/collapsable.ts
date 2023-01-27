import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { styleSheet } from '../style';

@customElement('cookie-solution-collapsable')
export class CookieSolutionCollapsable extends LitElement {
    static styles = [styleSheet];

    @property({ type: Boolean })
    open = false;

    contentRef: Ref<HTMLDivElement> = createRef();

    private _updateContentStyle(): void {
        if (!this.contentRef.value) {
            return;
        }

        this.contentRef.value.style.height = 'auto';
        const height = this.contentRef.value.getBoundingClientRect().height;

        if (this.open) {
            this.contentRef.value.style.height = `0px`;

            requestAnimationFrame(() => {
                this.contentRef.value!.style.height = `${height}px`;
                this.contentRef.value!.addEventListener(
                    'transitionend',
                    () => {
                        this.contentRef.value!.style.height = 'auto';
                    },
                    { once: true }
                );
            });
        } else {
            this.contentRef.value!.style.height = `${height}px`;
            requestAnimationFrame(() => {
                this.contentRef.value!.style.height = '0px';
            });
        }
    }

    private _onToggleOpenEvent(event: CustomEvent) {
        event.stopPropagation();

        this.open = !this.open;

        this._updateContentStyle();
    }

    protected firstUpdated() {
        this.contentRef.value!.style.height = this.open ? 'auto' : '0px';
    }

    protected render(): unknown {
        return html`
            <div class="group" @toggle-open="${this._onToggleOpenEvent}">
                <slot></slot>
                <div class="overflow-hidden transition-all duration-500" ${ref(this.contentRef)}>
                    <slot name="content"></slot>
                </div>
            </div>
        `;
    }
}
