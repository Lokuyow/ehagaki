import { describe, expect, it, vi } from "vitest";
import { nip19 } from "nostr-tools";
import { decodeEventPointerValue } from "../../lib/eventPointerUtils";

const eventId = "a".repeat(64);

describe("decodeEventPointerValue", () => {
    it.each([
        "http://invalid.example.com",
        "https://invalid.example.com",
        "not-a-relay",
        "wss://user:password@invalid.example.com",
        "   ",
    ])("strict decodeはnevent内の不正relayをrejectする: %s", (relay) => {
        const reference = nip19.neventEncode({ id: eventId, relays: [relay] });
        expect(decodeEventPointerValue(reference, { relayValidation: "strict" }))
            .toBeNull();
    });

    it("strict decodeは有効relayと不正relayの混在もreference全体をrejectする", () => {
        const reference = nip19.neventEncode({
            id: eventId,
            relays: ["wss://valid.example.com", "https://invalid.example.com"],
        });
        expect(decodeEventPointerValue(reference, { relayValidation: "strict" }))
            .toBeNull();
    });

    it("permissive decodeは不正relayだけを除外して有効relayを保持する", () => {
        const reference = nip19.neventEncode({
            id: eventId,
            relays: [
                "https://invalid.example.com",
                "wss://valid.example.com",
                "wss://user:password@invalid.example.com",
            ],
        });
        expect(decodeEventPointerValue(reference)).toEqual({
            eventId,
            relayHints: ["wss://valid.example.com/"],
            authorPubkey: null,
        });
    });

    it("想定内のdecode失敗ではconsoleへ出力しない", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
        expect(decodeEventPointerValue("invalid", { relayValidation: "strict" })).toBeNull();
        expect(error).not.toHaveBeenCalled();
        error.mockRestore();
    });
});
