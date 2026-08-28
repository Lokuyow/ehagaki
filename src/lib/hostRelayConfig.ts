import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayConfig } from "./types";

/** Public, mount-scoped relay input accepted by Full embeds. */
export interface HostRelayConfigEntry {
    readonly url: string;
    readonly read: boolean;
    readonly write: boolean;
}

export type HostRelayConfig = ReadonlyArray<HostRelayConfigEntry>;

export class HostRelayConfigError extends TypeError {
    constructor(message: string) {
        super(message);
        this.name = "HostRelayConfigError";
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Host relay input is authoritative, unlike event/context relay hints. Do not
 * quietly retain a partial configuration when one entry is malformed.
 */
export function parseHostRelayConfig(value: unknown): RelayConfig {
    if (!Array.isArray(value) || value.length === 0) {
        throw new HostRelayConfigError("Host relay config must be a non-empty array.");
    }

    const config: Record<string, { read: boolean; write: boolean }> = {};
    for (const entry of value) {
        if (
            !isRecord(entry)
            || Object.keys(entry).some((key) => key !== "url" && key !== "read" && key !== "write")
            || typeof entry.url !== "string"
            || typeof entry.read !== "boolean"
            || typeof entry.write !== "boolean"
            || (!entry.read && !entry.write)
        ) {
            throw new HostRelayConfigError("Host relay config contains an invalid entry.");
        }

        const url = RelayConfigUtils.normalizeExternalRelayUrl(entry.url);
        if (!url || url in config) {
            throw new HostRelayConfigError("Host relay config contains an invalid or duplicate URL.");
        }
        config[url] = { read: entry.read, write: entry.write };
    }

    return config;
}

export function toHostRelayConfig(config: RelayConfig): HostRelayConfig {
    if (Array.isArray(config)) {
        return config.map((url) => ({
            url: RelayConfigUtils.normalizeRelayUrl(url),
            read: true,
            write: true,
        }));
    }
    return Object.entries(config).map(([url, capabilities]) => ({
        url: RelayConfigUtils.normalizeRelayUrl(url),
        read: capabilities.read,
        write: capabilities.write,
    }));
}
