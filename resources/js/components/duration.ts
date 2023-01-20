import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cookie-solution-duration')
export class CookieSolutionDuration extends LitElement {
    @property({ type: Number })
    duration = 0;

    private _relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
        style: 'long',
    });

    protected render(): unknown {
        return html` ${this.formatDuration(this.duration)} `;
    }

    protected formatDuration(duration: number): string {
        if (duration === 0) {
            return 'session';
        }

        let parts;

        if (duration % 365 === 0) {
            parts = this._relativeTimeFormatter.formatToParts(duration / 365, 'year');
        } else if (duration % 30 === 0) {
            parts = this._relativeTimeFormatter.formatToParts(duration / 30, 'month');
        } else {
            parts = this._relativeTimeFormatter.formatToParts(duration, 'day');
        }

        return `${parts[1].value} ${parts[2].value}`;
    }
}
