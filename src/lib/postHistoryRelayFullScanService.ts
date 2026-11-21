import { Nip11Registry, type RxNostr } from "rx-nostr";
import type { RelayConfig } from "./types";
import { POST_HISTORY_AUTHORED_KINDS } from "./postHistoryKinds";
import { getPostHistoryAuthoredRelayScopeKey, resolvePostHistoryAuthoredRelayUrls } from "./postHistoryRelayResolver";
import { postHistoryRelayFetchService, POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS, type PostHistoryRelayFetchResult, type PostHistoryRelayFetchTask } from "./postHistoryRelayFetchService";
import { createPostHistoryAuthoredFetchScope, persistPostHistoryAuthoredBatch } from "./postHistoryAuthoredFetchPersistence";
import { acquirePostHistoryScanVerification } from "./postHistoryRawEventVerification";
import { observePostHistoryScanAuth } from "./postHistoryScanAuthObserver";
import { derivePostHistoryRelayFetchCoverage, type PostHistoryCoverageRange, type PostHistoryRelayCoverage } from "./postHistoryRelayCoverage";

export type PostHistoryFullScanStatus = "completed" | "partial" | "cancelled" | "stale-cancelled" | "failed";
export type PostHistoryFullScanIssue = "timeout" | "error" | "auth-rejected" | "auth-timeout" | "auth-unresolved" | "ambiguous" | "safety-limit" | "storage";
export interface PostHistoryFullScanRelayProgress {
    relayUrl: string;
    status: "running" | "completed" | "partial" | "cancelled";
    phase: "pending" | "fetching" | "auth";
    receivedCount: number;
    hasMatchedLocalEvents?: boolean;
    issueCounts: Partial<Record<PostHistoryFullScanIssue, number>>;
}
export function hasOnlyPostHistoryFullScanAmbiguity(relay: Pick<PostHistoryFullScanRelayProgress, "issueCounts">): boolean {
    const issues = Object.entries(relay.issueCounts).filter(([, count]) => (count ?? 0) > 0);
    return issues.length === 1 && issues[0][0] === "ambiguous";
}
export interface PostHistoryFullScanRelayResult extends PostHistoryFullScanRelayProgress {
    requestCount: number;
    rangeSamples: PostHistoryCoverageRange[];
}
export interface PostHistoryFullScanProgress {
    phase: "fetching" | "auth";
    elapsedMs: number;
    receivedCount: number;
    insertedCount: number;
    updatedCount: number;
    finishedRelayCount: number;
    targetRelayCount: number;
    relays: PostHistoryFullScanRelayProgress[];
}
export interface PostHistoryFullScanResult extends PostHistoryFullScanProgress {
    status: PostHistoryFullScanStatus;
    ownerPubkeyHex: string;
    localRevision: number;
    upperBound: number;
    relays: PostHistoryFullScanRelayResult[];
}
export interface PostHistoryFullScanScope { ownerPubkeyHex: string | null | undefined; rxNostr: RxNostr | undefined; relayConfig: RelayConfig | null | undefined }
export interface PostHistoryFullScanRequest {
    ownerPubkeyHex: string;
    rxNostr: RxNostr;
    relayConfig: RelayConfig | null | undefined;
    getCurrentScope: () => PostHistoryFullScanScope;
    signal?: AbortSignal;
    onProgress?: (progress: PostHistoryFullScanProgress) => void;
}
export interface PostHistoryFullScanTask { promise: Promise<PostHistoryFullScanResult>; cancel: (stale?: boolean) => void }
export const POST_HISTORY_FULL_SCAN_DEFAULTS = {
    windowSeconds: 30 * 24 * 60 * 60, limit: 250, concurrency: 4,
    pageTimeoutMs: POST_HISTORY_REPAIR_FETCH_TIMEOUT_MS, authTimeoutMs: 30_000,
    relayTimeoutMs: 30 * 60 * 1000, operationTimeoutMs: 2 * 60 * 60 * 1000,
    maxRequests: 10_000, maxBoundaryIds: 1000,
};
export interface PostHistoryFullScanDeps {
    fetchRelayPage?: typeof postHistoryRelayFetchService.fetchRelayPage;
    loadNegentropy?: () => Promise<typeof import("./postHistoryFullScanNegentropy")>;
    createScope?: typeof createPostHistoryAuthoredFetchScope;
    persistBatch?: typeof persistPostHistoryAuthoredBatch;
    now?: () => number;
    options?: Partial<typeof POST_HISTORY_FULL_SCAN_DEFAULTS>;
}
type RangeWork = PostHistoryCoverageRange & { authRetried: boolean };
const EXACT_ID_BATCH_SIZE = 100;

function isCleanRelayPage(page: PostHistoryRelayFetchResult): boolean {
    const outcome = page.relayOutcomes?.[0];
    return page.status === "success" && outcome?.termination === "eose"
        && outcome.eoseReceived && outcome.verificationDrained
        && !page.errorRelayUrls.length && !page.downRelayUrls.length && !page.page?.bufferLimited;
}

export class PostHistoryRelayFullScanService {
    private activeRuntimes = new WeakSet<RxNostr>();
    constructor(private deps: PostHistoryFullScanDeps = {}) {}

    start(input: PostHistoryFullScanRequest): PostHistoryFullScanTask {
        if (this.activeRuntimes.has(input.rxNostr)) throw new Error("A post-history full scan is already running");
        this.activeRuntimes.add(input.rxNostr);
        const now = this.deps.now ?? Date.now;
        const options = { ...POST_HISTORY_FULL_SCAN_DEFAULTS, ...this.deps.options };
        const startedAt = now();
        const upperBound = Math.max(0, Math.floor(startedAt / 1000));
        const relayUrls = resolvePostHistoryAuthoredRelayUrls(input.relayConfig);
        const scopeKey = getPostHistoryAuthoredRelayScopeKey(input.relayConfig);
        const kinds = [...POST_HISTORY_AUTHORED_KINDS];
        const controller = new AbortController();
        const activeTasks = new Set<PostHistoryRelayFetchTask>();
        let cancellation: "cancelled" | "stale-cancelled" | null = null;
        let storageFailed = false;
        let committedResponse = false;
        let usableResponse = false;
        let localRevision = 0;
        const relays: PostHistoryFullScanRelayResult[] = relayUrls.map((relayUrl) => ({
            relayUrl, status: "running", phase: "pending", receivedCount: 0, requestCount: 0, issueCounts: {}, rangeSamples: [],
        }));
        const progress: PostHistoryFullScanProgress = { phase: "fetching", elapsedMs: 0, receivedCount: 0,
            insertedCount: 0, updatedCount: 0, finishedRelayCount: 0, targetRelayCount: relayUrls.length, relays: [] };
        const notify = () => {
            progress.phase = relays.some((relay) => relay.status === "running" && relay.phase === "auth") ? "auth" : "fetching";
            progress.elapsedMs = Math.max(0, now() - startedAt);
            progress.finishedRelayCount = relays.filter((relay) => relay.status !== "running").length;
            progress.relays = relays.map(({ relayUrl, status, phase, receivedCount, hasMatchedLocalEvents, issueCounts }) => ({
                relayUrl, status, phase, receivedCount, hasMatchedLocalEvents, issueCounts: { ...issueCounts },
            }));
            input.onProgress?.({ ...progress });
        };
        const cancel = (stale = false) => {
            cancellation = stale ? "stale-cancelled" : cancellation ?? "cancelled";
            controller.abort(); activeTasks.forEach((task) => task.cancel());
        };
        const isCurrent = () => {
            const current = input.getCurrentScope();
            const same = current.ownerPubkeyHex === input.ownerPubkeyHex && current.rxNostr === input.rxNostr
                && getPostHistoryAuthoredRelayScopeKey(current.relayConfig) === scopeKey;
            if (!same) cancel(true);
            return same && !controller.signal.aborted;
        };
        const abort = () => cancel();
        input.signal?.addEventListener("abort", abort, { once: true });
        if (input.signal?.aborted) cancel();
        const auth = observePostHistoryScanAuth(input.rxNostr, relayUrls, now);
        let releaseVerification = () => undefined as void;
        const issue = (relay: PostHistoryFullScanRelayResult, reason: PostHistoryFullScanIssue, range: PostHistoryCoverageRange) => {
            relay.issueCounts[reason] = (relay.issueCounts[reason] ?? 0) + 1;
            if (relay.rangeSamples.length < 16) relay.rangeSamples.push({ since: range.since, until: range.until });
        };
        notify();
        const promise = (async (): Promise<PostHistoryFullScanResult> => {
            try {
                releaseVerification = acquirePostHistoryScanVerification(input.rxNostr, input.ownerPubkeyHex, kinds);
                const scope = await (this.deps.createScope ?? createPostHistoryAuthoredFetchScope)({
                    ownerPubkeyHex: input.ownerPubkeyHex, rxNostr: input.rxNostr, relayConfig: input.relayConfig,
                    kinds, getRelayConfig: () => input.getCurrentScope().relayConfig, isActive: isCurrent,
                });
                localRevision = scope.expectedRevision;
                const persistBatch = this.deps.persistBatch ?? persistPostHistoryAuthoredBatch;
                const fetchRelayPage = this.deps.fetchRelayPage ?? postHistoryRelayFetchService.fetchRelayPage.bind(postHistoryRelayFetchService);
                const save = async (events: PostHistoryRelayFetchResult["events"], fetchedAt: number, coverage: PostHistoryRelayCoverage[]) => {
                    if (!isCurrent() || storageFailed) return;
                    const result = await persistBatch(events, fetchedAt, coverage, scope);
                    if (result.applied === false) { if (!cancellation && !storageFailed) cancel(true); return; }
                    committedResponse = true;
                    progress.insertedCount += result.insertedCount; progress.updatedCount += result.updatedCount;
                    notify();
                };
                const savePage = (page: PostHistoryRelayFetchResult, coverage: PostHistoryRelayCoverage[]) => save(page.events, page.fetchedAt, coverage);
                const checkRevision = async () => {
                    const result = await persistBatch([], now(), [], scope);
                    if (result.applied === false && !cancellation && !storageFailed) cancel(true);
                    return isCurrent() && result.applied !== false;
                };
                const prepareNegentropy = async () => {
                    try {
                        const transport = await this.deps.loadNegentropy?.();
                        if (!transport || !isCurrent()) return null;
                        const seeds = await transport.readPostHistoryNegentropySeeds({
                            owner: input.ownerPubkeyHex, kinds, until: upperBound, relayUrls, isActive: isCurrent,
                        });
                        return { transport, seeds };
                    } catch {
                        // A failed optional preparation leaves the regular scan available.
                        return null;
                    }
                };
                let negentropyPreparation: ReturnType<typeof prepareNegentropy> | undefined;
                const runRelay = async (relay: PostHistoryFullScanRelayResult) => {
                    const relayDeadline = now() + options.relayTimeoutMs;
                    const remainingMs = () => Math.min(relayDeadline, startedAt + options.operationTimeoutMs) - now();
                    const requestPage = async (range: PostHistoryCoverageRange, ids?: string[]) => {
                        relay.requestCount += 1; relay.phase = "fetching"; notify();
                        const task = fetchRelayPage(input.rxNostr, {
                            relayUrl: relay.relayUrl, pubkeyHex: input.ownerPubkeyHex, kinds, limit: ids?.length ?? options.limit,
                            since: range.since, until: range.until, timeoutMs: Math.max(1, Math.min(options.pageTimeoutMs, remainingMs())),
                            ...(ids ? { ids } : {}),
                        });
                        activeTasks.add(task);
                        let page: PostHistoryRelayFetchResult;
                        try { page = await task.promise; } finally { activeTasks.delete(task); }
                        if (!isCurrent() || storageFailed) return null;
                        relay.requestCount += Math.max(0, (page.page?.requestCount ?? 1) - 1);
                        progress.receivedCount += page.rawCount;
                        relay.receivedCount += page.rawCount;
                        notify();
                        usableResponse ||= page.events.length > 0 || page.eoseRelayUrls.length > 0;
                        return page;
                    };
                    const tryNegentropy = async () => {
                        if (!this.deps.loadNegentropy || !isCurrent()) return false;
                        relay.phase = "fetching"; notify();
                        const prepared = await (negentropyPreparation ??= prepareNegentropy());
                        if (!prepared || !isCurrent() || remainingMs() <= 0 || !await checkRevision()) return false;

                        const range = { since: 0, until: upperBound };
                        const result = await prepared.transport.reconcilePostHistoryRelay({
                            relayUrl: relay.relayUrl,
                            filter: { authors: [input.ownerPubkeyHex], kinds, ...range },
                            seed: prepared.seeds.get(relay.relayUrl) ?? [],
                            timeoutMs: Math.min(options.pageTimeoutMs, remainingMs()),
                            signal: controller.signal,
                        });
                        if (!result || !isCurrent() || !await checkRevision()) return false;

                        const maxLimit = Nip11Registry.get(relay.relayUrl)?.limitation?.max_limit;
                        const batchSize = maxLimit && Number.isSafeInteger(maxLimit) && maxLimit > 0
                            ? Math.min(EXACT_ID_BATCH_SIZE, maxLimit) : EXACT_ID_BATCH_SIZE;
                        for (let offset = 0; offset < result.ids.length; offset += batchSize) {
                            if (!isCurrent() || remainingMs() <= 0 || relay.requestCount >= options.maxRequests) return false;
                            const ids = result.ids.slice(offset, offset + batchSize);
                            let page: PostHistoryRelayFetchResult | null;
                            try { page = await requestPage(range, ids); }
                            catch { return false; }
                            if (!page) return false;
                            if (page.events.length) await savePage(page, []);
                            if (!isCleanRelayPage(page) || page.closedRelayUrls.length || page.page?.hints.includes("auth")
                                || relay.requestCount > options.maxRequests) return false;
                            const verifiedIds = new Set(page.events.map(({ event }) => event.id));
                            if (!ids.every((id) => verifiedIds.has(id))) return false;
                        }
                        if (!isCurrent() || remainingMs() <= 0) return false;
                        await save([], now(), [{ relayUrl: relay.relayUrl, ranges: [range] }]);
                        if (!isCurrent()) return false;
                        relay.hasMatchedLocalEvents = result.hasMatchedLocalEvents;
                        usableResponse = true;
                        return true;
                    };
                    const fetchPage = async (range: RangeWork): Promise<PostHistoryRelayFetchResult | null> => {
                        for (let attempt = 0; attempt < 2 && isCurrent() && !storageFailed; attempt++) {
                            if (remainingMs() <= 0 || relay.requestCount >= options.maxRequests) {
                                issue(relay, "safety-limit", range); return null;
                            }
                            let page: PostHistoryRelayFetchResult | null;
                            try {
                                page = await requestPage(range);
                            } catch {
                                if (attempt === 1) { issue(relay, "error", range); return null; }
                                continue;
                            }
                            if (!page) return null;
                            if (relay.requestCount > options.maxRequests) {
                                await savePage(page, []); issue(relay, "safety-limit", range); return null;
                            }
                            if (isCleanRelayPage(page)) return page;
                            await savePage(page, []);
                            if (page.page?.bufferLimited) { issue(relay, "safety-limit", range); return null; }
                            if (page.page?.authRequired) { issue(relay, "auth-unresolved", range); return null; }
                            if (attempt === 1) { issue(relay, page.status === "timeout" || !page.eoseRelayUrls.length && !page.allRelaysFailed ? "timeout" : "error", range); return null; }
                        }
                        return null;
                    };
                    try {
                        if (await tryNegentropy()) {
                            relay.status = "completed";
                            return;
                        }
                        for (let windowUntil = upperBound; windowUntil >= 0 && isCurrent() && !storageFailed;) {
                            const windowSince = Math.max(0, windowUntil - options.windowSeconds + 1);
                            const stack: RangeWork[] = [{ since: windowSince, until: windowUntil, authRetried: false }];
                            while (stack.length && isCurrent() && !storageFailed) {
                                let range = stack.pop()!;
                                let boundary = -1;
                                const boundaryIds = new Set<string>();
                                while (isCurrent() && !storageFailed) {
                                    let page = await fetchPage(range);
                                    if (!page) { relay.status = cancellation ? "cancelled" : "partial"; return; }
                                    if (page.page?.authAutoResent) range.authRetried = true;
                                    if (page.page?.hints.includes("auth")) {
                                        const authDeadline = Math.min(Math.min(now(), page.page.eoseReceivedAt ?? now()) + options.authTimeoutMs,
                                            now() + remainingMs());
                                        await savePage(page, []);
                                        if (!isCurrent()) return;
                                        if (range.authRetried) { issue(relay, "auth-unresolved", range); relay.status = "partial"; return; }
                                        page = null; // Release the committed page before waiting or holding its replacement.
                                        relay.phase = "auth"; notify();
                                        const outcome = await auth.wait(relay.relayUrl, options.authTimeoutMs, controller.signal, authDeadline);
                                        if (!isCurrent()) return;
                                        if (outcome !== "success") { issue(relay, outcome === "rejected" ? "auth-rejected" : "auth-timeout", range); relay.status = "partial"; return; }
                                        range.authRetried = true;
                                        page = await fetchPage(range);
                                        if (!page) { relay.status = cancellation ? "cancelled" : "partial"; return; }
                                        if (page.page?.hints.includes("auth")) {
                                            await savePage(page, []); issue(relay, "auth-unresolved", range); relay.status = "partial"; return;
                                        }
                                    }
                                    const more = page.page?.hints.includes("more") === true;
                                    const finished = !more && page.page?.hints.includes("finish") === true;
                                    const empty = !more && page.rawCount === 0;
                                    const oldest = page.oldestCreatedAt;
                                    const coverage = derivePostHistoryRelayFetchCoverage({ since: range.since, until: range.until,
                                        oldestCreatedAt: oldest, cancelled: false,
                                        outcomes: (page.relayOutcomes ?? []).map((outcome) => ({ ...outcome,
                                            relayUrl: relay.relayUrl, oldestCreatedAt: oldest,
                                            saturated: outcome.saturated || !finished && !empty,
                                        })),
                                    });
                                    await savePage(page, coverage);
                                    if (!isCurrent()) return;
                                    if (finished || empty) break;
                                    if (oldest !== null && oldest < range.until) {
                                        range = { ...range, until: oldest };
                                        boundary = oldest; boundaryIds.clear();
                                        page.events.filter(({ event }) => event.created_at === oldest).forEach(({ event }) => boundaryIds.add(event.id));
                                        continue;
                                    }
                                    if (boundary !== range.until) { boundary = range.until; boundaryIds.clear(); }
                                    let added = 0;
                                    for (const { event } of page.events) {
                                        if (!boundaryIds.has(event.id)) { added++; boundaryIds.add(event.id); }
                                        if (boundaryIds.size >= options.maxBoundaryIds) break;
                                    }
                                    if (added > 0 && boundaryIds.size < options.maxBoundaryIds) continue;
                                    if (range.since < range.until) {
                                        const mid = range.since + Math.floor((range.until - range.since) / 2);
                                        stack.push({ ...range, until: mid }, { ...range, since: mid + 1 });
                                    } else issue(relay, "ambiguous", range);
                                    break;
                                }
                            }
                            windowUntil = windowSince - 1;
                        }
                        relay.status = controller.signal.aborted ? "cancelled"
                            : Object.keys(relay.issueCounts).length && !hasOnlyPostHistoryFullScanAmbiguity(relay) ? "partial" : "completed";
                    } catch {
                        if (!controller.signal.aborted) {
                            issue(relay, "storage", { since: 0, until: upperBound }); storageFailed = true;
                            controller.abort();
                            activeTasks.forEach((task) => task.cancel());
                        }
                        relay.status = cancellation ? "cancelled" : "partial";
                    } finally { notify(); }
                };
                let index = 0;
                await Promise.all(Array.from({ length: Math.min(options.concurrency, relays.length) }, async () => {
                    while (index < relays.length && isCurrent() && !storageFailed) await runRelay(relays[index++]);
                }));
                if (!scope.isActive() && !cancellation && !storageFailed) cancel(true);
                if (!cancellation && !storageFailed) {
                    await checkRevision();
                }
            } catch {
                storageFailed = true;
                const relay = relays.find((relay) => relay.status === "running") ?? relays[0];
                if (relay) { issue(relay, "storage", { since: 0, until: upperBound }); relay.status = "partial"; }
            }
            finally {
                activeTasks.forEach((task) => task.cancel()); auth.dispose(); releaseVerification();
                input.signal?.removeEventListener("abort", abort); this.activeRuntimes.delete(input.rxNostr);
            }
            relays.forEach((relay) => { if (relay.status === "running") relay.status = cancellation ? "cancelled" : "partial"; });
            notify();
            const status = cancellation ?? (relays.length && !storageFailed && relays.every((relay) => relay.status === "completed")
                ? "completed" : (storageFailed ? committedResponse : usableResponse || progress.insertedCount > 0) ? "partial" : "failed");
            return { ...progress, status, ownerPubkeyHex: input.ownerPubkeyHex, localRevision, upperBound, relays };
        })();
        return { promise, cancel };
    }
}
export const postHistoryRelayFullScanService = new PostHistoryRelayFullScanService({
    loadNegentropy: () => import("./postHistoryFullScanNegentropy"),
});
