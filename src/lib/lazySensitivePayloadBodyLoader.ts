import type { SensitiveBodyLoader } from "./postContentPreview";
import { getSensitivePayloadReference } from "./sensitiveContentPayload";

type SensitivePayloadReaderModule = typeof import("./sensitiveContentPayloadReader");
type SensitivePayloadBodyLoaderParams = Parameters<
    SensitivePayloadReaderModule["createSensitivePayloadBodyLoader"]
>[0];

let readerModulePromise: Promise<SensitivePayloadReaderModule> | null = null;

function loadReaderModule(): Promise<SensitivePayloadReaderModule> {
    readerModulePromise ??= import("./sensitiveContentPayloadReader").catch((error: unknown) => {
        // Let a later reveal retry after a transient chunk failure.
        readerModulePromise = null;
        throw error;
    });
    return readerModulePromise;
}

/**
 * Synchronous counterpart of `createSensitivePayloadBodyLoader` for startup
 * surfaces. The reader (event storage, relay fetch, Dexie liveQuery) is
 * imported only when the loader is first called or observed.
 */
export function createLazySensitivePayloadBodyLoader(
    params: SensitivePayloadBodyLoaderParams,
): SensitiveBodyLoader | undefined {
    if (!params.structure || !getSensitivePayloadReference(params.structure)) return undefined;

    let resolvedLoader: Promise<SensitiveBodyLoader | undefined> | null = null;
    const resolveLoader = (): Promise<SensitiveBodyLoader | undefined> => {
        resolvedLoader ??= loadReaderModule().then(
            (reader) => reader.createSensitivePayloadBodyLoader(params),
            (error: unknown) => {
                resolvedLoader = null;
                throw error;
            },
        );
        return resolvedLoader;
    };

    const loader: SensitiveBodyLoader = async (signal) => {
        const resolved = await resolveLoader();
        return resolved ? await resolved(signal) : null;
    };
    loader.scope = { runtime: params.rxNostr, ownerPubkey: params.ownerPubkey };
    loader.loadEmoji = async (url) => {
        const resolved = await resolveLoader();
        return resolved?.loadEmoji ? await resolved.loadEmoji(url) : { ready: false };
    };
    loader.observe = (onChange) => {
        let active = true;
        let stopObserving: (() => void) | undefined;
        void resolveLoader().then(
            (resolved) => {
                if (!active) return;
                stopObserving = resolved?.observe?.(onChange);
            },
            // A failed reader import surfaces when the body is requested.
            () => undefined,
        );
        return () => {
            active = false;
            stopObserving?.();
        };
    };
    return loader;
}
