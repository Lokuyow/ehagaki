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
        ["https://example.com/foo'bar"],
        ["https://example.com/記事。続き"],
        ["https://example.com/項目、補足"],
        ["https://example.com/path?q=値。続き"],
        ["https://example.com/path#場所。詳細"],
    ])("keeps URL-internal punctuation in %s", (input) => {
        const [candidate] = scanHttpUrlCandidates(input);

        expect(candidate.displayText).toBe(input);
        expect(candidate.trailingText).toBe("");
        expect(candidate.isValidHttpUrl).toBe(true);
        expect(candidate.href).toBe(new URL(input).href);
    });

    it.each([
        ["https://example.com/foo)bar"],
        ["https://example.com/foo]bar"],
        ["https://example.com/foo}bar"],
        ["https://example.com/search?q=)"],
        ["https://example.com/#section]2"],
    ])("keeps URL-internal closing brackets and source offsets in %s", (url) => {
        const text = `before ${url} after`;
        const [candidate] = scanHttpUrlCandidates(text);
        const start = text.indexOf(url);

        expect(candidate).toMatchObject({
            candidateStart: start,
            candidateEnd: start + url.length,
            start,
            end: start + url.length,
            rawCandidate: url,
            displayText: url,
            trailingText: "",
            href: new URL(url).href,
            isValidHttpUrl: true,
        });
        expect(text.slice(candidate.start, candidate.end)).toBe(url);
    });

    it("separates only an unmatched closing bracket at the candidate end", () => {
        const text = "before https://example.com/path) after";
        const rawCandidate = "https://example.com/path)";
        const displayText = "https://example.com/path";
        const [candidate] = scanHttpUrlCandidates(text);
        const start = text.indexOf("https://");

        expect(candidate).toMatchObject({
            candidateStart: start,
            candidateEnd: start + rawCandidate.length,
            start,
            end: start + displayText.length,
            rawCandidate,
            displayText,
            trailingText: ")",
        });
    });

    it("keeps a balanced URL bracket and separates only the extra trailing bracket", () => {
        const text =
            "https://example.com/wiki/Function_(mathematics))。";
        const displayText =
            "https://example.com/wiki/Function_(mathematics)";
        const [candidate] = scanHttpUrlCandidates(text);

        expect(candidate).toMatchObject({
            candidateStart: 0,
            candidateEnd: text.length,
            start: 0,
            end: displayText.length,
            rawCandidate: text,
            displayText,
            trailingText: ")。",
        });
    });

    it.each([
        [
            "（https://example.com/path）。次",
            "https://example.com/path",
            "）",
        ],
        [
            "(https://example.com/path),next",
            "https://example.com/path",
            ")",
        ],
        [
            "【https://example.com/path】次",
            "https://example.com/path",
            "】",
        ],
        [
            "（https://example.com/wiki/Function_(mathematics)）。次",
            "https://example.com/wiki/Function_(mathematics)",
            "）",
        ],
    ])(
        "ends at the matching outer bracket in %s",
        (text, displayText, trailingText) => {
            const [candidate] = scanHttpUrlCandidates(text);
            const start = text.indexOf(displayText);
            const rawCandidate = `${displayText}${trailingText}`;

            expect(candidate).toMatchObject({
                candidateStart: start,
                candidateEnd: start + rawCandidate.length,
                start,
                end: start + displayText.length,
                rawCandidate,
                displayText,
                trailingText,
                href: new URL(displayText).href,
                isValidHttpUrl: true,
            });
        },
    );

    it("keeps source offsets accurate for multiple candidates and trailing prose", () => {
        const text =
            "prefix <https://example.com> and https://two.example/記事。続き）。 suffix";
        const candidates = scanHttpUrlCandidates(text);
        const firstText = "https://example.com";
        const secondText = "https://two.example/記事。続き";
        const firstStart = text.indexOf(firstText);
        const secondStart = text.indexOf(secondText);

        expect(candidates).toHaveLength(2);
        expect(candidates[0]).toMatchObject({
            candidateStart: firstStart,
            candidateEnd: firstStart + firstText.length,
            start: firstStart,
            end: firstStart + firstText.length,
            rawCandidate: firstText,
            displayText: firstText,
            trailingText: "",
        });
        expect(candidates[1]).toMatchObject({
            candidateStart: secondStart,
            candidateEnd: secondStart + secondText.length + "）。".length,
            start: secondStart,
            end: secondStart + secondText.length,
            rawCandidate: `${secondText}）。`,
            displayText: secondText,
            trailingText: "）。",
        });
        expect(
            candidates.map((candidate) =>
                text.slice(candidate.start, candidate.end)),
        ).toEqual([firstText, secondText]);
    });

    it.each([
        ["https://example.com</b>", "https://example.com"],
        ["<https://example.com>", "https://example.com"],
        ["https://example.com>後続", "https://example.com"],
    ])("treats angle brackets as candidate boundaries in %s", (text, url) => {
        const [candidate] = scanHttpUrlCandidates(text);
        const start = text.indexOf(url);

        expect(candidate).toMatchObject({
            candidateStart: start,
            candidateEnd: start + url.length,
            start,
            end: start + url.length,
            rawCandidate: url,
            displayText: url,
            trailingText: "",
            isValidHttpUrl: true,
        });
    });

    it("keeps surrounding quotation marks outside the URL", () => {
        const asciiText = '"https://example.com/path"';
        const curvedText = "“https://example.com/path”";

        expect(scanHttpUrlCandidates(asciiText)[0]).toMatchObject({
            candidateStart: 1,
            candidateEnd: asciiText.length - 1,
            start: 1,
            end: asciiText.length - 1,
            displayText: "https://example.com/path",
            trailingText: "",
        });
        expect(scanHttpUrlCandidates(curvedText)[0]).toMatchObject({
            candidateStart: 1,
            candidateEnd: curvedText.length,
            start: 1,
            end: curvedText.length - 1,
            displayText: "https://example.com/path",
            trailingText: "”",
        });
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
