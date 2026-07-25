import { describe, expect, it } from "vitest";
import {
    normalizeAbsoluteHttpUrl,
    scanHttpUrlCandidates,
    splitHttpUrlTrailingText,
} from "../../lib/utils/httpUrlCandidates";

describe("httpUrlCandidates", () => {
    it("returns source positions, original display text, and normalized href", () => {
        const text = "before https://例え.テスト/パス?q=値#場所 after";
        const [candidate] = scanHttpUrlCandidates(text);
        const start = text.indexOf("https://");
        const displayText = "https://例え.テスト/パス?q=値#場所";

        expect(candidate).toEqual({
            candidateStart: start,
            candidateEnd: start + displayText.length,
            start,
            end: start + displayText.length,
            rawCandidate: displayText,
            displayText,
            trailingText: "",
            href: "https://xn--r8jz45g.xn--zckzah/%E3%83%91%E3%82%B9?q=%E5%80%A4#%E5%A0%B4%E6%89%80",
            isValidHttpUrl: true,
        });
    });

    it.each([
        ["http://example.com/path", "http://example.com/path"],
        ["https://example.com/path", "https://example.com/path"],
        [
            "https://example.com/path?one=1&two=2#section",
            "https://example.com/path?one=1&two=2#section",
        ],
        ["https://localhost:4173/path", "https://localhost:4173/path"],
        ["http://127.0.0.1/path", "http://127.0.0.1/path"],
        ["http://[::1]/path", "http://[::1]/path"],
    ])("accepts absolute HTTP(S) URL %s", (input, expectedHref) => {
        const [candidate] = scanHttpUrlCandidates(input);

        expect(candidate.isValidHttpUrl).toBe(true);
        expect(candidate.href).toBe(expectedHref);
    });

    it("finds multiple URLs on one line and across line breaks", () => {
        const candidates = scanHttpUrlCandidates(
            "http://one.example/a https://two.example/b\nhttps://three.example/c",
        );

        expect(candidates.map((candidate) => candidate.displayText)).toEqual([
            "http://one.example/a",
            "https://two.example/b",
            "https://three.example/c",
        ]);
    });

    it.each([
        ["https://example.com/path.,!?", "https://example.com/path", ".,!?"],
        [
            "https://example.com/path。、！？",
            "https://example.com/path",
            "。、！？",
        ],
        [
            "https://example.com/path\"＂”",
            "https://example.com/path",
            "\"＂”",
        ],
        [
            "https://example.com/path)）】」』",
            "https://example.com/path",
            ")）】」』",
        ],
        [
            "https://example.com/path）」。",
            "https://example.com/path",
            "）」。",
        ],
    ])(
        "separates trailing prose characters from %s",
        (input, displayText, trailingText) => {
            expect(splitHttpUrlTrailingText(input)).toEqual({
                displayText,
                trailingText,
            });
        },
    );

    it("keeps balanced brackets inside the URL and removes only unmatched closers", () => {
        expect(
            splitHttpUrlTrailingText(
                "https://example.com/wiki/Function_(mathematics))。",
            ),
        ).toEqual({
            displayText:
                "https://example.com/wiki/Function_(mathematics)",
            trailingText: ")。",
        });
        expect(
            splitHttpUrlTrailingText(
                "https://example.com/項目（補足））",
            ),
        ).toEqual({
            displayText: "https://example.com/項目（補足）",
            trailingText: "）",
        });
    });

    it("reports malformed HTTP candidates as invalid without losing source text", () => {
        const text = "before https://]） after";
        const [candidate] = scanHttpUrlCandidates(text);

        expect(candidate).toMatchObject({
            rawCandidate: "https://]）",
            displayText: "https://",
            trailingText: "]）",
            href: null,
            isValidHttpUrl: false,
        });
        expect(
            text.slice(candidate.candidateStart, candidate.candidateEnd),
        ).toBe(candidate.rawCandidate);
    });

    it.each([
        ["relative/path"],
        ["javascript:alert(1)"],
        ["data:text/plain,hello"],
        ["ftp://example.com/file"],
    ])("does not report non-HTTP candidate %s", (input) => {
        expect(scanHttpUrlCandidates(input)).toEqual([]);
    });

    it("rejects missing hosts and non-HTTP protocols in direct normalization", () => {
        expect(normalizeAbsoluteHttpUrl("https://")).toBeNull();
        expect(normalizeAbsoluteHttpUrl("/relative")).toBeNull();
        expect(normalizeAbsoluteHttpUrl("javascript:alert(1)")).toBeNull();
        expect(normalizeAbsoluteHttpUrl("data:text/plain,hello")).toBeNull();
    });
});
