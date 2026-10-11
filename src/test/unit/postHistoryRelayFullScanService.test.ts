import { describe, expect, it, vi } from "vitest";
import type { RxNostr } from "rx-nostr";
import { PostHistoryRelayFullScanService, type PostHistoryFullScanDeps, type PostHistoryFullScanProgress } from "../../lib/postHistoryRelayFullScanService";
import { createAuthoredFetchResult } from "../postHistorySyncResultTestUtils";
import type { NostrEvent, RelayConfig } from "../../lib/types";
import type { PostHistoryRelayFetchResult } from "../../lib/postHistoryRelayFetchService";
import { POST_HISTORY_AUTHORED_KINDS } from "../../lib/postHistoryKinds";

const owner = "a".repeat(64);
const urls = ["wss://scan-a.example/", "wss://scan-b.example/"];
function event(time: number, suffix = time): NostrEvent {
    return { id: suffix.toString(16).padStart(64, "0"), pubkey: owner, kind: 1, created_at: time, content: "scan fixture", tags: [], sig: "0".repeat(128) };
}
function page(events: NostrEvent[], hints: string[] = [], overrides: Partial<PostHistoryRelayFetchResult> = {}): PostHistoryRelayFetchResult {
    return createAuthoredFetchResult(event(0), {
        events: events.map((event) => ({ event, relayUrls: urls })), rawCount: events.length,
        oldestCreatedAt: events.length ? Math.min(...events.map((event) => event.created_at)) : null,
        newestCreatedAt: events.length ? Math.max(...events.map((event) => event.created_at)) : null,
        relayOutcomes: [{ relayUrl: urls[0], eoseReceived: true, verificationDrained: true, termination: "eose", rawCount: events.length, oldestCreatedAt: null, saturated: false }],
        eoseRelayUrls: urls, page: { subscriptionId: "page:0", hints, authRequired: false, authAutoResent: false, bufferLimited: false }, ...overrides,
    });
}
function setup(fetch: (params: Parameters<NonNullable<PostHistoryFullScanDeps["fetchRelayPage"]>>[1]) => PostHistoryRelayFetchResult | Promise<PostHistoryRelayFetchResult>, extra: PostHistoryFullScanDeps = {}, onProgress?: (progress: PostHistoryFullScanProgress) => void) {
    const runtime = {} as RxNostr;
    let currentOwner = owner;
    let currentRuntime = runtime;
    let config: RelayConfig = Object.fromEntries(urls.map((url) => [url, { read: true, write: true }]));
    const saved = new Map<string, { event: NostrEvent; relays: Set<string> }>();
    const coverage: { relayUrl: string; since: number; until: number }[] = [];
    const requests: Parameters<NonNullable<PostHistoryFullScanDeps["fetchRelayPage"]>>[1][] = [];
    const persistBatch = vi.fn<NonNullable<PostHistoryFullScanDeps["persistBatch"]>>(async (events, _at, ranges, scope) => {
        if (!scope.isActive()) return { insertedCount: 0, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0, applied: false };
        let insertedCount = 0;
        for (const item of events) {
            const existing = saved.get(item.event.id);
            if (!existing) { saved.set(item.event.id, { event: item.event, relays: new Set(item.relayUrls) }); insertedCount++; }
            else item.relayUrls?.forEach((url) => existing.relays.add(url));
        }
        ranges.forEach((relay) => relay.ranges.forEach((range) => coverage.push({ relayUrl: relay.relayUrl, ...range })));
        return { insertedCount, updatedCount: 0, unchangedCount: events.length - insertedCount, appliedDeletionCount: 0 };
    });
    const service = new PostHistoryRelayFullScanService({
        now: () => 100_000, options: { windowSeconds: 101, pageTimeoutMs: 100, maxRequests: 100 },
        createScope: async (params) => ({ ownerPubkeyHex: params.ownerPubkeyHex, kindsKey: params.kinds.join(","), expectedRevision: 7, isActive: params.isActive }),
        persistBatch,
        fetchRelayPage: (_runtime, params) => {
            requests.push(params);
            return { promise: Promise.resolve(fetch(params)), cancel: () => undefined };
        }, ...extra,
    });
    const task = service.start({ ownerPubkeyHex: owner, rxNostr: runtime, relayConfig: config,
        getCurrentScope: () => ({ ownerPubkeyHex: currentOwner, rxNostr: currentRuntime, relayConfig: config }), onProgress });
    return { task, requests, saved, coverage, persistBatch,
        changeOwner: () => { currentOwner = "b".repeat(64); }, changeRuntime: () => { currentRuntime = {} as RxNostr; },
        changeConfig: () => { config = { [urls[0]]: { read: true, write: false } }; } };
}

describe("manual full relay scan", () => {
    it("reports all pending relays before work, then fetching and completed/empty without mutating old snapshots", async () => {
        const releases = new Map<string, (response: PostHistoryRelayFetchResult) => void>();
        const snapshots: PostHistoryFullScanProgress[] = [];
        const state = setup((params) => new Promise((resolve) => releases.set(params.relayUrl, resolve)),
            { options: { concurrency: 1 } }, (progress) => snapshots.push(progress));
        expect(snapshots[0].relays.map((relay) => relay.phase)).toEqual(["pending", "pending"]);
        await vi.waitFor(() => expect(releases.has(urls[0])).toBe(true));
        expect(snapshots.at(-1)!.relays.map((relay) => relay.phase)).toEqual(["fetching", "pending"]);
        releases.get(urls[0])!(page([event(90)], ["finish"], { rawCount: 5 }));
        await vi.waitFor(() => expect(releases.has(urls[1])).toBe(true));
        expect(snapshots.at(-1)!.relays.map(({ status, phase, receivedCount }) => ({ status, phase, receivedCount }))).toEqual([
            { status: "completed", phase: "fetching", receivedCount: 5 }, { status: "running", phase: "fetching", receivedCount: 0 },
        ]);
        releases.get(urls[1])!(page([], []));
        const result = await state.task.promise;
        expect(result.status).toBe("completed");
        expect(result.relays.map((relay) => relay.receivedCount)).toEqual([5, 0]);
        expect(result.receivedCount).toBe(5);
        expect(snapshots[0].relays.every((relay) => relay.phase === "pending" && relay.status === "running" && relay.receivedCount === 0)).toBe(true);
    });
    it("keeps concurrent relay counts independent and includes duplicate raw events across pages", async () => {
        const releases = new Map<string, (response: PostHistoryRelayFetchResult) => void>();
        const snapshots: PostHistoryFullScanProgress[] = [];
        const state = setup((params) => new Promise((resolve) => releases.set(params.relayUrl, resolve)), {}, (progress) => snapshots.push(progress));
        await vi.waitFor(() => expect(releases.size).toBe(2));
        expect(snapshots.at(-1)!.relays.every((relay) => relay.phase === "fetching")).toBe(true);
        releases.get(urls[1])!(page([event(90)], ["finish"], { rawCount: 3 }));
        await vi.waitFor(() => expect(snapshots.at(-1)!.relays[1].status).toBe("completed"));
        expect(snapshots.at(-1)!.relays[0].receivedCount).toBe(0);
        releases.get(urls[0])!(page([event(90)], [], { rawCount: 7 }));
        await vi.waitFor(() => expect(state.requests).toHaveLength(3));
        releases.get(urls[0])!(page([event(90)], ["finish"], { rawCount: 5 }));
        const result = await state.task.promise;
        expect(result.relays.map((relay) => relay.receivedCount)).toEqual([12, 3]);
        expect(result.receivedCount).toBe(15); expect(state.saved.size).toBe(1);
    });
    it("keeps the retrieval phase stable while saving page batches", async () => {
        const phases: string[] = [];
        const state = setup(() => page([event(90)], ["finish"]), {}, ({ phase }) => phases.push(phase));
        expect((await state.task.promise).status).toBe("completed");
        expect(phases.length).toBeGreaterThan(0);
        expect(new Set(phases)).toEqual(new Set(["fetching"]));
    });
    it("keeps each relay's cursor, deduplicates A/B-only events and records safe coverage", async () => {
        const fixtures = { [urls[0]]: [event(90), event(40), event(20)], [urls[1]]: [event(90), event(65), event(5)] };
        const state = setup((params) => {
            const matching = fixtures[params.relayUrl].filter((event) => event.created_at >= params.since! && event.created_at <= params.until!);
            const selected = matching.slice(0, 2);
            return page(selected, matching.length <= 2 ? ["finish"] : [], { events: selected.map((event) => ({ event, relayUrls: [params.relayUrl] })) });
        });
        const result = await state.task.promise;
        expect(result.status).toBe("completed"); expect(result.insertedCount).toBe(5);
        expect(state.saved.get(event(90).id)?.relays.size).toBe(2);
        expect(state.requests.filter((request) => request.relayUrl === urls[0]).map((request) => request.until)).toEqual([100, 40]);
        expect(state.requests.filter((request) => request.relayUrl === urls[1]).map((request) => request.until)).toEqual([100, 65]);
        expect(state.requests.every((request) => request.kinds?.join(",") === POST_HISTORY_AUTHORED_KINDS.join(","))).toBe(true);
    });
    it.each([{ hints: [] }, { hints: ["future-hint"] }])("accepts a zero-event legacy terminal without finish ($hints)", async ({ hints }) => {
        const state = setup(() => page([], hints));
        expect((await state.task.promise).status).toBe("completed");
        expect(state.coverage).toHaveLength(2);
    });
    it("does not stop at a hidden cap below the requested limit", async () => {
        const fixtures = [event(90), event(80), event(70), event(60)];
        const state = setup((params) => {
            const matching = fixtures.filter((event) => event.created_at >= params.since! && event.created_at <= params.until!);
            return page(matching.slice(0, 2));
        });
        const result = await state.task.promise;
        expect(state.saved.size).toBe(4); expect(state.requests.length).toBeGreaterThan(4);
        expect(result.status).toBe("partial"); // actual unresolved second, not missing hint
        expect(result.relays.every((relay) => relay.issueCounts.ambiguous)).toBe(true);
    });
    it("splits a truncated range, leaves a saturated second uncovered and continues older", async () => {
        const fixtures = [event(80, 1), event(80, 2), event(80, 3), event(10, 4)];
        const state = setup((params) => {
            const matching = fixtures.filter((event) => event.created_at >= params.since! && event.created_at <= params.until!);
            return page(matching.slice(0, 2), matching.length > 2 ? ["more"] : ["finish"]);
        });
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(state.saved.has(event(10, 4).id)).toBe(true);
        expect(state.coverage.every((range) => !(range.since <= 80 && range.until >= 80))).toBe(true);
        expect(result.relays.every((relay) => relay.issueCounts.ambiguous === 1)).toBe(true);
    });
    it("one timeout cannot stop the other relay or turn partial into completed", async () => {
        const state = setup((params) => params.relayUrl === urls[0]
            ? page([event(30)], [], { status: "timeout", eoseRelayUrls: [], relayOutcomes: [], hasAnyRelayResponse: false }) : page([event(10)], ["finish"]));
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(result.relays[1].status).toBe("completed");
        expect(result.relays.map((relay) => relay.receivedCount)).toEqual([2, 1]);
        expect(state.saved.size).toBe(2); expect(state.coverage.every((range) => range.relayUrl === urls[1])).toBe(true);
    });
    it("keeps saturated boundary coverage conservative even when finish ends the query", async () => {
        const response = page([event(80)], ["finish"]);
        response.relayOutcomes![0].saturated = true;
        const state = setup(() => response);
        expect((await state.task.promise).status).toBe("completed");
        expect(state.coverage).toEqual(urls.map((relayUrl) => ({ relayUrl, since: 81, until: 100 })));
    });
    it.each(["changeOwner", "changeRuntime", "changeConfig"] as const)("rejects stale writes after %s", async (change) => {
        let release!: (page: PostHistoryRelayFetchResult) => void;
        const state = setup(() => new Promise((resolve) => { release = resolve; }), { options: { concurrency: 1 } });
        await vi.waitFor(() => expect(release).toBeDefined());
        state[change](); release(page([event(10)], ["finish"]));
        expect((await state.task.promise).status).toBe("stale-cancelled"); expect(state.saved.size).toBe(0);
    });
    it("cancels and keeps committed batches", async () => {
        let release!: (page: PostHistoryRelayFetchResult) => void;
        const state = setup((params) => params.until === 100 ? page([event(90)], []) : new Promise((resolve) => { release = resolve; }),
            { options: { concurrency: 1 } });
        await vi.waitFor(() => expect(release).toBeDefined());
        state.task.cancel(); release(page([event(80)], ["finish"]));
        const result = await state.task.promise;
        expect(result.status).toBe("cancelled"); expect(state.saved.size).toBe(1);
        expect(result.relays.map(({ status, receivedCount }) => ({ status, receivedCount }))).toEqual([
            { status: "cancelled", receivedCount: 1 }, { status: "cancelled", receivedCount: 0 },
        ]);
    });
    it("does not fetch a new page until persistence commits", async () => {
        let commit!: () => void;
        let first = true;
        const state = setup(() => page([event(90)], []), { options: { concurrency: 1, maxRequests: 1 },
            persistBatch: async () => {
                const summary = { insertedCount: 1, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
                if (!first) return summary;
                first = false;
                return new Promise((resolve) => { commit = () => resolve(summary); });
            } });
        await vi.waitFor(() => expect(commit).toBeDefined()); expect(state.requests.length).toBe(1);
        commit(); expect((await state.task.promise).status).toBe("partial");
    });
    it("reports all-relay failures and stale revision commits distinctly", async () => {
        const failed = setup(() => page([], [], { status: "error", hasAnyRelayResponse: false, allRelaysFailed: true, eoseRelayUrls: [], relayOutcomes: [] }));
        expect((await failed.task.promise).status).toBe("failed");
        const notice = setup(() => page([], [], { status: "error", hasAnyRelayResponse: true, eoseRelayUrls: [], relayOutcomes: [] }));
        expect((await notice.task.promise).status).toBe("failed");
        const stale = setup(() => page([event(1)], ["finish"]), { persistBatch: async () => ({ insertedCount: 0, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0, applied: false }) });
        expect((await stale.task.promise).status).toBe("stale-cancelled");
    });
    it("stops all persistence after a database failure and preserves an earlier commit", async () => {
        let writes = 0;
        const state = setup((params) => page([event(params.until!)], []), { options: { concurrency: 1 },
            persistBatch: async () => {
                if (++writes === 2) throw new Error("synthetic storage failure");
                return { insertedCount: 1, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
            } });
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(result.insertedCount).toBe(1); expect(writes).toBe(2);
        const fatal = setup(() => page([event(1)], ["finish"]), { persistBatch: async () => { throw new Error("synthetic storage failure"); } });
        expect((await fatal.task.promise).status).toBe("failed");
        const opening = setup(() => page([], ["finish"]), { createScope: async () => { throw new Error("synthetic database open failure"); } });
        const failure = await opening.task.promise;
        expect(failure.status).toBe("failed"); expect(failure.relays[0].issueCounts.storage).toBe(1);
    });
    it.each(["request", "relay", "operation"])("stops at the %s safety limit without claiming completion", async (limit) => {
        let clock = 100_000;
        const state = setup(() => {
            if (limit !== "request") clock += 100;
            return page([event(90)], ["more", "finish"]);
        }, { now: () => clock, options: { concurrency: 1, maxRequests: limit === "request" ? 1 : 100,
            relayTimeoutMs: limit === "relay" ? 50 : 1000, operationTimeoutMs: limit === "operation" ? 50 : 1000 } });
        const result = await state.task.promise;
        expect(result.status).toBe("partial"); expect(result.relays[0].issueCounts["safety-limit"]).toBe(1);
        expect(state.coverage.some((range) => range.since <= 90 && range.until >= 90)).toBe(false);
    });
    it("does not misclassify a sibling transaction rolled back by storage failure as stale cancellation", async () => {
        let fail!: (error: Error) => void;
        let abortSibling!: () => void;
        let siblingCurrent!: () => boolean;
        let count = 0;
        const state = setup(() => page([event(1)], ["finish"]), { persistBatch: (_events, _at, _ranges, scope) => {
            if (++count === 1) return new Promise((_resolve, reject) => { fail = reject; });
            siblingCurrent = scope.isActive;
            return new Promise((resolve) => { abortSibling = () => resolve({ insertedCount: 0, updatedCount: 0,
                unchangedCount: 0, appliedDeletionCount: 0, applied: false }); });
        } });
        await vi.waitFor(() => expect(abortSibling).toBeDefined()); fail(new Error("synthetic storage failure"));
        await vi.waitFor(() => expect(siblingCurrent()).toBe(false)); abortSibling();
        expect((await state.task.promise).status).toBe("failed");
    });
    it("streams 100,000 events using page-sized batches and no full result array", async () => {
        let oldestSaved = 100_001;
        let largestBatch = 0;
        const state = setup((params) => {
            const until = Math.min(100_000, params.until!);
            const count = Math.min(250, until - params.since! + 1);
            const events = Array.from({ length: Math.max(0, count) }, (_, index) => event(until - index));
            return page(events, until - params.since! + 1 <= 250 ? ["finish"] : []);
        }, { now: () => 100_000_000, options: { concurrency: 1, windowSeconds: 100_001, maxRequests: 1000 },
            persistBatch: async (events) => {
                largestBatch = Math.max(largestBatch, events.length);
                const added = events.filter(({ event }) => event.created_at < oldestSaved && event.created_at > 0).length;
                oldestSaved = Math.min(oldestSaved, ...events.map(({ event }) => event.created_at));
                return { insertedCount: added, updatedCount: 0, unchangedCount: 0, appliedDeletionCount: 0 };
            } });
        const result = await state.task.promise;
        expect(result.status).toBe("completed"); expect(result.insertedCount).toBe(100_000);
        expect(largestBatch).toBe(250); expect("events" in result).toBe(false);
        expect(result.relays.every((relay) => relay.rangeSamples.length <= 16)).toBe(true);
    });
});
