import { RelayConfigUtils } from "./relayConfigUtils";
import type { NostrEvent } from "./types";
import { isHex64 } from "./utils/nostrHexUtils";

export interface Nip22CommentReferences {
    valid: boolean;
    reason: string | null;
    rootTags: string[][];
    rootKind: string | null;
    rootPubkey: string | null;
    rootEventId: string | null;
    parentTags: string[][];
    parentKind: string | null;
    parentPubkey: string | null;
    parentEventId: string | null;
    relayHints: string[];
}

function oneValueTag(tags: string[][], name: string): string | null | undefined {
    const values = tags.filter((tag) => tag[0] === name).map((tag) => tag[1]);
    if (values.length === 0) return undefined;
    if (values.some((value) => typeof value !== "string" || !value)
        || new Set(values).size !== 1) return null;
    return values[0]!;
}

function parseScopeTags(
    tags: string[][],
    names: readonly string[],
    options: { allowAddressableVersionPair?: boolean } = {},
): {
    tags: string[][];
    invalid: boolean;
} {
    const result: string[][] = [];
    let invalid = false;
    for (const name of names) {
        const matches = tags.filter((tag) => tag[0] === name);
        if (matches.length > 1) invalid = true;
        for (const tag of matches) {
            const value = tag[1];
            const valid = name.toLowerCase() === "e"
                ? isHex64(value)
                : typeof value === "string" && value.trim().length > 0;
            if (!valid || ((name === "E" || name === "e")
                && typeof tag[3] === "string"
                && !isHex64(tag[3]))) invalid = true;
            else result.push([...tag]);
        }
    }
    const isAddressableVersionPair = options.allowAddressableVersionPair === true
        && result.length === 2
        && result.filter((tag) => tag[0] === "a").length === 1
        && result.filter((tag) => tag[0] === "e").length === 1;
    if (result.length !== 1 && !isAddressableVersionPair) invalid = true;
    return { tags: result, invalid };
}

function isKindTag(value: string | null | undefined): value is string {
    return typeof value === "string"
        && value.trim().length > 0;
}

function resolveScopeAuthor(
    metaTags: string[],
    scopeTags: string[][],
    scopeName: "E" | "e",
): { pubkey: string | null; invalid: boolean } {
    const authorFromScope = scopeTags
        .filter((tag) => tag[0] === scopeName)
        .map((tag) => tag[3])
        .find((value) => isHex64(value)) ?? null;
    const invalid = metaTags.some((value) => !isHex64(value))
        || (!!authorFromScope && !metaTags.includes(authorFromScope));
    return {
        pubkey: authorFromScope ?? metaTags.find((value) => isHex64(value)) ?? null,
        invalid,
    };
}

export function parseNip22CommentReferences(
    event: Pick<NostrEvent, "kind" | "tags">,
): Nip22CommentReferences {
    const empty: Nip22CommentReferences = {
        valid: false,
        reason: "unsupported-kind",
        rootTags: [],
        rootKind: null,
        rootPubkey: null,
        rootEventId: null,
        parentTags: [],
        parentKind: null,
        parentPubkey: null,
        parentEventId: null,
        relayHints: [],
    };
    if (event.kind !== 1111) return empty;

    const tags = event.tags;
    const rootScope = parseScopeTags(tags, ["E", "A", "I"]);
    const parentScope = parseScopeTags(tags, ["e", "a", "i"], {
        allowAddressableVersionPair: true,
    });
    const rootKind = oneValueTag(tags, "K");
    const parentKind = oneValueTag(tags, "k");
    const rootPubkeyValues = tags.filter((tag) => tag[0] === "P").map((tag) => tag[1] ?? "");
    const parentPubkeyValues = tags.filter((tag) => tag[0] === "p").map((tag) => tag[1] ?? "");
    const rootAuthor = resolveScopeAuthor(rootPubkeyValues, rootScope.tags, "E");
    const parentAuthor = resolveScopeAuthor(parentPubkeyValues, parentScope.tags, "e");
    const rootPubkey = rootAuthor.pubkey;
    const parentPubkey = parentAuthor.pubkey;
    const rootEventId = rootScope.tags.find((tag) => tag[0] === "E")?.[1] ?? null;
    const parentEventId = parentScope.tags.find((tag) => tag[0] === "e")?.[1] ?? null;
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...rootScope.tags.filter((tag) => tag[0] === "E" || tag[0] === "A").map((tag) => tag[2]),
        ...parentScope.tags.filter((tag) => tag[0] === "e" || tag[0] === "a").map((tag) => tag[2]),
    ]);

    let reason: string | null = null;
    if (rootScope.invalid || rootScope.tags.length !== 1) reason = "invalid-root-reference";
    else if (parentScope.invalid || parentScope.tags.length === 0) reason = "invalid-parent-reference";
    else if (!isKindTag(rootKind) || !isKindTag(parentKind)) reason = "missing-kind-tag";
    else if (
        (rootPubkeyValues.length === 0 && rootScope.tags[0]?.[0] !== "I")
        || (parentPubkeyValues.length === 0 && parentScope.tags[0]?.[0] !== "i")
    ) reason = "missing-author-tag";
    else if (rootAuthor.invalid || parentAuthor.invalid) reason = "invalid-author-tag";

    return {
        valid: reason === null,
        reason,
        rootTags: rootScope.tags,
        rootKind: typeof rootKind === "string" ? rootKind : null,
        rootPubkey,
        rootEventId,
        parentTags: parentScope.tags,
        parentKind: typeof parentKind === "string" ? parentKind : null,
        parentPubkey,
        parentEventId,
        relayHints,
    };
}
