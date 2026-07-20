import { describe, expect, it, vi } from "vitest";
import { createReplyQuoteProfileSyncController } from "../../lib/replyQuoteProfileSync";
import type {
    ProfileData,
    ReplyQuoteComposerState,
    ReplyQuoteState,
} from "../../lib/types";

const ownerTokens = new Map<string, symbol>();

function getOwnerToken(mode: "reply" | "quote", eventId: string): symbol {
    const key = `${mode}:${eventId}`;
    const existing = ownerTokens.get(key);
    if (existing) return existing;
    const created = Symbol(key);
    ownerTokens.set(key, created);
    return created;
}

function ownedTarget(eventId: string, mode: "reply" | "quote") {
    return expect.objectContaining({
        eventId,
        mode,
        ownerToken: expect.any(Symbol),
    });
}

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
        authorPicture: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: false,
        error: null,
        ownerToken: getOwnerToken(mode, eventId),
        ...overrides,
    };
}

function createProfile(name: string, picture = `https://example.com/${name}.png`): ProfileData {
    return {
        name,
        displayName: name,
        picture,
        npub: `npub-${name}`,
        nprofile: `nprofile-${name}`,
    };
}

describe("replyQuoteProfileSync", () => {
    it("同じentryを再生成した場合は古いprofile fetch結果を新ownerへ適用しない", async () => {
        let resolveOld!: (profile: ProfileData) => void;
        let resolveNew!: (profile: ProfileData) => void;
        const fetchProfileRealtime = vi.fn()
            .mockReturnValueOnce(new Promise<ProfileData>((resolve) => {
                resolveOld = resolve;
            }))
            .mockReturnValueOnce(new Promise<ProfileData>((resolve) => {
                resolveNew = resolve;
            }));
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime,
                subscribeProfile: vi.fn(() => vi.fn()),
            },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
        });
        const oldOwner = Symbol("old-owner");
        const newOwner = Symbol("new-owner");

        controller.sync({
            reply: createReference("reply", "same-event", {
                ownerToken: oldOwner,
                authorPubkey: "same-author",
            }),
            quotes: [],
        });
        controller.sync({
            reply: createReference("reply", "same-event", {
                ownerToken: newOwner,
                authorPubkey: "same-author",
            }),
            quotes: [],
        });

        resolveOld(createProfile("Old"));
        await Promise.resolve();
        await Promise.resolve();
        expect(updateAuthorProfile).not.toHaveBeenCalled();

        resolveNew(createProfile("New"));
        await Promise.resolve();
        await Promise.resolve();
        expect(updateAuthorProfile).toHaveBeenCalledWith(
            { eventId: "same-event", mode: "reply", ownerToken: newOwner },
            "same-author",
            {
                displayName: "New",
                picture: "https://example.com/New.png",
            },
        );
    });

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
        const updateAuthorProfile = vi.fn();
        const updateReplyNotificationRecipientProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: { fetchProfileRealtime, subscribeProfile },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile,
        });
        const state: ReplyQuoteComposerState = {
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                relayHints: ["wss://reply.example.com/"],
                replyNotificationRecipients: [{
                    pubkey: "shared-b",
                    displayName: null,
                    picture: null,
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
        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("reply-event", "reply"), "author-a", {
            displayName: "Alice",
            picture: "https://example.com/Alice.png",
        });
        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("quote-event", "quote"), "shared-b", {
            displayName: "Bob",
            picture: "https://example.com/Bob.png",
        });
        expect(updateReplyNotificationRecipientProfile).toHaveBeenCalledWith(
            ownedTarget("reply-event", "reply"),
            "shared-b",
            {
                displayName: "Bob",
                picture: "https://example.com/Bob.png",
            },
        );
    });

    it("normalizes name-only and picture-only profiles independently", async () => {
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async (pubkey: string) => pubkey === "name-only"
                    ? {
                        ...createProfile("ignored", "   "),
                        name: " Name only ",
                        displayName: "   ",
                    }
                    : {
                        ...createProfile("ignored", " https://example.com/picture.png "),
                        name: "   ",
                        displayName: "   ",
                    }),
                subscribeProfile: vi.fn(() => vi.fn()),
            },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "name-event", {
                authorPubkey: "name-only",
            }),
            quotes: [createReference("quote", "picture-event", {
                authorPubkey: "picture-only",
            })],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("name-event", "reply"), "name-only", {
            displayName: "Name only",
            picture: null,
        });
        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("picture-event", "quote"), "picture-only", {
            displayName: null,
            picture: "https://example.com/picture.png",
        });
    });

    it("keeps known profile values for null results and relay-hint refreshes", async () => {
        let callback: (profile: ProfileData | null) => void = () => undefined;
        const fetchProfileRealtime = vi.fn(async () => createProfile("Alice"));
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime,
                subscribeProfile: vi.fn((_pubkey, next) => {
                    callback = next;
                    return vi.fn();
                }),
            },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();
        callback(null);
        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                authorDisplayName: "Alice",
                authorPicture: "https://example.com/Alice.png",
                relayHints: ["wss://new.example.com/"],
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(fetchProfileRealtime).toHaveBeenCalledTimes(2);
        expect(updateAuthorProfile).toHaveBeenCalledOnce();
        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("reply-event", "reply"), "author-a", {
            displayName: "Alice",
            picture: "https://example.com/Alice.png",
        });
    });

    it("applies later subscription updates and stops UI updates after dispose", async () => {
        let callback: (profile: ProfileData | null) => void = () => undefined;
        const unsubscribe = vi.fn();
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => createProfile("Cached")),
                subscribeProfile: vi.fn((_pubkey, next) => {
                    callback = next;
                    return unsubscribe;
                }),
            },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
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

        expect(updateAuthorProfile).toHaveBeenLastCalledWith(
            ownedTarget("reply-event", "reply"),
            "author-a",
            {
                displayName: "Updated",
                picture: "https://example.com/Updated.png",
            },
        );

        controller.dispose();
        callback(createProfile("After dispose"));

        expect(unsubscribe).toHaveBeenCalledOnce();
        expect(updateAuthorProfile).not.toHaveBeenCalledWith(
            ownedTarget("reply-event", "reply"),
            "author-a",
            expect.objectContaining({ displayName: "After dispose" }),
        );
    });

    it("unsubscribes pubkeys that are removed from composer state", () => {
        const unsubscribe = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => null),
                subscribeProfile: vi.fn(() => unsubscribe),
            },
            updateAuthorProfile: vi.fn(),
            updateReplyNotificationRecipientProfile: vi.fn(),
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
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: {
                fetchProfileRealtime: vi.fn(async () => {
                    throw new Error("network failed");
                }),
                subscribeProfile: vi.fn(() => vi.fn()),
            },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
            logger,
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                authorDisplayName: "Existing",
                authorPicture: "https://example.com/existing.png",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(updateAuthorProfile).not.toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith(
            "返信・引用プロフィールの取得に失敗:",
            expect.any(Error),
        );
    });

    it("starts profile sync when the referenced event later supplies an author", async () => {
        const subscribeProfile = vi.fn(() => vi.fn());
        const fetchProfileRealtime = vi.fn(async () => createProfile("Alice"));
        const updateAuthorProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: { fetchProfileRealtime, subscribeProfile },
            updateAuthorProfile,
            updateReplyNotificationRecipientProfile: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "reply-event"),
            quotes: [],
        });
        expect(subscribeProfile).not.toHaveBeenCalled();

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(subscribeProfile).toHaveBeenCalledWith("author-a", expect.any(Function));
        expect(fetchProfileRealtime).toHaveBeenCalledWith("author-a", {
            additionalRelays: [],
        });
        expect(updateAuthorProfile).toHaveBeenCalledWith(ownedTarget("reply-event", "reply"), "author-a", {
            displayName: "Alice",
            picture: "https://example.com/Alice.png",
        });
    });

    it("新しいowner target追加時はpubkey subscriptionを更新して古い結果を共有しない", async () => {
        const subscribeProfile = vi.fn(() => vi.fn());
        const fetchProfileRealtime = vi.fn(async (pubkey: string) =>
            createProfile(pubkey === "shared" ? "Shared" : "New"),
        );
        const updateReplyNotificationRecipientProfile = vi.fn();
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: { fetchProfileRealtime, subscribeProfile },
            updateAuthorProfile: vi.fn(),
            updateReplyNotificationRecipientProfile,
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "shared",
            }),
            quotes: [],
        });
        await Promise.resolve();
        await Promise.resolve();

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "shared",
                authorDisplayName: "Shared",
                authorPicture: "https://example.com/Shared.png",
            }),
            quotes: [createReference("quote", "quote-event", {
                replyNotificationRecipients: [
                    { pubkey: "shared", displayName: null, picture: null, enabled: true },
                    { pubkey: "new", displayName: null, picture: null, enabled: true },
                ],
            })],
        });
        await Promise.resolve();
        await Promise.resolve();

        expect(subscribeProfile).toHaveBeenCalledTimes(3);
        expect(fetchProfileRealtime).toHaveBeenCalledTimes(3);
        expect(updateReplyNotificationRecipientProfile).toHaveBeenCalledWith(
            ownedTarget("quote-event", "quote"),
            "shared",
            {
                displayName: "Shared",
                picture: "https://example.com/Shared.png",
            },
        );
        expect(updateReplyNotificationRecipientProfile).toHaveBeenCalledWith(
            ownedTarget("quote-event", "quote"),
            "new",
            {
                displayName: "New",
                picture: "https://example.com/New.png",
            },
        );
    });

    it("does not resubscribe or refetch when a display-name update is synced back", () => {
        let profileCallback: (profile: ProfileData | null) => void = () => undefined;
        let authorDisplayName: string | null = null;
        let authorPicture: string | null = null;
        const subscribeProfile = vi.fn((_pubkey, callback) => {
            profileCallback = callback;
            return vi.fn();
        });
        const fetchProfileRealtime = vi.fn(async () => null);
        const controller = createReplyQuoteProfileSyncController({
            relayProfileService: { fetchProfileRealtime, subscribeProfile },
            updateAuthorProfile: (_eventId, _pubkey, profile) => {
                authorDisplayName = profile.displayName;
                authorPicture = profile.picture;
            },
            updateReplyNotificationRecipientProfile: vi.fn(),
        });

        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
            }),
            quotes: [],
        });
        profileCallback(createProfile("Alice"));
        controller.sync({
            reply: createReference("reply", "reply-event", {
                authorPubkey: "author-a",
                authorDisplayName,
                authorPicture,
            }),
            quotes: [],
        });

        expect(subscribeProfile).toHaveBeenCalledOnce();
        expect(fetchProfileRealtime).toHaveBeenCalledOnce();
    });
});
