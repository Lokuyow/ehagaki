import { CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT } from "./channelContextConstants";
import { normalizeChannelPictureUrl } from "./channelPictureUrlUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { ChannelContextQueryTarget, ChannelContextState } from "./types";

export type ChannelContextExternalSource = "iframe" | "url" | "manual";
export type ChannelContextProvenanceSource = ChannelContextExternalSource | "draft";
export type ChannelContextResolutionPhase =
    | "idle"
    | "loading"
    | "ready"
    | "refreshing"
    | "refresh-failed"
    | "unavailable";
export type ChannelContextRuntimeQuality =
    | "legacy-seed"
    | "verified-root-only"
    | "verified-metadata";

export interface ChannelContextRuntimeState {
    phase: ChannelContextResolutionPhase;
    quality: ChannelContextRuntimeQuality | null;
    source: "seed" | "cache" | "network" | null;
}

export interface ChannelMetadataOverrides {
    name?: string | null;
    about?: string | null;
    picture?: string | null;
}

/**
 * Runtime-only origin information. It stays separate from the stable cache /
 * draft context; posting and preview derive an effective context from both.
 */
export interface ChannelContextProvenance {
    source: ChannelContextProvenanceSource;
    metadataOverrides: ChannelMetadataOverrides;
    channelRelayOverrides?: string[];
}

export interface PreparedExternalChannelContext {
    coordinatorQuery: ChannelContextQueryTarget;
    provenance: ChannelContextProvenance;
}

const METADATA_FIELDS = ["name", "about", "picture"] as const;

function hasOwn(value: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(value, key);
}

export function prepareExternalChannelContext(
    query: ChannelContextQueryTarget,
    source: ChannelContextExternalSource,
): PreparedExternalChannelContext {
    const metadataOverrides: ChannelMetadataOverrides = {};
    for (const field of METADATA_FIELDS) {
        if (hasOwn(query, field) && query[field] !== undefined) {
            if (field !== "picture") {
                metadataOverrides[field] = query[field] ?? null;
                continue;
            }
            if (query.picture === null) {
                metadataOverrides.picture = null;
                continue;
            }
            const picture = normalizeChannelPictureUrl(query.picture ?? "");
            if (picture) metadataOverrides.picture = picture;
        }
    }

    // All untrusted relays share one budget. Explicit write overrides reserve
    // the budget first; only the remaining slots may be used by reference hints.
    const channelRelayOverrides = RelayConfigUtils.sanitizeExternalRelayUrls(
        query.channelRelays,
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );
    const overrideSet = new Set(channelRelayOverrides);
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls(
        query.relayHints,
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    )
        .filter((relay) => !overrideSet.has(relay))
        .slice(
            0,
            Math.max(
                0,
                RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT
                    - channelRelayOverrides.length,
            ),
        );

    return {
        coordinatorQuery: {
            eventId: query.eventId,
            relayHints,
        },
        provenance: {
            source,
            metadataOverrides,
            ...(channelRelayOverrides.length > 0 ? { channelRelayOverrides } : {}),
        },
    };
}

export function buildEffectiveChannelContext(
    context: ChannelContextState,
    provenance: ChannelContextProvenance | null,
): ChannelContextState {
    if (!provenance) {
        return {
            ...context,
            relayHints: [...context.relayHints],
            ...(context.channelRelays
                ? { channelRelays: [...context.channelRelays] }
                : {}),
        };
    }
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

export function isChannelPictureCacheEligible(
    runtime: ChannelContextRuntimeState,
    provenance: ChannelContextProvenance | null,
): boolean {
    return runtime.quality === "verified-metadata"
        && !(provenance && hasOwn(provenance.metadataOverrides, "picture"));
}
