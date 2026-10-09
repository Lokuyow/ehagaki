import { mergePostHistoryCoverageRanges, type PostHistoryCoverageRange } from "./postHistoryRelayCoverage";

export function getPostHistoryBrowsingContinuity(quorum: PostHistoryCoverageRange[], restored: PostHistoryCoverageRange[]): PostHistoryCoverageRange[] {
    return mergePostHistoryCoverageRanges([...quorum, ...restored]);
}

/** Bounds a normal backfill to the next hole, without crossing a saved component. */
export function getPostHistoryOlderUncoveredRange(
    ranges: PostHistoryCoverageRange[], frontier: number, windowSeconds: number, continuationSince: number | null = null,
): PostHistoryCoverageRange | null {
    const merged = mergePostHistoryCoverageRanges(ranges);
    const connected = merged.find((range) => range.since <= frontier && range.until >= frontier);
    const until = connected ? connected.since - 1 : frontier;
    if (until < 0) return null;
    const older = merged.filter((range) => range.until < until).at(-1);
    const since = continuationSince !== null && continuationSince <= until
        ? continuationSince : Math.max(0, until - windowSeconds);
    return { since: Math.max(since, older ? older.until + 1 : 0), until };
}
