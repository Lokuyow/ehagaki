import { describe, expect, it } from "vitest";
import { normalizePostErrorCode } from "../../lib/postErrorCode";

describe("normalizePostErrorCode", () => {
    it.each([
        ["no_write_relays", "no_write_relays"],
        ["post_timeout", "post_timeout"],
        [{ code: "sensitive_partial_publish" }, "sensitive_partial_publish"],
        ["postComponent.error.reply_target_event_unavailable", "reply_target_event_unavailable"],
        ["postComponent.post_error", "post_error"],
        ["nosskey.timeout", "nosskey_timeout"],
    ])("keeps or derives a stable identifier from %j", (input, expected) => {
        expect(normalizePostErrorCode(input)).toBe(expected);
    });

    it.each([
        undefined,
        "",
        "Network request failed: https://relay.example",
        "settings.unknown.key",
        "UPPER_CASE",
        { message: "no code" },
        { code: 42 },
    ])("falls back to post_error for %j", (input) => {
        expect(normalizePostErrorCode(input)).toBe("post_error");
    });
});
