import { graphemeSegments } from "unicode-segmenter/grapheme";

let nativeSegmenter: Intl.Segmenter | undefined;

/** Keep grapheme handling available on Firefox 104–124 and Safari 16. */
export function segmentGraphemes(text: string): Iterable<{ segment: string }> {
    if (typeof Intl.Segmenter === "function") {
        nativeSegmenter ??= new Intl.Segmenter(undefined, { granularity: "grapheme" });
        return nativeSegmenter.segment(text);
    }
    return graphemeSegments(text);
}

export function firstGrapheme(text: string): string {
    for (const { segment } of segmentGraphemes(text)) return segment;
    return "";
}
