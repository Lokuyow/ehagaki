import { describe, expect, it, vi } from "vitest";

import { createPostHistoryProfileSyncCoordinator } from "../../lib/postHistoryProfileSync";
import type { ProfileData } from "../../lib/types";

function createProfile(name: string): ProfileData {
    return {
        name,
        displayName: name,
        picture: "",
        npub: `npub-${name}`,
        nprofile: `nprofile-${name}`,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((nextResolve) => {
        resolve = nextResolve;
    });
    return { promise, resolve };
}

describe("postHistoryProfileSync", () => {
    it("shares one pubkey subscription and fetch across quote, graph, and reaction consumers", async () => {
        const deferred = createDeferred<ProfileData | null>();
        const unsubscribe = vi.fn();
        const getProfile = vi.fn()
            .mockReturnValueOnce(deferred.promise)
            .mockResolvedValue(createProfile("Updated"));
        const subscribe = vi.fn(() => unsubscribe);
        const coordinator = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => ({ tag: "rxnostr" }) as never,
            profileCache: { getProfile, subscribe },
        });
        const quoteListener = vi.fn();
        const graphListener = vi.fn();
        coordinator.subscribe(quoteListener);
        coordinator.subscribe(graphListener);

        coordinator.ensureProfile("pubkey-a", ["wss://quote.example.com"]);
        coordinator.ensureProfile("pubkey-a", ["wss://thread.example.com"]);

        expect(subscribe).toHaveBeenCalledOnce();
        expect(getProfile).toHaveBeenCalledOnce();

        deferred.resolve(createProfile("Cached"));
        await deferred.promise;
        await Promise.resolve();
        await Promise.resolve();

        expect(quoteListener).toHaveBeenCalledWith("pubkey-a", expect.objectContaining({
            displayName: "Cached",
        }));
        expect(graphListener).toHaveBeenCalledWith("pubkey-a", expect.objectContaining({
            displayName: "Cached",
        }));
        expect(getProfile).toHaveBeenNthCalledWith(2, "pubkey-a", {
            rxNostr: { tag: "rxnostr" },
            additionalRelays: [
                "wss://quote.example.com/",
                "wss://thread.example.com/",
            ],
            forceRefresh: true,
            allowBackgroundRefresh: true,
        });
    });

    it("reuses a profile already held by the common cache", () => {
        const cachedProfile = createProfile("From reply quote");
        const listener = vi.fn();
        const coordinator = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => undefined,
            profileCache: {
                getProfile: vi.fn().mockResolvedValue(cachedProfile),
                subscribe: vi.fn((_pubkey, callback) => {
                    callback(cachedProfile);
                    return vi.fn();
                }),
            },
        });
        coordinator.subscribe(listener);

        coordinator.ensureProfile("pubkey-a");

        expect(listener).toHaveBeenCalledOnce();
        expect(listener).toHaveBeenCalledWith("pubkey-a", cachedProfile);
    });

    it("returns a known profile when an existing pubkey is ensured again", () => {
        const cachedProfile = createProfile("Known");
        const listener = vi.fn();
        const getProfile = vi.fn().mockResolvedValue(cachedProfile);
        const coordinator = createPostHistoryProfileSyncCoordinator({
            getShow: () => true,
            getRxNostr: () => undefined,
            profileCache: {
                getProfile,
                subscribe: vi.fn((_pubkey, callback) => {
                    callback(cachedProfile);
                    return vi.fn();
                }),
            },
        });
        coordinator.subscribe(listener);

        coordinator.ensureProfile("pubkey-a");
        listener.mockClear();
        const knownProfile = coordinator.ensureProfile("pubkey-a");

        expect(knownProfile).toBe(cachedProfile);
        expect(listener).not.toHaveBeenCalled();
        expect(getProfile).toHaveBeenCalledOnce();
    });

    it("unsubscribes on reset and ignores cache updates and late requests after close", async () => {
        const deferred = createDeferred<ProfileData | null>();
        const unsubscribe = vi.fn();
        let cacheListener: (profile: ProfileData | null) => void = () => undefined;
        const listener = vi.fn();
        const coordinator = createPostHistoryProfileSyncCoordinator({
            getShow: () => false,
            getRxNostr: () => undefined,
            profileCache: {
                getProfile: vi.fn(() => deferred.promise),
                subscribe: vi.fn((_pubkey, callback) => {
                    cacheListener = callback;
                    return unsubscribe;
                }),
            },
        });
        coordinator.subscribe(listener);
        coordinator.ensureProfile("pubkey-a");

        coordinator.reset();
        cacheListener(createProfile("After close"));
        deferred.resolve(createProfile("Late request"));
        await deferred.promise;
        await Promise.resolve();

        expect(unsubscribe).toHaveBeenCalledOnce();
        expect(listener).not.toHaveBeenCalled();
    });
});
