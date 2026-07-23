import { describe, expect, it } from "vitest";
import { nip19 } from "nostr-tools";
import {
    COMPOSER_TARGET_INPUT_MAX_LENGTH,
    getComposerTargetActions,
    parseComposerTargetInput,
    truncateComposerTargetPreview,
} from "../../lib/composerTargetUtils";

describe("composerTargetUtils", () => {
    const eventId = "1".repeat(64);
    const author = "2".repeat(64);

    it.each([
        nip19.noteEncode(eventId),
        `nostr:${nip19.noteEncode(eventId)}`,
    ])("note入力を解析する: %s", (input) => {
        expect(parseComposerTargetInput(` \n${input}\n `)).toEqual({
            status: "supported",
            pointer: {
                format: "note",
                eventId,
                relayHints: [],
                authorHint: null,
                kindHint: null,
            },
        });
    });

    it("neventの作者・kind・sanitize済みrelayヒントを解析する", () => {
        const nevent = nip19.neventEncode({
            id: eventId,
            author,
            kind: 42,
            relays: [
                "wss://relay.one/",
                "https://invalid.example/",
                "wss://relay.two/",
                "wss://relay.three/",
                "wss://relay.four/",
            ],
        });

        expect(parseComposerTargetInput(`nostr:${nevent}`)).toEqual({
            status: "supported",
            pointer: {
                format: "nevent",
                eventId,
                relayHints: [
                    "wss://relay.one/",
                    "wss://relay.two/",
                    "wss://relay.three/",
                ],
                authorHint: author,
                kindHint: 42,
            },
        });
    });

    it.each(["npub", "nprofile", "naddr"] as const)(
        "%sを未対応として判定する",
        (format) => {
            const value = format === "npub"
                ? nip19.npubEncode(author)
                : format === "nprofile"
                    ? nip19.nprofileEncode({ pubkey: author })
                    : nip19.naddrEncode({
                        kind: 30023,
                        pubkey: author,
                        identifier: "article",
                    });
            expect(parseComposerTargetInput(value)).toEqual({
                status: "unsupported",
                format,
            });
        },
    );

    it("nsecを値を返さず拒否する", () => {
        const nsec = nip19.nsecEncode(new Uint8Array(32).fill(7));
        expect(parseComposerTargetInput(nsec)).toEqual({
            status: "secret-key",
        });
    });

    it("無効なbech32を拒否する", () => {
        expect(parseComposerTargetInput("note1invalid")).toEqual({
            status: "invalid",
            reason: "invalid-format",
        });
    });

    it("5000文字は正規化後に解析し、5000文字超過はデコード前に拒否する", () => {
        const note = nip19.noteEncode(eventId);
        const exact = `${note}${" ".repeat(
            COMPOSER_TARGET_INPUT_MAX_LENGTH - note.length,
        )}`;
        expect(parseComposerTargetInput(exact).status).toBe("supported");
        expect(parseComposerTargetInput(`${exact} `)).toEqual({
            status: "invalid",
            reason: "too-long",
        });
    });

    it("kindごとの操作候補を返す", () => {
        expect(getComposerTargetActions(1, false)).toEqual(["reply", "quote"]);
        expect(getComposerTargetActions(40, true)).toEqual(["channel"]);
        expect(getComposerTargetActions(42, true)).toEqual(["reply", "quote"]);
        expect(getComposerTargetActions(42, false)).toEqual([]);
        expect(getComposerTargetActions(7, true)).toEqual([]);
    });

    it("Unicode文字単位でプレビューを省略する", () => {
        expect(truncateComposerTargetPreview("😀abc", 2)).toBe("😀a…");
        expect(truncateComposerTargetPreview("abc", 3)).toBe("abc");
    });
});
