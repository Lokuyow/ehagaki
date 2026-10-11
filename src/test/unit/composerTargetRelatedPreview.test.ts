import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { buildComposerInteractionRenderModel, COMPOSER_RELATED_PREVIEW_KINDS } from "../../lib/composerTargetRelatedPreview";
import { parseRepostReference, resolveRepostPreview } from "../../lib/postRepostUtils";
import type { NostrEvent } from "../../lib/types";
import type { PostHistoryRelatedTargetSnapshot } from "../../lib/postHistoryRelatedTargetResolver.svelte";

const sign = (kind = 1, content = "body", tags: string[][] = []): NostrEvent =>
    finalizeEvent({ kind, content, tags, created_at: 100 }, generateSecretKey());
const snapshot = (event: NostrEvent): PostHistoryRelatedTargetSnapshot => ({ targetEventId: event.id,
    status: "resolved", event, profile: null, authorPubkey: event.pubkey, relayHints: [], errorCode: null, updatedAt: 0 });

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
