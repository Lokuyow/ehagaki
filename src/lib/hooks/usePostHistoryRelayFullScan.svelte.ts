import { onDestroy, untrack } from "svelte";
import { getPostHistoryAuthoredRelayScopeKey } from "../postHistoryRelayResolver";
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
    const sameOwner = () => {
        const current = input.getScope();
        return !!owner && owner.ownerPubkeyHex === current.ownerPubkeyHex && owner.rxNostr === current.rxNostr
            && relayKey === getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
    };
    function setOpen(open: boolean) {
        if (!open) task?.cancel();
        if (open && !task) { state.result = null; state.progress = null; state.elapsedMs = 0; }
        state.open = open;
    }
    async function start() {
        const current = input.getScope();
        if (task || !current.ownerPubkeyHex || !current.rxNostr || !input.getShow()) return;
        owner = current; relayKey = getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
        state.running = true; state.result = null; state.progress = null; state.elapsedMs = 0;
        const startedAt = performance.now();
        const timer = setInterval(() => { state.elapsedMs = performance.now() - startedAt; }, 1000);
        try {
            const operation = postHistoryRelayFullScanService.start({
                ownerPubkeyHex: current.ownerPubkeyHex, rxNostr: current.rxNostr, relayConfig: current.relayConfig,
                getCurrentScope: input.getScope,
                onProgress: (progress) => { if (!destroyed) state.progress = progress; },
            });
            task = operation;
            const result = await operation.promise;
            if (destroyed) return;
            state.result = result; state.elapsedMs = performance.now() - startedAt;
            if (sameOwner() && input.getShow() && result.status !== "stale-cancelled") await input.onSettled(result);
        } finally {
            clearInterval(timer); task = null;
            if (!destroyed) state.running = false;
        }
    }
    $effect(() => {
        const show = input.getShow();
        const current = input.getScope();
        const key = getPostHistoryAuthoredRelayScopeKey(current.relayConfig);
        untrack(() => {
            if (task && owner && (current.ownerPubkeyHex !== owner.ownerPubkeyHex || current.rxNostr !== owner.rxNostr || key !== relayKey)) task.cancel(true);
            if (!show) setOpen(false);
        });
    });
    onDestroy(() => { destroyed = true; task?.cancel(); });
    return { state, setOpen, start, cancel: () => task?.cancel() };
}
