import { nip19 } from "nostr-tools";
import { describe, expect, it } from "vitest";
import {
    parsePostHistoryQuoteReferences,
    stripPostHistoryInlineQuoteUrisForDisplay,
} from "../../lib/postHistoryQuoteUtils";

describe("parsePostHistoryQuoteReferences", () => {
    it("qタグを出現順に正規化する", () => {
        const quotes = parsePostHistoryQuoteReferences({
            tags: [
                ["q", "1".repeat(64), "wss://relay-a.example.com", "a".repeat(64)],
                ["e", "9".repeat(64), "wss://reply.example.com", "reply"],
                ["q", "2".repeat(64), "wss://relay-b.example.com", "b".repeat(64)],
            ],
        });

        expect(quotes).toEqual([
            {
                eventId: "1".repeat(64),
                relayHint: "wss://relay-a.example.com/",
                authorHint: "a".repeat(64),
            },
            {
                eventId: "2".repeat(64),
                relayHint: "wss://relay-b.example.com/",
                authorHint: "b".repeat(64),
            },
        ]);
    });

    it("不足タグや不正タグでクラッシュせず、同一event idは重複排除する", () => {
        const quotes = parsePostHistoryQuoteReferences({
            tags: [
                ["q"],
                ["q", "not-an-event-id"],
                ["q", "3".repeat(64)],
                ["q", "3".repeat(64), "wss://relay-c.example.com"],
                ["q", "3".repeat(64), "", "c".repeat(64)],
            ],
        });

        expect(quotes).toEqual([
            {
                eventId: "3".repeat(64),
                relayHint: "wss://relay-c.example.com/",
                authorHint: "c".repeat(64),
            },
        ]);
    });

    it("event-address形式のqタグは無視する", () => {
        const quotes = parsePostHistoryQuoteReferences({
            tags: [
                ["q", `30023:${"d".repeat(64)}:article`],
                ["q", "4".repeat(64), "wss://relay-d.example.com"],
            ],
        });

        expect(quotes).toEqual([
            {
                eventId: "4".repeat(64),
                relayHint: "wss://relay-d.example.com/",
                authorHint: null,
            },
        ]);
    });

    it("eventがnullでも空配列を返す", () => {
        expect(parsePostHistoryQuoteReferences(null)).toEqual([]);
    });
});

describe("stripPostHistoryInlineQuoteUrisForDisplay", () => {
    it("qタグに対応する note/nevent URI だけを表示時に除去し、通常URLと非対応URIを残す", () => {
        const firstQuoteId = "1".repeat(64);
        const secondQuoteId = "2".repeat(64);
        const unmatchedQuoteId = "3".repeat(64);
        const noteUri = `nostr:${nip19.noteEncode(firstQuoteId)}`;
        const neventUri = `nostr:${nip19.neventEncode({
            id: secondQuoteId,
            author: "a".repeat(64),
            relays: ["wss://relay.example.com/"],
        })}`;
        const unmatchedUri = `nostr:${nip19.noteEncode(unmatchedQuoteId)}`;

        const content = [
            "前文",
            noteUri,
            `中間 ${neventUri} 後文`,
            "通常URL https://example.com/image.jpg",
            `未対応 ${unmatchedUri}`,
        ].join("\n");

        expect(
            stripPostHistoryInlineQuoteUrisForDisplay({
                content,
                tags: [
                    ["q", firstQuoteId],
                    ["q", secondQuoteId],
                ],
            }),
        ).toBe([
            "前文",
            "中間 後文",
            "通常URL https://example.com/image.jpg",
            `未対応 ${unmatchedUri}`,
        ].join("\n"));
    });

    it("引用URIだけの行は空行を残さず取り除く", () => {
        const firstQuoteId = "4".repeat(64);
        const secondQuoteId = "5".repeat(64);
        const firstUri = `nostr:${nip19.noteEncode(firstQuoteId)}`;
        const secondUri = `nostr:${nip19.neventEncode({ id: secondQuoteId })}`;

        expect(
            stripPostHistoryInlineQuoteUrisForDisplay({
                content: ["導入", firstUri, secondUri, "末尾"].join("\n"),
                tags: [
                    ["q", firstQuoteId],
                    ["q", secondQuoteId],
                ],
            }),
        ).toBe(["導入", "末尾"].join("\n"));
    });

    it("naddr や qタグ未対応の引用URIは誤って除去しない", () => {
        const quoteId = "6".repeat(64);
        const noteUri = `nostr:${nip19.noteEncode(quoteId)}`;
        const naddrUri = `nostr:${nip19.naddrEncode({
            kind: 30023,
            pubkey: "d".repeat(64),
            identifier: "article",
            relays: ["wss://relay.example.com/"],
        })}`;

        expect(
            stripPostHistoryInlineQuoteUrisForDisplay({
                content: [naddrUri, noteUri].join("\n"),
                tags: [],
            }),
        ).toBe([naddrUri, noteUri].join("\n"));
    });
});