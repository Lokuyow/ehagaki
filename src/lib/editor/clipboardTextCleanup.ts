import { scanHttpUrlCandidates } from '../utils/httpUrlCandidates';

/**
 * Removes a small set of visual Markdown markers from clipboard plain text.
 * Input lines are expected to have already been normalized by
 * `normalizeClipboardText`.
 */
export function cleanupExternalRichPasteLines(lines: readonly string[]): string[] {
    const cleaned: string[] = [];
    let insideFence = false;

    for (const line of lines) {
        if (/^\s*```[^`]*$/.test(line)) {
            insideFence = !insideFence;
            continue;
        }

        cleaned.push(insideFence ? line : cleanupLine(line));
    }

    return cleaned;
}

function cleanupLine(line: string): string {
    const withoutHeadingMarker = line.replace(/^([ \t]*)#{1,6}[ \t]+/, '$1');
    let result = '';
    let cursor = 0;

    while (cursor < withoutHeadingMarker.length) {
        const opening = findSingleBacktick(withoutHeadingMarker, cursor);
        if (opening < 0) {
            result += removeEmphasisMarkers(withoutHeadingMarker.slice(cursor));
            break;
        }

        const closing = findSingleBacktick(withoutHeadingMarker, opening + 1);
        if (closing < 0) {
            result += removeEmphasisMarkers(withoutHeadingMarker.slice(cursor));
            break;
        }

        result += removeEmphasisMarkers(withoutHeadingMarker.slice(cursor, opening));
        result += withoutHeadingMarker.slice(opening + 1, closing);
        cursor = closing + 1;
    }

    return result;
}

function findSingleBacktick(line: string, from: number): number {
    for (let index = from; index < line.length; index += 1) {
        if (line[index] !== '`') {
            continue;
        }

        let runEnd = index + 1;
        while (line[runEnd] === '`') {
            runEnd += 1;
        }

        if (runEnd - index === 1) {
            return index;
        }

        index = runEnd - 1;
    }

    return -1;
}

function removeEmphasisMarkers(text: string): string {
    const candidates = scanHttpUrlCandidates(text);
    if (candidates.length === 0) {
        return stripEmphasisMarkers(text);
    }

    let result = '';
    let cursor = 0;

    for (const candidate of candidates) {
        if (candidate.start < cursor) {
            continue;
        }

        result += stripEmphasisMarkers(text.slice(cursor, candidate.start));
        result += text.slice(candidate.start, candidate.end);
        cursor = candidate.end;
    }

    return result + stripEmphasisMarkers(text.slice(cursor));
}

function stripEmphasisMarkers(text: string): string {
    return text.replace(/\*\*|__|~~/g, '');
}
