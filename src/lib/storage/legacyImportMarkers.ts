export const LEGACY_DRAFTS_IMPORT_ID = "migrated.localStorage.drafts.v1";
export const LEGACY_HASHTAG_HISTORY_IMPORT_ID = "migrated.localStorage.hashtagHistory.v1";
export const LEGACY_UPLOAD_ENDPOINT_IMPORT_PREFIX = "migrated.localStorage.uploadEndpoint.v1.";
export const LEGACY_PROFILE_IMPORT_PREFIX = "migrated.localStorage.profile.v1.";
export const LEGACY_RELAY_CONFIG_IMPORT_PREFIX = "migrated.localStorage.relayConfig.v1.";

export function legacyUploadEndpointImportId(scopeKey: string): string {
    return `${LEGACY_UPLOAD_ENDPOINT_IMPORT_PREFIX}${scopeKey}`;
}

export function legacyProfileImportId(pubkeyHex: string): string {
    return `${LEGACY_PROFILE_IMPORT_PREFIX}${pubkeyHex}`;
}

export function legacyRelayConfigImportId(pubkeyHex: string): string {
    return `${LEGACY_RELAY_CONFIG_IMPORT_PREFIX}${pubkeyHex}`;
}

export function isCopiedLegacyImportMarker(key: string): boolean {
    return key === LEGACY_DRAFTS_IMPORT_ID
        || key === LEGACY_HASHTAG_HISTORY_IMPORT_ID
        || key.startsWith(LEGACY_UPLOAD_ENDPOINT_IMPORT_PREFIX);
}
