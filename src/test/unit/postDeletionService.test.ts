import { describe, expect, it, vi } from "vitest";

vi.mock("../../lib/postHistoryRawEventVerification", () => ({
    RAW_EVENT_VERIFICATION_RULE_VERSION: 1,
    attestFullyVerifiedPostHistoryRawEvent: (event: unknown) => ({
        event,
        attestation: {},
    }),
}));
import type { AuthState } from "../../lib/types";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import {
    PostDeletionService,
    buildDeletionRelayUrls,
    buildDeletionRequestEvent,
    canRequestPostDeletion,
} from "../../lib/postDeletionService";
import { createDeferred } from "../deferredTestUtils";
import { createMockConsole } from "../helpers";

function createAuthState(overrides: Partial<AuthState> = {}): AuthState {
    return {
        type: "nsec",
        isAuthenticated: true,
        pubkey: "a".repeat(64),
        npub: "npub1test",
        nprofile: "nprofile1test",
        isValid: true,
        isInitialized: true,
        isExtensionLogin: false,
        ...overrides,
    };
}

function createRecord(overrides: Partial<PostHistoryRecord> = {}): PostHistoryRecord {
    return {
        id: "event-1",
        eventId: "e".repeat(64),
        pubkeyHex: "a".repeat(64),
        kind: 1,
        content: "hello world",
        tags: [],
        createdAt: 100,
        postedAt: 200,
        relayHints: ["wss://hint.example.com/"],
        acceptedRelays: ["wss://accepted.example.com/"],
        fetchedRelays: ["wss://fetched.example.com/"],
        media: [],
        rawEvent: {},
        updatedAt: 300,
        schemaVersion: 2,
        ...overrides,
    };
}

describe("postDeletionService helpers", () => {
    it.each([
        {
            name: "自分の未削除投稿",
            recordOverrides: {},
            expected: true,
        },
        {
            name: "他人の投稿",
            recordOverrides: { pubkeyHex: "b".repeat(64) },
            expected: false,
        },
        {
            name: "削除済み投稿",
            recordOverrides: { deletedAt: 123 },
            expected: false,
        },
        {
            name: "対象外kind",
            recordOverrides: { kind: 30023 },
            expected: false,
        },
    ])("$name", ({ recordOverrides, expected }) => {
        expect(canRequestPostDeletion(createRecord(recordOverrides), "a".repeat(64))).toBe(
            expected,
        );
    });

    it("kind:5 deletion request event を e tag, k tag, 空 content で組み立てる", () => {
        const event = buildDeletionRequestEvent(
            createRecord({ eventId: "1".repeat(64), kind: 42 }),
            500,
        );

        expect(event).toEqual({
            kind: 5,
            pubkey: "a".repeat(64),
            content: "",
            tags: [["e", "1".repeat(64)], ["k", "42"]],
            created_at: 500,
        });
    });

    it("relay 候補を accepted, fetched, hints, channel, write の順で sanitize する", () => {
        const relays = buildDeletionRelayUrls(
            createRecord({
                kind: 42,
                acceptedRelays: ["wss://accepted.example.com/"],
                fetchedRelays: ["wss://fetched.example.com/"],
                relayHints: ["wss://hint.example.com/"],
                channelRelayHints: ["wss://channel.example.com/"],
            }),
            ["wss://write.example.com/", "wss://accepted.example.com/"],
        );

        expect(relays).toEqual([
            "wss://accepted.example.com/",
            "wss://fetched.example.com/",
            "wss://hint.example.com/",
            "wss://channel.example.com/",
            "wss://write.example.com/",
        ]);
    });
});

describe("PostDeletionService", () => {
    it("nsec signer で署名送信し、atomicなローカル削除保存を呼ぶ", async () => {
        const saveLocalDeletion = vi.fn().mockResolvedValue(undefined);
        const sendEvent = vi.fn().mockResolvedValue({
            success: true,
            eventId: "delete-event-id",
            acceptedRelays: ["wss://accepted.example.com/"],
        });
        const signEvent = vi.fn().mockResolvedValue({
            id: "delete-event-id",
            sig: "s".repeat(128),
            kind: 5,
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            pubkey: "a".repeat(64),
            created_at: 1,
        });
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState() },
            keyManager: {
                getFromStore: () => "nsec1test",
                loadFromStorage: () => null,
                isWindowNostrAvailable: () => false,
            },
            seckeySignerFn: vi.fn().mockReturnValue({ signEvent }),
            writeRelaysStore: { value: ["wss://write.example.com/"] },
            postHistoryDeletionRequestsRepository: { saveLocalDeletion },
            eventSenderFactory: () => ({ sendEvent }),
            now: () => 5000,
            console: createMockConsole(),
        });

        const result = await service.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });

        expect(result).toMatchObject({
            success: true,
            eventId: "delete-event-id",
            acceptedRelays: ["wss://accepted.example.com/"],
            deletionEventId: "delete-event-id",
            deletionEvent: expect.objectContaining({ id: "delete-event-id", kind: 5 }),
            deletedAt: 5000,
        });
        expect(signEvent).toHaveBeenCalledWith({
            kind: 5,
            pubkey: "a".repeat(64),
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            created_at: 5,
        });
        expect(sendEvent).toHaveBeenCalledWith(
            expect.objectContaining({ id: "delete-event-id", kind: 5 }),
            {
                includeDefaultWriteRelays: true,
                targetRelays: [
                    "wss://accepted.example.com/",
                    "wss://fetched.example.com/",
                    "wss://hint.example.com/",
                    "wss://write.example.com/",
                ],
            },
        );
        expect(saveLocalDeletion).toHaveBeenCalledWith(expect.objectContaining({
            targetEventId: "e".repeat(64),
            deletionEvent: expect.objectContaining({ id: "delete-event-id", kind: 5 }),
            deletedAt: 5000,
        }));
    });

    it("atomicなローカル保存失敗でもpublish成功結果を失敗扱いにしない", async () => {
        const saveLocalDeletion = vi.fn().mockRejectedValue(new Error("local save failed"));
        const sendEvent = vi.fn().mockResolvedValue({
            success: true,
            eventId: "delete-event-id",
        });
        const signEvent = vi.fn().mockResolvedValue({
            id: "delete-event-id",
            sig: "s".repeat(128),
            kind: 5,
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            pubkey: "a".repeat(64),
            created_at: 5,
        });
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState() },
            keyManager: {
                getFromStore: () => "nsec1test",
                loadFromStorage: () => null,
                isWindowNostrAvailable: () => false,
            },
            seckeySignerFn: vi.fn().mockReturnValue({ signEvent }),
            postHistoryDeletionRequestsRepository: { saveLocalDeletion },
            eventSenderFactory: () => ({ sendEvent }),
            now: () => 5000,
            console: createMockConsole(),
        });

        const result = await service.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });

        expect(result).toMatchObject({
            success: true,
            deletionEventId: "delete-event-id",
            deletedAt: 5000,
        });
    });

    it("他人の投稿には deletion request を送らない", async () => {
        const sendEvent = vi.fn();
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState() },
            keyManager: {
                getFromStore: () => "nsec1test",
                loadFromStorage: () => null,
                isWindowNostrAvailable: () => false,
            },
            seckeySignerFn: vi.fn().mockReturnValue({ signEvent: vi.fn() }),
            eventSenderFactory: () => ({ sendEvent }),
        });

        const result = await service.requestDeletion({
            post: createRecord({ pubkeyHex: "b".repeat(64) }),
            rxNostr: {} as any,
        });

        expect(result).toEqual({
            success: false,
            error: "deletion_request_not_allowed",
        });
        expect(sendEvent).not.toHaveBeenCalled();
    });

    it("NIP-07 signer を優先して使う", async () => {
        const signEvent = vi.fn().mockResolvedValue({
            id: "nip07-delete-id",
            sig: "s".repeat(128),
            kind: 5,
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            pubkey: "a".repeat(64),
            created_at: 10,
        });
        const sendEvent = vi.fn().mockResolvedValue({
            success: true,
            eventId: "nip07-delete-id",
        });
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState({ type: "nip07" }) },
            window: { nostr: { signEvent } },
            postHistoryDeletionRequestsRepository: { saveLocalDeletion: vi.fn().mockResolvedValue(undefined) },
            eventSenderFactory: () => ({ sendEvent }),
            now: () => 10_000,
        });

        await service.requestDeletion({ post: createRecord(), rxNostr: {} as any });

        expect(signEvent).toHaveBeenCalledOnce();
        expect(sendEvent).toHaveBeenCalledOnce();
    });

    it("NIP-46 と parentClient signer 経路を壊さない", async () => {
        const nip46SignEvent = vi.fn().mockResolvedValue({
            id: "nip46-delete-id",
            sig: "s".repeat(128),
            kind: 5,
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            pubkey: "a".repeat(64),
            created_at: 10,
        });
        const parentSignEvent = vi.fn().mockResolvedValue({
            id: "parent-delete-id",
            sig: "s".repeat(128),
            kind: 5,
            content: "",
            tags: [["e", "e".repeat(64)], ["k", "1"]],
            pubkey: "a".repeat(64),
            created_at: 10,
        });
        const sendEvent = vi.fn().mockResolvedValue({ success: true, eventId: "ok" });

        const nip46ServiceInstance = new PostDeletionService({
            authStateStore: { value: createAuthState({ type: "nip46" }) },
            getNip46SignerForSessionFn: vi.fn().mockResolvedValue({ signEvent: nip46SignEvent }),
            postHistoryDeletionRequestsRepository: { saveLocalDeletion: vi.fn().mockResolvedValue(undefined) },
            eventSenderFactory: () => ({ sendEvent }),
            now: () => 20_000,
        });
        const parentServiceInstance = new PostDeletionService({
            authStateStore: { value: createAuthState({ type: "parentClient" }) },
            getParentClientSignerFn: () => ({ signEvent: parentSignEvent }),
            postHistoryDeletionRequestsRepository: { saveLocalDeletion: vi.fn().mockResolvedValue(undefined) },
            eventSenderFactory: () => ({ sendEvent }),
            now: () => 30_000,
        });

        await nip46ServiceInstance.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });
        await parentServiceInstance.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });

        expect(nip46SignEvent).toHaveBeenCalledOnce();
        expect(parentSignEvent).toHaveBeenCalledOnce();
        expect(sendEvent).toHaveBeenCalledTimes(2);
    });

    it("NIP-46 signer取得不能時は署名せずエラーを返す", async () => {
        const nip46SignEvent = vi.fn();
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState({ type: "nip46" }) },
            getNip46SignerForSessionFn: vi.fn().mockResolvedValue(null),
        });

        const result = await service.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });

        expect(result).toEqual({
            success: false,
            error: "nip46_signer_not_available",
        });
        expect(nip46SignEvent).not.toHaveBeenCalled();
    });

    it("NIP-46 signer取得待機中に認証が変わった場合はsignerを使用しない", async () => {
        const signerDeferred = createDeferred<any>();
        const signEvent = vi.fn();
        const authStateStore = { value: createAuthState({ type: "nip46" }) };
        const service = new PostDeletionService({
            authStateStore,
            getNip46SignerForSessionFn: vi.fn().mockReturnValue(signerDeferred.promise),
        });

        const resultPromise = service.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });
        authStateStore.value = createAuthState({
            type: "nip46",
            pubkey: "b".repeat(64),
        });
        signerDeferred.resolve({ signEvent });

        await expect(resultPromise).resolves.toEqual({
            success: false,
            error: "nip46_signer_not_available",
        });
        expect(signEvent).not.toHaveBeenCalled();
    });

    it("signEvent を持たない signer では送信しない", async () => {
        const sendEvent = vi.fn();
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState({ type: "parentClient" }) },
            getParentClientSignerFn: () => ({}) as any,
            eventSenderFactory: () => ({ sendEvent }),
        });

        const result = await service.requestDeletion({
            post: createRecord(),
            rxNostr: {} as any,
        });

        expect(result).toEqual({
            success: false,
            error: "nostr_sign_event_not_supported",
        });
        expect(sendEvent).not.toHaveBeenCalled();
    });
});
