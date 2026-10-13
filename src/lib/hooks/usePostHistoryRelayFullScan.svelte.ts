import { onDestroy, untrack } from "svelte";
import { getPostHistoryAuthoredRelayScopeKey } from "../postHistoryRelayResolver";
import { postHistoryOperationWakeLock } from "../postHistoryOperationWakeLock";
import { postHistoryRelayFullScanService, type PostHistoryFullScanProgress, type PostHistoryFullScanResult,
    type PostHistoryFullScanScope, type PostHistoryFullScanTask } from "../postHistoryRelayFullScanService";

export function usePostHistoryRelayFullScan(input: {
    getShow: () => boolean;
    getScope: () => PostHistoryFullScanScope;
    onSettled: (result: PostHistoryFullScanResult) => Promise<void>;
}) {
    const state = $state({ open: false, running: false, progress: null as PostHistoryFullScanProgress | null,
        result: null as PostHistoryFullScanResult | null, elapsedMs: 0 });
    let task: PostHistoryFullScanTask | null = null;
    let owner: PostHistoryFullScanScope | null = null;
    let relayKey = "";
    let destroyed = false;
    let generation = 0;
    let elapsedTimer: ReturnType<typeof setInterval> | undefined;
    function suspend() {
        generation++;
        cancel();
        clearInterval(elapsedTimer);
        task = null; owner = null; state.running = false; state.open = false;
    }
    let wakeLockLease: (() => void) | null = null;
    function cancel(stale?: boolean) {
        wakeLockLease?.(); wakeLockLease = null;
        task?.cancel(stale);
    }
    const sameOwner = () => {
        const current = input.getScope();
        return !!owner && owner.ownerPubkeyHex === current.ownerPubkeyHex && owner.rxNostr === current.rxNostr
            && relayKey === getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
    };
    function setOpen(open: boolean) {
        if (!open) cancel();
        if (open && !task) { state.result = null; state.progress = null; state.elapsedMs = 0; }
        state.open = open;
    }
    async function start() {
        const current = input.getScope();
        if (destroyed || task || !current.ownerPubkeyHex || !current.rxNostr || !input.getShow()) return;
        const epoch = generation;
        owner = current; relayKey = getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
        state.running = true; state.result = null; state.progress = null; state.elapsedMs = 0;
        const startedAt = performance.now();
        const timer = setInterval(() => { if (epoch === generation && input.getShow()) state.elapsedMs = performance.now() - startedAt; }, 1000);
        elapsedTimer = timer;
        const endWakeLock = postHistoryOperationWakeLock.acquire();
        wakeLockLease = endWakeLock;
        try {
            const operation = postHistoryRelayFullScanService.start({
                ownerPubkeyHex: current.ownerPubkeyHex, rxNostr: current.rxNostr, relayConfig: current.relayConfig,
                getCurrentScope: input.getScope,
                onProgress: (progress) => { if (!destroyed && epoch === generation && input.getShow()) state.progress = progress; },
            });
            task = operation;
            const result = await operation.promise;
            if (destroyed || epoch !== generation || !input.getShow()) return;
            state.result = result; state.elapsedMs = performance.now() - startedAt;
            if (sameOwner() && input.getShow() && result.status !== "stale-cancelled") await input.onSettled(result);
        } finally {
            endWakeLock();
            if (wakeLockLease === endWakeLock) wakeLockLease = null;
            clearInterval(timer);
            if (epoch === generation) { task = null; if (!destroyed) state.running = false; }
        }
    }
    $effect(() => {
        const show = input.getShow();
        const current = input.getScope();
        const key = getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
        untrack(() => {
            if (task && owner && (current.ownerPubkeyHex !== owner.ownerPubkeyHex || current.rxNostr !== owner.rxNostr || key !== relayKey)) cancel(true);
            if (!show && task) suspend();
            else if (!show) state.open = false;
        });
    });
    onDestroy(() => { destroyed = true; cancel(); });
    return { state, setOpen, start, suspend, cancel: () => cancel() };
}
