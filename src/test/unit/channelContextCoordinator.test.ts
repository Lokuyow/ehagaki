import { describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import { ChannelContextCoordinator } from "../../lib/channelContextCoordinator";
import type {
    ChannelMetadataCache,
    ChannelMetadataRepository,
} from "../../lib/storage/channelMetadataRepository";

const channelId = "a".repeat(64);

function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((next) => {
        resolve = next;
    });
    return { promise, resolve };
}

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

function incompleteResolvedNetworkResult(name = "Partial channel") {
    return {
        ...resolvedNetworkResult(name),
        metadataLookup: "incomplete" as const,
    };
}

function incompleteRootOnlyResult() {
    return {
        status: "root-only" as const,
        quality: "verified-root-only" as const,
        reason: "invalid-root-content" as const,
        metadataLookup: "incomplete" as const,
        channelEventId: channelId,
        creatorPubkey: "b".repeat(64),
        createEventCreatedAt: 100,
        verifiedSourceRelays: ["wss://root.example.com/"],
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

    it("legacy-seedは表示metadataだけに使い、read/write relay候補には使わない", async () => {
        const { repository } = createRepository(createCache({
            name: "Legacy name",
            relayHints: ["wss://legacy-read.example.com/"],
            relays: ["wss://legacy-write.example.com/"],
            resolutionQuality: "legacy-seed",
        }));
        repository.shouldRefresh = vi.fn(() => false);
        const coordinator = new ChannelContextCoordinator({
            service: { resolveChannelMetadataWithInternalHints: vi.fn() },
            repository,
        });

        const snapshot = await coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://seed-read.example.com/"],
            channelRelays: ["wss://seed-write.example.com/"],
        }).cacheReady;

        expect(snapshot.context).toMatchObject({
            name: "Legacy name",
            relayHints: ["wss://seed-read.example.com/"],
            channelRelays: ["wss://seed-write.example.com/"],
        });
    });

    it("verified-root-onlyはsource relayだけをread候補に追加する", async () => {
        const { repository } = createRepository(createCache({
            relayHints: ["wss://verified-root.example.com/"],
            relays: ["wss://must-not-write.example.com/"],
            resolutionQuality: "verified-root-only",
        }));
        repository.shouldRefresh = vi.fn(() => false);
        const coordinator = new ChannelContextCoordinator({
            service: { resolveChannelMetadataWithInternalHints: vi.fn() },
            repository,
        });

        const snapshot = await coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://seed-read.example.com/"],
            channelRelays: ["wss://seed-write.example.com/"],
        }).cacheReady;

        expect(snapshot.context.relayHints).toEqual([
            "wss://seed-read.example.com/",
            "wss://verified-root.example.com/",
        ]);
        expect(snapshot.context.channelRelays).toEqual([
            "wss://seed-write.example.com/",
        ]);
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

    it("abort済みentryは新consumerへ共有せず、古いfinallyも新entryを削除しない", async () => {
        const { repository } = createRepository(null);
        const firstRequest = deferred<any>();
        const secondRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise)
                .mockReturnValueOnce(secondRequest.promise),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const handleA = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://a.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
        });

        handleA.release();
        const firstSignal = service.resolveChannelMetadataWithInternalHints.mock.calls[0]?.[3]?.signal;
        expect(firstSignal?.aborted).toBe(true);

        const handleB = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://b.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(2);
        });

        firstRequest.resolve({ status: "aborted" });
        await handleA.refresh;
        const handleC = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://c.example.com/"],
        }, rxNostr);
        await handleC.cacheReady;
        await Promise.resolve();
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(2);

        secondRequest.resolve(resolvedNetworkResult("Fresh request"));
        await expect(handleB.refresh).resolves.toMatchObject({
            status: "updated",
            snapshot: { context: { name: "Fresh request" } },
        });
        await expect(handleC.refresh).resolves.toMatchObject({ status: "updated" });
        expect(repository.upsertResolvedChannel).toHaveBeenCalledTimes(1);
    });

    it.each([
        {
            label: "failed",
            firstResult: { status: "failed", reason: "root-not-found" },
            expectedCalls: 2,
        },
        {
            label: "incomplete",
            firstResult: incompleteRootOnlyResult(),
            expectedCalls: 2,
        },
        {
            label: "resolved + complete",
            firstResult: resolvedNetworkResult("Already complete"),
            expectedCalls: 1,
        },
    ])("in-flight中の新hintは$labelの場合にだけ即時再試行する", async ({
        firstResult,
        expectedCalls,
    }) => {
        const { repository } = createRepository(null);
        const firstRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise)
                .mockResolvedValueOnce(resolvedNetworkResult("Retried")),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
        });
        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://new.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();

        firstRequest.resolve(firstResult);
        await Promise.all([firstHandle.refresh, secondHandle.refresh]);
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(expectedCalls);
    });

    it("resolved + incompleteを保存後の再試行がfailedでもmetadataをsnapshotへ残す", async () => {
        const { repository, getStored } = createRepository(null);
        const firstRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise)
                .mockResolvedValueOnce({ status: "failed", reason: "root-not-found" }),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1));
        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://new.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();

        firstRequest.resolve(incompleteResolvedNetworkResult("Saved partial"));
        const [firstResult, secondResult] = await Promise.all([
            firstHandle.refresh,
            secondHandle.refresh,
        ]);

        expect(repository.upsertResolvedChannel).toHaveBeenCalledTimes(1);
        expect(repository.markFetchFailed).toHaveBeenCalledTimes(1);
        expect(getStored()).toMatchObject({
            name: "Saved partial",
            resolutionQuality: "verified-metadata",
            lastResolutionAttemptStatus: "failed",
        });
        expect(firstResult).toMatchObject({
            status: "failed",
            snapshot: {
                source: "network",
                context: { name: "Saved partial" },
            },
        });
        expect(secondResult).toMatchObject({
            status: "failed",
            snapshot: { context: { name: "Saved partial" } },
        });
    });

    it("root-only + incompleteを保存後の再試行がfailedでも検証済みrootを残す", async () => {
        const { repository, getStored } = createRepository(null);
        const firstRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise)
                .mockResolvedValueOnce({ status: "failed", reason: "timeout" }),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1));
        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://new.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();

        firstRequest.resolve(incompleteRootOnlyResult());
        const result = await firstHandle.refresh;
        await secondHandle.refresh;

        expect(getStored()).toMatchObject({
            resolutionQuality: "verified-root-only",
            relayHints: ["wss://root.example.com/"],
            lastResolutionAttemptStatus: "failed",
        });
        expect(result).toMatchObject({
            status: "failed",
            snapshot: {
                cache: {
                    resolutionQuality: "verified-root-only",
                    relayHints: ["wss://root.example.com/"],
                },
            },
        });
    });

    it("incomplete保存後の再試行で新しいverified metadataへ昇格する", async () => {
        const { repository, getStored } = createRepository(null);
        const firstRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise)
                .mockResolvedValueOnce(resolvedNetworkResult("New verified")),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1));
        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://new.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();

        firstRequest.resolve(incompleteRootOnlyResult());
        await Promise.all([firstHandle.refresh, secondHandle.refresh]);

        expect(repository.upsertResolvedChannel).toHaveBeenCalledTimes(2);
        expect(getStored()).toMatchObject({
            name: "New verified",
            resolutionQuality: "verified-metadata",
        });
    });

    it("failedの失敗記録中に追加された新hintを次のREQへ渡す", async () => {
        const { repository } = createRepository(null);
        const markFinished = deferred<void>();
        repository.markFetchFailed = vi.fn(() => markFinished.promise);
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockResolvedValueOnce({ status: "failed", reason: "root-not-found" })
                .mockResolvedValueOnce(resolvedNetworkResult("Retried after mark")),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => expect(repository.markFetchFailed).toHaveBeenCalledTimes(1));

        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://late.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();
        markFinished.resolve();

        await Promise.all([firstHandle.refresh, secondHandle.refresh]);
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(2);
        expect(service.resolveChannelMetadataWithInternalHints.mock.calls[1]?.[0]).toEqual({
            eventId: channelId,
            relayHints: [
                "wss://first.example.com/",
                "wss://late.example.com/",
            ],
        });
    });

    it.each([
        {
            label: "incomplete",
            firstResult: incompleteResolvedNetworkResult("Saved while waiting"),
            expectedCalls: 2,
        },
        {
            label: "resolved + complete",
            firstResult: resolvedNetworkResult("Complete while waiting"),
            expectedCalls: 1,
        },
    ])("$labelの保存中に新hintが追加された場合の再試行方針を維持する", async ({
        firstResult,
        expectedCalls,
    }) => {
        const { repository } = createRepository(null);
        const saveFinished = deferred<ChannelMetadataCache>();
        repository.upsertResolvedChannel = vi.fn()
            .mockReturnValueOnce(saveFinished.promise)
            .mockResolvedValueOnce(createCache({ name: "Retried" }));
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockResolvedValueOnce(firstResult)
                .mockResolvedValueOnce(resolvedNetworkResult("Retried")),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const firstHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, rxNostr);
        await vi.waitFor(() => expect(repository.upsertResolvedChannel).toHaveBeenCalledTimes(1));

        const secondHandle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://late.example.com/"],
        }, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();
        saveFinished.resolve(createCache({ name: firstResult.metadata.name }));

        await Promise.all([firstHandle.refresh, secondHandle.refresh]);
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(expectedCalls);
    });

    it("incomplete保存中に全consumerがreleaseされても失敗として記録しない", async () => {
        const { repository } = createRepository(null);
        const saveFinished = deferred<ChannelMetadataCache>();
        repository.upsertResolvedChannel = vi.fn(() => saveFinished.promise);
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockResolvedValue(incompleteResolvedNetworkResult("Saved before abort")),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const handle = coordinator.resolveInternal({
            eventId: channelId,
            relayHints: ["wss://first.example.com/"],
        }, {} as RxNostr);
        await vi.waitFor(() => expect(repository.upsertResolvedChannel).toHaveBeenCalledTimes(1));

        handle.release();
        saveFinished.resolve(createCache({ name: "Saved before abort" }));

        await expect(handle.refresh).resolves.toMatchObject({ status: "aborted" });
        expect(repository.markFetchFailed).not.toHaveBeenCalled();
    });

    it("in-flight中に同じhintを再追加しても再試行しない", async () => {
        const { repository } = createRepository(null);
        const firstRequest = deferred<any>();
        const service = {
            resolveChannelMetadataWithInternalHints: vi.fn()
                .mockReturnValueOnce(firstRequest.promise),
        };
        const coordinator = new ChannelContextCoordinator({ service, repository });
        const rxNostr = {} as RxNostr;
        const query = {
            eventId: channelId,
            relayHints: ["wss://same.example.com/"],
        };
        const firstHandle = coordinator.resolveInternal(query, rxNostr);
        await vi.waitFor(() => {
            expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
        });
        const secondHandle = coordinator.resolveInternal(query, rxNostr);
        await secondHandle.cacheReady;
        await Promise.resolve();

        firstRequest.resolve({ status: "failed", reason: "root-not-found" });
        await Promise.all([firstHandle.refresh, secondHandle.refresh]);
        expect(service.resolveChannelMetadataWithInternalHints).toHaveBeenCalledTimes(1);
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
