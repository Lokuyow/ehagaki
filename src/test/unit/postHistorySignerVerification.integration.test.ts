import { describe, expect, it, vi } from "vitest";
import { PostDeletionService } from "../../lib/postDeletionService";
import { PostManager } from "../../lib/postManager";
import type { AuthState } from "../../lib/types";
import type { PostHistoryRecord } from "../../lib/storage/ehagakiDb";
import { createMockRxNostr, MockKeyManager } from "../helpers";

const PUBKEY = "a".repeat(64);

function createAuthState(type: AuthState["type"]): AuthState {
    return {
        type,
        isAuthenticated: true,
        pubkey: PUBKEY,
        npub: "npub1test",
        nprofile: "nprofile1test",
        isValid: true,
        isInitialized: true,
        isExtensionLogin: type === "nip07",
    };
}

function createPostRecord(): PostHistoryRecord {
    return {
        id: "post-record",
        eventId: "e".repeat(64),
        pubkeyHex: PUBKEY,
        kind: 1,
        content: "post",
        tags: [],
        createdAt: 1,
        postedAt: 1,
        relayHints: [],
        acceptedRelays: [],
        fetchedRelays: [],
        media: [],
        rawEvent: {},
        updatedAt: 1,
        schemaVersion: 2,
    };
}

describe("post-history external signer verification integration", () => {
    it.each(["nip07", "nip46", "parentClient"] as const)(
        "does not publish a malformed %s post signer result",
        async (type) => {
            const signEvent = vi.fn().mockResolvedValue(null);
            const send = vi.fn();
            const rxNostr = createMockRxNostr();
            rxNostr.send = send as never;
            const manager = new PostManager(rxNostr, {
                authStateStore: { value: createAuthState(type) },
                hashtagStore: { hashtags: [], tags: [] },
                keyManager: new MockKeyManager(null, null, type === "nip07"),
                window: type === "nip07" ? { nostr: { signEvent } } : {},
                getNip46SignerForSessionFn: type === "nip46"
                    ? vi.fn().mockResolvedValue({ signEvent })
                    : undefined,
                getParentClientSignerFn: type === "parentClient"
                    ? () => ({ signEvent })
                    : undefined,
                contentWarningStore: { value: false, reset: () => undefined },
                contentWarningReasonStore: { value: "", reset: () => undefined },
                replyQuoteState: { value: { reply: null, quotes: [] } } as never,
                settingsStore: { quoteNotificationEnabled: false },
                writeRelaysStore: { value: [] },
                iframeMessageService: {
                    notifyPostSuccess: () => true,
                    notifyPostError: () => true,
                },
            });

            await expect(manager.submitPost("malformed signer output")).resolves.toEqual({
                success: false,
                error: "post_error",
            });
            expect(signEvent).toHaveBeenCalledOnce();
            expect(send).not.toHaveBeenCalled();
        },
    );

    it("returns a normal failure without publishing or saving when a kind 5 signer result is malformed", async () => {
        const signEvent = vi.fn().mockResolvedValue({ tags: null });
        const sendEvent = vi.fn();
        const saveLocalDeletion = vi.fn();
        const service = new PostDeletionService({
            authStateStore: { value: createAuthState("nsec") },
            keyManager: new MockKeyManager("nsec1test"),
            seckeySignerFn: () => ({ signEvent }),
            eventSenderFactory: () => ({ sendEvent }),
            postHistoryDeletionRequestsRepository: { saveLocalDeletion },
        });

        await expect(service.requestDeletion({
            post: createPostRecord(),
            rxNostr: {} as never,
        })).resolves.toEqual({ success: false, error: "post_error" });
        expect(signEvent).toHaveBeenCalledOnce();
        expect(sendEvent).not.toHaveBeenCalled();
        expect(saveLocalDeletion).not.toHaveBeenCalled();
    });
});
