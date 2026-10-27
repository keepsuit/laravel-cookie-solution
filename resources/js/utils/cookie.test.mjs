import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readStatus, writeStatus } from './cookie.ts';

const config = { cookie_name: 'cs', cookie_lifetime: 10, digest: 'abc' };
const status = {
    timestamp: '2026-01-01T00:00:00Z',
    purposes: { necessary: true, preferences: false, statistics: true, marketing: false },
};
const cookie = (value) => `cs=${encodeURIComponent(JSON.stringify(value))}`;

globalThis.document = { cookie: '', location: { protocol: 'https:' } };

test('readStatus', () => {
    document.cookie = '';
    assert.equal(readStatus(config), undefined);

    document.cookie = cookie({ ...status, digest: 'other' });
    assert.equal(readStatus(config), undefined);

    document.cookie = 'cs=not-json';
    assert.equal(readStatus(config), undefined);

    document.cookie = `other=1; ${cookie({ ...status, digest: 'abc' })}`;
    assert.deepEqual(readStatus(config), { ...status, digest: 'abc' });
});

test('writeStatus uses digest and cookie_lifetime', () => {
    writeStatus(config, { ...status });

    const expires = Date.parse(document.cookie.match(/expires=([^;]+)/)[1]);
    assert.ok(Math.abs(expires - (Date.now() + 10 * 86400000)) < 2000);
    assert.deepEqual(readStatus(config), { ...status, digest: 'abc' });
});

test('writeStatus does not mutate its argument', () => {
    const input = { ...status };
    writeStatus(config, input);
    assert.equal(input.digest, undefined);
});

test('readStatus rejects tampered purposes', () => {
    for (const purposes of [null, 'yes', { ...status.purposes, marketing: 'true' }]) {
        document.cookie = cookie({ ...status, digest: 'abc', purposes });
        assert.equal(readStatus(config), undefined);
    }
});
