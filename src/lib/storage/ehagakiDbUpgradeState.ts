// Side-effect-free upgrade-blocked state shared by the page gate, the Service
// Worker bootstrap, and the Dexie wrapper. Keep this module free of Dexie and
// event-store imports so the entry graph does not load the database runtime.
type EHagakiDbUpgradeStateListener = (blocked: boolean) => void;

const ehagakiDbUpgradeStateListeners = new Set<EHagakiDbUpgradeStateListener>();
let ehagakiDbUpgradeBlocked = false;

export function setEHagakiDbUpgradeBlocked(blocked: boolean) {
    if (ehagakiDbUpgradeBlocked === blocked) {
        return;
    }

    ehagakiDbUpgradeBlocked = blocked;
    ehagakiDbUpgradeStateListeners.forEach((listener) => listener(blocked));
}

export function subscribeEHagakiDbUpgradeState(
    listener: EHagakiDbUpgradeStateListener,
): () => void {
    listener(ehagakiDbUpgradeBlocked);
    ehagakiDbUpgradeStateListeners.add(listener);
    return () => ehagakiDbUpgradeStateListeners.delete(listener);
}
