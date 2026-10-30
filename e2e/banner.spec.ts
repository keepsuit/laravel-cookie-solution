import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// The PHP contract snapshots double as fixtures, so these tests break when the contract and the bundle drift apart.
const snapshot = (n: number) =>
    JSON.parse(
        readFileSync(
            `tests/__snapshots__/CookieSolutionConfigTest__it_keeps_the_config_contract_stable__${n}.json`,
            'utf8',
        ),
    );
const boot = { ...snapshot(1), content_url: 'http://site.test/content?locale=en' };
const content = snapshot(2);
const layout = () => test.info().project.metadata.layout;
const bundle = readFileSync('resources/dist/laravel-cookie-solution.js', 'utf8');

const acceptedAll = {
    timestamp: new Date().toISOString(),
    digest: boot.digest,
    purposes: { necessary: true, preferences: false, statistics: true, marketing: true },
};

type Setup = { cookie?: object; config?: object; body?: string; contentDelay?: number; failContent?: number };

async function visit(page: Page, { cookie, config = boot, body = '', contentDelay = 0, failContent = 0 }: Setup = {}) {
    const requests: string[] = [];

    if (cookie) {
        await page
            .context()
            .addCookies([
                { name: boot.cookie_name, value: encodeURIComponent(JSON.stringify(cookie)), url: 'http://site.test/' },
            ]);
    }

    // Served from another origin without CORS headers, like a CDN behind ASSET_URL.
    await page.route('http://cdn.test/bundle.js', (route) =>
        route.fulfill({ contentType: 'text/javascript', body: bundle }),
    );
    await page.route('http://site.test/**', async (route) => {
        const url = new URL(route.request().url());

        if (url.pathname === '/content') {
            requests.push(url.searchParams.get('locale') ?? '');
            await new Promise((resolve) => setTimeout(resolve, contentDelay));

            if (requests.length <= failContent) {
                return route.fulfill({ status: 500 });
            }

            const locale = url.searchParams.get('locale');
            return route.fulfill({
                json: { ...content, texts: { ...content.texts, consent_title: `Title ${locale}` } },
            });
        }

        return route.fulfill({
            contentType: 'text/html',
            body: `<!doctype html><html lang="en"><body>${body}<script>window._cookieSolution = ${JSON.stringify({ ...config, layout: layout() })};</script><script defer src="http://cdn.test/bundle.js"></script></body></html>`,
        });
    });

    await page.goto('http://site.test/');

    return { requests };
}

const banner = (page: Page) => page.locator('cookie-solution-banner');
const dialog = (page: Page) => banner(page).getByRole('dialog');
const toggle = (page: Page) => banner(page).locator('cookie-solution-toggle');
const storedPurposes = async (page: Page) => {
    const cookie = (await page.context().cookies()).find((cookie) => cookie.name === boot.cookie_name);
    return cookie ? JSON.parse(decodeURIComponent(cookie.value)).purposes : undefined;
};

test('first visit loads the content once and opens the banner', async ({ page }) => {
    const { requests } = await visit(page);

    await expect(dialog(page)).toBeVisible();
    await expect(banner(page)).toHaveAttribute('layout', layout());
    await banner(page).getByRole('tab', { name: content.texts.tab_information }).click();
    await expect(banner(page).locator('[part="banner-tab-information"] h2').first()).toBeVisible();
    expect(requests).toEqual(['en']);
});

test('accept all stores every purpose with services and keeps the content cached', async ({ page }) => {
    const { requests } = await visit(page);

    await banner(page).getByRole('button', { name: content.texts.button_accept_all }).click();
    await expect(dialog(page)).toBeHidden();
    expect(await storedPurposes(page)).toEqual(acceptedAll.purposes);

    await toggle(page).getByRole('button').click();
    await expect(dialog(page)).toBeVisible();
    expect(requests).toHaveLength(1);
});

test('a stored consent shows only the toggle and loads nothing', async ({ page }) => {
    const { requests } = await visit(page, { cookie: acceptedAll });

    await expect(toggle(page).getByRole('button')).toBeVisible();
    await expect(dialog(page)).toBeHidden();
    expect(await page.evaluate(() => (window as any).CookieSolution.getStatus()?.purposes)).toEqual(
        acceptedAll.purposes,
    );
    expect(requests).toHaveLength(0);
});

test('closing on the first visit refuses', async ({ page }) => {
    await visit(page);
    await expect(dialog(page)).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialog(page)).toBeHidden();
    expect(await storedPurposes(page)).toEqual({
        necessary: true,
        preferences: false,
        statistics: false,
        marketing: false,
    });
});

test('closing a reopened banner keeps the stored choice', async ({ page }) => {
    await visit(page, { cookie: acceptedAll });

    await toggle(page).getByRole('button').click();
    await expect(dialog(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog(page)).toBeHidden();
    expect(await storedPurposes(page)).toEqual(acceptedAll.purposes);
});

test('a failed content request is retried on the next open', async ({ page }) => {
    const { requests } = await visit(page, { failContent: 1 });

    await expect.poll(() => requests.length).toBe(1);
    await expect(dialog(page)).toBeHidden();

    await page.evaluate(() => (window as any).CookieSolution.open());
    await expect(dialog(page)).toBeVisible();
    expect(requests).toHaveLength(2);
});

test('a config change while the content loads opens the banner with the new content', async ({ page }) => {
    await visit(page, { contentDelay: 300 });

    await page.evaluate((config) => (window as any).CookieSolution.mount(config), {
        ...boot,
        layout: layout(),
        locale: 'it',
        content_url: 'http://site.test/content?locale=it',
    });

    await expect(dialog(page)).toBeVisible();
    await expect(dialog(page)).toContainText('Title it');
});

test("toggle 'auto' hides while the page has its own trigger", async ({ page }) => {
    await visit(page, { cookie: acceptedAll, config: { ...boot, toggle_enabled: 'auto' } });
    await expect(toggle(page).getByRole('button')).toBeVisible();

    await page.evaluate(() => {
        const link = document.createElement('a');
        link.id = 'cookie-settings';
        link.href = '#';
        link.textContent = 'Cookie settings';
        link.setAttribute('data-cookie-solution-toggle', '');
        document.body.append(link);
    });
    await expect(toggle(page)).toHaveCount(0);

    await page.click('#cookie-settings');
    await expect(dialog(page)).toBeVisible();
});

test('new services close an open banner until their content has loaded', async ({ page }) => {
    await visit(page, { contentDelay: 300 });
    await expect(dialog(page)).toBeVisible();

    await page.evaluate(() =>
        (window as any).CookieSolution.mount({
            ...(window as any)._cookieSolution,
            digest: 'new-services',
            content_url: 'http://site.test/content?locale=en&v=2',
        }),
    );

    await expect(dialog(page)).toBeHidden();
    await expect(dialog(page)).toBeVisible();
    await banner(page).getByRole('button', { name: content.texts.button_accept_all }).click();
    expect(await storedPurposes(page)).toEqual(acceptedAll.purposes);
});

const recordEvents = `<script>
    window.events = [];
    for (const type of ['default', 'change']) {
        document.addEventListener('cookie-solution-status-' + type, (event) => events.push([type, event.detail.purposes]));
    }
</script>`;
const events = (page: Page) => page.evaluate(() => (window as any).events);
const remount = (page: Page, config: object) =>
    page.evaluate(async (config) => {
        (window as any).CookieSolution.mount({ ...(window as any)._cookieSolution, ...config });
        await document.querySelector('cookie-solution-banner')!.updateComplete;
    }, config);
const deniedPurposes = { necessary: true, preferences: false, statistics: false, marketing: false };

test('the default status comes first, then only the user choices', async ({ page }) => {
    await visit(page, { body: recordEvents });
    await expect(dialog(page)).toBeVisible();
    expect(await events(page)).toEqual([['default', deniedPurposes]]);

    await banner(page).getByRole('button', { name: content.texts.button_accept_all }).click();

    expect(await events(page)).toEqual([
        ['default', deniedPurposes],
        ['change', acceptedAll.purposes],
    ]);
});

test('a remount emits a change only when the status in effect changes', async ({ page }) => {
    await visit(page, { cookie: acceptedAll, body: recordEvents });
    await expect(toggle(page).getByRole('button')).toBeVisible();

    await remount(page, { locale: 'it' });
    await remount(page, { digest: 'new-services' });
    await remount(page, { digest: 'other-services' });

    expect(await events(page)).toEqual([
        ['default', acceptedAll.purposes],
        ['change', deniedPurposes],
    ]);
    await expect(dialog(page)).toBeVisible();
    expect(await page.evaluate(() => (window as any).CookieSolution.getStatus())).toBeUndefined();
});

test('onStatusChange starts from the status in effect', async ({ page }) => {
    await visit(page);
    await expect(dialog(page)).toBeVisible();

    const received = await page.evaluate(() => {
        const purposes: unknown[] = [];
        (window as any).CookieSolution.onStatusChange((status: any) => purposes.push(status.purposes));
        return purposes;
    });

    expect(received).toEqual([deniedPurposes]);
});

test('derived highlight colors are opaque and button text follows the luminance', async ({ page }) => {
    const accept = () => banner(page).getByRole('button', { name: content.texts.button_accept_all });

    await visit(page, { config: { ...boot, highlight_color: 'rgb(37 99 235 / 40%)' } });
    await expect(accept()).toHaveCSS('background-color', 'color(srgb 0.145098 0.388235 0.921569)');
    await expect(accept()).toHaveCSS('color', 'color(xyz-d65 0.9505 1 1.089)');

    await page.evaluate(() =>
        (window as any).CookieSolution.mount({ ...(window as any)._cookieSolution, highlight_color: '#fbbf24' }),
    );
    await expect(accept()).toHaveCSS('color', 'color(xyz-d65 0 0 0)');
});

test('highlight_color wins over the page CSS variable, which applies when it is null', async ({ page }) => {
    const pageColor = '<style>:root { --cs--color-highlight: #0f766e; }</style>';
    const refuse = () => banner(page).getByRole('button', { name: content.texts.button_refuse });
    const accept = () => banner(page).getByRole('button', { name: content.texts.button_accept_all });

    await visit(page, { body: pageColor, config: { ...boot, highlight_color: '#2563eb' } });
    await expect(accept()).toHaveCSS('background-color', 'color(srgb 0.145098 0.388235 0.921569)');

    await refuse().click();
    await page.evaluate(() =>
        (window as any).CookieSolution.mount({ ...(window as any)._cookieSolution, highlight_color: null }),
    );
    await toggle(page).getByRole('button').click();
    await expect(accept()).toHaveCSS('background-color', 'color(srgb 0.0588235 0.462745 0.431373)');
});

// Luminance of theme colors as rendered in the banner; the canvas resolves any color format to sRGB.
async function themeLuminance(page: Page, variables: string[]): Promise<Record<string, number>> {
    return banner(page).evaluate(async (host, variables) => {
        await (host as any).updateComplete;
        const context = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
        const linear = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

        return Object.fromEntries(
            variables.map((variable) => {
                const probe = document.createElement('i');
                probe.style.color = `var(${variable})`;
                host.shadowRoot!.append(probe);
                context.fillStyle = getComputedStyle(probe).color;
                probe.remove();
                context.fillRect(0, 0, 1, 1);
                const [r, g, b] = context.getImageData(0, 0, 1, 1).data;

                return [variable, 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)];
            }),
        );
    }, variables);
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

for (const [scheme, backgrounds] of [
    ['light', ['--color-white']],
    ['dark', ['--color-white', '--color-gray-50', '--color-track']],
] as const) {
    test(`text and highlight stay readable in the ${scheme} color scheme`, async ({ page }) => {
        await visit(page, { config: { ...boot, color_scheme: scheme } });
        await expect(dialog(page)).toBeVisible();

        for (const highlight_color of [null, '#334155', '#0e7490', '#fbbf24', '#ffffff', '#000000']) {
            await page.evaluate(
                (highlight_color) =>
                    (window as any).CookieSolution.mount({ ...(window as any)._cookieSolution, highlight_color }),
                highlight_color,
            );
            const colors = await themeLuminance(page, [
                ...backgrounds,
                '--color-gray-900',
                '--color-gray-700',
                '--color-gray-600',
                '--color-gray-500',
                '--color-highlight-ink',
                '--color-highlight',
            ]);

            for (const background of backgrounds) {
                for (const [variable, minimum] of [
                    ['--color-gray-900', 4.5],
                    ['--color-gray-700', 4.5],
                    ['--color-gray-600', 4.5],
                    // Ordered-list markers are text.
                    ['--color-gray-500', 4.5],
                    ['--color-highlight-ink', 4.5],
                    ['--color-highlight', 3],
                ] as const) {
                    expect(
                        contrast(colors[variable], colors[background]),
                        `${variable} on ${background}, highlight ${highlight_color}`,
                    ).toBeGreaterThanOrEqual(minimum);
                }
            }
        }
    });
}

test('the page CSS variables override the theme colors, nested components included', async ({ page }) => {
    await visit(page, {
        body: '<style>:root { --cs--color-background: #000; --cs--color-text: #fff; }</style>',
        config: { ...boot, color_scheme: 'dark' },
    });
    await expect(dialog(page)).toBeVisible();
    expect(await themeLuminance(page, ['--color-white', '--color-gray-900'])).toEqual({
        '--color-white': 0,
        '--color-gray-900': 1,
    });
    await banner(page).getByRole('tab', { name: content.texts.tab_customize }).click();
    await expect(banner(page).getByRole('switch', { checked: false }).first()).toHaveCSS(
        'background-color',
        'rgb(0, 0, 0)',
    );
});

test('the auto color scheme follows the system setting', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await visit(page, { config: { ...boot, color_scheme: 'auto' } });
    await expect(dialog(page)).toBeVisible();
    expect((await themeLuminance(page, ['--color-white']))['--color-white']).toBeLessThan(0.05);

    await page.emulateMedia({ colorScheme: 'light' });
    expect((await themeLuminance(page, ['--color-white']))['--color-white']).toBe(1);
});

test('the policy formatter applies its highlight-color attribute and keeps a variable set by the page', async ({
    page,
}) => {
    const formatter = (id: string) => page.locator(`#${id}`);
    const highlight = (id: string) =>
        formatter(id).evaluate((el) => getComputedStyle(el).getPropertyValue('--cs--color-highlight'));

    await visit(page, {
        body: `<cookie-solution-policy-formatter id="attribute" highlight-color="#2563eb"><p>a</p></cookie-solution-policy-formatter>
            <cookie-solution-policy-formatter id="inline" style="--cs--color-highlight: #0f766e"><p>b</p></cookie-solution-policy-formatter>`,
    });

    await expect.poll(() => highlight('attribute')).toBe('#2563eb');
    expect(await highlight('inline')).toBe('#0f766e');

    await formatter('attribute').evaluate((el) => el.removeAttribute('highlight-color'));
    await expect.poll(() => highlight('attribute')).toBe('');
});

test('the banner shows a focus ring only after a key press', async ({ page }) => {
    await visit(page);
    await expect(dialog(page)).toBeFocused();
    const outline = () =>
        banner(page).evaluate((host) => getComputedStyle(host.shadowRoot!.activeElement!).outlineStyle);
    expect(await outline()).toBe('none');

    await page.keyboard.press('Tab');

    await expect(banner(page).getByRole('tab', { name: content.texts.tab_consent })).toBeFocused();
    expect(await outline()).toBe('solid');
});

test.describe('floating layout', () => {
    test.beforeEach(() => test.skip(layout() !== 'floating', 'Only the floating layout leaves the page usable'));

    test('the page stays interactive while the banner is open', async ({ page }) => {
        await visit(page, {
            body: `<button id="page-button" onclick="this.textContent = 'clicked'">Page</button><div style="height: 3000px"></div>`,
        });
        await expect(dialog(page)).toBeVisible();

        await page.click('#page-button');
        await expect(page.locator('#page-button')).toHaveText('clicked');

        await page.mouse.wheel(0, 500);
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
        await expect(dialog(page)).toBeVisible();
    });

    test('Esc dismisses only with focus inside the banner', async ({ page }) => {
        await visit(page, { body: '<button id="page-button">Page</button>' });
        await expect(dialog(page)).toBeVisible();

        await page.focus('#page-button');
        await page.keyboard.press('Escape');
        await expect(dialog(page)).toBeVisible();
        expect(await storedPurposes(page)).toBeUndefined();

        await banner(page).getByRole('tab', { name: content.texts.tab_customize }).focus();
        await page.keyboard.press('Escape');
        await expect(dialog(page)).toBeHidden();
        const refused = { necessary: true, preferences: false, statistics: false, marketing: false };
        expect(await storedPurposes(page)).toEqual(refused);

        await toggle(page).getByRole('button').click();
        await expect(dialog(page)).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dialog(page)).toBeHidden();
        expect(await storedPurposes(page)).toEqual(refused);
        await expect(toggle(page).getByRole('button')).toBeFocused();
    });
});
