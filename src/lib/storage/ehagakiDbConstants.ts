export const EHAGAKI_DB_NAME = "eHagakiDB";
export const EHAGAKI_DB_VERSION = 16;
// Dexie stores logical versions at 10x the native IndexedDB version number.
// Raw IndexedDB callers such as the service worker must use this value.
export const EHAGAKI_DB_NATIVE_VERSION = EHAGAKI_DB_VERSION * 10;
export const POST_HISTORY_TIMELINE_INDEX = "[pubkeyHex+postedAt+createdAt+eventId]";
export const POST_HISTORY_TIMELINE_KEY_PATH = [
    "pubkeyHex",
    "postedAt",
    "createdAt",
    "eventId",
];
export const POST_HISTORY_SEARCH_TIMELINE_INDEX = "[pubkeyHex+postedAt+createdAt]";
export const POST_HISTORY_SEARCH_TIMELINE_KEY_PATH = [
    "pubkeyHex",
    "postedAt",
    "createdAt",
];
