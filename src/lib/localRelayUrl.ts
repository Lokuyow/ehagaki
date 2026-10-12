import { RelayConfigUtils } from "./relayConfigUtils";

/** User-entered device preference; never a NIP-65 relay configuration. */
export function normalizeLocalRelayUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!/^wss?:\/\//i.test(trimmed)) return null;
    try {
        const url = new URL(trimmed);
        if (url.hash || url.username || url.password) return null;
        return RelayConfigUtils.normalizeExternalRelayUrl(trimmed);
    } catch {
        return null;
    }
}
