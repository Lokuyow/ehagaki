import { cleanup, render, waitFor } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PostHistoryRelatedReactionsHarness from "./fixtures/PostHistoryRelatedReactionsHarness.svelte";

const { mockState, repairRelatedCardReactions, lifecycleTrigger } = vi.hoisted(() => ({
    mockState: { records: [] as any[], tasks: [] as any[] },
    repairRelatedCardReactions: vi.fn(),
    lifecycleTrigger: vi.fn(async () => ({
        status: "completed",
        deletedReactionEventIds: [],
    })),
}));

vi.mock("../../lib/postHistoryChildInteractionsAdapter", () => ({
    postHistoryReactionRecordsAdapter: {
        getReactionRecordsForParents: vi.fn(async (eventIds: string[]) =>
            mockState.records.filter((record) => eventIds.includes(record.parentEventId)),
        ),
        getReactionRecords: vi.fn(async (eventId: string) =>
            mockState.records.filter((record) => record.parentEventId === eventId),
        ),
    },
}));

vi.mock("../../lib/postHistoryVisibleRangeChildInteractionRepairService", () => ({
    postHistoryVisibleRangeChildInteractionRepairService: { repairRelatedCardReactions },
}));

vi.mock("../../lib/postHistoryReactionLifecycleTrigger", () => ({
    triggerPostHistoryReactionLifecycle: lifecycleTrigger,
}));

const TARGET_A = "a".repeat(64);
const TARGET_B = "b".repeat(64);

function reaction(parentEventId: string, suffix: string) {
    return {
        id: `${suffix}${parentEventId}`,
        eventId: `${suffix}${parentEventId}`,
        parentEventId,
        authorPubkey: "c".repeat(64),
        kind: 7,
        content: "+",
        tags: [],
        createdAt: 1,
        relayUrls: [],
        discoveredAs: ["reaction"],
        rawEvent: null,
        fetchedAt: 1,
        updatedAt: 1,
        schemaVersion: 1,
    };
}

function createDeferred<T>() {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise;
        reject = rejectPromise;
    });
    return { promise, resolve, reject };
}

function createRepairTask() {
    const deferred = createDeferred<any>();
    const task = {
        targets: undefined as any,
        relayConfig: undefined as any,
        cancel: vi.fn(() => deferred.resolve({
            status: "cancelled",
            targetEventIds: task.targets?.map((target: any) => target.eventId) ?? [],
        })),
        promise: deferred.promise,
        resolve: deferred.resolve,
        reject: deferred.reject,
    };
    mockState.tasks.push(task);
    return task;
}

function renderHarness(props: Partial<{
    show: boolean;
    pubkeyHex: string;
    rxNostr: any;
    relayConfig: Record<string, { read: boolean; write: boolean }>;
    targets: { eventId: string; relayHints: string[] }[];
}> = {}) {
    return render(PostHistoryRelatedReactionsHarness, {
        props: {
            show: true,
            pubkeyHex: "d".repeat(64),
            rxNostr: {} as any,
            relayConfig: { "wss://relay-a.example": { read: true, write: false } },
            targets: [{ eventId: TARGET_A, relayHints: [] }],
            ...props,
        },
    });
}

describe("usePostHistoryRelatedReactions", () => {
    beforeEach(() => {
        mockState.records = [];
        mockState.tasks = [];
        repairRelatedCardReactions.mockReset();
        repairRelatedCardReactions.mockImplementation((_rxNostr, params) => {
            const task = createRepairTask();
            task.targets = params.targets;
            task.relayConfig = params.relayConfig;
            return task;
        });
        lifecycleTrigger.mockClear();
    });

    afterEach(() => cleanup());

    it("loads and displays new reactions for a related event", async () => {
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));

        mockState.records = [reaction(TARGET_A, "1")];
        mockState.tasks[0].resolve({ status: "success", targetEventIds: [TARGET_A] });

        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_A}`).textContent).toBe("1"));
        expect(repairRelatedCardReactions).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ targets: [{ eventId: TARGET_A, relayHints: [] }] }),
        );
    });

    it("keeps cached reactions after partial retrieval and retries after relay settings improve", async () => {
        mockState.records = [reaction(TARGET_A, "1")];
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));
        mockState.tasks[0].resolve({ status: "partial", targetEventIds: [TARGET_A] });

        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_A}`).textContent).toBe("1"));
        await Promise.resolve();
        expect(mockState.tasks).toHaveLength(1);

        await view.rerender({
            show: true,
            pubkeyHex: "d".repeat(64),
            rxNostr: {} as any,
            relayConfig: {
                "wss://relay-a.example": { read: true, write: false },
                "wss://relay-b.example": { read: true, write: false },
            },
            targets: [{ eventId: TARGET_A, relayHints: [] }],
        });
        await waitFor(() => expect(mockState.tasks).toHaveLength(2));
        expect(mockState.tasks[1].relayConfig).toHaveProperty("wss://relay-b.example");
        mockState.records = [reaction(TARGET_A, "1"), reaction(TARGET_A, "2")];
        mockState.tasks[1].resolve({ status: "success", targetEventIds: [TARGET_A] });
        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_A}`).textContent).toBe("2"));
    });

    it("keeps cached reactions after a failed request and retries on online recovery", async () => {
        mockState.records = [reaction(TARGET_A, "1")];
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));
        mockState.tasks[0].reject(new Error("temporary relay failure"));

        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_A}`).textContent).toBe("1"));
        await Promise.resolve();
        expect(mockState.tasks).toHaveLength(1);

        window.dispatchEvent(new Event("online"));
        await waitFor(() => expect(mockState.tasks).toHaveLength(2));
        mockState.records = [reaction(TARGET_A, "1"), reaction(TARGET_A, "2")];
        mockState.tasks[1].resolve({ status: "success", targetEventIds: [TARGET_A] });
        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_A}`).textContent).toBe("2"));
    });

    it("re-fetches an event when a new relay hint is added", async () => {
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));
        mockState.tasks[0].resolve({ status: "success", targetEventIds: [TARGET_A] });

        await view.rerender({
            show: true,
            pubkeyHex: "d".repeat(64),
            rxNostr: {} as any,
            relayConfig: { "wss://relay-a.example": { read: true, write: false } },
            targets: [
                { eventId: TARGET_A, relayHints: ["wss://quote.example"] },
                { eventId: TARGET_A, relayHints: ["wss://thread.example"] },
            ],
        });
        await waitFor(() => expect(mockState.tasks).toHaveLength(2));
        expect(mockState.tasks[1].targets).toEqual([{
            eventId: TARGET_A,
            relayHints: ["wss://quote.example", "wss://thread.example"],
        }]);
        mockState.records = [reaction(TARGET_A, "1")];
        mockState.tasks[1].resolve({ status: "success", targetEventIds: [TARGET_A] });
        await waitFor(() => expect(view.getAllByTestId(`reaction-${TARGET_A}`).map((item) => item.textContent))
            .toEqual(["1", "1"]));
    });

    it("cancels stale target work and does not apply it after target changes", async () => {
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));
        const staleTask = mockState.tasks[0];

        await view.rerender({
            show: true,
            pubkeyHex: "d".repeat(64),
            rxNostr: {} as any,
            relayConfig: { "wss://relay-a.example": { read: true, write: false } },
            targets: [{ eventId: TARGET_B, relayHints: [] }],
        });
        expect(staleTask.cancel).toHaveBeenCalledOnce();
        await waitFor(() => expect(mockState.tasks).toHaveLength(2));
        mockState.records = [reaction(TARGET_B, "2")];
        mockState.tasks[1].resolve({ status: "success", targetEventIds: [TARGET_B] });
        await waitFor(() => expect(view.getByTestId(`reaction-${TARGET_B}`).textContent).toBe("1"));
        expect(view.queryByTestId(`reaction-${TARGET_A}`)).toBeNull();
    });

    it("cancels pending work when the dialog closes", async () => {
        const view = renderHarness();
        await waitFor(() => expect(mockState.tasks).toHaveLength(1));
        const pendingTask = mockState.tasks[0];

        await view.rerender({
            show: false,
            pubkeyHex: "d".repeat(64),
            rxNostr: {} as any,
            relayConfig: { "wss://relay-a.example": { read: true, write: false } },
            targets: [{ eventId: TARGET_A, relayHints: [] }],
        });

        expect(pendingTask.cancel).toHaveBeenCalledOnce();
        expect(view.queryByTestId(`reaction-${TARGET_A}`)).toBeNull();
    });
});
