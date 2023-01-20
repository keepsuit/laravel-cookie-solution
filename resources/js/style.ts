import style from './style.css?inline';
import { css, unsafeCSS } from 'lit';

const styleSheet = css`
    ${unsafeCSS(style)}
`;

export { styleSheet };
