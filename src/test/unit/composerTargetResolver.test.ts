import { describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { createComposerTargetResolver } from "../../lib/composerTargetResolver";
import type { NostrEvent } from "../../lib/types";

const eventId = "1".repeat(64);
const author = "2".repeat(64);
const channelId = "3".repeat(64);

function event(overrides: Partial<NostrEvent> = {}): NostrEvent {
    return {
        id: eventId,
        pubkey: author,
        created_at: 1,
        kind: 1,
        tags: [],
        content: "hello",
        sig: "4".repeat(128),
        ...overrides,
    };
}

function pointer(overrides: Record<string, unknown> = {}) {
    return {
        format: "nevent" as const,
        eventId,
        relayHints: ["wss://hint.example/"],
        authorHint: author,
        kindHint: 1,
        ...overrides,
    };
}

function foundTask(resolvedEvent: NostrEvent) {
    return {
        promise: Promise.resolve({
            status: "found" as const,
            event: resolvedEvent,
            relayUrl: "wss://observed.example/",
        }),
        cancel: vi.fn(),
    };
}

function verifiedChannelSnapshot() {
    return {
        context: {
            eventId: channelId,
            relayHints: ["wss://verified.example/"],
            channelRelays: ["wss://write.example/"],
            name: "General",
            about: "Talk",
            picture: null,
        },
        cache: {
            channelEventId: channelId,
            name: "General",
            about: "Talk",
            picture: null,
            relays: ["wss://write.example/"],
            relayHints: ["wss://verified.example/"],
            creatorPubkey: "5".repeat(64),
            resolutionQuality: "verified-metadata" as const,
        },
        source: "network" as const,
    };
}

describe("createComposerTargetResolver", () => {
    it("kind 1を取得・検証し、プロフィールを補完する", async () => {
        const fetchReferencedEventTask = vi.fn((_id: string, _relayHints: string[]) => foundTask(event()));
        const profile = {
            name: "alice",
            displayName: "Alice",
            picture: "",
            npub: "",
            nprofile: "",
        };
        const resolver = createComposerTargetResolver({
            replyQuoteService: { fetchReferencedEventTask },
            verifyEventFn: () => true,
        });

        await expect(resolver.resolve({
            pointer: pointer(),
            rxNostr: {} as never,
            relayConfig: null,
            profileService: {
                fetchProfileRealtime: vi.fn().mockResolvedValue(profile),
            },
        }).promise).resolves.toMatchObject({
            status: "resolved",
            target: {
                event: { id: eventId, kind: 1 },
                relayHints: [
                    "wss://observed.example/",
                    "wss://hint.example/",
                ],
                authorProfile: profile,
                channelQuery: null,
            },
        });
    });

    it.each([
        ["not-found", "not-found"],
        ["timeout", "timeout"],
        ["error", "network"],
    ] as const)("取得status %sを%sへ分類する", async (status, reason) => {
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => ({
                    promise: Promise.resolve({ status }),
                    cancel: vi.fn(),
                }),
            },
            verifyEventFn: () => true,
        });
        await expect(resolver.resolve({
            pointer: pointer(),
            rxNostr: {} as never,
        }).promise).resolves.toEqual({ status: "error", reason });
    });

    it("取得taskの予期しないrejectも再試行可能なnetworkへ分類する", async () => {
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => ({
                    promise: Promise.reject(new Error("unexpected")),
                    cancel: vi.fn(),
                }),
            },
            verifyEventFn: () => true,
        });

        await expect(resolver.resolve({
            pointer: pointer(),
            rxNostr: {} as never,
        }).promise).resolves.toEqual({
            status: "error",
            reason: "network",
        });
    });

    it("作者またはkindヒント不一致を拒否する", async () => {
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event({ kind: 42 })),
            },
            verifyEventFn: () => true,
        });
        await expect(resolver.resolve({
            pointer: pointer(),
            rxNostr: {} as never,
        }).promise).resolves.toEqual({ status: "error", reason: "mismatch" });
    });

    it("不正イベントを拒否する", async () => {
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event()),
            },
            verifyEventFn: () => false,
        });
        await expect(resolver.resolve({
            pointer: pointer(),
            rxNostr: {} as never,
        }).promise).resolves.toEqual({
            status: "error",
            reason: "invalid-event",
        });
    });

    it("Sensitive kind 1 Structureをcomposer targetとして維持し、payloadへredirectしない", async () => {
        const secretKey = generateSecretKey();
        const payload = finalizeEvent({
            kind: 36,
            created_at: 10,
            content: "sensitive post",
            tags: [["k", "1"]],
        }, secretKey);
        const structure = finalizeEvent({
            kind: 1,
            created_at: 20,
            content: "",
            tags: [
                ["content-warning", "Sensitive fixture"],
                ["c", payload.id, "wss://payload-hint.example/"],
            ],
        }, secretKey);
        const fetchReferencedEventTask = vi.fn((
            requestedId: string,
            _relayHints: string[],
            _rxNostr: unknown,
            _relayConfig?: unknown,
        ) => ({
            promise: Promise.resolve({
                status: "found" as const,
                event: requestedId === structure.id ? structure : payload,
                relayUrl: requestedId === structure.id
                    ? "wss://structure-source.example/"
                    : "wss://payload-source.example/",
            }),
            cancel: vi.fn(),
        }));
        const fetchProfileRealtime = vi.fn().mockResolvedValue(null);
        const resolver = createComposerTargetResolver({
            replyQuoteService: { fetchReferencedEventTask },
        });
        const result = await resolver.resolve({
            pointer: pointer({
                eventId: structure.id,
                authorHint: structure.pubkey,
                kindHint: structure.kind,
                relayHints: [
                    "wss://pointer-one.example/",
                    "wss://pointer-two.example/",
                    "wss://pointer-three.example/",
                ],
            }),
            rxNostr: {} as never,
            profileService: { fetchProfileRealtime },
        }).promise;

        expect(result).toMatchObject({
            status: "resolved",
            target: {
                event: { id: structure.id, kind: 1, content: "" },
                relayHints: [
                    "wss://structure-source.example/",
                    "wss://pointer-one.example/",
                    "wss://pointer-two.example/",
                ],
            },
        });
        expect(fetchReferencedEventTask).toHaveBeenCalledTimes(1);
        expect(fetchProfileRealtime).toHaveBeenCalledWith(structure.pubkey, {
            additionalRelays: expect.arrayContaining([
                "wss://structure-source.example/",
            ]),
        });
    });

    it("kind 42から検証済みkind 40 queryを構築し、入力relayをwrite relayにしない", async () => {
        const snapshot = verifiedChannelSnapshot();
        const release = vi.fn();
        const resolveInternal = vi.fn(() => ({
            initial: snapshot,
            cacheReady: Promise.resolve(snapshot),
            refresh: Promise.resolve({
                status: "skipped" as const,
                snapshot,
            }),
            release,
        }));
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event({
                    kind: 42,
                    tags: [["e", channelId, "wss://input.example/", "root"]],
                })),
            },
            channelCoordinator: { resolveInternal },
            verifyEventFn: () => true,
        });

        const result = await resolver.resolve({
            pointer: pointer({ kindHint: 42 }),
            rxNostr: {} as never,
        }).promise;

        expect(result).toMatchObject({
            status: "resolved",
            target: {
                channelPictureCacheEligible: true,
                channelQuery: {
                    eventId: channelId,
                    relayHints: ["wss://verified.example/"],
                },
                channelContext: {
                    channelRelays: ["wss://write.example/"],
                },
            },
        });
        expect(release).toHaveBeenCalledOnce();
    });

    it("kind 42のrootが安全に解決できない場合は操作不能エラーにする", async () => {
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event({
                    kind: 42,
                    tags: [],
                })),
            },
            verifyEventFn: () => true,
        });
        await expect(resolver.resolve({
            pointer: pointer({ kindHint: 42 }),
            rxNostr: {} as never,
        }).promise).resolves.toMatchObject({
            status: "error",
            reason: "channel-unavailable",
            event: { kind: 42 },
        });
    });

    it("有効rootとイベントIDが不正なrootが混在するkind 42を拒否する", async () => {
        const resolveInternal = vi.fn();
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event({
                    kind: 42,
                    tags: [
                        ["e", channelId, "wss://valid.example/", "root"],
                        ["e", "not-a-valid-event-id", "", "root"],
                    ],
                })),
            },
            channelCoordinator: { resolveInternal },
            verifyEventFn: () => true,
        });

        await expect(resolver.resolve({
            pointer: pointer({ kindHint: 42 }),
            rxNostr: {} as never,
        }).promise).resolves.toMatchObject({
            status: "error",
            reason: "channel-unavailable",
        });
        expect(resolveInternal).not.toHaveBeenCalled();
    });

    it("異なるイベントIDのrootが複数あるkind 42を拒否する", async () => {
        const resolveInternal = vi.fn();
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => foundTask(event({
                    kind: 42,
                    tags: [
                        ["e", channelId, "", "root"],
                        ["e", "6".repeat(64), "", "root"],
                    ],
                })),
            },
            channelCoordinator: { resolveInternal },
            verifyEventFn: () => true,
        });

        await expect(resolver.resolve({
            pointer: pointer({ kindHint: 42 }),
            rxNostr: {} as never,
        }).promise).resolves.toMatchObject({
            status: "error",
            reason: "channel-unavailable",
        });
        expect(resolveInternal).not.toHaveBeenCalled();
    });

    it("cancelで取得taskを解除し、古い結果をcancelledにする", async () => {
        let finish: ((value: { status: "cancelled" }) => void) | undefined;
        const cancel = vi.fn(() => finish?.({ status: "cancelled" }));
        const resolver = createComposerTargetResolver({
            replyQuoteService: {
                fetchReferencedEventTask: () => ({
                    promise: new Promise((resolve) => {
                        finish = resolve;
                    }),
                    cancel,
                }),
            },
            verifyEventFn: () => true,
        });
        const task = resolver.resolve({
            pointer: pointer({ authorHint: null }),
            rxNostr: {} as never,
        });
        task.cancel();
        await expect(task.promise).resolves.toEqual({ status: "cancelled" });
        expect(cancel).toHaveBeenCalledOnce();
    });

    it("既知relay hintから返信対象を取得し、遅いNIP-65 lookupを待たない", async () => {
        let finishLookup!: (relays: string[]) => void;
        const lookupAuthorWriteRelaysFn = vi.fn(() => new Promise<string[]>((resolve) => {
            finishLookup = resolve;
        }));
        const fetchReferencedEventTask = vi.fn((_id: string, _relayHints: string[]) => foundTask(event()));
        const resolver = createComposerTargetResolver({
            replyQuoteService: { fetchReferencedEventTask },
            lookupAuthorWriteRelaysFn,
            verifyEventFn: () => true,
        });
        const explicitRelay = "wss://explicit-event-hint.example/";

        await expect(resolver.resolve({
            pointer: pointer({ relayHints: [explicitRelay] }),
            rxNostr: {} as never,
        }).promise).resolves.toMatchObject({ status: "resolved" });
        expect(fetchReferencedEventTask).toHaveBeenCalledOnce();
        expect(fetchReferencedEventTask.mock.calls[0][1]).toContain(explicitRelay);
        finishLookup(["wss://author-write.example/"]);
    });

    it("keeps explicit event hints when the author has three Write relays", async () => {
        const authorWriteRelays = [
            "wss://author-write-1.example/",
            "wss://author-write-2.example/",
            "wss://author-write-3.example/",
        ];
        const explicitRelay = "wss://explicit-event-hint.example/";
        const fetchReferencedEventTask = vi.fn((
            _id: string,
            relayHints: string[],
            _rxNostr?: any,
            _relayConfig?: any,
            _timeoutMs?: number,
            _authorWriteRelays?: string[],
        ) =>
            relayHints.includes(explicitRelay)
                ? { promise: Promise.resolve({ status: "not-found" as const }), cancel: vi.fn() }
                : foundTask(event()),
        );
        const resolver = createComposerTargetResolver({
            replyQuoteService: { fetchReferencedEventTask },
            lookupAuthorWriteRelaysFn: async () => authorWriteRelays,
            verifyEventFn: () => true,
        });

        await expect(resolver.resolve({
            pointer: pointer({ relayHints: [explicitRelay] }),
            rxNostr: {} as never,
        }).promise).resolves.toMatchObject({ status: "resolved" });

        expect(fetchReferencedEventTask).toHaveBeenCalledTimes(2);
        expect(fetchReferencedEventTask.mock.calls[0][1]).toEqual([explicitRelay]);
        expect(fetchReferencedEventTask.mock.calls[1][1]).toEqual([]);
        expect(fetchReferencedEventTask.mock.calls[1][5]).toEqual(authorWriteRelays);
    });
});
