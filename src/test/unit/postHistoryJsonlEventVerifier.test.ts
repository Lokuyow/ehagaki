import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey } from "nostr-tools";
import { getEventHash } from "@rx-nostr/crypto";
import { verifyPostHistoryJsonlEvent } from "../../lib/postHistoryJsonlEventVerifier";

const signed = finalizeEvent({ kind: 1, content: "fixture", tags: [], created_at: 123 }, generateSecretKey());
describe("JSONL full Worker verifier", () => {
    it("accepts canonical signatures including uppercase signature hex", async () => {
        expect(await verifyPostHistoryJsonlEvent({ ...signed })).toBe(true);
        expect(await verifyPostHistoryJsonlEvent({ ...signed, sig: signed.sig.toUpperCase() })).toBe(true);
    });
    it.each(["id", "pubkey", "sig"] as const)("rejects malformed hex and lengths in %s without throwing", async field => {
        for (const value of [null, 123, {}, "g".repeat(field === "sig" ? 128 : 64), "a", "a".repeat(field === "sig" ? 126 : 62)]) {
            expect(await verifyPostHistoryJsonlEvent({ ...signed, [field]: value })).toBe(false);
        }
    });
    it("rejects canonical ID mismatch and well-formed invalid signatures", async () => {
        expect(await verifyPostHistoryJsonlEvent({ ...signed, id: "0".repeat(64) })).toBe(false);
        expect(await verifyPostHistoryJsonlEvent({ ...signed, content: "changed" })).toBe(false);
        expect(await verifyPostHistoryJsonlEvent({ ...signed, sig: "0".repeat(128) })).toBe(false);
        const invalidPoint = { ...signed, pubkey: "f".repeat(64) };
        invalidPoint.id = getEventHash(invalidPoint);
        expect(await verifyPostHistoryJsonlEvent(invalidPoint)).toBe(false);
    });
    it("ignores external verification cache", async () => {
        expect(await verifyPostHistoryJsonlEvent({ ...signed, sig: "0".repeat(128) })).toBe(false);
    });
});
