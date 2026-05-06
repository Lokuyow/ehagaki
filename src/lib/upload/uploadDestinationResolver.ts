import { nip19 } from "nostr-tools";
import type { UploadDestination } from "../types";

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

export function resolveUploadDestinationForUse(
    destination: UploadDestination,
    identity: UploadDestinationIdentity,
): UploadDestination {
    const withoutResolvedUploadUrl = destination.protocol === "nip96"
        ? destination
        : stripOptionalField(destination, "resolvedUploadUrl");

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
