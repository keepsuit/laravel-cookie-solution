# Customization

## Highlight color

Set the `highlight_color` config value. It reaches headless frontends with the rest of the config, so they can also override it in `mount({ ...config, highlight_color: '#3522dd' })`. With `highlight_color` set to `null`, the banner uses the `--cs--color-highlight` CSS variable when the page sets it:

```css
:root {
    --cs--color-highlight: #3522dd;
}
```

Any CSS color format works (transparency is ignored). Where the color is used for text, focus rings or icons on white, it is darkened as needed (keeping its hue) to stay readable; buttons get white or black text to match. Browsers without CSS relative colors use the color as set, with white button text.

## Layout

Set the `layout` config value to choose how the banner looks:

- `'modal'` (default): a dialog centered on the page. It blocks the page until the user chooses.
- `'floating'`: a compact card in the bottom corner on the `toggle_position` side, a bottom sheet on mobile. It doesn't block the page: users can scroll and interact with it, and Esc closes the card only while focus is inside it.

Unknown values fall back to `'modal'`.
Headless frontends can override it before mounting: `mount({ ...config, layout: 'floating' })`.

## Toggle position

You can change the toggle position to `left` or `right` by changing the `toggle_position` config value (default to `right`).
If you need a more advanced customization, you can edit the toggle position with some CSS:

```css
:root {
    --cs--toggle-position-bottom: 4rem; /* position from the bottom */
    --cs--toggle-position-x: 2rem; /* position from the left or right (depending on `toggle_position` value) */
}

/* change the position for desktop */
@media (min-width: 1024px) {
    :root {
        --cs--toggle-position-bottom: 2rem;
        --cs--toggle-position-x: 1rem;
    }
}
```

## Toggle z-index

You can change the toggle z-index by changing the `--cs--toggle-z-index` CSS variable. The default value is `9999`.

## Disabling toggle

Sometimes you may want to use your own button instead of the floating toggle.
Add the `data-cookie-solution-toggle` attribute to an element in your layout:

```html
<button data-cookie-solution-toggle>
    Cookie settings
</button>
```

Then set the `toggle_enabled` config value:

- `false`: the floating toggle is never shown.
- `'auto'`: the floating toggle is hidden while the page contains an element with `data-cookie-solution-toggle`, and shown again when it doesn't (also after client-side navigations).

Users must always be able to change their consent: with `'auto'`, make sure the element is reachable on every viewport (not only inside a closed mobile menu, for example).

## Policy views

The policy views are wrapped in the `<cookie-solution-policy-formatter>` component, which applies the default styles.
You can adjust them from your CSS with `::part()`:

```css
cookie-solution-policy-formatter::part(h1) {
    font-size: 2rem;
}

cookie-solution-policy-formatter::part(link) {
    color: var(--brand-color);
}
```

Available parts:

- Text: `root`, `headings`, `h1`, `h2`, `h3`, `p`, `ul`, `ol`, `li`, `link`, `data-owner`.
- Cookie policy: `cookie-list`, `purpose`, `services` (the services of a purpose), `service`, `service-header` (name and provider), `service-name`, `service-provider`, `service-cookies`, `cookie`, `cookie-name`, `cookie-duration`, `cookie-description`.
- Privacy policy: `privacy-list`, `service`, `service-header` (name, provider and link), `service-name`, `service-provider`, `service-link`, `service-description`, `service-location`, `service-location-value`.

For full control, publish the views with `php artisan vendor:publish --tag="cookie-solution-views"` and remove the formatter.
