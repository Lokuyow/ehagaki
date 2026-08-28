import { EHagakiComposerElement as ComposerElementBase } from "./element";
import {
    HostRelayConfigError,
    parseHostRelayConfig,
    toHostRelayConfig,
    type HostRelayConfig,
} from "../lib/hostRelayConfig";
import type { RelayConfig } from "../lib/types";

/** The existing full distribution keeps the regular application root. */
export class EHagakiComposerElement extends ComposerElementBase {
    #hostRelayConfig: RelayConfig | undefined;
    #hostRelayConfigError: string | null = null;

    /**
     * A mount-scoped, nonpersistent default Relay Config for the Full embed.
     * Assign before connection; later assignments are retained for a recreated
     * element and never mutate an active Nostr session.
     */
    get relays(): HostRelayConfig | undefined {
        return this.#hostRelayConfig
            ? toHostRelayConfig(this.#hostRelayConfig)
            : undefined;
    }

    set relays(value: HostRelayConfig | undefined) {
        if (value === undefined) {
            this.#hostRelayConfig = undefined;
            this.#hostRelayConfigError = null;
            return;
        }

        try {
            this.#hostRelayConfig = parseHostRelayConfig(value);
            this.#hostRelayConfigError = null;
        } catch (error) {
            this.#hostRelayConfig = undefined;
            this.#hostRelayConfigError = error instanceof HostRelayConfigError
                ? error.message
                : "Invalid relays property.";
        }
    }

    protected override loadApp(): Promise<{ default: any }> {
        return import("../App.svelte");
    }

    protected override getConnectionError() {
        if (this.#hostRelayConfigError) {
            return {
                code: "initialization_failed" as const,
                message: this.#hostRelayConfigError,
            };
        }
        return super.getConnectionError();
    }

    protected override getAdditionalMountProps(): Record<string, unknown> {
        return this.#hostRelayConfig
            ? { hostRelayConfig: this.#hostRelayConfig }
            : {};
    }
}
