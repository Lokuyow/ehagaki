import { nip19 } from "nostr-tools";
import type { UploadDestination } from "../types";
import {
    findUploadDestinationPresetIdentity,
    normalizeServerUrl,
} from "./uploadDestinationPresets";

const BLOSSOM_BAND_HOST = "blossom.band";

export interface UploadDestinationIdentity {
    pubkeyHex?: string | null;
    npub?: string | null;
}

function stripOptionalField<T extends object, K extends keyof T>(value: T, key: K): Omit<T, K> {
    const { [key]: _removed, ...rest } = value;
    return rest;
}

function getNpub(identity: UploadDestinationIdentity): string | null {
    if (identity.npub?.startsWith("npub1")) return identity.npub;
    if (!identity.pubkeyHex) return null;

    try {
        return nip19.npubEncode(identity.pubkeyHex);
    } catch {
        return null;
    }
}

export function resolveBlossomBandServerUrl(identity: UploadDestinationIdentity): string | null {
    const npub = getNpub(identity);
    return npub ? `https://${npub}.${BLOSSOM_BAND_HOST}` : null;
}

function resolveNip96PresetUploadUrl(destination: UploadDestination): UploadDestination {
    const preset = findUploadDestinationPresetIdentity(destination);
    if (!preset?.resolvedUploadUrl) return destination;

    const resolvedUploadUrl = destination.resolvedUploadUrl;
    const normalizedResolvedUrl = resolvedUploadUrl ? normalizeServerUrl(resolvedUploadUrl) : "";
    const isKnownResolvedUrl = !resolvedUploadUrl
        || normalizedResolvedUrl === normalizeServerUrl(preset.serverUrl)
        || normalizedResolvedUrl === normalizeServerUrl(preset.resolvedUploadUrl);

    if (!isKnownResolvedUrl || resolvedUploadUrl === preset.resolvedUploadUrl) {
        return destination;
    }

    return {
        ...destination,
        resolvedUploadUrl: preset.resolvedUploadUrl,
    };
}

export function resolveUploadDestinationForUse(
    destination: UploadDestination,
    identity: UploadDestinationIdentity,
): UploadDestination {
    if (destination.protocol === "nip96") {
        return resolveNip96PresetUploadUrl(destination);
    }

    const withoutResolvedUploadUrl = stripOptionalField(destination, "resolvedUploadUrl");

    if (destination.protocol !== "blossom" || destination.presetId !== "blossom-band") {
        return withoutResolvedUploadUrl;
    }

    const serverUrl = resolveBlossomBandServerUrl(identity);
    return serverUrl
        ? {
            ...withoutResolvedUploadUrl,
            serverUrl,
        }
        : withoutResolvedUploadUrl;
}
