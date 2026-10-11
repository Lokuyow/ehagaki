import { describe, expect, it, vi } from "vitest";
import { finalizeEvent, generateSecretKey, verifyEvent } from "nostr-tools";
import { schnorr } from "@noble/curves/secp256k1.js";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js";
import { createPostHistoryScanVerifier } from "../../lib/postHistoryRawEventVerification";
import type { NostrEvent } from "../../lib/types";

function signed(content = "cache fixture") { return finalizeEvent({ kind: 1, created_at: 1, content, tags: [] }, generateSecretKey()) as NostrEvent; }
describe("scan-scoped verification cache", () => {
    it("shares exact in-flight duplicates but not a different sig or altered signing fields", async () => {
        const event = signed();
        const base = vi.fn((input: NostrEvent) => verifyEvent(input));
        const cache = createPostHistoryScanVerifier(base);
        const release = cache.acquire(event.pubkey, [1]);
        expect(await Promise.all([cache.verify(event), cache.verify(structuredClone(event))])).toEqual([true, true]);
        expect(base).toHaveBeenCalledTimes(1);
        expect(await cache.verify({ ...event, sig: "0".repeat(128) })).toBe(false);
        expect(base).toHaveBeenCalledTimes(2);
        expect(await cache.verify({ ...event, content: "changed" })).toBe(false);
        expect(base).toHaveBeenCalledTimes(2);
        release(); await cache.verify(event); expect(base).toHaveBeenCalledTimes(3);
    });
    it("falls back for a different valid signature with the same ID", async () => {
        const secret = generateSecretKey();
        const template = { kind: 1, created_at: 1, content: "same signing fields", tags: [] };
        const event = finalizeEvent(template, secret);
        const duplicate = { ...event, sig: bytesToHex(schnorr.sign(hexToBytes(event.id), secret, new Uint8Array(32).fill(1))) };
        expect(duplicate.id).toBe(event.id); expect(duplicate.sig).not.toBe(event.sig);
        const base = vi.fn((event: NostrEvent) => verifyEvent(event));
        const cache = createPostHistoryScanVerifier(base); const release = cache.acquire(event.pubkey, [1]);
        expect(await cache.verify(event)).toBe(true);
        expect(await cache.verify(duplicate)).toBe(true);
        expect(base).toHaveBeenCalledTimes(2); release();
    });
    it("evicts successes, does not cache negatives, and checks input mutation", async () => {
        const base = vi.fn((event: NostrEvent) => verifyEvent(event));
        const cache = createPostHistoryScanVerifier(base, 1);
        const one = signed(); const release = cache.acquire(one.pubkey, [1]);
        await cache.verify(one);
        const another = { ...one, sig: "0".repeat(128) };
        await cache.verify(another); await cache.verify(another); expect(base).toHaveBeenCalledTimes(3);
        // A second successful fingerprint evicts the first, even when its ID is the same.
        const permissive = vi.fn(() => true); const small = createPostHistoryScanVerifier(permissive, 1); const done = small.acquire(one.pubkey, [1]);
        await small.verify(one); await small.verify({ ...one, sig: "1".repeat(128) }); await small.verify(one);
        expect(permissive).toHaveBeenCalledTimes(3); done(); release();
        let resolve!: (valid: boolean) => void;
        const delayed = createPostHistoryScanVerifier(() => new Promise((finish) => { resolve = finish; }));
        const end = delayed.acquire(one.pubkey, [1]); const result = delayed.verify(one);
        await Promise.resolve(); one.content = "mutated"; resolve(true);
        expect(await result).toBe(false); end();
    });
    it("shares at most 64 pending fingerprints and clears pending work across scan generations", async () => {
        const event = signed(); const finish: ((value: boolean) => void)[] = [];
        const base = vi.fn(() => new Promise<boolean>((resolve) => finish.push(resolve)));
        const cache = createPostHistoryScanVerifier(base); const release = cache.acquire(event.pubkey, [1]);
        const inputs = Array.from({ length: 65 }, (_, index) => ({ ...event, sig: index.toString(16).padStart(128, "0") }));
        const tasks = inputs.map((input) => cache.verify(input));
        tasks.push(cache.verify(inputs[0]), cache.verify(inputs[64]));
        await Promise.resolve(); expect(base).toHaveBeenCalledTimes(66);
        release(); finish.forEach((resolve) => resolve(true)); await Promise.all(tasks);
        const done = cache.acquire(event.pubkey, [1]); const next = cache.verify(inputs[0]);
        await Promise.resolve(); expect(base).toHaveBeenCalledTimes(67); finish[66](true); await next; done();
    });
});
