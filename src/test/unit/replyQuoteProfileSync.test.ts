import { describe, expect, it, vi } from "vitest";
import { createReplyQuoteProfileSyncController } from "../../lib/replyQuoteProfileSync";
import type {
    ProfileData,
    ReplyQuoteComposerState,
    ReplyQuoteState,
} from "../../lib/types";

function createReference(
    mode: "reply" | "quote",
    eventId: string,
    overrides: Partial<ReplyQuoteState> = {},
): ReplyQuoteState {
    return {
        mode,
        eventId,
        relayHints: [],
        authorPubkey: null,
        quoteNotificationEnabled: false,
        replyNotificationRecipients: [],
        authorDisplayName: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: false,
        error: null,
        ...overrides,
    };
}

function createProfile(name: string): ProfileData {
    return {
        name,
        displayName: name,
        picture: "",
        npub: `npub-${name}`,
        nprofile: `nprofile-${name}`,
    };
}

describe("replyQuoteProfileSync", () => {
    it("deduplicates pubkeys, merges relay hints, and updates reply and quote targets", async () => {
        const callbacks = new Map<string, (profile: ProfileData | null) => void>();
        const fetchProfileRealtime = vi.fn(async (pubkey: string) => (
            createProfile(pubkey === "author-a" ? "Alice" : "Bob")
        ));
        const subscribeProfile = vi.fn((
            pubkey: string,
            callback: (profile: ProfileData | null) => void,
        ) => {
            callbacks.set(pubkey, callback);
            return vi.fn();
        });
        const updateAuthorDisplayName = vi.fn();
        const updateReplyNotificationRecipientDisplayName = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: { fetchProfileRealtime, subscribeProfile },
            updateAuthorDisplayName,
            updateReplyNotificationRecipientDisplayName,
        });
        const state: ReplyQuoteComposerState = {
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                relayHints: ["wss://reply.example.com/"],
                replyNotificationRecipients: [{
                    pubkey: "shared-b",
                    displayName: null,
                    enabled: true,
                }],
            }),
            quotes: [createReference("quote", "quote-event", {
                authorPubkey: "shared-b",
                relayHints: ["wss://quote.example.com/"],
            })],
        };

        controller.sync(state);
        await Promise.resolve();
        await Promise.resolve();

        expect(subscribeProfile).toHaveBeenCalledTimes(2);
        expect(fetchProfileRealtime).toHaveBeenCalledTimes(2);
        expect(fetchProfileRealtime).toHaveBeenCalledWith("shared-b", {
            additionalRelays: [
                "wss://reply.example.com/",
                "wss://quote.example.com/",
            ],
        });
        expect(updateAuthorDisplayName).toHaveBeenCalledWith("reply-event", "Alice");
        expect(updateAuthorDisplayName).toHaveBeenCalledWith("quote-event", "Bob");
        expect(updateReplyNotificationRecipientDisplayName).toHaveBeenCalledWith(
            "reply-event",
            "shared-b",
            "Bob",
        );
    });

    it("applies later subscription updates and stops UI updates after dispose", async () => {
        let callback: (profile: ProfileData | null) => void = () => undefined;
        const unsubscribe = vi.fn();
        const updateAuthorDisplayName = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => createProfile("Cached")),
                subscribeProfile: vi.fn((_pubkey, next) => {
                    callback = next;
                    return unsubscribe;
                }),
            },
            updateAuthorDisplayName,
            updateReplyNotificationRecipientDisplayName: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();
        callback(createProfile("Updated"));

        expect(updateAuthorDisplayName).toHaveBeenLastCalledWith(
            "reply-event",
            "Updated",
        );

        controller.dispose();
        callback(createProfile("After dispose"));

        expect(unsubscribe).toHaveBeenCalledOnce();
        expect(updateAuthorDisplayName).not.toHaveBeenCalledWith(
            "reply-event",
            "After dispose",
        );
    });

    it("unsubscribes pubkeys that are removed from composer state", () => {
        const unsubscribe = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => null),
                subscribeProfile: vi.fn(() => unsubscribe),
            },
            updateAuthorDisplayName: vi.fn(),
            updateReplyNotificationRecipientDisplayName: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
            }),
            quotes: [],
        });
        controller.sync({ reply: null, quotes: [] });

        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it("keeps the existing display name when refresh fails", async () => {
        const logger = { error: vi.fn() };
        const updateAuthorDisplayName = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => {
                    throw new Error("network failed");
                }),
                subscribeProfile: vi.fn(() => vi.fn()),
            },
            updateAuthorDisplayName,
            updateReplyNotificationRecipientDisplayName: vi.fn(),
            logger,
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                authorDisplayName: "Existing",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(updateAuthorDisplayName).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith(
            "返信・引用プロフィールの取得に失敗:",
            expect.any(Error),
        );
    });
});
