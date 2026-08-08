import { describe, expect, it } from "vitest";
import { finalizeEvent, generateSecretKey, getPublicKey } from "nostr-tools";
import { validateSignedEventResult } from "../../lib/signedEventResultValidator";

const secretKey = generateSecretKey();
const pubkey = getPublicKey(secretKey);
const template = {
    kind: 1,
    content: "signed-event contract",
    created_at: 1_700_000_000,
    tags: [
        ["p", "a".repeat(64)],
        ["t", "ehagaki"],
    ],
};

function sign(overrides: Partial<typeof template> = {}) {
    return finalizeEvent({
        ...template,
        ...overrides,
    }, secretKey);
}

describe("validateSignedEventResult", () => {
    it("accepts a valid event matching the requested template and pubkey", () => {
        const signedEvent = sign();

        expect(validateSignedEventResult(template, signedEvent, pubkey)).toEqual(signedEvent);
    });

    it.each([
        ["canonical id", () => ({ ...sign(), id: "0".repeat(64) })],
        ["Schnorr signature", () => ({ ...sign(), sig: "0".repeat(128) })],
        ["structure", () => ({ ...sign(), tags: null })],
    ])("rejects an invalid %s", (_label, createEvent) => {
        expect(() => validateSignedEventResult(template, createEvent(), pubkey)).toThrow(
            "Invalid signed event result",
        );
    });

    it("rejects a valid signature from a different pubkey", () => {
        const otherSecretKey = generateSecretKey();
        const signedEvent = finalizeEvent(template, otherSecretKey);

        expect(() => validateSignedEventResult(template, signedEvent, pubkey)).toThrow(
            "Invalid signed event result",
        );
    });

    it.each([
        ["kind", () => sign({ kind: 42 })],
        ["content", () => sign({ content: "changed" })],
        ["created_at", () => sign({ created_at: template.created_at + 1 })],
        ["tag value", () => sign({ tags: [["p", "b".repeat(64)], template.tags[1]] })],
        ["tag order", () => sign({ tags: [...template.tags].reverse() })],
        ["added tag", () => sign({ tags: [...template.tags, ["client", "other"]] })],
        ["removed tag", () => sign({ tags: template.tags.slice(0, 1) })],
    ])("rejects a validly signed event with changed %s", (_label, createEvent) => {
        expect(() => validateSignedEventResult(template, createEvent(), pubkey)).toThrow(
            "Invalid signed event result",
        );
    });
});
