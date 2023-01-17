import style from './style.css?inline';

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(style);

export { styleSheet };
