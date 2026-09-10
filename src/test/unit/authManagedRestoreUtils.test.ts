import { describe, expect, it } from 'vitest';

import { buildManagedRestoreCandidates } from '../../lib/authManagedRestoreUtils';

describe('authManagedRestoreUtils', () => {
    it('有効なactive accountだけを復元候補にする', () => {
        expect(
            buildManagedRestoreCandidates({
                activePubkey: 'aa'.repeat(32),
                activeType: 'nsec',
                accounts: [
                    { pubkeyHex: 'aa'.repeat(32), type: 'nsec' },
                    { pubkeyHex: 'parent-pub', type: 'parentClient' },
                    { pubkeyHex: 'fallback-pub', type: 'nip07' },
                ],
            }),
        ).toEqual([
            { pubkeyHex: 'aa'.repeat(32), type: 'nsec', activateOnSuccess: false },
        ]);
    });

    it('active が parentClient または不明なら fallback candidates だけを返す', () => {
        expect(
            buildManagedRestoreCandidates({
                activePubkey: 'parent-pub',
                activeType: 'parentClient',
                accounts: [
                    { pubkeyHex: 'parent-pub', type: 'parentClient' },
                    { pubkeyHex: 'fallback-pub', type: 'nsec' },
                ],
            }),
        ).toEqual([
            { pubkeyHex: 'fallback-pub', type: 'nsec', activateOnSuccess: true },
        ]);

        expect(
            buildManagedRestoreCandidates({
                activePubkey: 'missing-pub',
                activeType: null,
                accounts: [
                    { pubkeyHex: 'missing-pub', type: 'nip07' },
                    { pubkeyHex: 'fallback-pub', type: 'nip46' },
                ],
            }),
        ).toEqual([
            { pubkeyHex: 'fallback-pub', type: 'nip46', activateOnSuccess: true },
        ]);
    });
});