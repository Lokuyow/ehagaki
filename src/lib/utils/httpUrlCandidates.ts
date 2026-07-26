const HTTP_URL_CANDIDATE_PATTERN = /https?:\/\/[^\s\u3000<>"]+/gi;

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
const OPENING_BRACKET_TO_CLOSING = new Map(
    Array.from(CLOSING_BRACKET_TO_OPENING, ([closing, opening]) => [
        opening,
        closing,
    ]),
);

export function isHttpUrlOuterOpeningBracket(
    character: string | undefined,
): boolean {
    return !!character && OPENING_BRACKET_TO_CLOSING.has(character);
}

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

type OuterBracketBoundary = {
    end: number;
    closingBracket: string;
};

type OuterUrlContinuationState = {
    hasContent: boolean;
    startsAsUrlSyntax: boolean;
    isAsciiPrintable: boolean;
    openingBrackets: string[];
};

type TrailingCharacterState = {
    hasQueryOrFragment: boolean;
    isNaturalTrailingCharacter: boolean;
    openingBrackets: string[];
};

function hasUnmatchedClosingBracket(
    value: string,
    closingBracket: string,
    openingBracket: string,
): boolean {
    let openingDepth = 0;

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        if (character === openingBracket) {
            openingDepth += 1;
        } else if (character === closingBracket) {
            const isMatched = openingDepth > 0;
            if (isMatched) {
                openingDepth -= 1;
            }
            if (index === value.length - 1) {
                return !isMatched;
            }
        }
    }

    return false;
}

function isUrlDataComponentBracket(
    value: string,
    index: number,
    character: string,
): boolean {
    if (character !== ")" && character !== "]" && character !== "}") {
        return false;
    }

    const queryIndex = value.indexOf("?");
    const fragmentIndex = value.indexOf("#");
    return (queryIndex >= 0 && queryIndex < index) ||
        (fragmentIndex >= 0 && fragmentIndex < index);
}

function createOuterUrlContinuationState(): OuterUrlContinuationState {
    return {
        hasContent: false,
        startsAsUrlSyntax: false,
        isAsciiPrintable: true,
        openingBrackets: [],
    };
}

function createTrailingCharacterState(): TrailingCharacterState {
    return {
        hasQueryOrFragment: false,
        isNaturalTrailingCharacter: false,
        openingBrackets: [],
    };
}

function appendTrailingCharacterState(
    state: TrailingCharacterState,
    character: string,
): void {
    if (character === "?" || character === "#") {
        state.hasQueryOrFragment = true;
    }

    state.isNaturalTrailingCharacter =
        TRAILING_PUNCTUATION.has(character) || TRAILING_QUOTES.has(character);

    if (OPENING_BRACKET_TO_CLOSING.has(character)) {
        state.openingBrackets.push(character);
        return;
    }

    const expectedOpeningBracket = CLOSING_BRACKET_TO_OPENING.get(character);
    if (!expectedOpeningBracket) {
        return;
    }

    const isMatched = expectedOpeningBracket === state.openingBrackets.at(-1);
    if (isMatched) {
        state.openingBrackets.pop();
    }

    const isUrlDataBracket = state.hasQueryOrFragment &&
        (character === ")" || character === "]" || character === "}");
    state.isNaturalTrailingCharacter = !isMatched && !isUrlDataBracket;
}

function appendOuterUrlContinuationCharacter(
    state: OuterUrlContinuationState,
    character: string,
): void {
    if (!state.hasContent) {
        state.hasContent = true;
        state.startsAsUrlSyntax = /[A-Za-z0-9/?#%]/.test(character);
    }

    if (character < "!" || character > "~") {
        state.isAsciiPrintable = false;
    }

    if (OPENING_BRACKET_TO_CLOSING.has(character)) {
        state.openingBrackets.push(character);
        return;
    }

    const expectedOpeningBracket = CLOSING_BRACKET_TO_OPENING.get(character);
    if (expectedOpeningBracket === state.openingBrackets.at(-1)) {
        state.openingBrackets.pop();
    }
}

function isOuterUrlContinuation(
    state: OuterUrlContinuationState,
): boolean {
    return !state.hasContent ||
        (state.startsAsUrlSyntax &&
            state.isAsciiPrintable &&
            state.openingBrackets.length === 0);
}

function getOuterBracketBoundaryInfo(
    rawCandidate: string,
    boundary: OuterBracketBoundary,
): { isValid: boolean; hasTrailingText: boolean } {
    const displayText = rawCandidate.slice(
        0,
        boundary.end - boundary.closingBracket.length,
    );
    const split = splitHttpUrlTrailingText(displayText);

    return {
        isValid: normalizeAbsoluteHttpUrl(split.displayText) !== null,
        hasTrailingText: split.trailingText.length > 0,
    };
}

function findOuterBracketBoundary(
    text: string,
    candidateStart: number,
    rawCandidate: string,
): OuterBracketBoundary | null {
    const outerOpeningBracket = candidateStart > 0
        ? text.at(candidateStart - 1)
        : undefined;
    if (!outerOpeningBracket) {
        return null;
    }

    const outerClosingBracket =
        OPENING_BRACKET_TO_CLOSING.get(outerOpeningBracket);
    if (!outerClosingBracket) {
        return null;
    }

    let depth = 1;
    let offset = 0;
    let firstBoundary: OuterBracketBoundary | null = null;
    let earliestNaturalBoundary: OuterBracketBoundary | null = null;
    let latestContinuationBoundary: OuterBracketBoundary | null = null;
    let continuationState: OuterUrlContinuationState | null = null;
    const trailingCharacterState = createTrailingCharacterState();
    for (const character of rawCandidate) {
        const wasTrackingContinuation = continuationState !== null;
        if (character === outerOpeningBracket) {
            depth += 1;
        } else if (character === outerClosingBracket) {
            if (depth > 0) {
                depth -= 1;
            }
            if (depth === 0) {
                const nextBoundary = {
                    end: offset + character.length,
                    closingBracket: character,
                };
                if (
                    !earliestNaturalBoundary &&
                    trailingCharacterState.isNaturalTrailingCharacter
                ) {
                    earliestNaturalBoundary = nextBoundary;
                }
                if (!firstBoundary) {
                    firstBoundary = nextBoundary;
                    continuationState = createOuterUrlContinuationState();
                } else if (
                    continuationState &&
                    isOuterUrlContinuation(continuationState)
                ) {
                    latestContinuationBoundary = nextBoundary;
                }
            }
        }

        if (wasTrackingContinuation && continuationState) {
            appendOuterUrlContinuationCharacter(continuationState, character);
        }
        appendTrailingCharacterState(trailingCharacterState, character);
        offset += character.length;
    }

    if (!firstBoundary) {
        return null;
    }

    if (earliestNaturalBoundary) {
        const naturalBoundaryInfo = getOuterBracketBoundaryInfo(
            rawCandidate,
            earliestNaturalBoundary,
        );
        if (naturalBoundaryInfo.isValid && naturalBoundaryInfo.hasTrailingText) {
            return earliestNaturalBoundary;
        }
    }

    if (latestContinuationBoundary) {
        const latestBoundaryInfo = getOuterBracketBoundaryInfo(
            rawCandidate,
            latestContinuationBoundary,
        );
        if (latestBoundaryInfo.isValid) {
            return latestContinuationBoundary;
        }
    }

    const firstBoundaryInfo = getOuterBracketBoundaryInfo(
        rawCandidate,
        firstBoundary,
    );
    return firstBoundaryInfo.isValid ? firstBoundary : null;
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
            !isUrlDataComponentBracket(
                value,
                value.length - trailingCharacter.length,
                trailingCharacter,
            ) &&
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

        const outerBracketBoundary = findOuterBracketBoundary(
            text,
            candidateStart,
            matchedText,
        );
        const candidateEnd = candidateStart +
            (outerBracketBoundary?.end ?? matchedText.length);
        const rawCandidate = text.slice(candidateStart, candidateEnd);
        pattern.lastIndex = candidateEnd;

        const outerDisplayText = outerBracketBoundary
            ? rawCandidate.slice(0, -outerBracketBoundary.closingBracket.length)
            : null;
        const outerSplit = outerDisplayText
            ? splitHttpUrlTrailingText(outerDisplayText)
            : null;
        const { displayText, trailingText } = outerSplit &&
                normalizeAbsoluteHttpUrl(outerSplit.displayText)
            ? {
                displayText: outerSplit.displayText,
                trailingText: outerSplit.trailingText +
                    outerBracketBoundary!.closingBracket,
            }
            : splitHttpUrlTrailingText(rawCandidate);
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
