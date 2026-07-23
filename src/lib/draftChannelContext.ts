import {
    CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT,
    CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
} from "./channelContextConstants";
import {
    buildEffectiveChannelContext,
    type ChannelContextProvenance,
} from "./channelContextRuntime";
import { RelayConfigUtils } from "./relayConfigUtils";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    DraftChannelData,
    DraftChannelDataV2,
} from "./types";

export interface DecodedDraftChannelContext {
    query: ChannelContextQueryTarget;
    provenance: ChannelContextProvenance | null;
}

function sanitizeRelayHints(relays: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays, {
        limit: CHANNEL_TEMPORARY_READ_RELAY_LIMIT,
    });
}

function sanitizeChannelRelayCandidates(relays: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(relays, {
        limit: CHANNEL_ADDITIONAL_WRITE_RELAY_LIMIT,
    });
}

function cloneMetadataOverrides(
    overrides: DraftChannelDataV2["overrides"],
): DraftChannelDataV2["overrides"] {
    if (!overrides) return undefined;
    const cloned: NonNullable<DraftChannelDataV2["overrides"]> = {};
    for (const field of ["name", "about", "picture"] as const) {
        if (Object.prototype.hasOwnProperty.call(overrides, field)) {
            cloned[field] = overrides[field] ?? null;
        }
    }
    return Object.keys(cloned).length > 0 ? cloned : undefined;
}

export function isDraftChannelDataV2(
    value: DraftChannelData,
): value is DraftChannelDataV2 {
    return value.version === 2;
}

export function serializeDraftChannelContext(
    context: ChannelContextState | null,
    provenance: ChannelContextProvenance | null,
): DraftChannelData | undefined {
    if (!context) return undefined;

    const channelRelayCandidates = sanitizeChannelRelayCandidates(
        context.channelRelays,
    );
    const overrides = cloneMetadataOverrides(provenance?.metadataOverrides);

    return {
        version: 2,
        eventId: context.eventId,
        relayHints: sanitizeRelayHints(context.relayHints),
        ...(channelRelayCandidates.length > 0
            ? { channelRelayCandidates }
            : {}),
        seedMetadata: {
            name: context.name,
            about: context.about,
            picture: context.picture,
        },
        ...(overrides ? { overrides } : {}),
    };
}

export function decodeDraftChannelContext(
    data: DraftChannelData,
): DecodedDraftChannelContext {
    if (isDraftChannelDataV2(data)) {
        const channelRelayCandidates = sanitizeChannelRelayCandidates(
            data.channelRelayCandidates,
        );
        const overrides = cloneMetadataOverrides(data.overrides);
        return {
            query: {
                eventId: data.eventId,
                relayHints: sanitizeRelayHints(data.relayHints),
                ...(channelRelayCandidates.length > 0
                    ? { channelRelays: channelRelayCandidates }
                    : {}),
                name: data.seedMetadata?.name ?? null,
                about: data.seedMetadata?.about ?? null,
                picture: data.seedMetadata?.picture ?? null,
            },
            provenance: overrides
                ? {
                    source: "draft",
                    metadataOverrides: overrides,
                }
                : null,
        };
    }

    return {
        query: {
            eventId: data.eventId,
            // V1 did not preserve relay provenance. A saved channel relay may
            // have been an iframe / URL runtime override, so it is discarded
            // rather than restored as either a read or write candidate.
            relayHints: sanitizeRelayHints(data.relayHints),
            // V1 cannot distinguish an explicit value from a cached or temporary
            // presentation value, so every field is a replaceable seed.
            name: data.name ?? null,
            about: data.about ?? null,
            picture: data.picture ?? null,
        },
        provenance: null,
    };
}

export function getDraftEffectiveChannelContext(
    data: DraftChannelData,
): ChannelContextState {
    const { query, provenance } = decodeDraftChannelContext(data);
    const stable: ChannelContextState = {
        eventId: query.eventId,
        relayHints: [...query.relayHints],
        ...(query.channelRelays
            ? { channelRelays: [...query.channelRelays] }
            : {}),
        name: query.name ?? null,
        about: query.about ?? null,
        picture: query.picture ?? null,
    };
    return buildEffectiveChannelContext(stable, provenance);
}
