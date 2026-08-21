import { describe, expect, it } from "vitest";
import {
    buildHostOwnedComposerOutput,
    createHostOwnedContextSnapshot,
    getHostSubmissionEventId,
    isHostSubmissionEventId,
} from "../../lib/hostOwnedComposer";

const reply = {
    mode: "reply" as const,
    eventId: "1".repeat(64),
    relayHints: ["wss://relay.example"],
    authorPubkey: "2".repeat(64),
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
};

describe("Host-owned Composer output", () => {
    it("keeps composer-owned tags and an immutable reference snapshot without event fields", async () => {
        const output = await buildHostOwnedComposerOutput({
            content: "host handoff",
            hashtagTags: [["t", "Topic"], ["client", "eHagaki"]],
            hashtags: [],
            contentWarningEnabled: true,
            contentWarningReason: "warning",
            emojiTags: [["emoji", "wave", "https://example.com/wave.webp"], ["q", "x"]],
            mediaImetaMap: {},
            replyQuote: { reply, quotes: [{ ...reply, mode: "quote", eventId: "3".repeat(64) }] },
            channel: {
                eventId: "4".repeat(64),
                relayHints: ["wss://read.example"],
                channelRelays: ["wss://write.example"],
                name: null,
                about: null,
                picture: null,
            },
        });

        expect(output).toEqual({
            content: "host handoff",
            tags: [
                ["t", "Topic"],
                ["content-warning", "warning"],
                ["t", "nsfw"],
                ["emoji", "wave", "https://example.com/wave.webp"],
            ],
            context: {
                reply: expect.objectContaining({ eventId: "1".repeat(64) }),
                quotes: [expect.objectContaining({ eventId: "3".repeat(64) })],
                channel: expect.objectContaining({ eventId: "4".repeat(64) }),
            },
        });
        expect("kind" in output).toBe(false);
        expect(output.tags.some((tag) => ["e", "p", "q", "a", "k", "client"].includes(tag[0]))).toBe(false);

        expect(Object.isFrozen(output)).toBe(true);
        expect(Object.isFrozen(output.tags)).toBe(true);
        expect(Object.isFrozen(output.context.reply!.relayHints)).toBe(true);
        expect(() => (output.context.reply!.relayHints as string[]).push("wss://later.example")).toThrow();
        expect(reply.relayHints).toEqual(["wss://relay.example"]);
    });

    it("accepts only a complete Nostr event id from the host", () => {
        expect(isHostSubmissionEventId("a".repeat(64))).toBe(true);
        expect(isHostSubmissionEventId("not-an-id")).toBe(false);
        expect(getHostSubmissionEventId(undefined)).toBeUndefined();
        expect(getHostSubmissionEventId({ eventId: "a".repeat(64) })).toBe("a".repeat(64));
        expect(() => getHostSubmissionEventId({ eventId: "not-an-id" })).toThrow();
    });

    it("emits Host-owned image and video imeta tags with supplied metadata", async () => {
        const output = await buildHostOwnedComposerOutput({
            content: "media",
            hashtagTags: [],
            hashtags: [],
            contentWarningEnabled: false,
            contentWarningReason: "",
            emojiTags: [],
            mediaImetaMap: {
                "https://host.example/media/abcdef": {
                    m: "image/webp",
                    alt: "webp image",
                    dim: "1x1",
                    size: 12,
                    x: "a".repeat(64),
                },
                "https://host.example/media/video": {
                    m: "video/mp4",
                    dim: "640x360",
                    size: 42,
                },
            },
            replyQuote: { reply: null, quotes: [] },
            channel: null,
        });

        const imageTag = output.tags.find((tag) => tag[1] === "url https://host.example/media/abcdef");
        const videoTag = output.tags.find((tag) => tag[1] === "url https://host.example/media/video");
        expect(imageTag).toEqual(expect.arrayContaining([
            "imeta",
            "url https://host.example/media/abcdef",
            "m image/webp",
            "size 12",
            "x " + "a".repeat(64),
            "dim 1x1",
            "alt webp image",
        ]));
        expect(videoTag).toEqual(expect.arrayContaining([
            "imeta",
            "url https://host.example/media/video",
            "m video/mp4",
            "size 42",
            "dim 640x360",
        ]));
    });

    it("copies reference-only context even when no referenced event was hydrated", () => {
        const snapshot = createHostOwnedContextSnapshot({
            replyQuote: { reply, quotes: [] },
            channel: null,
        });
        expect(snapshot.reply).toEqual({
            eventId: "1".repeat(64),
            relayHints: ["wss://relay.example"],
            authorPubkey: "2".repeat(64),
        });
    });
});
