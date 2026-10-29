import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { formatDuration } from '../utils/duration';

export class CookieSolutionDuration extends LitElement {
    @property({ type: Number })
    duration = 0;

    @property({ type: String })
    locale: string | undefined = undefined;

    @property({ type: String, attribute: 'session-label' })
    sessionLabel = '';

    protected render(): unknown {
        const locale = this.locale || document.documentElement.lang || navigator.language;

        return html`${formatDuration(this.duration, locale, this.sessionLabel)}`;
    }
}
