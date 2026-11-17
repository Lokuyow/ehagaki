import type { RxNostr } from "rx-nostr";
import type { SensitiveBodyLoader } from "./postContentPreview";
import { createSensitivePayloadBodyLoader } from "./sensitiveContentPayloadReader";
import type { NostrEvent, RelayConfig } from "./types";

export interface SensitiveBodyLoaderContext {
    ownerPubkey?: string | null;
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}

interface CachedLoader {
    ownerPubkey: string | null | undefined;
    rxNostr: RxNostr | undefined;
    relayConfig: RelayConfig | null | undefined;
    relayKey: string;
    loader: SensitiveBodyLoader | undefined;
}

/**
 * One Sensitive body loader per event for the current account, runtime, relay
 * config and relay hints. PostContentPreview resubscribes to the payload whenever
 * it is handed a new loader, so lists that re-render cards keep handing out the
 * same loader until one of those inputs actually changes.
 */
export function createSensitiveBodyLoaderCache() {
    let loaderByEvent = new WeakMap<NostrEvent, CachedLoader>();

    function get(
        event: NostrEvent | null | undefined,
        context: SensitiveBodyLoaderContext,
        relayHints: readonly string[] = [],
    ): SensitiveBodyLoader | undefined {
        if (!event) {
            return undefined;
        }

        const relayKey = relayHints.join("\n");
        const cached = loaderByEvent.get(event);
        if (
            cached
            && cached.ownerPubkey === context.ownerPubkey
            && cached.rxNostr === context.rxNostr
            && cached.relayConfig === context.relayConfig
            && cached.relayKey === relayKey
        ) {
            return cached.loader;
        }

        const loader = createSensitivePayloadBodyLoader({
            ownerPubkey: context.ownerPubkey,
            structure: event,
            rxNostr: context.rxNostr,
            relayConfig: context.relayConfig,
            ...(relayHints.length ? { relayHints: [...relayHints] } : {}),
        });
        loaderByEvent.set(event, {
            ownerPubkey: context.ownerPubkey,
            rxNostr: context.rxNostr,
            relayConfig: context.relayConfig,
            relayKey,
            loader,
        });
        return loader;
    }

    function clear(): void {
        loaderByEvent = new WeakMap();
    }

    return { get, clear };
}
