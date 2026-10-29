import { html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import { styleSheet } from '../style';

export class CookieSolutionCollapsable extends LitElement {
    static styles = [styleSheet];

    @property({ type: Boolean })
    open = false;

    contentRef: Ref<HTMLDivElement> = createRef();

    private _updateContentStyle(): void {
        if (!this.contentRef.value) {
            return;
        }

        // Without transitions `transitionend` never fires to reset the height.
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.contentRef.value.style.height = this.open ? 'auto' : '0px';
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
                    { once: true },
                );
            });
        } else {
            this.contentRef.value!.style.height = `${height}px`;
            requestAnimationFrame(() => {
                this.contentRef.value!.style.height = '0px';
            });
        }
    }

    protected firstUpdated() {
        this.contentRef.value!.style.height = this.open ? 'auto' : '0px';
    }

    protected updated(changed: PropertyValues<this>) {
        if (changed.get('open') !== undefined) {
            this._updateContentStyle();
        }
    }

    protected render(): unknown {
        return html`
            <div class="group">
                <slot></slot>
                <div class="overflow-hidden transition-all duration-500" ${ref(this.contentRef)}>
                    <slot name="content"></slot>
                </div>
            </div>
        `;
    }
}
