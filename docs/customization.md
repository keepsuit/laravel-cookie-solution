# Customization

## Highlight color

With Blade, set the `highlight_color` config value. Headless frontends set the CSS variable themselves:

```css
:root {
    --cs--color-highlight: #3522dd;
}
```

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

Sometimes you may want to disable the default floating toggle and use your own toggle button.
You can do this by setting the `toggle_enabled` config value to `false`.
Then you need to add the `data-cookie-solution-toggle` attribute to an element in your layout, like this:

```html
<button data-cookie-solution-toggle>
    Toggle Cookie Banner
</button>
```

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
- Cookie policy: `cookie-list`, `purpose`, `service`, `service-name`, `service-provider`, `cookie`, `cookie-name`, `cookie-duration`, `cookie-description`.
- Privacy policy: `privacy-list`, `service`, `service-name`, `service-provider`, `service-link`, `service-description`, `service-location`, `service-location-value`.

For full control, publish the views with `php artisan vendor:publish --tag="cookie-solution-views"` and remove the formatter.
