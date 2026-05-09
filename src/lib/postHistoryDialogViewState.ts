export interface PersistedPostHistoryViewState {
    currentPage: number;
    searchPage: number;
    searchInput: string;
    searchQuery: string;
}

const DEFAULT_PERSISTED_POST_HISTORY_VIEW_STATE: PersistedPostHistoryViewState = {
    currentPage: 1,
    searchPage: 1,
    searchInput: "",
    searchQuery: "",
};

const persistedViewStateByPubkey = new Map<
    string,
    PersistedPostHistoryViewState
>();

function resolvePersistenceKey(
    pubkeyHex: string | null | undefined,
): string | null {
    if (typeof pubkeyHex !== "string") {
        return null;
    }

    const normalizedPubkeyHex = pubkeyHex.trim();
    return normalizedPubkeyHex.length > 0 ? normalizedPubkeyHex : null;
}

function normalizePage(page: number | undefined): number {
    if (typeof page !== "number" || !Number.isFinite(page)) {
        return 1;
    }

    return Math.max(1, Math.trunc(page));
}

function clonePersistedViewState(
    state: PersistedPostHistoryViewState,
): PersistedPostHistoryViewState {
    return {
        currentPage: state.currentPage,
        searchPage: state.searchPage,
        searchInput: state.searchInput,
        searchQuery: state.searchQuery,
    };
}

export function readPersistedPostHistoryViewState(
    pubkeyHex: string | null | undefined,
): PersistedPostHistoryViewState {
    const key = resolvePersistenceKey(pubkeyHex);
    if (!key) {
        return clonePersistedViewState(
            DEFAULT_PERSISTED_POST_HISTORY_VIEW_STATE,
        );
    }

    return clonePersistedViewState(
        persistedViewStateByPubkey.get(key) ??
            DEFAULT_PERSISTED_POST_HISTORY_VIEW_STATE,
    );
}

export function writePersistedPostHistoryViewState(
    pubkeyHex: string | null | undefined,
    partialState: Partial<PersistedPostHistoryViewState>,
): PersistedPostHistoryViewState {
    const key = resolvePersistenceKey(pubkeyHex);
    if (!key) {
        return clonePersistedViewState(
            DEFAULT_PERSISTED_POST_HISTORY_VIEW_STATE,
        );
    }

    const currentState =
        persistedViewStateByPubkey.get(key) ??
        DEFAULT_PERSISTED_POST_HISTORY_VIEW_STATE;
    const nextState: PersistedPostHistoryViewState = {
        currentPage: normalizePage(partialState.currentPage ?? currentState.currentPage),
        searchPage: normalizePage(partialState.searchPage ?? currentState.searchPage),
        searchInput: partialState.searchInput ?? currentState.searchInput,
        searchQuery: partialState.searchQuery ?? currentState.searchQuery,
    };

    persistedViewStateByPubkey.set(key, nextState);
    return clonePersistedViewState(nextState);
}

export function clearPersistedPostHistoryViewState(): void {
    persistedViewStateByPubkey.clear();
}