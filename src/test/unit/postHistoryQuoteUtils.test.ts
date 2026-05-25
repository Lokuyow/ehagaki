import { describe, expect, it } from "vitest";
import { parsePostHistoryQuoteReferences } from "../../lib/postHistoryQuoteUtils";

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