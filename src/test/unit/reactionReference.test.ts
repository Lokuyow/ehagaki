import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { matchesReactionReferenceTarget, parseReactionReference } from "../../lib/reactionReference";
import { verifyRelatedEvent } from "../../lib/relatedEventVerification";

const a = "a".repeat(64), b = "b".repeat(64), author = "c".repeat(64);
const reaction = (tags: string[][]) => ({ kind: 7, tags });

describe("NIP-25 Reaction reference", () => {
    it.each(["root", "reply", "mention"])("selects the trailing e despite an earlier %s marker", marker => {
        expect(parseReactionReference(reaction([["e", b, "", marker, b], ["e", a], ["p", author]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author } });
    });
    it("treats NIP-25 e[3] as author and ignores an unrelated fifth element", () => {
        expect(parseReactionReference(reaction([["e", a, "wss://target.example", author, b], ["p", author], ["k", "7"]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author, targetKindHint: 7,
                relayHints: ["wss://target.example/"] } });
    });
    it.each(["root", "reply", "mention"])("supports a trailing legacy %s marker with e[4] author", marker => {
        expect(parseReactionReference(reaction([["e", b, "", "reply", b], ["e", a, "", marker, author], ["p", author]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author } });
    });
    it("uses the last e and p, with sanitized contextual hints", () => {
        expect(parseReactionReference(reaction([["e", b], ["p", b], ["e", a, "javascript:bad"],
            ["p", author, "wss://author.example"], ["k", "1"], ["k", "1"]])))
            .toMatchObject({ status: "valid", reference: { eventId: a, authorHint: author,
                targetKindHint: 1, relayHints: ["wss://author.example/"] } });
    });
    it("uses an e author hint when p is absent and permits missing optional hints", () => {
        expect(parseReactionReference(reaction([["e", a, "", author]])))
            .toMatchObject({ reference: { authorHint: author, targetKindHint: null } });
        expect(parseReactionReference(reaction([["e", a]])))
            .toMatchObject({ reference: { authorHint: null, targetKindHint: null } });
    });
    it.each(["0", "1", "7", "65535"])("accepts canonical kind %s", kind => {
        expect(parseReactionReference(reaction([["e", a], ["k", kind]])))
            .toMatchObject({ status: "valid", reference: { targetKindHint: Number(kind) } });
    });
    it.each([
        [["e", a], ["e", "invalid"]], [["e", a], ["e"]],
        [["e", a, "", "invalid-author"]],
        [["e", a, "", "reply", "invalid-author"]],
        [["e", a, "", author], ["p", b]],
        [["e", a], ["p", author], ["p", "invalid"]],
        [["e", a, "", author], ["p"]],
        [["e", a], ["k", "07"]], [["e", a], ["k", "-1"]],
        [["e", a], ["k", "65536"]], [["e", a], ["k", "1"], ["k", "7"]],
        [["e", a], ["k", " 7"]], [["e", a], ["k", "+7"]],
        [["e", a], ["k", "7.0"]], [["e", a], ["k", "1e0"]],
        [["e", a], ["k", ""]], [["e", a], ["k"]], [],
    ].map(tags => ({ tags })))("rejects invalid or contradictory tags without fallback: $tags", ({ tags }) => {
        expect(parseReactionReference(reaction(tags))).toEqual({ status: "invalid-reference", reference: null });
    });
    it("does not expand address-only references or other event kinds", () => {
        expect(parseReactionReference(reaction([["a", `30023:${author}:x`]])))
            .toEqual({ status: "unsupported-reference", reference: null });
        expect(parseReactionReference({ kind: 17, tags: [["e", a]] }).reference).toBeNull();
    });
    it("compares reference hints only against known target facts", () => {
        const reference = parseReactionReference(reaction([["e", a, "", author], ["k", "42"]])).reference!;
        expect(matchesReactionReferenceTarget(reference, { eventId: a })).toBe(true);
        expect(matchesReactionReferenceTarget(reference, { eventId: a, targetAuthorPubkey: author, targetKind: 42 })).toBe(true);
        expect(matchesReactionReferenceTarget(reference, { eventId: b })).toBe(false);
        expect(matchesReactionReferenceTarget(reference, { eventId: a, targetAuthorPubkey: b })).toBe(false);
        expect(matchesReactionReferenceTarget(reference, { eventId: a, targetKind: 1 })).toBe(false);
    });
    it("checks the signed target's ID, author, kind and integrity", () => {
        const target = finalizeEvent({ kind: 7, content: "+", tags: [], created_at: 100 }, generateSecretKey());
        const reference = parseReactionReference(reaction([["e", target.id, "", target.pubkey], ["k", "7"]])).reference!;
        expect(verifyRelatedEvent(target, reference)?.event).toEqual(target);
        for (const changed of [{ eventId: a }, { authorHint: author }, { targetKindHint: 1 }]) {
            expect(verifyRelatedEvent(target, { ...reference, ...changed })).toBeNull();
        }
        expect(verifyRelatedEvent({ ...target, content: "tampered" }, reference)).toBeNull();
    });
});
