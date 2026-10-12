import { afterEach, describe, expect, it, vi } from "vitest";
import { Subject } from "rxjs";
import type { OkPacketAgainstEvent } from "rx-nostr";
import { finalizeEvent, getPublicKey } from "nostr-tools";
import { PostManager } from "../../lib/postManager";
import { PostDeletionService } from "../../lib/postDeletionService";
import { PostRepostService } from "../../lib/postRepostService";
import type { AuthState, NostrEvent } from "../../lib/types";
import { createMockRxNostr, MockKeyManager } from "../helpers";
import { attestFullyVerifiedPostHistoryRawEvent } from "../../lib/postHistoryRawEventVerification";
import type { AttestedPostHistoryRawEvent } from "../../lib/postHistoryRawEventVerification";
import { createDeferred } from "../deferredTestUtils";

const key = new Uint8Array(32).fill(8);
const pubkey = getPublicKey(key);
const auth: AuthState = { type: "nsec", isAuthenticated: true, pubkey,
    npub: "npub1fixture", nprofile: "nprofile1fixture", isValid: true, isInitialized: true, isExtensionLogin: false };
afterEach(() => vi.useRealTimers());

describe("independent local storage and external post delivery", () => {
    it.each([[true, "accept"], [true, "reject"], [true, "pending"], [false, "accept"], [false, "reject"]] as const)(
        "external=%s local=%s keeps external delivery authoritative", async (external, local) => {
            vi.useFakeTimers();
            const rx = createMockRxNostr();
            rx.getDefaultRelays = () => ({ "wss://external.example/": { url: "wss://external.example/", read: true, write: true } });
            const ack = new Subject<OkPacketAgainstEvent>();
            const send = vi.fn<typeof rx.send>(() => ack); rx.send = send;
            const save = vi.fn();
            const localStore = vi.fn((_inputs: AttestedPostHistoryRawEvent[]) => local === "accept" ? Promise.resolve()
                : local === "pending" ? new Promise<void>(() => undefined) : Promise.reject(new Error("local unavailable")));
            const manager = new PostManager(rx, {
                authStateStore: { value: auth }, keyManager: new MockKeyManager("fixture-key"),
                seckeySignerFn: () => ({ signEvent: async (template) => finalizeEvent(template, key) }),
                hashtagStore: { hashtags: [], tags: [] }, contentWarningStore: { value: false, reset: () => undefined },
                contentWarningReasonStore: { value: "", reset: () => undefined },
                writeRelaysStore: { value: ["wss://external.example/"] }, settingsStore: { quoteNotificationEnabled: false },
                replyQuoteState: { value: { reply: null, quotes: [] } } as never,
                savePostHistoryFn: save, storeSignedEventsFn: localStore,
                resetEditorStateFn: () => undefined, resetPostStatusFn: () => undefined,
                saveHashtagsToHistoryFn: () => undefined, clearReplyQuoteFn: () => undefined,
                notificationPort: { notifyPostSuccess: () => true, notifyPostError: () => true },
            });
            const result = manager.submitPost("local relay synthetic fixture");
            await vi.advanceTimersByTimeAsync(0);
            expect(send).toHaveBeenCalledOnce(); expect(localStore).not.toHaveBeenCalled();
            const sent = send.mock.calls[0][0];
            ack.next({ type: "OK", eventId: sent.id!, from: "wss://external.example/", ok: external,
                done: true, notice: "", message: ["OK", sent.id!, external, ""] });
            ack.complete();
            await vi.advanceTimersByTimeAsync(1600);
            const delivered = await result;
            expect(delivered.success).toBe(external);
            expect(localStore).toHaveBeenCalledTimes(external ? 1 : 0);
            if (external) {
                expect(localStore.mock.calls[0][0].map(input => input.event)).toEqual([sent]);
                expect(attestFullyVerifiedPostHistoryRawEvent(localStore.mock.calls[0][0][0].event)).not.toBeNull();
            }
            expect(delivered.acceptedRelays ?? []).toEqual(external ? ["wss://external.example/"] : []);
            expect(save).toHaveBeenCalledTimes(external ? 1 : 0);
        });

    it("a synchronous local failure does not prevent a verified deletion from publishing", async () => {
        const event = finalizeEvent({ kind: 1, created_at: 100, content: "fixture", tags: [] }, key);
        const send = vi.fn().mockResolvedValue({ success: true, acceptedRelays: ["wss://external.example/"] });
        const save = vi.fn();
        const service = new PostDeletionService({ authStateStore: { value: auth }, keyManager: new MockKeyManager("fixture-key"),
            seckeySignerFn: () => ({ signEvent: async (template) => finalizeEvent(template, key) }),
            eventSenderFactory: () => ({ sendEvent: send }), postHistoryDeletionRequestsRepository: { saveLocalDeletion: save },
            storeSignedEventsFn: () => { throw new Error("local unavailable"); } });
        const result = await service.requestDeletion({ rxNostr: createMockRxNostr(), post: {
            id: event.id, eventId: event.id, pubkeyHex: pubkey, kind: 1, content: event.content, tags: [],
            createdAt: 100, postedAt: 100000, relayHints: [], acceptedRelays: [], media: [], rawEvent: event,
            updatedAt: 100000, schemaVersion: 2,
        } });
        expect(result.success).toBe(true);
        expect(send).toHaveBeenCalledOnce(); expect(save).toHaveBeenCalledOnce();
    });

    it.each(["repost", "deletion"] as const)("%s copies only after external success and never awaits local ACK", async path => {
        for (const success of [false, true]) {
            const event = finalizeEvent({ kind: 1, created_at: 100, content: "fixture", tags: [] }, key);
            const external = createDeferred<{ success: boolean; acceptedRelays: string[] }>();
            const send = vi.fn((_event: NostrEvent) => external.promise), save = vi.fn();
            const localStore = vi.fn((_inputs: AttestedPostHistoryRawEvent[]) => new Promise<void>(() => undefined));
            const shared = { authStateStore: { value: auth }, keyManager: new MockKeyManager("fixture-key"),
                seckeySignerFn: () => ({ signEvent: async (template: import("nostr-tools").EventTemplate) => finalizeEvent(template, key) }),
                storeSignedEventsFn: localStore };
            const operation = path === "repost"
                ? new PostRepostService({ ...shared, getWriteRelays: () => ["wss://external.example/"],
                    getLocalRevision: async () => 0, createSender: () => ({ sendEvent: send }), saveHistory: save }).repost({
                    target: event, relayHints: ["wss://external.example/"], rxNostr: createMockRxNostr(),
                    prepareTarget: async () => ({ targetEventId: event.id, event, status: "resolved", profile: null,
                        authorPubkey: pubkey, relayHints: ["wss://external.example/"], errorCode: null, updatedAt: 100 }) })
                : new PostDeletionService({ ...shared, eventSenderFactory: () => ({ sendEvent: send }),
                    postHistoryDeletionRequestsRepository: { saveLocalDeletion: save } }).requestDeletion({
                    rxNostr: createMockRxNostr(), post: { id: event.id, eventId: event.id, pubkeyHex: pubkey, kind: 1,
                        content: event.content, tags: [], createdAt: 100, postedAt: 100000, relayHints: [], acceptedRelays: [],
                        media: [], rawEvent: event, updatedAt: 100000, schemaVersion: 2 } });
            await vi.waitFor(() => expect(send).toHaveBeenCalledOnce());
            expect(localStore).not.toHaveBeenCalled(); expect(save).not.toHaveBeenCalled();
            external.resolve({ success, acceptedRelays: success ? ["wss://external.example/"] : [] });
            expect((await operation).success).toBe(success);
            expect(localStore).toHaveBeenCalledTimes(success ? 1 : 0);
            expect(save).toHaveBeenCalledTimes(success ? 1 : 0);
            if (success) expect(localStore.mock.calls[0][0].map(input => input.event)).toEqual([send.mock.calls[0][0]]);
        }
    });
});
