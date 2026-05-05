import { describe, expect, it } from 'vitest';

import { buildManagedRestoreCandidates } from '../../lib/authManagedRestoreUtils';

describe('authManagedRestoreUtils', () => {
    it('active account を先頭に置き、fallback では active と parentClient を除外する', () => {
        expect(
            buildManagedRestoreCandidates({
                activePubkey: 'active-pub',
                activeType: 'nsec',
                accounts: [
                    { pubkeyHex: 'active-pub', type: 'nsec' },
                    { pubkeyHex: 'parent-pub', type: 'parentClient' },
                    { pubkeyHex: 'fallback-pub', type: 'nip07' },
                ],
            }),
        ).toEqual([
            { pubkeyHex: 'active-pub', type: 'nsec', activateOnSuccess: false },
            { pubkeyHex: 'fallback-pub', type: 'nip07', activateOnSuccess: true },
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