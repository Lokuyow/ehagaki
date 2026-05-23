import { describe, expect, it, vi } from 'vitest';
import { MockStorage } from '../helpers';
import {
    DEFAULT_NIP46_CONNECTION_RELAYS,
    getDefaultNip46ConnectionRelays,
    openNip46ConnectionUri,
    resolveInitialNip46ConnectionRelays,
    saveLastUsedNip46ConnectionRelays,
    validateNip46ConnectionRelayDrafts,
} from '../../lib/nip46ConnectUiUtils';

describe('nip46ConnectUiUtils', () => {
    it('default relay 4件は重複なく定義順で有効化される', () => {
        expect(DEFAULT_NIP46_CONNECTION_RELAYS).toEqual([
            'wss://nostr.oxtr.dev/',
            'wss://theforest.nostr1.com/',
            'wss://relay.primal.net/',
            'wss://ephemeral.snowflare.cc/',
        ]);
        expect(getDefaultNip46ConnectionRelays()).toEqual([
            'wss://nostr.oxtr.dev/',
            'wss://theforest.nostr1.com/',
            'wss://relay.primal.net/',
            'wss://ephemeral.snowflare.cc/',
        ]);
    });

    it('saved valid relay 一覧がある場合は default より優先して初期値に使う', () => {
        const storage = new MockStorage();

        saveLastUsedNip46ConnectionRelays(storage, [
            'wss://relay.saved.example.com/',
            'wss://relay.saved2.example.com/',
        ]);

        expect(resolveInitialNip46ConnectionRelays(storage)).toEqual([
            'wss://relay.saved.example.com/',
            'wss://relay.saved2.example.com/',
        ]);
    });

    it('saved relay 一覧が invalid の場合は default relay に fallback する', () => {
        const storage = new MockStorage();
        storage.setItem(
            'nostr-nip46-connect-relays',
            JSON.stringify(['https://invalid.example.com']),
        );

        expect(resolveInitialNip46ConnectionRelays(storage)).toEqual([
            'wss://nostr.oxtr.dev/',
            'wss://theforest.nostr1.com/',
            'wss://relay.primal.net/',
            'wss://ephemeral.snowflare.cc/',
        ]);
    });

    it('relay draft validation は required / invalid / dedupe を区別する', () => {
        expect(validateNip46ConnectionRelayDrafts(['', '   '])).toEqual({
            relays: [],
            errorKey: 'loginDialog.nostrconnect_relay_required',
        });

        expect(
            validateNip46ConnectionRelayDrafts([
                'wss://relay.example.com',
                'https://invalid.example.com',
            ]),
        ).toEqual({
            relays: ['wss://relay.example.com/'],
            errorKey: 'loginDialog.nostrconnect_relay_invalid',
        });

        expect(
            validateNip46ConnectionRelayDrafts([
                'wss://relay.example.com',
                'wss://relay.example.com/',
                '',
            ]),
        ).toEqual({
            relays: ['wss://relay.example.com/'],
            errorKey: null,
        });
    });

    it('direct-open helper は生成済み URI を location.assign へ渡す', () => {
        const assign = vi.fn();

        expect(
            openNip46ConnectionUri(
                'nostrconnect://client?relay=wss://relay.example.com',
                { assign },
            ),
        ).toBe(true);
        expect(assign).toHaveBeenCalledWith(
            'nostrconnect://client?relay=wss://relay.example.com',
        );
    });
});