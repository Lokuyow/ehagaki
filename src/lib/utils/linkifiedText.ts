import { scanHttpUrlCandidates } from "./httpUrlCandidates";

export type TextLinkSegment =
    | {
        type: "text";
        text: string;
    }
    | {
        type: "link";
        text: string;
        href: string;
    };

function pushTextSegment(
    segments: TextLinkSegment[],
    text: string,
): void {
    if (!text) {
        return;
    }

    const lastSegment = segments[segments.length - 1];
    if (lastSegment?.type === "text") {
        lastSegment.text += text;
        return;
    }

    segments.push({ type: "text", text });
}

export function buildLinkifiedTextSegments(text: string): TextLinkSegment[] {
    const segments: TextLinkSegment[] = [];
    let lastIndex = 0;

    for (const candidate of scanHttpUrlCandidates(text)) {
        if (!candidate.isValidHttpUrl || !candidate.href) {
            continue;
        }

        pushTextSegment(
            segments,
            text.slice(lastIndex, candidate.candidateStart),
        );
        segments.push({
            type: "link",
            text: candidate.displayText,
            href: candidate.href,
        });
        pushTextSegment(segments, candidate.trailingText);
        lastIndex = candidate.candidateEnd;
    }

    pushTextSegment(segments, text.slice(lastIndex));
    return segments;
}
