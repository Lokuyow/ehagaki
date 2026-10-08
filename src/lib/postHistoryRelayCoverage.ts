/** Evidence of completed relay queries, not proof that every Nostr event exists locally. */
export interface PostHistoryCoverageRange {
    since: number;
    until: number;
}

export interface PostHistoryRelayCoverage {
    relayUrl: string;
    ranges: PostHistoryCoverageRange[];
}

export interface PostHistoryRelayOutcome {
    relayUrl: string;
    eoseReceived: boolean;
    verificationDrained: boolean;
    termination: "eose" | "timeout" | "error" | "cancelled";
    rawCount: number;
    oldestCreatedAt: number | null;
    saturated: boolean;
}

export function mergePostHistoryCoverageRanges(ranges: PostHistoryCoverageRange[]): PostHistoryCoverageRange[] {
    const sorted = ranges.filter((range) => range &&
        Number.isSafeInteger(range.since) && Number.isSafeInteger(range.until)
        && range.since >= 0 && range.until >= range.since && range.until < Number.MAX_SAFE_INTEGER,
    ).map((range) => ({ ...range })).sort((a, b) => a.since - b.since || a.until - b.until);
    const merged: PostHistoryCoverageRange[] = [];
    for (const range of sorted) {
        const previous = merged.at(-1);
        if (previous && range.since <= previous.until + 1) {
            previous.until = Math.max(previous.until, range.until);
        } else {
            merged.push(range);
        }
    }
    return merged;
}

export function getPostHistoryQuorumCoverage(
    relays: PostHistoryRelayCoverage[],
    canonicalRelayUrls: string[],
): PostHistoryCoverageRange[] {
    const targets = new Set(canonicalRelayUrls);
    if (!targets.size) return [];
    const votes = new Map<number, number>();
    for (const relayUrl of targets) {
        const ranges = mergePostHistoryCoverageRanges(relays
            .filter((relay) => relay.relayUrl === relayUrl).flatMap((relay) => relay.ranges));
        for (const { since, until } of ranges) {
            votes.set(since, (votes.get(since) ?? 0) + 1);
            votes.set(until + 1, (votes.get(until + 1) ?? 0) - 1);
        }
    }
    const required = Math.ceil(targets.size / 2);
    const result: PostHistoryCoverageRange[] = [];
    let count = 0;
    let start: number | null = null;
    for (const [time, delta] of [...votes].sort(([a], [b]) => a - b)) {
        count += delta;
        if (count >= required && start === null) start = time;
        if (count < required && start !== null) {
            result.push({ since: start, until: time - 1 });
            start = null;
        }
    }
    return mergePostHistoryCoverageRanges(result);
}

export function getPostHistoryConnectedCoverageUntil(
    ranges: PostHistoryCoverageRange[],
    frontier: number,
): number {
    // The frontier itself must be covered; an unresolved saturated second is a gap.
    return mergePostHistoryCoverageRanges(ranges)
        .find((range) => range.since <= frontier && range.until >= frontier)?.since ?? frontier;
}

export function derivePostHistoryRelayFetchCoverage(input: {
    since?: number;
    until: number;
    oldestCreatedAt: number | null;
    outcomes: PostHistoryRelayOutcome[];
    cancelled: boolean;
}): PostHistoryRelayCoverage[] {
    if (input.cancelled) return [];
    const lowerBound = input.since ?? input.oldestCreatedAt;
    if (lowerBound === null || lowerBound === undefined) return [];
    return input.outcomes.flatMap((outcome) => {
        if (!outcome.eoseReceived || !outcome.verificationDrained || outcome.termination !== "eose") return [];
        if (outcome.saturated && outcome.oldestCreatedAt === null) return [];
        const since = outcome.saturated
            ? Math.max(lowerBound, outcome.oldestCreatedAt! + 1)
            : lowerBound;
        const ranges = mergePostHistoryCoverageRanges([{ since, until: input.until }]);
        return ranges.length ? [{ relayUrl: outcome.relayUrl, ranges }] : [];
    });
}
