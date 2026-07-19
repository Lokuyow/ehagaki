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

