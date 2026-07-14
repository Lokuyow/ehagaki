import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";

export interface ProfileRelayTiers {
    bootstrap: string[];
    contextual: string[];
    fallback: string[];
}

export function buildProfileRelayTiers(
    contextualRelays: string[],
    contextualRelayLimit: number,
): ProfileRelayTiers {
    const bootstrap = RelayConfigUtils.sanitizeExternalRelayUrls(BOOTSTRAP_RELAYS);
    const bootstrapSet = new Set(bootstrap);
    const fallback = RelayConfigUtils.sanitizeExternalRelayUrls(FALLBACK_RELAYS)
        .filter((relay) => !bootstrapSet.has(relay));
    const reservedRelays = new Set([...bootstrap, ...fallback]);
    const contextual = RelayConfigUtils.sanitizeExternalRelayUrls(contextualRelays)
        .filter((relay) => !reservedRelays.has(relay))
        .slice(0, contextualRelayLimit);

    return { bootstrap, contextual, fallback };
}
