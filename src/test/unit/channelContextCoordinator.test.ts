import { describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import { ChannelContextCoordinator } from "../../lib/channelContextCoordinator";
import type {
    ChannelMetadataCache,
    ChannelMetadataRepository,
} from "../../lib/storage/channelMetadataRepository";

const channelId = "a".repeat(64);

function createCache(overrides: Partial<ChannelMetadataCache> = {}): ChannelMetadataCache {
    return {
        channelEventId: channelId,
        name: "Cached channel",
        about: "Cached about",
        picture: null,
        relays: ["wss://verified-write.example.com/"],
        relayHints: ["wss://verified-source.example.com/"],
        resolutionQuality: "verified-metadata",
        verifiedMetadataAt: 100,
        lastResolutionAttemptAt: 100,
        lastResolutionAttemptStatus: "complete",
        ...overrides,
    };
}

function createRepository(cache: ChannelMetadataCache | null = null) {
    let stored = cache;
    const repository: ChannelMetadataRepository = {
        get: vi.fn(async () => stored),
        getMany: vi.fn(async () => stored ? [stored] : []),
        shouldRefresh: vi.fn(() => !stored),
        upsertResolvedChannel: vi.fn(async (input) => {
            stored = createCache({
                channelEventId: input.channelEventId,
                name: input.quality === "verified-metadata" ? input.name : stored?.name ?? null,
                about: input.quality === "verified-metadata" ? input.about : stored?.about ?? null,
                picture: input.quality === "verified-metadata" ? input.picture : stored?.picture ?? null,
                relays: input.quality === "verified-metadata" ? input.relays ?? [] : stored?.relays ?? [],
                relayHints: input.verifiedSourceRelays ?? [],
                resolutionQuality: input.quality,
                lastResolutionAttemptStatus: input.metadataLookup,
            });
            return stored;
        }),
        markFetchFailed: vi.fn(async () => {
            stored = createCache({
                ...(stored ?? {}),
                lastResolutionAttemptStatus: "failed",
            });
        }),
    };
    return { repository, getStored: () => stored };
}

function resolvedNetworkResult(name = "Network channel") {
    return {
        status: "resolved" as const,
        quality: "verified-metadata" as const,
        metadataLookup: "complete" as const,
        metadata: {
            channelEventId: channelId,
            relayHints: ["wss://external-must-not-persist.example.com/"],
            channelRelays: ["wss://network-write.example.com/"],
            name,
            about: null,
            picture: null,
            creatorPubkey: "b".repeat(64),
            createEventCreatedAt: 100,
            metadataEventId: "c".repeat(64),
            metadataCreatedAt: 200,
            verifiedSourceRelays: ["wss://network-source.example.com/"],
        },
    };
}

describe("ChannelContextCoordinator", () => {
    it("同期seedの後に新しいcacheを返し、fresh cacheではREQしない", async () => {
        const { repository } = createRepository(createCache());
        repository.shouldRefresh = vi.fn(() => false);
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn(),
        };
        const coordinator = new ChannelContextCoordinator({
            service: service as never,
            repository,
        });

        const handle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://direct.example.com"],
            channelRelays: ["wss://candidate-write.example.com"],
        }, {} as RxNostr);

        expect(handle.initial.context).toMatchObject({
            name: null,
            relayHints: ["wss://direct.example.com/"],
        });
        await expect(handle.cacheReady).resolves.toMatchObject({
            source: "cache",
            context: {
                name: "Cached channel",
                relayHints: [
                    "wss://direct.example.com/",
                    "wss://verified-source.example.com/",
                    "wss://verified-write.example.com/",
                ],
                channelRelays: [
                    "wss://verified-write.example.com/",
                    "wss://candidate-write.example.com/",
                ],
            },
        });
        await expect(handle.refresh).resolves.toMatchObject({ status: "skipped" });
        expect(service.resolveChannelMetadataWithInternalHints).not.toHaveBeenCalled();
    });

    it("検証済みnetwork結果だけをRepositoryへ保存する", async () => {
        const { repository } = createRepository(null);
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockResolvedValue(resolvedNetworkResult()),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const handle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://unverified-input.example.com"],
        }, {} as RxNostr);

        await expect(handle.refresh).resolves.toMatchObject({
            status: "updated",
            snapshot: { context: { name: "Network channel" } },
        });
        expect(repository.upsertResolvedChannel).toHaveBeenCalledWith(
            expect.objectContaining({
                verifiedSourceRelays: ["wss://network-source.example.com/"],
                relays: ["wss://network-write.example.com/"],
            }),
        );
        expect(repository.upsertResolvedChannel).not.toHaveBeenCalledWith(
            expect.objectContaining({
                verifiedSourceRelays: expect.arrayContaining([
                    "wss://unverified-input.example.com/",
                ]),
            }),
        );
    });

    it("同じRxNostrとeventIdの同時解決はREQを共有し、別RxNostrでは分離する", async () => {
        const first = createRepository(null);
        let resolveNetwork: ((value: ReturnType<typeof resolvedNetworkResult>) => void) | undefined;
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn(() =>
                new Promise<ReturnType<typeof resolvedNetworkResult>>((resolve) => {
                    resolveNetwork = resolve;
                })),
        };
        const coordinator = new ChannelContextCoordinator({
            service,
            repository: first.repository,
        });
        const rxNostr = {} as RxNostr;
        const handleA = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://a.example.com"],
        }, rxNostr);
        const handleB = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://b.example.com"],
        }, rxNostr);

        await Promise.all([handleA.cacheReady, handleB.cacheReady]);
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
        });
        resolveNetwork?.(resolvedNetworkResult());
        await Promise.all([handleA.refresh, handleB.refresh]);
        expect(first.repository.upsertResolvedChannel).toHaveBeenCalledTimes(1);

        const otherRxHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://c.example.com"],
        }, {} as RxNostr);
        first.repository.shouldRefresh = vi.fn(() => true);
        await otherRxHandle.cacheReady;
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(2);
        });
        resolveNetwork?.(resolvedNetworkResult("Other session"));
        await otherRxHandle.refresh;
    });

    it("一部consumerのreleaseでは共有REQをabortせず、全releaseでabortする", async () => {
        const { repository } = createRepository(null);
        let observedSignal: AbortSignal | undefined;
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn((
                _query: unknown,
                _rxNostr: unknown,
                _relayConfig: unknown,
                options: { signal?: AbortSignal },
            ) => new Promise((resolve) => {
                observedSignal = options.signal;
                options.signal?.addEventListener("abort", () => {
                    resolve({ status: "aborted" });
                });
            })),
        };
        const coordinator = new ChannelContextCoordinator({
            service: service as never,
            repository,
        });
        const rxNostr = {} as RxNostr;
        const handleA = coordinator.resolveInternal({ eventId: channelId, relayHints: [] }, rxNostr);
        const handleB = coordinator.resolveInternal({ eventId: channelId, relayHints: [] }, rxNostr);
        await Promise.all([handleA.cacheReady, handleB.cacheReady]);
        await vi.waitFor(() => expect(observedSignal).toBeDefined());

        handleA.release();
        expect(observedSignal?.aborted).toBe(false);
        handleB.release();
        expect(observedSignal?.aborted).toBe(true);
        await Promise.all([handleA.refresh, handleB.refresh]);
        expect(repository.markFetchFailed).not.toHaveBeenCalled();
    });

    it("同一Coordinator内では新hintだけが失敗抑制を迂回する", async () => {
        const cache = createCache({ lastResolutionAttemptStatus: "failed" });
        const { repository } = createRepository(cache);
        repository.shouldRefresh = vi.fn(() => false);
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockResolvedValue({ status: "failed", reason: "root-not-found" }),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;

        repository.shouldRefresh = vi.fn(() => true);
        await coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://weak.example.com"],
        }, rxNostr).refresh;
        repository.shouldRefresh = vi.fn(() => false);

        await expect(coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://weak.example.com"],
        }, rxNostr).refresh).resolves.toMatchObject({ status: "skipped" });
        await expect(coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://strong.example.com"],
        }, rxNostr).refresh).resolves.toMatchObject({ status: "failed" });
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(2);
    });
});
