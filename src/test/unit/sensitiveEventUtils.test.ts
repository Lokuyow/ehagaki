import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { buildNip22ReplyTags, resolveSubmissionKind } from "../../lib/sensitiveEventUtils";
import {
    buildSensitivePayloadEvent,
    buildSensitiveStructureEvent,
    verifySensitivePayloadLink,
} from "../../lib/sensitiveContentPayload";
import { parseNip22CommentReferences } from "../../lib/postHistoryNip22Utils";
import type { NostrEvent } from "../../lib/types";

const ROOT_ID = "1".repeat(64);
const PARENT_ID = "2".repeat(64);
const PARENT_AUTHOR = "a".repeat(64);
const ROOT_AUTHOR = "b".repeat(64);

function event(kind: number, id: string, pubkey: string, tags: string[][] = []): NostrEvent {
    return { id, pubkey, kind, content: "body", tags, created_at: 100, sig: "test" };
}

describe("resolveSubmissionKind", () => {
    it("preserves standard kinds independent of the Sensitive format setting", () => {
        expect(resolveSubmissionKind({ channel: false, hasReply: false })).toBe(1);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 1 })).toBe(1);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 1111 })).toBe(1111);
        expect(resolveSubmissionKind({ channel: true, hasReply: false })).toBe(42);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 36 })).toBeNull();
    });
});

describe("buildNip22ReplyTags", () => {
    it("preserves a comment root and changes only the direct parent", () => {
        const address = `30023:${ROOT_AUTHOR}:article`;
        const parent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["A", address, "wss://root.example.com/"], ["K", "30023"], ["P", ROOT_AUTHOR],
            ["a", address, "wss://parent.example.com/"], ["e", PARENT_ID, "wss://parent.example.com/"],
            ["k", "30023"], ["p", ROOT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(parent)).toMatchObject({ valid: true, parentEventId: PARENT_ID });
        const tags = buildNip22ReplyTags(parent, "wss://reply.example.com/")!;
        expect(tags).toEqual([
            ["A", address, "wss://root.example.com/"], ["K", "30023"], ["P", ROOT_AUTHOR],
            ["e", PARENT_ID, "wss://reply.example.com/", PARENT_AUTHOR],
            ["k", "1111"], ["p", PARENT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(event(1111, "3".repeat(64), "c".repeat(64), tags))).toMatchObject({
            valid: true, rootKind: "30023", parentKind: "1111", parentEventId: PARENT_ID,
        });
    });

    it("keeps I/i and string-kind scopes", () => {
        const parent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["I", "web:example.test/article/1"], ["K", "web"],
            ["i", "https://example.test/article/1"], ["k", "web"],
        ]);
        expect(parseNip22CommentReferences(parent)).toMatchObject({ valid: true, rootKind: "web", parentKind: "web" });
        expect(buildNip22ReplyTags(parent)).toEqual([
            ["I", "web:example.test/article/1"], ["K", "web"],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "1111"], ["p", PARENT_AUTHOR],
        ]);
    });

    it("rejects ambiguous primary scopes", () => {
        expect(parseNip22CommentReferences(event(1111, "3".repeat(64), "c".repeat(64), [
            ["A", `30023:${ROOT_AUTHOR}:article`], ["E", ROOT_ID], ["K", "30023"], ["P", ROOT_AUTHOR],
            ["a", `30023:${ROOT_AUTHOR}:article`], ["e", PARENT_ID], ["k", "30023"], ["p", ROOT_AUTHOR],
        ]))).toMatchObject({ valid: false });
    });
});

describe("Sensitive Content Payload", () => {
    it("stores the body in kind 36 and points an empty Structure at it", () => {
        const secretKey = generateSecretKey();
        const payloadTemplate = buildSensitivePayloadEvent(1, "body", "a".repeat(64), 123);
        expect(payloadTemplate).toMatchObject({ kind: 36, content: "body", tags: [["k", "1"]] });
        const payload = finalizeEvent(payloadTemplate, secretKey) as NostrEvent;
        const structureTemplate = buildSensitiveStructureEvent({
            kind: 1,
            pubkey: payload.pubkey,
            created_at: 123,
            content: "body",
            tags: [["content-warning", "spoiler"], ["t", "nsfw"], ["imeta", "url https://example.test/a.jpg"]],
        }, payload.id, "wss://relay.example.com/");
        expect(structureTemplate).toMatchObject({
            kind: 1, content: "", tags: [
                ["content-warning", "spoiler"], ["t", "nsfw"], ["imeta", "url https://example.test/a.jpg"],
                ["c", payload.id, "wss://relay.example.com/"],
            ],
        });
        const structure = finalizeEvent(structureTemplate, secretKey) as NostrEvent;
        expect(verifySensitivePayloadLink(structure, payload)).toBe(true);
    });

    it("rejects mismatched IDs, kinds, authors, signatures, and k tags", () => {
        const secretKey = generateSecretKey();
        const otherSecretKey = generateSecretKey();
        const payload = finalizeEvent(buildSensitivePayloadEvent(1, "body", "a".repeat(64), 123), secretKey) as NostrEvent;
        const structureFor = (payloadId: string, key = secretKey) => finalizeEvent({
            kind: 1, created_at: 123, content: "", tags: [["content-warning"], ["c", payloadId]],
        }, key) as NostrEvent;
        const structure = structureFor(payload.id);
        expect(verifySensitivePayloadLink(structure, payload)).toBe(true);
        expect(verifySensitivePayloadLink(structureFor("f".repeat(64)), payload)).toBe(false);
        const wrongKind = finalizeEvent({ kind: 42, created_at: 123, content: "body", tags: [["k", "1"]] }, secretKey) as NostrEvent;
        expect(verifySensitivePayloadLink(structure, wrongKind)).toBe(false);
        const wrongAuthor = finalizeEvent(buildSensitivePayloadEvent(1, "body", "a".repeat(64), 123), otherSecretKey) as NostrEvent;
        expect(verifySensitivePayloadLink(structure, wrongAuthor)).toBe(false);
        expect(verifySensitivePayloadLink(structure, { ...payload, sig: "0".repeat(128) })).toBe(false);
        const wrongK = finalizeEvent({ kind: 36, created_at: 123, content: "body", tags: [["k", "42"], ["k", "1"]] }, secretKey) as NostrEvent;
        expect(verifySensitivePayloadLink(structure, wrongK)).toBe(false);
    });
});
