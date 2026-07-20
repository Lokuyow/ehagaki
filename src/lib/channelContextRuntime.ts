import { CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT } from "./channelContextConstants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { ChannelContextQueryTarget, ChannelContextState } from "./types";

export type ChannelContextExternalSource = "iframe" | "url";

export interface ChannelMetadataOverrides {
    name?: string | null;
    about?: string | null;
    picture?: string | null;
}

/**
 * Runtime-only origin information. It is intentionally separate from the
 * stable context used by posting and is not part of draft persistence yet.
 */
export interface ChannelContextProvenance {
    source: ChannelContextExternalSource;
    metadataOverrides: ChannelMetadataOverrides;
    channelRelayOverrides?: string[];
}

const METADATA_FIELDS = ["name", "about", "picture"] as const;

function hasOwn(value: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}

export function buildExternalChannelContextProvenance(
    query: ChannelContextQueryTarget,
    source: ChannelContextExternalSource,
): ChannelContextProvenance {
    const metadataOverrides: ChannelMetadataOverrides = {};
    for (const field of METADATA_FIELDS) {
        if (hasOwn(query, field)) {
            metadataOverrides[field] = query[field] ?? null;
        }
    }

    const channelRelayOverrides = RelayConfigUtils.sanitizeExternalRelayUrls(
        query.channelRelays,
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );

    return {
        source,
        metadataOverrides,
        ...(channelRelayOverrides.length > 0 ? { channelRelayOverrides } : {}),
    };
}

export function applyChannelContextProvenance(
    context: ChannelContextState,
    provenance: ChannelContextProvenance,
): ChannelContextState {
    const overridden = { ...context };
    for (const field of METADATA_FIELDS) {
        if (hasOwn(provenance.metadataOverrides, field)) {
            overridden[field] = provenance.metadataOverrides[field] ?? null;
        }
    }

    if (provenance.channelRelayOverrides?.length) {
        const channelRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.mergeRelayConfigs(
                provenance.channelRelayOverrides,
                context.channelRelays ?? [],
            ),
            { limit: CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT },
        );
        overridden.channelRelays = channelRelays;
    }

    return overridden;
}

export function cloneChannelContextProvenance(
    provenance: ChannelContextProvenance | null,
): ChannelContextProvenance | null {
    if (!provenance) return null;
    return {
        source: provenance.source,
        metadataOverrides: { ...provenance.metadataOverrides },
        ...(provenance.channelRelayOverrides
            ? { channelRelayOverrides: [...provenance.channelRelayOverrides] }
            : {}),
    };
}
