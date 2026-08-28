import { FALLBACK_RELAYS } from "./relayLists";
import { isHostRelayConfigActive } from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayConfig } from "./types";

export function resolvePostHistoryRelayUrls(
    relayConfig: RelayConfig | null | undefined,
    relayLimit: number,
): string[] {
    const configuredRelays = relayConfig
        ? isHostRelayConfigActive()
            ? RelayConfigUtils.extractReadRelays(relayConfig)
            : [
                ...RelayConfigUtils.extractReadRelays(relayConfig),
                ...RelayConfigUtils.extractWriteRelays(relayConfig),
            ]
        : [];
    const relayUrls = RelayConfigUtils.sanitizeExternalRelayUrls(configuredRelays, {
        limit: relayLimit,
    });

    return relayUrls.length > 0 || isHostRelayConfigActive()
        ? relayUrls
        : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS, { limit: relayLimit });
}
