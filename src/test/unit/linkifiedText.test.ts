import { describe, expect, it } from "vitest";
import { buildLinkifiedTextSegments } from "../../lib/utils/linkifiedText";

describe("linkifiedText", () => {
    it("keeps URL-internal punctuation and separates only trailing prose", () => {
        expect(
            buildLinkifiedTextSegments(
                "https://example.com/foo'bar https://example.com/記事。続き）。",
            ),
        ).toEqual([
            {
                type: "link",
                text: "https://example.com/foo'bar",
                href: "https://example.com/foo'bar",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/記事。続き",
                href: "https://example.com/%E8%A8%98%E4%BA%8B%E3%80%82%E7%B6%9A%E3%81%8D",
            },
            { type: "text", text: "）。" },
        ]);
    });

    it("keeps internal closing brackets and separates only a trailing bracket", () => {
        expect(
            buildLinkifiedTextSegments(
                "https://example.com/foo)bar https://example.com/search?q=) https://example.com/path)",
            ),
        ).toEqual([
            {
                type: "link",
                text: "https://example.com/foo)bar",
                href: "https://example.com/foo)bar",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/search?q=)",
                href: "https://example.com/search?q=)",
            },
            { type: "text", text: " " },
            {
                type: "link",
                text: "https://example.com/path",
                href: "https://example.com/path",
            },
            { type: "text", text: ")" },
        ]);
    });

    it("keeps surrounding brackets as text while linkifying their URL", () => {
        expect(
            buildLinkifiedTextSegments(
                "（https://example.com/image.jpg）。動画",
            ),
        ).toEqual([
            { type: "text", text: "（" },
            {
                type: "link",
                text: "https://example.com/image.jpg",
                href: "https://example.com/image.jpg",
            },
            { type: "text", text: "）。動画" },
        ]);
    });

    it("keeps closing brackets inside an outer-bracketed URL", () => {
        expect(
            buildLinkifiedTextSegments(
                "(https://example.com/foo)bar) (https://example.com/search?q=foo))",
            ),
        ).toEqual([
            { type: "text", text: "(" },
            {
                type: "link",
                text: "https://example.com/foo)bar",
                href: "https://example.com/foo)bar",
            },
            { type: "text", text: ") (" },
            {
                type: "link",
                text: "https://example.com/search?q=foo)",
                href: "https://example.com/search?q=foo)",
            },
            { type: "text", text: ")" },
        ]);
    });

    it.each([
        [
            "https://example.com</b>",
            [
                { type: "link", text: "https://example.com", href: "https://example.com/" },
                { type: "text", text: "</b>" },
            ],
        ],
        [
            "<https://example.com>",
            [
                { type: "text", text: "<" },
                { type: "link", text: "https://example.com", href: "https://example.com/" },
                { type: "text", text: ">" },
            ],
        ],
        [
            "https://example.com>後続",
            [
                { type: "link", text: "https://example.com", href: "https://example.com/" },
                { type: "text", text: ">後続" },
            ],
        ],
    ])("keeps angle brackets outside links in %s", (text, expected) => {
        expect(buildLinkifiedTextSegments(text)).toEqual(expected);
    });
});
