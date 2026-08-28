import { FALLBACK_RELAYS } from "./relayLists";
import {
    getHostReadRelayDefaults,
    isHostRelayConfigActive,
} from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayConfig } from "./types";

export function resolvePostHistoryRelayUrls(
    relayConfig: RelayConfig | null | undefined,
    relayLimit: number,
): string[] {
    if (isHostRelayConfigActive()) {
        return getHostReadRelayDefaults();
    }

    const configuredRelays = relayConfig
        ? [
            ...RelayConfigUtils.extractReadRelays(relayConfig),
            ...RelayConfigUtils.extractWriteRelays(relayConfig),
        ]
        : [];
    const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(configuredRelays, {
        limit: relayLimit,
    });

    return relayUrls.length > 0
        ? relayUrls
        : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS, { limit: relayLimit });
}
