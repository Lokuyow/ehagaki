import { describe, expect, it, vi } from "vitest";
import { startPostHistoryChannelContextApply } from "../../lib/postHistoryChannelContextApply";
import type { ChannelContextCoordinatorHandle } from "../../lib/channelContextCoordinator";

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((next) => {
        resolve = next;
    });
    return { promise, resolve };
}

describe("startPostHistoryChannelContextApply", () => {
    it("release済みhandleは同じeventIdの新しいseedを古い結果で上書きしない", async () => {
        const eventId = "a".repeat(64);
        const cacheA = deferred<any>();
        const refreshA = deferred<any>();
        const releaseA = vi.fn();
        const makeSnapshot = (name: string) => ({
            context: {
                eventId,
                relayHints: [`wss://${name.toLowerCase()}.example.com/`],
                name,
                about: null,
                picture: null,
            },
            cache: null,
            source: "seed" as const,
        });
        const handleA: ChannelContextCoordinatorHandle = {
            initial: makeSnapshot("Seed A"),
            cacheReady: cacheA.promise,
            refresh: refreshA.promise,
            release: releaseA,
        };
        const handleB: ChannelContextCoordinatorHandle = {
            initial: makeSnapshot("Seed B"),
            cacheReady: new Promise(() => {}),
            refresh: new Promise(() => {}),
            release: vi.fn(),
        };
        const coordinator = {
            resolveInternal: vi.fn()
                .mockReturnValueOnce(handleA)
                .mockReturnValueOnce(handleB),
        };
        let currentContext = handleA.initial.context;
        const setChannelContext = vi.fn((context) => {
            currentContext = context;
        });
        const params = {
            channelContextQuery: { eventId, relayHints: [] },
            getCurrentChannelContext: () => currentContext,
            setChannelContext,
            coordinator: coordinator as never,
        };

        const applyA = startPostHistoryChannelContextApply(params);
        applyA.release();
        applyA.release();
        startPostHistoryChannelContextApply(params);

        cacheA.resolve({ ...makeSnapshot("Cache A"), source: "cache" });
        refreshA.resolve({
            status: "updated",
            snapshot: { ...makeSnapshot("Network A"), source: "network" },
        });
        await Promise.all([cacheA.promise, refreshA.promise]);
        await Promise.resolve();

        expect(setChannelContext).toHaveBeenCalledTimes(2);
        expect(currentContext.name).toBe("Seed B");
        expect(releaseA).toHaveBeenCalledTimes(1);
    });

    it("seedを同期適用し、同じeventIdの間だけcacheとnetwork更新を反映する", async () => {
        const eventId = "a".repeat(64);
        const cacheReady = deferred<any>();
        const refresh = deferred<any>();
        const release = vi.fn();
        const handle: ChannelContextCoordinatorHandle = {
            initial: {
                context: {
                    eventId,
                    relayHints: ["wss://seed.example.com/"],
                    name: null,
                    about: null,
                    picture: null,
                },
                cache: null,
                source: "seed",
            },
            cacheReady: cacheReady.promise,
            refresh: refresh.promise,
            release,
        };
        const coordinator = { resolveInternal: vi.fn(() => handle) };
        let currentEventId: string | null = eventId;
        const setChannelContext = vi.fn();

        const applyHandle = startPostHistoryChannelContextApply({
            channelContextQuery: { eventId, relayHints: [] },
            getCurrentChannelContext: () => currentEventId
                ? {
                    eventId: currentEventId,
                    relayHints: [],
                    name: null,
                    about: null,
                    picture: null,
                }
                : null,
            setChannelContext,
            coordinator: coordinator as never,
        });

        expect(setChannelContext).toHaveBeenCalledTimes(1);
        cacheReady.resolve({
            context: { ...handle.initial.context, name: "Cached" },
            cache: null,
            source: "cache",
        });
        await Promise.resolve();
        expect(setChannelContext).toHaveBeenLastCalledWith(
            expect.objectContaining({ name: "Cached" }),
        );

        currentEventId = null;
        refresh.resolve({
            status: "updated",
            snapshot: {
                context: { ...handle.initial.context, name: "Network" },
                cache: null,
                source: "network",
            },
        });
        await Promise.resolve();
        expect(setChannelContext).toHaveBeenCalledTimes(2);

        applyHandle.release();
        expect(release).toHaveBeenCalledTimes(1);
    });
});
