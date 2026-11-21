export interface CacheRetentionLimits {
    maxEntries: number;
    maxReadableBytes: number;
    maxOpaqueEntries: number;
}

export interface CacheRetentionEntry {
    size: number | null;
    lastAccessedAt: number;
    expiresAt: number;
}

/** A null size denotes an opaque response. A readable empty body has size zero. */
export function selectCacheEvictions<T extends CacheRetentionEntry>(
    entries: readonly T[],
    limits: CacheRetentionLimits,
    now: number,
    incoming?: CacheRetentionEntry,
): T[] {
    const expired = entries.filter(entry => entry.expiresAt <= now);
    const retained = entries.filter(entry => entry.expiresAt > now)
        .sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);
    let count = retained.length + Number(incoming !== undefined);
    let opaque = retained.filter(entry => entry.size === null).length + Number(incoming?.size === null);
    let bytes = retained.reduce((total, entry) => total + (entry.size ?? 0), incoming?.size ?? 0);
    for (const entry of retained) {
        if (count <= limits.maxEntries && opaque <= limits.maxOpaqueEntries && bytes <= limits.maxReadableBytes) break;
        if (count <= limits.maxEntries && (entry.size === null
            ? opaque <= limits.maxOpaqueEntries
            : bytes <= limits.maxReadableBytes)) continue;
        expired.push(entry);
        count--;
        opaque -= Number(entry.size === null);
        bytes -= entry.size ?? 0;
    }
    return expired;
}

export const OPAQUE_CACHE_RETENTION_MS = 24 * 60 * 60 * 1000;
