import { afterEach, describe, expect, it, vi } from "vitest";
import { of } from "rxjs";
import type { OkPacketAgainstEvent } from "rx-nostr";
import { finalizeEvent, getPublicKey } from "nostr-tools";
import { PostManager } from "../../lib/postManager";
import { PostDeletionService } from "../../lib/postDeletionService";
import type { AuthState } from "../../lib/types";
import { createMockRxNostr, MockKeyManager } from "../helpers";
import { attestFullyVerifiedPostHistoryRawEvent } from "../../lib/postHistoryRawEventVerification";
import type { AttestedPostHistoryRawEvent } from "../../lib/postHistoryRawEventVerification";

const key = new Uint8Array(32).fill(8);
const pubkey = getPublicKey(key);
const auth: AuthState = { type: "nsec", isAuthenticated: true, pubkey,
    npub: "npub1fixture", nprofile: "nprofile1fixture", isValid: true, isInitialized: true, isExtensionLogin: false };
afterEach(() => vi.useRealTimers());

describe("independent local storage and external post delivery", () => {
    it.each([[true, true], [true, false], [false, true], [false, false]])(
        "external=%s local=%s keeps external delivery authoritative", async (external, local) => {
            vi.useFakeTimers();
            const rx = createMockRxNostr();
            rx.getDefaultRelays = () => ({ "wss://external.example/": { url: "wss://external.example/", read: true, write: true } });
            rx.send = vi.fn<typeof rx.send>((event) => of<OkPacketAgainstEvent>({ type: "OK", eventId: event.id!,
                from: "wss://external.example/", ok: external, done: true, notice: "", message: ["OK", event.id!, external, ""] }));
            const save = vi.fn();
            const localStore = vi.fn((_input: AttestedPostHistoryRawEvent) => local ? Promise.resolve() : Promise.reject(new Error("local unavailable")));
            const manager = new PostManager(rx, {
                authStateStore: { value: auth }, keyManager: new MockKeyManager("fixture-key"),
                seckeySignerFn: () => ({ signEvent: async (template) => finalizeEvent(template, key) }),
                hashtagStore: { hashtags: [], tags: [] }, contentWarningStore: { value: false, reset: () => undefined },
                contentWarningReasonStore: { value: "", reset: () => undefined },
                writeRelaysStore: { value: ["wss://external.example/"] }, settingsStore: { quoteNotificationEnabled: false },
                replyQuoteState: { value: { reply: null, quotes: [] } } as never,
                savePostHistoryFn: save, storeSignedEventFn: localStore,
                resetEditorStateFn: () => undefined, resetPostStatusFn: () => undefined,
                saveHashtagsToHistoryFn: () => undefined, clearReplyQuoteFn: () => undefined,
                notificationPort: { notifyPostSuccess: () => true, notifyPostError: () => true },
            });
            const result = manager.submitPost("local relay synthetic fixture");
            await vi.advanceTimersByTimeAsync(1600);
            const delivered = await result;
            expect(delivered.success).toBe(external);
            expect(localStore).toHaveBeenCalledOnce();
            expect(attestFullyVerifiedPostHistoryRawEvent(localStore.mock.calls[0][0].event)).not.toBeNull();
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
            storeSignedEventFn: () => { throw new Error("local unavailable"); } });
        const result = await service.requestDeletion({ rxNostr: createMockRxNostr(), post: {
            id: event.id, eventId: event.id, pubkeyHex: pubkey, kind: 1, content: event.content, tags: [],
            createdAt: 100, postedAt: 100000, relayHints: [], acceptedRelays: [], media: [], rawEvent: event,
            updatedAt: 100000, schemaVersion: 2,
        } });
        expect(result.success).toBe(true);
        expect(send).toHaveBeenCalledOnce(); expect(save).toHaveBeenCalledOnce();
    });
});
