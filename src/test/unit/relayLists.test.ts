import { describe, expect, it } from 'vitest';

import { DECOMMISSIONED_RELAYS, FALLBACK_RELAYS } from '../../lib/relayLists';
import { RelayConfigUtils } from '../../lib/relayConfigUtils';

describe('relay lists', () => {
    it('excludes Damus from fallback relays and decommissions its canonical URL', () => {
        expect(FALLBACK_RELAYS).not.toContain('wss://relay.damus.io/');
        expect(DECOMMISSIONED_RELAYS).toContain('wss://relay.damus.io/');
    });

    it('filters Damus from externally supplied relay configuration with or without a trailing slash', () => {
        expect(RelayConfigUtils.filterDecommissionedRelayConfig([
            'wss://relay.damus.io',
            'wss://relay.damus.io/',
            'wss://relay.example.com',
        ])).toEqual(['wss://relay.example.com']);
    });
});
