import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

// Vite's `?raw` imports, for Node.
registerHooks({
    load(url, context, nextLoad) {
        if (!url.endsWith('?raw')) {
            return nextLoad(url, context);
        }

        const text = readFileSync(fileURLToPath(url.slice(0, -'?raw'.length)), 'utf8');

        return { format: 'module', source: `export default ${JSON.stringify(text)};`, shortCircuit: true };
    },
});

const { savedStatusScript } = await import('./saved-status-script.ts');

const config = { cookie_name: 'cs', digest: 'abc' };
const status = {
    timestamp: '2026-01-01T00:00:00Z',
    digest: 'abc',
    purposes: { necessary: true, preferences: false, statistics: true, marketing: false },
};

globalThis.window = globalThis;
globalThis.document = { cookie: '' };

test('savedStatusScript defines a reader of the saved consent', () => {
    new Function(savedStatusScript(config))();

    document.cookie = `cs=${encodeURIComponent(JSON.stringify(status))}`;
    assert.deepEqual(window.cookieSolutionSavedStatus(), status);

    document.cookie = `cs=${encodeURIComponent(JSON.stringify({ ...status, digest: 'stale' }))}`;
    assert.equal(window.cookieSolutionSavedStatus(), undefined);
});

test('savedStatusScript escapes the config for an inline script', () => {
    assert.ok(!savedStatusScript({ cookie_name: '</script>', digest: 'abc' }).includes('</script>'));
});
