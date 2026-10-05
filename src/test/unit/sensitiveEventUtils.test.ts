import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import {
    buildNip22ReplyTags,
    createSensitiveTextNoteCompanion,
    getSensitiveCompanionReference,
    resolveSubmissionKind,
    verifySensitiveCompanionLink,
} from "../../lib/sensitiveEventUtils";
import { parseNip22CommentReferences } from "../../lib/postHistoryNip22Utils";
import type { NostrEvent } from "../../lib/types";

const ROOT_ID = "1".repeat(64);
const PARENT_ID = "2".repeat(64);
const PARENT_AUTHOR = "a".repeat(64);
const ROOT_AUTHOR = "b".repeat(64);

function event(kind: number, id: string, pubkey: string, tags: string[][] = []): NostrEvent {
    return {
        id,
        pubkey,
        kind,
        content: "body",
        tags,
        created_at: 100,
        sig: "test",
    };
}

describe("resolveSubmissionKind", () => {
    it("keeps standard kinds when the setting is off and chooses Sensitive kinds only for explicit CW", () => {
        expect(resolveSubmissionKind({ channel: false, hasReply: false, failClosedContentWarning: false, contentWarningEnabled: true })).toBe(1);
        expect(resolveSubmissionKind({ channel: false, hasReply: false, failClosedContentWarning: true, contentWarningEnabled: false })).toBe(1);
        expect(resolveSubmissionKind({ channel: false, hasReply: false, failClosedContentWarning: true, contentWarningEnabled: true })).toBe(36);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 1, failClosedContentWarning: false, contentWarningEnabled: true })).toBe(1);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 1, failClosedContentWarning: true, contentWarningEnabled: true })).toBe(3636);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 36, failClosedContentWarning: false, contentWarningEnabled: false })).toBe(1111);
        expect(resolveSubmissionKind({ channel: false, hasReply: true, replyKind: 1111, failClosedContentWarning: true, contentWarningEnabled: true })).toBe(3636);
        expect(resolveSubmissionKind({ channel: true, hasReply: false, failClosedContentWarning: true, contentWarningEnabled: true })).toBe(42);
    });
});

describe("buildNip22ReplyTags", () => {
    it("builds the root and direct parent topology for a Sensitive Text Note", () => {
        const parent = event(36, PARENT_ID, PARENT_AUTHOR);
        const tags = buildNip22ReplyTags(parent, "wss://relay.example.com")!;
        expect(tags).toEqual([
            ["E", PARENT_ID, "wss://relay.example.com/", PARENT_AUTHOR],
            ["K", "36"],
            ["P", PARENT_AUTHOR],
            ["e", PARENT_ID, "wss://relay.example.com/", PARENT_AUTHOR],
            ["k", "36"],
            ["p", PARENT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(event(1111, "3".repeat(64), "c".repeat(64), tags)).valid).toBe(true);
    });

    it("requires and uses a verified signed root when a legacy thread omits its root author", () => {
        const rootSecretKey = generateSecretKey();
        const root = finalizeEvent({
            kind: 1,
            created_at: 90,
            content: "thread root",
            tags: [],
        }, rootSecretKey) as NostrEvent;
        const parent = event(1, PARENT_ID, PARENT_AUTHOR, [
            ["e", root.id, "wss://root.example.com/", "root"],
            ["e", PARENT_ID, "wss://parent.example.com/", "reply", PARENT_AUTHOR],
        ]);

        expect(buildNip22ReplyTags(parent, "wss://reply.example.com/")).toBeNull();
        expect(buildNip22ReplyTags(parent, "wss://reply.example.com/", root)).toEqual([
            ["E", root.id, "wss://root.example.com/", root.pubkey],
            ["K", "1"],
            ["P", root.pubkey],
            ["e", PARENT_ID, "wss://reply.example.com/", PARENT_AUTHOR],
            ["k", "1"],
            ["p", PARENT_AUTHOR],
        ]);
        expect(buildNip22ReplyTags(parent, "wss://reply.example.com/", {
            ...root,
            id: ROOT_ID,
        })).toBeNull();
    });

    it("inherits A/I root scopes from a validated comment while setting its own direct parent", () => {
        const parent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["A", "30023:" + ROOT_AUTHOR + ":article", "wss://root.example.com/"],
            ["K", "30023"],
            ["P", ROOT_AUTHOR],
            ["e", ROOT_ID, "wss://parent.example.com/", ROOT_AUTHOR],
            ["k", "36"],
            ["p", ROOT_AUTHOR],
        ]);
        const tags = buildNip22ReplyTags(parent, "wss://reply.example.com")!;
        expect(tags).toEqual([
            ["A", "30023:" + ROOT_AUTHOR + ":article", "wss://root.example.com/"],
            ["K", "30023"],
            ["P", ROOT_AUTHOR],
            ["e", PARENT_ID, "wss://reply.example.com/", PARENT_AUTHOR],
            ["k", "1111"],
            ["p", PARENT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(event(3636, "3".repeat(64), "c".repeat(64), tags))).toMatchObject({
            valid: true,
            rootKind: "30023",
            rootPubkey: ROOT_AUTHOR,
            parentKind: "1111",
            parentPubkey: PARENT_AUTHOR,
        });
    });

    it("preserves non-numeric NIP-22 kinds and I-scoped roots without author tags", () => {
        const parent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["I", "web:example.test/article/1", "wss://root.example.com/"],
            ["K", "web"],
            ["e", ROOT_ID, "wss://parent.example.com/", ROOT_AUTHOR],
            ["k", "1"],
            ["p", ROOT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(parent)).toMatchObject({
            valid: true,
            rootKind: "web",
            rootPubkey: null,
            parentKind: "1",
            parentPubkey: ROOT_AUTHOR,
        });

        const childTags = buildNip22ReplyTags(parent, "wss://reply.example.com/")!;
        expect(childTags).toEqual([
            ["I", "web:example.test/article/1", "wss://root.example.com/"],
            ["K", "web"],
            ["e", PARENT_ID, "wss://reply.example.com/", PARENT_AUTHOR],
            ["k", "1111"],
            ["p", PARENT_AUTHOR],
        ]);
        expect(parseNip22CommentReferences(event(1111, "3".repeat(64), "c".repeat(64), childTags))).toMatchObject({
            valid: true,
            rootKind: "web",
            parentKind: "1111",
        });
    });

    it("accepts external I/i scopes without author tags and keeps them when replying", () => {
        const parent = event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["I", "https://example.test/article/1"],
            ["K", "web"],
            ["i", "https://example.test/article/1"],
            ["k", "web"],
        ]);
        expect(parseNip22CommentReferences(parent)).toMatchObject({
            valid: true,
            rootKind: "web",
            rootPubkey: null,
            parentKind: "web",
            parentPubkey: null,
        });
        expect(buildNip22ReplyTags(parent)).toEqual([
            ["I", "https://example.test/article/1"],
            ["K", "web"],
            ["e", PARENT_ID, "", PARENT_AUTHOR],
            ["k", "1111"],
            ["p", PARENT_AUTHOR],
        ]);
    });

    it("rejects a malformed fourth author field on an NIP-22 event reference", () => {
        expect(parseNip22CommentReferences(event(1111, "3".repeat(64), "c".repeat(64), [
            ["E", ROOT_ID, "", "not-a-pubkey"], ["K", "1"], ["P", ROOT_AUTHOR],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "1"], ["p", PARENT_AUTHOR],
        ]))).toMatchObject({ valid: false });
    });

    it("rejects a comment with inconsistent or missing root metadata", () => {
        expect(buildNip22ReplyTags(event(1111, PARENT_ID, PARENT_AUTHOR, [
            ["E", ROOT_ID, "", ROOT_AUTHOR], ["K", "1"], ["P", ROOT_AUTHOR],
            ["e", PARENT_ID, "", PARENT_AUTHOR], ["k", "1"], ["p", PARENT_AUTHOR],
            ["E", "4".repeat(64), "", ROOT_AUTHOR],
        ]))).toBeNull();
    });
});

describe("Sensitive Text Note compatibility companion", () => {
    it("creates a signed-reference template with empty body, CW metadata, and a sanitized canonical relay hint", () => {
        const secretKey = generateSecretKey();
        const canonical = finalizeEvent({
            kind: 36,
            created_at: 123,
            content: "private display body",
            tags: [["content-warning", "Spoiler"]],
        }, secretKey);
        const companion = createSensitiveTextNoteCompanion(canonical, [
            "javascript:alert(1)",
            "wss://accepted.example.com/path",
        ]);
        expect(companion).toMatchObject({
            kind: 1,
            pubkey: getPublicKey(secretKey),
            created_at: 123,
            content: "",
            tags: [
                ["content-warning", "Spoiler"],
                ["c", canonical.id, "wss://accepted.example.com/path"],
            ],
        });
        expect(getSensitiveCompanionReference(companion!)).toBe(canonical.id);

        const signedCompanion = finalizeEvent(companion!, secretKey) as NostrEvent;
        expect(verifySensitiveCompanionLink(signedCompanion, canonical)).toBe(true);
        expect(verifySensitiveCompanionLink(signedCompanion, { ...canonical, pubkey: ROOT_AUTHOR })).toBe(false);
        expect(verifySensitiveCompanionLink(finalizeEvent({
            kind: 1,
            created_at: canonical.created_at,
            content: "",
            tags: [["content-warning", "Different reason"], ["c", canonical.id]],
        }, secretKey) as NostrEvent, canonical)).toBe(false);
        expect(verifySensitiveCompanionLink(finalizeEvent({
            kind: 1,
            created_at: canonical.created_at + 1,
            content: "",
            tags: [["content-warning", "Spoiler"], ["c", canonical.id]],
        }, secretKey) as NostrEvent, canonical)).toBe(false);
    });
});
