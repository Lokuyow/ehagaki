import { RelayConfigUtils } from "./relayConfigUtils";
import type { RelayConfig } from "./types";

// This is deliberately process-local. It represents the one currently mounted
// Full embed/iframe runtime and must never be backed by storage.
let activeHostRelayConfig: RelayConfig | null = null;

export function activateHostRelayConfig(config: RelayConfig): void {
    activeHostRelayConfig = config;
}

export function deactivateHostRelayConfig(): void {
    activeHostRelayConfig = null;
}

export function isHostRelayConfigActive(): boolean {
    return activeHostRelayConfig !== null;
}

/**
 * Host defaults are authoritative runtime inputs, not relay hints. Callers
 * deliberately receive every configured read relay without a hint limit.
 */
export function getHostReadRelayDefaults(): string[] {
    return activeHostRelayConfig
        ? RelayConfigUtils.sanitizeExternalRelayUrls(
            RelayConfigUtils.extractReadRelays(activeHostRelayConfig),
        )
        : [];
}

/**
 * Preserve the existing sanitization and cap for contextual/event hints, then
 * merge them with every host default. The host config is not an allowlist:
 * valid contextual hints remain additional destinations.
 */
export function mergeHostReadDefaultsWithHints(
    hints: string[] | undefined,
    hintLimit: number,
): string[] | null {
    if (!isHostRelayConfigActive()) {
        return null;
    }

    const limitedHints = RelayConfigUtils.sanitizeExternalRelayUrls(hints, {
        limit: hintLimit,
    });
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...getHostReadRelayDefaults(),
        ...limitedHints,
    ]);
}
