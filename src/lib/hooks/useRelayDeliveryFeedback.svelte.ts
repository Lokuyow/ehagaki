import { untrack } from "svelte";
import type { RxNostr } from "rx-nostr";
import { getAppRuntimeEnvironment } from "../appRuntimeEnvironment";
import { observeRelayDeliveries } from "../relay/deliveryProgress";
import { createRelayDeliveryToasts, type RelayDeliveryToast } from "../relay/deliveryToasts";
import { getActiveDeliveryDialog } from "../relay/deliveryToastPosition";

export function useRelayDeliveryFeedback(getRx: () => RxNostr | undefined, showMascot: () => boolean) {
    let rows = $state<RelayDeliveryToast[]>([]);
    let newest = $state(0);
    let modal = $state(false);
    let controller: ReturnType<typeof createRelayDeliveryToasts> | undefined;
    $effect(() => {
        const rx = getRx();
        if (!rx) { rows = []; return; }
        const current = untrack(() => createRelayDeliveryToasts(observeRelayDeliveries(rx), next => {
            rows = next;
            newest = Math.max(newest, ...next.map(row => row.progress.id));
        }));
        controller = current;
        return () => { current.dispose(); controller = undefined; };
    });
    $effect(() => {
        const runtime = getAppRuntimeEnvironment();
        const update = () => { modal = !!getActiveDeliveryDialog(runtime); };
        const observer = new MutationObserver(update);
        if (runtime.domRoot) observer.observe(runtime.domRoot, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state", "aria-hidden"] });
        update();
        return () => observer.disconnect();
    });
    const useMascot = $derived(showMascot() && !modal);
    return {
        get mascot() { return useMascot ? rows.find(row => row.progress.id === newest) : undefined; },
        get bars() { return useMascot ? [] : rows; },
        dismiss(id: number) { controller?.dismiss(id); },
    };
}
