import { describe, expect, it } from 'vitest';

import { RelayConfigUtils } from '../../lib/relayConfigUtils';

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
    });
});