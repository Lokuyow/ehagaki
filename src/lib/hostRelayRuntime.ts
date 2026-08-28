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
