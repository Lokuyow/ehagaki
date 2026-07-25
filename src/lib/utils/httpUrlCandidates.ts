const HTTP_URL_CANDIDATE_PATTERN = /https?:\/\/[^\s\u3000]+/gi;

const TRAILING_PUNCTUATION = new Set([
    ".",
    ",",
    "!",
    "?",
    ":",
    ";",
    "\u3001",
    "\u3002",
    "\uff0c",
    "\uff0e",
    "\uff01",
    "\uff1f",
    "\uff1a",
    "\uff1b",
]);

const TRAILING_QUOTES = new Set([
    "\"",
    "'",
    "\uff02",
    "\uff07",
    "\u201c",
    "\u201d",
    "\u2018",
    "\u2019",
]);

const CLOSING_BRACKET_TO_OPENING = new Map([
    [")", "("],
    ["]", "["],
    ["}", "{"],
    [">", "<"],
    ["\uff09", "\uff08"],
    ["\uff3d", "\uff3b"],
    ["\uff5d", "\uff5b"],
    ["\u3009", "\u3008"],
    ["\u300b", "\u300a"],
    ["\u300d", "\u300c"],
    ["\u300f", "\u300e"],
    ["\u3011", "\u3010"],
    ["\u3015", "\u3014"],
    ["\u3017", "\u3016"],
    ["\u3019", "\u3018"],
    ["\u301b", "\u301a"],
]);
const OPENING_BRACKETS = new Set(CLOSING_BRACKET_TO_OPENING.values());

export interface HttpUrlCandidate {
    candidateStart: number;
    candidateEnd: number;
    start: number;
    end: number;
    rawCandidate: string;
    displayText: string;
    trailingText: string;
    href: string | null;
    isValidHttpUrl: boolean;
}

export interface HttpUrlTrailingSplit {
    displayText: string;
    trailingText: string;
}

function countCharacter(value: string, target: string): number {
    let count = 0;
    for (const character of value) {
        if (character === target) {
            count += 1;
        }
    }
    return count;
}

function hasUnmatchedClosingBracket(
    value: string,
    closingBracket: string,
    openingBracket: string,
): boolean {
    return countCharacter(value, closingBracket) >
        countCharacter(value, openingBracket);
}

function isFullWidthTrailingPunctuation(character: string): boolean {
    return TRAILING_PUNCTUATION.has(character) &&
        character !== "." &&
        character !== "," &&
        character !== "!" &&
        character !== "?" &&
        character !== ":" &&
        character !== ";";
}

function findInlineProseBoundary(rawCandidate: string): number {
    const bracketDepth = new Map<string, number>();
    let offset = 0;

    for (const character of rawCandidate) {
        if (
            TRAILING_QUOTES.has(character) ||
            isFullWidthTrailingPunctuation(character)
        ) {
            return offset;
        }

        if (OPENING_BRACKETS.has(character)) {
            bracketDepth.set(
                character,
                (bracketDepth.get(character) ?? 0) + 1,
            );
            offset += character.length;
            continue;
        }

        const openingBracket = CLOSING_BRACKET_TO_OPENING.get(character);
        if (openingBracket) {
            const depth = bracketDepth.get(openingBracket) ?? 0;
            if (depth === 0) {
                return offset;
            }
            bracketDepth.set(openingBracket, depth - 1);
        }

        offset += character.length;
    }

    return rawCandidate.length;
}

function collectTrailingTextEnd(text: string, start: number): number {
    let end = start;

    while (end < text.length) {
        const character = String.fromCodePoint(text.codePointAt(end) ?? 0);
        if (
            !TRAILING_PUNCTUATION.has(character) &&
            !TRAILING_QUOTES.has(character) &&
            !CLOSING_BRACKET_TO_OPENING.has(character)
        ) {
            break;
        }
        end += character.length;
    }

    return end;
}

export function splitHttpUrlTrailingText(
    rawCandidate: string,
): HttpUrlTrailingSplit {
    let displayEnd = rawCandidate.length;

    while (displayEnd > 0) {
        const value = rawCandidate.slice(0, displayEnd);
        const trailingCharacter = value.at(-1);
        if (!trailingCharacter) {
            break;
        }

        if (
            TRAILING_PUNCTUATION.has(trailingCharacter) ||
            TRAILING_QUOTES.has(trailingCharacter)
        ) {
            displayEnd -= trailingCharacter.length;
            continue;
        }

        const openingBracket =
            CLOSING_BRACKET_TO_OPENING.get(trailingCharacter);
        if (
            openingBracket &&
            hasUnmatchedClosingBracket(
                value,
                trailingCharacter,
                openingBracket,
            )
        ) {
            displayEnd -= trailingCharacter.length;
            continue;
        }

        break;
    }

    return {
        displayText: rawCandidate.slice(0, displayEnd),
        trailingText: rawCandidate.slice(displayEnd),
    };
}

export function normalizeAbsoluteHttpUrl(value: string): string | null {
    try {
        const parsed = new URL(value);
        if (
            (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
            !parsed.hostname
        ) {
            return null;
        }

        return parsed.href;
    } catch {
        return null;
    }
}

export function scanHttpUrlCandidates(text: string): HttpUrlCandidate[] {
    const candidates: HttpUrlCandidate[] = [];
    const pattern = new RegExp(
        HTTP_URL_CANDIDATE_PATTERN.source,
        HTTP_URL_CANDIDATE_PATTERN.flags,
    );
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        const candidateStart = match.index ?? -1;
        const matchedText = match[0] ?? "";
        if (candidateStart < 0 || !matchedText) {
            continue;
        }

        const proseBoundary = findInlineProseBoundary(matchedText);
        const trailingStart = candidateStart + proseBoundary;
        const candidateEnd = proseBoundary < matchedText.length
            ? collectTrailingTextEnd(text, trailingStart)
            : candidateStart + matchedText.length;
        const rawCandidate = text.slice(candidateStart, candidateEnd);
        pattern.lastIndex = candidateEnd;

        const { displayText, trailingText } =
            splitHttpUrlTrailingText(rawCandidate);
        const href = normalizeAbsoluteHttpUrl(displayText);

        candidates.push({
            candidateStart,
            candidateEnd,
            start: candidateStart,
            end: candidateStart + displayText.length,
            rawCandidate,
            displayText,
            trailingText,
            href,
            isValidHttpUrl: href !== null,
        });
    }

    return candidates;
}
