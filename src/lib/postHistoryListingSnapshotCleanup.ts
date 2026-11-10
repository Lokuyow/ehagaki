type ClearPersistedPostHistoryListingSnapshots = () => void;

let clearPersistedPostHistoryListingSnapshots: ClearPersistedPostHistoryListingSnapshots | null = null;

/**
 * The snapshot map lives in the lazily loaded listing module. Registering its
 * clearer keeps logout from pulling that module into the main bundle, and from
 * loading it only to clear a map that was never created.
 */
export function registerClearPersistedPostHistoryListingSnapshots(
    clear: ClearPersistedPostHistoryListingSnapshots,
): void {
    clearPersistedPostHistoryListingSnapshots = clear;
}

export function clearRegisteredPersistedPostHistoryListingSnapshots(): void {
    clearPersistedPostHistoryListingSnapshots?.();
}
