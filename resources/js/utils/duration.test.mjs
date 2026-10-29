import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration } from './duration.ts';

test('formatDuration', () => {
    assert.equal(formatDuration(0, 'it', 'Sessione'), 'Sessione');
    assert.equal(formatDuration(1, 'en', ''), '1 day');
    assert.equal(formatDuration(60, 'it', ''), '2 mesi');
    assert.equal(formatDuration(730, 'de', ''), '2 Jahre');
    assert.equal(formatDuration(365, 'ja', ''), '1 年');
    assert.equal(formatDuration(14, 'pt_BR', ''), '14 dias');
});
