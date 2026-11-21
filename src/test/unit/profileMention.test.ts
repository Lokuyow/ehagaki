import { finalizeEvent, generateSecretKey, nip19 } from "nostr-tools";
import { describe, expect, it } from "vitest";
import { buildPostContentRenderModel } from "../../lib/postContentPreview";
import { notificationType } from "../../lib/notification";
import { sanitizeDraftHtml } from "../../lib/draftHtmlSanitizer";
import { scanProfileMentions, serializeProfileMentionText } from "../../lib/profileMention";

const alice = "a".repeat(64);
const bob = "b".repeat(64);
const npub = nip19.npubEncode(alice);
const uri = `nostr:${npub}`;

describe("profile mentions", () => {
    it("finds valid standalone profile URIs alongside punctuation and rejects embedded and malformed pointers", () => {
        const nprofile = nip19.nprofileEncode({ pubkey: bob, relays: ["wss://hint.example", "https://invalid.example"] });
        const content = `「${uri}」 nostr:${nprofile}。 https://example.com/${uri} x${uri} ${uri}x nostr:npub1bad`;
        expect(scanProfileMentions(content).map(mention => ({
            pubkey: mention.pubkey, relayHints: mention.relayHints, text: content.slice(mention.start, mention.end),
        }))).toEqual([
            { pubkey: alice, relayHints: [], text: uri },
            { pubkey: bob, relayHints: ["wss://hint.example/"], text: `nostr:${nprofile}` },
        ]);
    });

    it("preserves plain text boundaries and shows a mention next to a custom emoji", () => {
        expect(serializeProfileMentionText(uri, "Hi", "there")).toBe(` ${uri} `);
        const previousUrl = "https://example.com/";
        expect(scanProfileMentions(previousUrl + serializeProfileMentionText(uri, previousUrl, "")))
            .toMatchObject([{ pubkey: alice }]);
        const model = buildPostContentRenderModel({
            sourceContent: `${uri}:wave:`,
            tags: [["emoji", "wave", "https://example.com/wave.png"]],
        });
        expect(model.hasRenderableText).toBe(true);
        expect(model.previewContent.segments).toMatchObject([
            { type: "mention", profile: { pubkey: alice }, href: `https://njump.me/${npub}` },
            { type: "emoji", shortcode: "wave" },
        ]);
    });

    it("keeps sanitized mention nodes and unwraps spans with invalid references", () => {
        const html = sanitizeDraftHtml(`<p><span data-nostr-mention="${uri}" onclick="foo()">@Alice</span><span data-nostr-mention="javascript:foo()">Plain</span></p>`);
        expect(html).toBe(`<p><span data-nostr-mention="${uri}">@Alice</span>Plain</p>`);
    });

    it("distinguishes a mention in a thread or quote from the event's own addressee", () => {
        const eventId = "1".repeat(64);
        const key = generateSecretKey();
        const event = finalizeEvent({
            kind: 1, created_at: 42, content: uri,
            tags: [["e", eventId, "", "root", bob], ["q", eventId, "", bob], ["p", alice], ["p", bob]],
        }, key);
        expect(notificationType(event, alice)).toBe("mention");
        expect(notificationType(event, bob)).toBe("quote");
        const direct = finalizeEvent({
            kind: 1, created_at: 42, content: uri,
            tags: [["e", eventId, "", "root", alice], ["p", alice]],
        }, key);
        expect(notificationType(direct, alice)).toBe("reply");
    });
});
