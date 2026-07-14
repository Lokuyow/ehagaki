import { BOOTSTRAP_RELAYS, FALLBACK_RELAYS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";

export interface ProfileRelayTiers {
    bootstrap: string[];
    contextual: string[];
    fallback: string[];
}

export interface ProfileRelayTierInput {
    contextualRelays: string[];
    fallbackRelays?: string[];
    contextualRelayLimit: number;
}

export interface ProfileRelayRequestGroup {
    relays: string[];
    pubkeys: string[];
}

export function buildProfileRelayTiers(
    input: ProfileRelayTierInput,
): ProfileRelayTiers {
    const bootstrap = RelayConfigUtils.sanitizeExternalRelayUrls(BOOTSTRAP_RELAYS);
    const bootstrapSet = new Set(bootstrap);
    const contextual = RelayConfigUtils.sanitizeExternalRelayUrls(input.contextualRelays)
        .filter((relay) => !bootstrapSet.has(relay))
        .slice(0, input.contextualRelayLimit);
    const contextualSet = new Set(contextual);
    const fallback = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...FALLBACK_RELAYS,
        ...(input.fallbackRelays ?? []),
    ]).filter((relay) => !bootstrapSet.has(relay) && !contextualSet.has(relay));

    return { bootstrap, contextual, fallback };
}

export function groupPubkeysByRelaySet(
    pubkeys: string[],
    relaysByPubkey: Readonly<Record<string, string[]>>,
): ProfileRelayRequestGroup[] {
    const groups = new Map<string, ProfileRelayRequestGroup>();

    for (const pubkey of pubkeys) {
        const requestRelays = RelayConfigUtils.sanitizeExternalRelayUrls(relaysByPubkey[pubkey]);
        if (requestRelays.length === 0) {
            continue;
        }

        const key = JSON.stringify(
            [...requestRelays].sort((left, right) => left.localeCompare(right)),
        );
        const group = groups.get(key);
        if (group) {
            group.pubkeys.push(pubkey);
        } else {
            groups.set(key, {
                relays: requestRelays,
                pubkeys: [pubkey],
            });
        }
    }

    return Array.from(groups.values());
}
