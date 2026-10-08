import { FALLBACK_RELAYS } from "./relayLists";
import {
    getHostReadRelayDefaults,
    isHostRelayConfigActive,
} from "./hostRelayRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayConfig } from "./types";

/** Authored history uses write-first ordering, including the existing recent-query cap. */
export function resolvePostHistoryAuthoredRelayUrls(relayConfig: RelayConfig | null | undefined): string[] {
    if (isHostRelayConfigActive()) return getHostReadRelayDefaults();
    const relays = RelayConfigUtils.sanitizeExternalRelayUrls(relayConfig ? [
        ...RelayConfigUtils.extractWriteRelays(relayConfig),
        ...RelayConfigUtils.extractReadRelays(relayConfig),
    ] : []);
    return relays.length ? relays : RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS);
}

export function getPostHistoryAuthoredRelayScopeKey(relayConfig: RelayConfig | null | undefined): string {
    return JSON.stringify([isHostRelayConfigActive(), resolvePostHistoryAuthoredRelayUrls(relayConfig), relayConfig ?? null]);
}

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
