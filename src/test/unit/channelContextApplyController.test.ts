import { describe, expect, it, vi } from "vitest";
import { createChannelContextApplyController } from "../../lib/channelContextApplyController";
import type {
    ChannelContextCoordinatorRefreshResult,
    ChannelContextCoordinatorSnapshot,
} from "../../lib/channelContextCoordinator";
import type { ChannelContextProvenance } from "../../lib/channelContextRuntime";
import type { ChannelContextState } from "../../lib/types";

const eventId = "a".repeat(64);

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((next) => {
        resolve = next;
    });
    return { promise, resolve };
}

function snapshot(
    context: Partial<ChannelContextState>,
    source: ChannelContextCoordinatorSnapshot["source"] = "cache",
): ChannelContextCoordinatorSnapshot {
    return {
        source,
        cache: null,
        context: {
            eventId,
            relayHints: [],
            name: null,
            about: null,
            picture: null,
            ...context,
        },
    };
}

function createHarness(resolveInternal: ReturnType<typeof vi.fn>) {
    let current: ChannelContextState | null = null;
    let provenance: ChannelContextProvenance | null = null;
    const setChannelContext = vi.fn((next, nextProvenance) => {
        current = next;
        provenance = nextProvenance;
    });
    const clearChannelContext = vi.fn(() => {
        current = null;
        provenance = null;
    });
    const controller = createChannelContextApplyController({
        coordinator: { resolveInternal } as never,
        getCurrentChannelContext: () => current,
        setChannelContext,
        clearChannelContext,
        logger: { error: vi.fn() },
    });
    return {
        controller,
        setChannelContext,
        clearChannelContext,
        getCurrent: () => current,
        getProvenance: () => provenance,
    };
}

describe("createChannelContextApplyController", () => {
    it("明示metadata overrideをcache/networkより優先し、省略項目だけ補完する", async () => {
        const cacheReady = deferred<ChannelContextCoordinatorSnapshot>();
        const refresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const release = vi.fn();
        const resolveInternal = vi.fn((_query: unknown) => ({
            initial: snapshot({
                relayHints: ["wss://initial.example.com/"],
                name: "Parent name",
                about: null,
                picture: null,
            }, "seed"),
            cacheReady: cacheReady.promise,
            refresh: refresh.promise,
            release,
        }));
        const harness = createHarness(resolveInternal);

        const handle = harness.controller.applyExternal({
            source: "iframe",
            query: {
                eventId,
                relayHints: ["wss://initial.example.com"],
                name: "Parent name",
                picture: null,
            },
        });
        expect(harness.getCurrent()).toMatchObject({
            name: "Parent name",
            about: null,
            picture: null,
        });

        cacheReady.resolve(snapshot({
            name: "Verified name",
            about: "Verified about",
            picture: "https://example.com/verified.png",
        }));
        await handle.cacheReady;

        expect(harness.getCurrent()).toMatchObject({
            name: "Parent name",
            about: "Verified about",
            picture: null,
        });
        expect(harness.getProvenance()).toEqual({
            source: "iframe",
            metadataOverrides: {
                name: "Parent name",
                picture: null,
            },
        });
    });

    it("外部hintとwrite relayを3件へ制限し、明示write relayをverified候補より前に保つ", async () => {
        const completeSnapshot = snapshot({
            channelRelays: ["wss://verified.example.com/"],
        });
        const resolveInternal = vi.fn((_query: unknown) => ({
            initial: snapshot({}, "seed"),
            cacheReady: Promise.resolve(completeSnapshot),
            refresh: Promise.resolve({ status: "skipped", snapshot: completeSnapshot }),
            release: vi.fn(),
        }));
        const harness = createHarness(resolveInternal);
        const relayHints = Array.from({ length: 6 }, (_, index) =>
            `wss://read-${index}.example.com`);
        const channelRelays = Array.from({ length: 6 }, (_, index) =>
            `wss://write-${index}.example.com`);

        const handle = harness.controller.applyExternal({
            source: "url",
            query: { eventId, relayHints, channelRelays },
        });
        await handle.cacheReady;

        expect(resolveInternal.mock.calls[0]?.[0]).toMatchObject({
            relayHints: relayHints.slice(0, 3).map((relay) => `${relay}/`),
            channelRelays: channelRelays.slice(0, 3).map((relay) => `${relay}/`),
        });
        expect(harness.getCurrent()?.channelRelays).toEqual([
            ...channelRelays.slice(0, 3).map((relay) => `${relay}/`),
            "wss://verified.example.com/",
        ]);
    });

    it("同じeventIdへの連続適用でもrelease済みgenerationの結果を反映しない", async () => {
        const firstCache = deferred<ChannelContextCoordinatorSnapshot>();
        const firstRefresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const firstRelease = vi.fn();
        const secondSnapshot = snapshot({ name: "Second seed" }, "seed");
        const resolveInternal = vi.fn()
            .mockReturnValueOnce({
                initial: snapshot({ name: "First seed" }, "seed"),
                cacheReady: firstCache.promise,
                refresh: firstRefresh.promise,
                release: firstRelease,
            })
            .mockReturnValueOnce({
                initial: secondSnapshot,
                cacheReady: Promise.resolve(secondSnapshot),
                refresh: Promise.resolve({ status: "skipped", snapshot: secondSnapshot }),
                release: vi.fn(),
            });
        const harness = createHarness(resolveInternal);

        harness.controller.applyExternal({
            source: "iframe",
            query: { eventId, relayHints: [], name: "First seed" },
        });
        const secondHandle = harness.controller.applyExternal({
            source: "iframe",
            query: { eventId, relayHints: [], name: "Second seed" },
        });
        firstCache.resolve(snapshot({ name: "Old cache" }));
        firstRefresh.resolve({ status: "updated", snapshot: snapshot({ name: "Old network" }, "network") });
        await secondHandle.cacheReady;
        await Promise.resolve();

        expect(firstRelease).toHaveBeenCalledOnce();
        expect(harness.getCurrent()?.name).toBe("Second seed");
    });

    it("clearで進行中consumerをreleaseし、stable contextとprovenanceを同時に解除する", () => {
        const release = vi.fn();
        const pending = new Promise<never>(() => {});
        const resolveInternal = vi.fn(() => ({
            initial: snapshot({ name: "Parent" }, "seed"),
            cacheReady: pending,
            refresh: pending,
            release,
        }));
        const harness = createHarness(resolveInternal);
        harness.controller.applyExternal({
            source: "iframe",
            query: { eventId, relayHints: [], name: "Parent" },
        });

        harness.controller.clear();

        expect(release).toHaveBeenCalledOnce();
        expect(harness.clearChannelContext).toHaveBeenCalledOnce();
        expect(harness.getCurrent()).toBeNull();
        expect(harness.getProvenance()).toBeNull();
    });
});
