import { describe, expect, it, vi } from 'vitest';
import { MockStorage } from '../helpers';
import {
    DEFAULT_NIP46_CONNECTION_RELAY_CANDIDATES,
    extractNip46ConnectionUriRelays,
    getDefaultNip46ConnectionRelayCandidates,
    openNip46ConnectionUri,
    resolveInitialNip46ConnectionRelayCandidates,
    saveLastUsedNip46ConnectionRelayCandidates,
    validateNip46ConnectionRelayDrafts,
} from '../../lib/nip46ConnectUiUtils';

describe('nip46ConnectUiUtils', () => {
    it('default relay candidate 4件は重複なく定義順で有効化される', () => {
        expect(DEFAULT_NIP46_CONNECTION_RELAY_CANDIDATES).toEqual([
            'wss://nostr.oxtr.dev/',
            'wss://theforest.nostr1.com/',
            'wss://relay.primal.net/',
            'wss://ephemeral.snowflare.cc/',
        ]);
        expect(getDefaultNip46ConnectionRelayCandidates()).toEqual([
            'wss://nostr.oxtr.dev/',
            'wss://theforest.nostr1.com/',
            'wss://relay.primal.net/',
            'wss://ephemeral.snowflare.cc/',
        ]);
    });

    it('saved valid relay candidate 一覧がある場合は default より優先して初期値に使う', () => {
        const storage = new MockStorage();

        saveLastUsedNip46ConnectionRelayCandidates(storage, [
            'wss://relay.saved.example.com/',
            'wss://relay.saved2.example.com/',
        ]);

        expect(resolveInitialNip46ConnectionRelayCandidates(storage)).toEqual([
            'wss://relay.saved.example.com/',
            'wss://relay.saved2.example.com/',
        ]);
    });

    it('saved relay candidate 一覧が invalid の場合は default candidates に fallback する', () => {
        const storage = new MockStorage();
        storage.setItem(
            'nostr-nip46-connect-relays',
            JSON.stringify(['https://invalid.example.com']),
        );

        expect(resolveInitialNip46ConnectionRelayCandidates(storage)).toEqual([
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

        expect(validateNip46ConnectionRelayDrafts(['ws://~'])).toEqual({
            relays: ['ws://~/'],
            errorKey: null,
        });

        expect(
            validateNip46ConnectionRelayDrafts(['ws://127.0.0.1:4869/']),
        ).toEqual({
            relays: ['ws://127.0.0.1:4869/'],
            errorKey: null,
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

    it('nostrconnect URI から ready relay subset を取り出す', () => {
        expect(
            extractNip46ConnectionUriRelays(
                'nostrconnect://client?relay=wss%3A%2F%2Frelay.ready.example.com%2F&relay=https%3A%2F%2Finvalid.example.com',
            ),
        ).toEqual(['wss://relay.ready.example.com/']);
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
describe('resolveNip46NostrConnectErrorDisplay', () => {
    const flatten = (value: unknown, prefix = ''): string[] =>
        value && typeof value === 'object'
            ? Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
                flatten(child, prefix ? `${prefix}.${key}` : key))
            : [prefix];

    it('maps every message nip46Service throws to a key present in both locales', async () => {
        const { resolveNip46NostrConnectErrorDisplay } = await import('../../lib/nip46ConnectUiUtils');
        const { NIP46_ERROR_MESSAGES } = await import('../../lib/nip46ErrorMessages');
        const ja = new Set(flatten((await import('../../lib/i18n/ja.json')).default));
        const en = new Set(flatten((await import('../../lib/i18n/en.json')).default));

        for (const [name, message] of Object.entries(NIP46_ERROR_MESSAGES)) {
            const display = resolveNip46NostrConnectErrorDisplay(message);
            if (name === 'nostrConnectCancelled') {
                expect(display).toEqual({ kind: 'hidden' });
                continue;
            }
            expect(display.kind, name).toBe('key');
            if (display.kind !== 'key') continue;
            expect(ja.has(display.key), `ja ${display.key}`).toBe(true);
            expect(en.has(display.key), `en ${display.key}`).toBe(true);
        }
    });

    it('treats any relay connection failure detail as a connection failure', async () => {
        const { resolveNip46NostrConnectErrorDisplay } = await import('../../lib/nip46ConnectUiUtils');
        const { formatNip46RelayConnectionFailure } = await import('../../lib/nip46ErrorMessages');

        expect(resolveNip46NostrConnectErrorDisplay(formatNip46RelayConnectionFailure('no reachable relays')))
            .toEqual({ kind: 'key', key: 'loginDialog.nostrconnect_connection_failed' });
        expect(resolveNip46NostrConnectErrorDisplay('Relay connection failed'))
            .toEqual({ kind: 'key', key: 'loginDialog.nostrconnect_connection_failed' });
    });

    it('passes unknown messages through unchanged', async () => {
        const { resolveNip46NostrConnectErrorDisplay } = await import('../../lib/nip46ConnectUiUtils');

        expect(resolveNip46NostrConnectErrorDisplay('Something else'))
            .toEqual({ kind: 'raw', message: 'Something else' });
    });
});
