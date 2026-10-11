import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { buildComposerInteractionRenderModel, COMPOSER_RELATED_PREVIEW_KINDS, parseReactionReference } from "../../lib/composerTargetRelatedPreview";
import { parseRepostReference, resolveRepostPreview } from "../../lib/postRepostUtils";
import { verifyRelatedEvent } from "../../lib/relatedEventVerification";
import type { NostrEvent } from "../../lib/types";
import type { PostHistoryRelatedTargetSnapshot } from "../../lib/postHistoryRelatedTargetResolver.svelte";

const a = "a".repeat(64), b = "b".repeat(64), author = "c".repeat(64);
const reaction = (tags: string[][]) => ({ kind: 7, tags });
const sign = (kind = 1, content = "body", tags: string[][] = []): NostrEvent =>
    finalizeEvent({ kind, content, tags, created_at: 100 }, generateSecretKey());
const snapshot = (event: NostrEvent): PostHistoryRelatedTargetSnapshot => ({ targetEventId: event.id,
    status: "resolved", event, profile: null, authorPubkey: event.pubkey, relayHints: [], errorCode: null, updatedAt: 0 });

describe("Composer Reaction reference", () => {
    it("treats NIP-25 e[3] as author and ignores an unrelated fifth element", () => {
        expect(parseReactionReference(reaction([["e", a, "wss://target.example", author, b], ["p", author], ["k", "7"]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author, targetKindHint: 7,
                relayHints: ["wss://target.example/"] } });
    });
    it.each(["root", "reply", "mention"])("supports legacy %s markers with e[4] author", marker => {
        expect(parseReactionReference(reaction([["e", a, "", marker, author], ["p", author]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author } });
    });
    it("uses the last e and p, with sanitized contextual hints", () => {
        expect(parseReactionReference(reaction([["e", b], ["p", b], ["e", a, "javascript:bad"],
            ["p", author, "wss://author.example"], ["k", "1"], ["k", "1"]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author,
                targetKindHint: 1, relayHints: ["wss://author.example/"] } });
    });
    it.each([
        [["e", a], ["e", "invalid"]],
        [["e", a, "", "reply"], ["e", b]],
        [["e", a, "", "invalid-author"]],
        [["e", a, "", "reply", "invalid-author"]],
        [["e", a, "", author], ["p", b]],
        [["e", a], ["p", author], ["p", "invalid"]],
        [["e", a], ["k", "07"]], [["e", a], ["k", "-1"]],
        [["e", a], ["k", "65536"]], [["e", a], ["k", "1"], ["k", "7"]],
        [["e", a], ["k"]], [],
    ].map(tags => ({ tags })))("rejects invalid or contradictory tags $tags without fallback", ({ tags }) => {
        expect(parseReactionReference(reaction(tags)).status).toBe("invalid-reference");
    });
    it("does not expand address-only references", () => {
        expect(parseReactionReference(reaction([["a", `30023:${author}:x`]])).status).toBe("unsupported-reference");
    });
    it("checks the signed target's ID, author, kind and integrity", () => {
        const target = sign(7);
        const reference = { eventId: target.id, authorHint: target.pubkey, targetKindHint: 7, relayHints: [] };
        expect(verifyRelatedEvent(target, reference)?.event).toEqual(target);
        for (const changed of [{ eventId: a }, { authorHint: author }, { targetKindHint: 1 }]) {
            expect(verifyRelatedEvent(target, { ...reference, ...changed })).toBeNull();
        }
        expect(verifyRelatedEvent({ ...target, content: "tampered" }, reference)).toBeNull();
    });
});

describe("shared Repost projection", () => {
    it.each([6, 7, 16])("permits Composer's target kind %s without expanding history support", kind => {
        const target = sign(kind);
        const outer = sign(16, JSON.stringify(sign()), [["e", target.id], ["p", target.pubkey], ["k", String(kind)]]);
        expect(resolveRepostPreview(outer, snapshot(target)).status).toBe("unsupported-target-kind");
        expect(resolveRepostPreview(outer, snapshot(target), COMPOSER_RELATED_PREVIEW_KINDS)).toMatchObject({ status: "resolved", event: target });
        expect(parseRepostReference(outer).reference?.eventId).toBe(target.id);
    });
    it.each([[6, 7], [16, 1]])("rejects outer/target kind mismatch %s -> %s", (kind, targetKind) => {
        const target = sign(targetKind);
        const outer = sign(kind, "", [["e", target.id]]);
        expect(resolveRepostPreview(outer, snapshot(target), COMPOSER_RELATED_PREVIEW_KINDS).status).toBe("outer-target-kind-mismatch");
    });
});

describe("interaction rendering", () => {
    it.each([6, 16])("never renders kind %s embedded JSON or tagged body as content/media/emoji", kind => {
        const inner = sign(1, "hidden https://example.com/image.jpg :party:");
        const event = sign(kind, JSON.stringify(inner), [["content-warning", "CW", JSON.stringify(inner)],
            ["emoji", "party", "https://example.com/party.png"]]);
        const model = buildComposerInteractionRenderModel(event);
        expect(model.hasRenderableText).toBe(false);
        expect(model.media).toEqual([]);
        expect(model.previewContent.emojiUrls).toEqual([]);
    });
    it.each([["", "❤️"], ["+", "❤️"], ["👨‍👩‍👧‍👦text", "👨‍👩‍👧‍👦"], ["normal", "n"]])("uses existing Reaction normalization for %j", (content, display) => {
        const model = buildComposerInteractionRenderModel(sign(7, content));
        expect(model.previewContent.segments).toEqual([{ type: "text", text: display }]);
    });
    it("uses existing custom emoji lookup and rendering segments", () => {
        const model = buildComposerInteractionRenderModel(sign(7, ":party:", [["emoji", "party", "https://example.com/party.png"]]));
        expect(model.previewContent.emojiUrls).toEqual(["https://example.com/party.png"]);
    });
});
