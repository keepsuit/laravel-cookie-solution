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
