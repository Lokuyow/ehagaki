export type PostHistoryDialogScrollMode = "normal" | "search";

export interface PostHistoryDialogScrollAnchor {
    eventId: string;
    offsetTop: number;
}

export interface PostHistoryDialogScrollState {
    pubkeyHex: string;
    mode: PostHistoryDialogScrollMode;
    searchQuery: string;
    anchor: PostHistoryDialogScrollAnchor;
    savedAt: number;
}

const scrollStateByKey = new Map<string, PostHistoryDialogScrollState>();

function normalizePubkeyHex(pubkeyHex: string | null | undefined): string | null {
    if (typeof pubkeyHex !== "string") {
        return null;
    }

    const normalizedPubkeyHex = pubkeyHex.trim();
    return normalizedPubkeyHex.length > 0 ? normalizedPubkeyHex : null;
}

function normalizeSearchQuery(searchQuery: string | null | undefined): string {
    return typeof searchQuery === "string" ? searchQuery.trim() : "";
}

function resolveScrollStateKey(input: {
    pubkeyHex: string | null | undefined;
    mode: PostHistoryDialogScrollMode;
    searchQuery?: string | null | undefined;
}): string | null {
    const pubkeyHex = normalizePubkeyHex(input.pubkeyHex);
    if (!pubkeyHex) {
        return null;
    }

    const searchQuery = input.mode === "search"
        ? normalizeSearchQuery(input.searchQuery)
        : "";
    return `${pubkeyHex}:${input.mode}:${searchQuery}`;
}

export function readPostHistoryDialogScrollState(input: {
    pubkeyHex: string | null | undefined;
    mode: PostHistoryDialogScrollMode;
    searchQuery?: string | null | undefined;
}): PostHistoryDialogScrollState | null {
    const key = resolveScrollStateKey(input);
    if (!key) {
        return null;
    }

    const state = scrollStateByKey.get(key);
    return state
        ? {
            ...state,
            anchor: { ...state.anchor },
        }
        : null;
}

export function writePostHistoryDialogScrollState(input: {
    pubkeyHex: string | null | undefined;
    mode: PostHistoryDialogScrollMode;
    searchQuery?: string | null | undefined;
    anchor: PostHistoryDialogScrollAnchor;
    savedAt?: number;
}): void {
    const key = resolveScrollStateKey(input);
    const pubkeyHex = normalizePubkeyHex(input.pubkeyHex);
    if (!key || !pubkeyHex) {
        return;
    }

    scrollStateByKey.set(key, {
        pubkeyHex,
        mode: input.mode,
        searchQuery: input.mode === "search"
            ? normalizeSearchQuery(input.searchQuery)
            : "",
        anchor: { ...input.anchor },
        savedAt: input.savedAt ?? Date.now(),
    });
}

export function clearPostHistoryDialogScrollState(input: {
    pubkeyHex: string | null | undefined;
    mode?: PostHistoryDialogScrollMode;
    searchQuery?: string | null | undefined;
}): void {
    const pubkeyHex = normalizePubkeyHex(input.pubkeyHex);
    if (!pubkeyHex) {
        return;
    }

    if (input.mode) {
        const key = resolveScrollStateKey({
            pubkeyHex,
            mode: input.mode,
            searchQuery: input.searchQuery,
        });
        if (key) {
            scrollStateByKey.delete(key);
        }
        return;
    }

    for (const key of scrollStateByKey.keys()) {
        if (key.startsWith(`${pubkeyHex}:`)) {
            scrollStateByKey.delete(key);
        }
    }
}

export function clearPostHistoryDialogScrollStates(): void {
    scrollStateByKey.clear();
}
