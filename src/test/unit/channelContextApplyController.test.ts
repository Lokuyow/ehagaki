import { describe, expect, it, vi } from "vitest";
import { createChannelContextApplyController } from "../../lib/channelContextApplyController";
import type {
    ChannelContextCoordinatorRefreshResult,
    ChannelContextCoordinatorSnapshot,
} from "../../lib/channelContextCoordinator";
import {
    buildEffectiveChannelContext,
    type ChannelContextProvenance,
    type ChannelContextRuntimeState,
} from "../../lib/channelContextRuntime";
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
    let ownerToken: symbol | null = null;
    let runtime: ChannelContextRuntimeState | null = null;
    const setChannelContext = vi.fn((next, nextProvenance, nextOwnerToken) => {
        current = next;
        provenance = nextProvenance;
        ownerToken = nextOwnerToken;
    });
    const clearChannelContext = vi.fn(() => {
        current = null;
        provenance = null;
        ownerToken = null;
    });
    const controller = createChannelContextApplyController({
        coordinator: { resolveInternal } as never,
        getCurrentChannelContext: () => current,
        getChannelContextOwnerToken: () => ownerToken,
        setChannelContext,
        setRuntimeState: (next) => {
            runtime = next;
        },
        clearChannelContext,
        logger: { error: vi.fn() },
    });
    return {
        controller,
        setChannelContext,
        clearChannelContext,
        getCurrent: () => current,
        getProvenance: () => provenance,
        getEffective: () => current
            ? buildEffectiveChannelContext(current, provenance)
            : null,
        getRuntime: () => runtime,
        setOutside(next: ChannelContextState | null) {
            current = next;
            provenance = null;
            ownerToken = null;
        },
    };
}

describe("createChannelContextApplyController", () => {
    it("V2下書きを同期seed表示し、DB・networkでstableだけを更新する", async () => {
        const cacheReady = deferred<ChannelContextCoordinatorSnapshot>();
        const refresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const resolveInternal = vi.fn(() => ({
            initial: snapshot({
                name: "Draft seed",
                channelRelays: ["wss://saved-candidate.example.com/"],
            }, "seed"),
            cacheReady: cacheReady.promise,
            refresh: refresh.promise,
            release: vi.fn(),
        }));
        const harness = createHarness(resolveInternal);

        const handle = harness.controller.applyDraft({
            channelData: {
                version: 2,
                eventId,
                relayHints: ["wss://draft-read.example.com"],
                channelRelayCandidates: ["wss://saved-candidate.example.com"],
                seedMetadata: {
                    name: "Draft seed",
                    about: null,
                    picture: null,
                },
                overrides: {
                    name: "Persisted override",
                },
            },
        });

        expect(harness.getCurrent()?.name).toBe("Draft seed");
        expect(harness.getEffective()?.name).toBe("Persisted override");
        expect(harness.getRuntime()).toEqual({
            phase: "refreshing",
            quality: "legacy-seed",
            source: "seed",
        });
        expect(resolveInternal).toHaveBeenCalledWith({
            eventId,
            relayHints: ["wss://draft-read.example.com/"],
            channelRelays: ["wss://saved-candidate.example.com/"],
            name: "Draft seed",
            about: null,
            picture: null,
        }, undefined, undefined);

        cacheReady.resolve({
            ...snapshot({
                name: "Verified",
                channelRelays: ["wss://verified.example.com/"],
            }, "cache"),
            cache: {
                resolutionQuality: "verified-metadata",
            } as never,
        });
        await handle.cacheReady;

        expect(harness.getCurrent()?.channelRelays).toEqual([
            "wss://verified.example.com/",
        ]);
        expect(harness.getEffective()?.name).toBe("Persisted override");

        refresh.resolve({
            status: "updated",
            snapshot: {
                ...snapshot({ name: "New verified" }, "network"),
                cache: {
                    resolutionQuality: "verified-metadata",
                } as never,
            },
        });
        await handle.refresh;

        expect(harness.getCurrent()?.name).toBe("New verified");
        expect(harness.getEffective()?.name).toBe("Persisted override");
        expect(harness.getRuntime()).toEqual({
            phase: "ready",
            quality: "verified-metadata",
            source: "network",
        });
    });

    it("下書きA復元直後に下書きBを復元したらAの遅延結果を反映しない", async () => {
        const eventIdB = "b".repeat(64);
        const firstCache = deferred<ChannelContextCoordinatorSnapshot>();
        const firstRefresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const secondSnapshot = snapshot({
            eventId: eventIdB,
            name: "Draft B",
        }, "seed");
        const resolveInternal = vi.fn()
            .mockReturnValueOnce({
                initial: snapshot({ name: "Draft A" }, "seed"),
                cacheReady: firstCache.promise,
                refresh: firstRefresh.promise,
                release: vi.fn(),
            })
            .mockReturnValueOnce({
                initial: secondSnapshot,
                cacheReady: Promise.resolve(secondSnapshot),
                refresh: Promise.resolve({
                    status: "skipped",
                    snapshot: secondSnapshot,
                }),
                release: vi.fn(),
            });
        const harness = createHarness(resolveInternal);

        harness.controller.applyDraft({
            channelData: {
                version: 2,
                eventId,
                relayHints: [],
                seedMetadata: {
                    name: "Draft A",
                    about: null,
                    picture: null,
                },
            },
        });
        const second = harness.controller.applyDraft({
            channelData: {
                version: 2,
                eventId: eventIdB,
                relayHints: [],
                seedMetadata: {
                    name: "Draft B",
                    about: null,
                    picture: null,
                },
            },
        });

        firstCache.resolve(snapshot({ name: "Old A cache" }, "cache"));
        firstRefresh.resolve({
            status: "updated",
            snapshot: snapshot({ name: "Old A network" }, "network"),
        });
        await second.cacheReady;
        await Promise.resolve();

        expect(harness.getCurrent()).toMatchObject({
            eventId: eventIdB,
            name: "Draft B",
        });
        expect(harness.getProvenance()?.source).toBeUndefined();
    });

    it("明示metadata overrideをcache/networkより優先し、省略項目だけ補完する", async () => {
        const cacheReady = deferred<ChannelContextCoordinatorSnapshot>();
        const refresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const release = vi.fn();
        const resolveInternal = vi.fn((_query: unknown) => ({
            initial: snapshot({
                relayHints: ["wss://initial.example.com/"],
                name: null,
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
            name: null,
            about: null,
            picture: null,
        });
        expect(harness.getEffective()).toMatchObject({
            name: "Parent name",
            about: null,
            picture: null,
        });
        expect(harness.getRuntime()?.phase).toBe("refreshing");

        cacheReady.resolve(snapshot({
            name: "Verified name",
            about: "Verified about",
            picture: "https://example.com/verified.png",
        }));
        await handle.cacheReady;

        expect(harness.getCurrent()).toMatchObject({
            name: "Verified name",
            about: "Verified about",
            picture: "https://example.com/verified.png",
        });
        expect(harness.getEffective()).toMatchObject({
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

        expect(resolveInternal.mock.calls[0]?.[0]).toEqual({
            eventId,
            relayHints: [],
        });
        expect(harness.getCurrent()?.channelRelays).toEqual([
            "wss://verified.example.com/",
        ]);
        expect(harness.getEffective()?.channelRelays).toEqual([
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

    it.each([
        "通常setter",
        "投稿履歴適用",
        "下書き復元",
        "clear後の通常setter",
    ])("外部適用中に%sが同じeventIdを所有したら古い結果を復活させない", async (route) => {
        const cacheReady = deferred<ChannelContextCoordinatorSnapshot>();
        const refresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const resolveInternal = vi.fn(() => ({
            initial: snapshot({ name: null }, "seed"),
            cacheReady: cacheReady.promise,
            refresh: refresh.promise,
            release: vi.fn(),
        }));
        const harness = createHarness(resolveInternal);
        harness.controller.applyExternal({
            source: "iframe",
            query: { eventId, relayHints: [], name: "Parent" },
        });

        if (route === "clear後の通常setter") harness.setOutside(null);
        harness.setOutside(snapshot({ name: "Outside" }).context);
        cacheReady.resolve(snapshot({ name: "Old cache" }));
        refresh.resolve({
            status: "updated",
            snapshot: snapshot({ name: "Old network" }, "network"),
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(harness.getCurrent()?.name).toBe("Outside");
        expect(harness.getProvenance()).toBeNull();
    });

    it("同じexternal handle自身のcacheからnetworkへの更新はowner tokenを維持して反映する", async () => {
        const cacheReady = deferred<ChannelContextCoordinatorSnapshot>();
        const refresh = deferred<ChannelContextCoordinatorRefreshResult>();
        const resolveInternal = vi.fn(() => ({
            initial: snapshot({}, "seed"),
            cacheReady: cacheReady.promise,
            refresh: refresh.promise,
            release: vi.fn(),
        }));
        const harness = createHarness(resolveInternal);
        const handle = harness.controller.applyExternal({
            source: "iframe",
            query: { eventId, relayHints: [], name: "Parent" },
        });

        cacheReady.resolve(snapshot({ about: "Cached" }));
        await handle.cacheReady;
        expect(harness.getCurrent()?.about).toBe("Cached");
        refresh.resolve({
            status: "updated",
            snapshot: snapshot({ about: "Network" }, "network"),
        });
        await handle.refresh;

        expect(harness.getCurrent()?.about).toBe("Network");
        expect(harness.getEffective()?.name).toBe("Parent");
    });
});
