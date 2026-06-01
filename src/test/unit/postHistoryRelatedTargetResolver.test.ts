import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import {
    createPostHistoryRelatedTargetResolver,
    type RelatedTargetDescriptor,
} from "../../lib/postHistoryRelatedTargetResolver.svelte";
import type { NostrEvent } from "../../lib/types";
import { createMockRxNostr } from "../helpers";

const getProfileMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/profileMetadataCache.svelte", () => ({
    profileMetadataCache: {
        getProfile: getProfileMock,
    },
}));

function createEvent(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: "1".repeat(64),
        pubkey: "a".repeat(64),
        kind: 1,
        content: "related target",
        tags: [],
        created_at: 100,
        sig: "sig",
        ...overrides,
    };
}

function createRecord(event: NostrEvent): PostHistoryRecord {
    return {
        id: `post-history:${event.id}`,
        eventId: event.id,
        pubkeyHex: event.pubkey,
        kind: event.kind,
        content: event.content,
        tags: event.tags,
        createdAt: event.created_at,
        postedAt: event.created_at * 1000,
        relayHints: ["wss://relay.example.com/"],
        acceptedRelays: [],
        fetchedRelays: [],
        media: [],
        rawEvent: event,
        updatedAt: event.created_at * 1000,
        schemaVersion: 1,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (error?: unknown) => void;
    const promise = new Promise<T>((nextResolve, nextReject) => {
        resolve = nextResolve;
        reject = nextReject;
    });

    return {
        promise,
        resolve,
        reject,
    };
}

async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function createDescriptor(
    overrides: Partial<RelatedTargetDescriptor> = {},
): RelatedTargetDescriptor {
    return {
        targetEventId: overrides.targetEventId ?? "1".repeat(64),
        relationKind: overrides.relationKind ?? "quote",
        scopeKey: overrides.scopeKey ?? "scope-a",
        sourceEventId: overrides.sourceEventId ?? "f".repeat(64),
        relayHints: overrides.relayHints ?? ["wss://relay.example.com/"],
        authorHint: overrides.authorHint ?? "a".repeat(64),
    };
}

function createResolver() {
    const rxNostr = createMockRxNostr();
    const postHistoryRepositoryImpl = {
        getByEventId: vi.fn().mockResolvedValue(null as PostHistoryRecord | null),
    };
    const contextFetchService = {
        fetchEventById: vi.fn().mockReturnValue({
            promise: Promise.resolve({
                event: null,
                relayUrl: null,
            }),
            cancel: vi.fn(),
        }),
    };
    const deletionRequestsRepositoryImpl = {
        getDeletedTargets: vi.fn().mockResolvedValue(new Map()),
        upsertValidDeletionRequests: vi.fn().mockResolvedValue({
            insertedCount: 0,
            updatedCount: 0,
            unchangedCount: 0,
            ignoredCount: 0,
        }),
    };
    const deletionFetchService = {
        fetchDeletionRequests: vi.fn().mockReturnValue({
            promise: Promise.resolve({
                events: [],
                fetchedAt: 0,
                relayUrls: [],
            }),
            cancel: vi.fn(),
        }),
    };
    const profilesRepositoryImpl = {
        get: vi.fn().mockResolvedValue(null),
    };

    const resolver = createPostHistoryRelatedTargetResolver({
        getShow: () => true,
        getRxNostr: () => rxNostr,
        getRelayConfig: () => null,
        postHistoryRepositoryImpl,
        contextFetchService,
        deletionRequestsRepositoryImpl,
        deletionFetchService,
        profilesRepositoryImpl,
    });

    return {
        resolver,
        postHistoryRepositoryImpl,
        contextFetchService,
        deletionRequestsRepositoryImpl,
        deletionFetchService,
        profilesRepositoryImpl,
    };
}

describe("createPostHistoryRelatedTargetResolver", () => {
    beforeEach(() => {
        getProfileMock.mockReset();
        getProfileMock.mockResolvedValue(null);
    });

    it("exposes a normalized loading snapshot shape while a target is pending", async () => {
        const event = createEvent();
        const deferred = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById.mockReturnValue({
            promise: deferred.promise,
            cancel: vi.fn(),
        });

        const descriptor = createDescriptor({
            targetEventId: event.id,
            authorHint: event.pubkey,
            relayHints: ["wss://relay.example.com/", "wss://relay.example.com/", ""],
        });
        const promise = resolver.ensureTarget(descriptor);
        await flushMicrotasks();

        expect(resolver.getTargetSnapshot(event.id)).toEqual({
            targetEventId: event.id,
            status: "loading",
            event: null,
            profile: null,
            authorPubkey: event.pubkey,
            relayHints: ["wss://relay.example.com/"],
            errorCode: null,
            updatedAt: null,
        });

        deferred.resolve({
            event,
            relayUrl: "wss://relay.example.com/",
        });
        await promise;
    });

    it("stores a normalized resolved snapshot shape after a network fetch", async () => {
        const event = createEvent();
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById.mockReturnValue({
            promise: Promise.resolve({
                event,
                relayUrl: "wss://fetched.example.com/",
            }),
            cancel: vi.fn(),
        });

        const snapshot = await resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: event.pubkey,
                relayHints: ["wss://relay.example.com/"],
            }),
        );

        expect(snapshot).toMatchObject({
            targetEventId: event.id,
            status: "resolved",
            event,
            profile: null,
            authorPubkey: event.pubkey,
            relayHints: ["wss://relay.example.com/", "wss://fetched.example.com/"],
            errorCode: null,
        });
        expect(typeof snapshot?.updatedAt).toBe("number");
    });

    it("resolves a cached record before hitting the network", async () => {
        const event = createEvent();
        const { resolver, postHistoryRepositoryImpl, contextFetchService } = createResolver();
        postHistoryRepositoryImpl.getByEventId.mockResolvedValue(createRecord(event));

        const snapshot = await resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: event.pubkey,
            }),
        );

        expect(snapshot?.status).toBe("resolved");
        expect(snapshot?.event?.id).toBe(event.id);
        expect(contextFetchService.fetchEventById).not.toHaveBeenCalled();
        expect(resolver.getTargetSnapshot(event.id)?.status).toBe("resolved");
    });

    it("dedupes in-flight fetches for the same target across scopes", async () => {
        const event = createEvent();
        const deferred = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const cancel = vi.fn(() => {
            deferred.resolve({ event: null, relayUrl: null });
        });
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById.mockReturnValue({
            promise: deferred.promise,
            cancel,
        });

        const firstPromise = resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: null,
                scopeKey: "scope-a",
            }),
        );
        const secondPromise = resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: null,
                scopeKey: "scope-b",
            }),
        );

        deferred.resolve({
            event,
            relayUrl: "wss://relay.example.com/",
        });

        const [firstSnapshot, secondSnapshot] = await Promise.all([
            firstPromise,
            secondPromise,
        ]);

        expect(firstSnapshot?.status).toBe("resolved");
        expect(secondSnapshot?.status).toBe("resolved");
        expect(contextFetchService.fetchEventById).toHaveBeenCalledTimes(1);
    });

    it("keeps a deduped fetch alive while another scope still watches the target", async () => {
        const event = createEvent();
        const deferred = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const cancel = vi.fn(() => {
            deferred.resolve({ event: null, relayUrl: null });
        });
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById.mockReturnValue({
            promise: deferred.promise,
            cancel,
        });

        const firstPromise = resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: null,
                scopeKey: "scope-a",
            }),
        );
        const secondPromise = resolver.ensureTarget(
            createDescriptor({
                targetEventId: event.id,
                authorHint: null,
                scopeKey: "scope-b",
            }),
        );
        await flushMicrotasks();

        const scopeRevisionBeforeInvalidate = resolver.getScopeRevision("scope-a");
        resolver.invalidateScope("scope-a");
        expect(cancel).not.toHaveBeenCalled();
        expect(resolver.getScopeRevision("scope-a")).toBe(scopeRevisionBeforeInvalidate + 1);

        deferred.resolve({
            event,
            relayUrl: "wss://relay.example.com/",
        });

        const [firstSnapshot, secondSnapshot] = await Promise.all([
            firstPromise,
            secondPromise,
        ]);
        expect(firstSnapshot?.status).toBe("resolved");
        expect(secondSnapshot?.status).toBe("resolved");
        expect(contextFetchService.fetchEventById).toHaveBeenCalledTimes(1);
    });

    it("cancels the in-flight fetch when the last scope is invalidated", async () => {
        const deferred = createDeferred<{ event: NostrEvent | null; relayUrl: string | null }>();
        const cancel = vi.fn(() => {
            deferred.resolve({ event: null, relayUrl: null });
        });
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById.mockReturnValue({
            promise: deferred.promise,
            cancel,
        });

        const promise = resolver.ensureTarget(createDescriptor({ authorHint: null }));
        await flushMicrotasks();

        resolver.invalidateScope("scope-a");
        await promise;

        expect(cancel).toHaveBeenCalledTimes(1);
    });

    it("retryTarget refetches a not-found snapshot and replaces it with the retried result", async () => {
        const event = createEvent();
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    event: null,
                    relayUrl: null,
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    event,
                    relayUrl: "wss://retried.example.com/",
                }),
                cancel: vi.fn(),
            });

        const descriptor = createDescriptor({
            targetEventId: event.id,
            authorHint: null,
        });

        const firstSnapshot = await resolver.ensureTarget(descriptor);
        const retriedSnapshot = await resolver.retryTarget(descriptor);

        expect(firstSnapshot?.status).toBe("not-found");
        expect(retriedSnapshot?.status).toBe("resolved");
        expect(retriedSnapshot?.event?.id).toBe(event.id);
        expect(contextFetchService.fetchEventById).toHaveBeenCalledTimes(2);
        expect(resolver.getTargetSnapshot(event.id)?.status).toBe("resolved");
    });

    it("preserves a resolved snapshot during background refresh misses", async () => {
        const event = createEvent();
        const { resolver, contextFetchService } = createResolver();
        contextFetchService.fetchEventById
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    event,
                    relayUrl: "wss://relay.example.com/",
                }),
                cancel: vi.fn(),
            })
            .mockReturnValueOnce({
                promise: Promise.resolve({
                    event: null,
                    relayUrl: null,
                }),
                cancel: vi.fn(),
            });

        const descriptor = createDescriptor({
            targetEventId: event.id,
            authorHint: event.pubkey,
        });
        const firstSnapshot = await resolver.ensureTarget(descriptor);
        const secondSnapshot = await resolver.ensureTarget(descriptor, {
            force: true,
            background: true,
        });

        expect(firstSnapshot?.status).toBe("resolved");
        expect(secondSnapshot?.status).toBe("resolved");
        expect(resolver.getTargetSnapshot(event.id)?.status).toBe("resolved");
    });
});