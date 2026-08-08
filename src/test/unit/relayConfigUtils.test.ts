import { describe, expect, it } from 'vitest';

import { RelayConfigUtils } from '../../lib/relayConfigUtils';
import { DECOMMISSIONED_RELAYS } from '../../lib/relayLists';

describe('RelayConfigUtils', () => {
    describe('normalizeExternalRelayUrl', () => {
        it('ws/wss の relay URL を nostr-tools ベースで正規化する', () => {
            expect(
                RelayConfigUtils.normalizeExternalRelayUrl('wss://relay.example.com////'),
            ).toBe('wss://relay.example.com/');
        });

        it('http/https と credential 付き URL を拒否する', () => {
            expect(
                RelayConfigUtils.normalizeExternalRelayUrl('https://relay.example.com'),
            ).toBeNull();
            expect(
                RelayConfigUtils.normalizeExternalRelayUrl('wss://user:pass@relay.example.com'),
            ).toBeNull();
        });

        it.each(DECOMMISSIONED_RELAYS)('サービス終了 relay の canonical URL を除外する: %s', (relay) => {
            expect(RelayConfigUtils.normalizeExternalRelayUrl(relay)).toBeNull();
            expect(RelayConfigUtils.normalizeExternalRelayUrl(relay.slice(0, -1))).toBeNull();
        });

        it('ホスト名の大文字小文字差と default port 443 も除外する', () => {
            expect(RelayConfigUtils.normalizeExternalRelayUrl('wss://RELAY.NOSTR.BAND')).toBeNull();
            expect(RelayConfigUtils.normalizeExternalRelayUrl('wss://relay.nostr.band:443')).toBeNull();
        });
    });

    describe('sanitizeExternalRelayUrls', () => {
        it('無効 URL を除外し重複排除と件数制限を行う', () => {
            expect(
                RelayConfigUtils.sanitizeExternalRelayUrls(
                    [
                        'wss://relay.example.com',
                        'wss://relay.example.com/',
                        'https://invalid.example.com',
                        'wss://relay-2.example.com',
                        'wss://relay-3.example.com',
                        'wss://relay-4.example.com',
                    ],
                    { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
                ),
            ).toEqual([
                'wss://relay.example.com/',
                'wss://relay-2.example.com/',
                'wss://relay-3.example.com/',
            ]);
        });

        it('類似ホスト、path、非default port は除外しない', () => {
            expect(RelayConfigUtils.sanitizeExternalRelayUrls([
                'wss://relay.nostr.band.example.com',
                'wss://relay.nostr.band/path',
                'wss://relay.nostr.band:444',
            ])).toEqual([
                'wss://relay.nostr.band.example.com/',
                'wss://relay.nostr.band/path',
                'wss://relay.nostr.band:444/',
            ]);
        });
    });

    describe('filterDecommissionedRelayConfig', () => {
        it('配列形式では対象 relay のみを順序を保って除外する', () => {
            expect(RelayConfigUtils.filterDecommissionedRelayConfig([
                DECOMMISSIONED_RELAYS[0],
                'wss://relay.example.com',
                'wss://nrelay.c-stellar.net',
            ])).toEqual(['wss://relay.example.com']);
        });

        it('object 形式では read/write 属性を維持する', () => {
            expect(RelayConfigUtils.filterDecommissionedRelayConfig({
                [DECOMMISSIONED_RELAYS[1]]: { read: true, write: false },
                'wss://relay.example.com': { read: false, write: true },
            })).toEqual({
                'wss://relay.example.com': { read: false, write: true },
            });
        });
    });
});
