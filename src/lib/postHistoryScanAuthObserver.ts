import type { RxNostr } from "rx-nostr";
import { RelayConfigUtils } from "./relayConfigUtils";

export type PostHistoryScanAuthResult = "success" | "rejected" | "timeout" | "cancelled";

/** Observe existing AUTH transport; never creates, signs or sends an AUTH. */
export function observePostHistoryScanAuth(rxNostr: RxNostr, relayUrls: string[], now = Date.now) {
    let disposed = false;
    const states = new Map(relayUrls.map((url) => [url, {
        ids: new Set<string>(), successAt: null as number | null, rejected: false, listeners: new Set<() => void>(),
    }]));
    const stateFor = (url: string) => states.get(RelayConfigUtils.normalizeExternalRelayUrl(url) ?? "");
    const clear = (state: NonNullable<ReturnType<typeof stateFor>>) => {
        state.ids.clear(); state.successAt = null; state.rejected = false;
    };
    const subscriptions = [
        rxNostr.createOutgoingMessageObservable?.().subscribe((packet) => {
            const state = stateFor(packet.to);
            const message: unknown = packet.message;
            if (!state || !Array.isArray(message) || message[0] !== "AUTH") return;
            const event: unknown = message[1];
            if (!event || typeof event !== "object" || !("id" in event) || typeof event.id !== "string") return;
            state.ids.add(event.id);
            state.rejected = false;
            while (state.ids.size > 4) state.ids.delete(state.ids.keys().next().value!);
        }),
        rxNostr.createAllMessageObservable?.().subscribe((packet) => {
            const state = stateFor(packet.from);
            if (!state) return;
            if (packet.type === "AUTH") clear(state);
            if (packet.type === "OK" && state.ids.delete(packet.eventId)) {
                if (packet.ok) state.successAt = now();
                else state.rejected = true;
            }
            state.listeners.forEach((notify) => notify());
        }),
        rxNostr.createConnectionStateObservable?.().subscribe((packet) => {
            if (packet.state !== "connected") {
                const state = stateFor(packet.from);
                if (state) clear(state);
                state?.listeners.forEach((notify) => notify());
            }
        }),
    ];
    return {
        wait(relayUrl: string, timeoutMs: number, signal: AbortSignal, deadlineAt = now() + timeoutMs): Promise<PostHistoryScanAuthResult> {
            return new Promise((resolve) => {
                const state = stateFor(relayUrl);
                let timer: ReturnType<typeof setTimeout> | undefined;
                let settled = false;
                const finish = (result: PostHistoryScanAuthResult) => {
                    if (settled) return;
                    settled = true;
                    if (timer !== undefined) clearTimeout(timer);
                    state?.listeners.delete(check); signal.removeEventListener("abort", cancel);
                    resolve(result);
                };
                const cancel = () => finish("cancelled");
                const check = () => {
                    if (disposed || signal.aborted) { cancel(); return; }
                    if (state?.successAt !== null && state?.successAt !== undefined) finish(state.successAt <= deadlineAt ? "success" : "timeout");
                    else if (state?.rejected && !state.ids.size) finish("rejected");
                };
                state?.listeners.add(check); signal.addEventListener("abort", cancel, { once: true });
                timer = setTimeout(() => finish("timeout"), Math.max(1, Math.min(timeoutMs, deadlineAt - now())));
                check();
            });
        },
        dispose() {
            disposed = true; subscriptions.forEach((subscription) => subscription?.unsubscribe());
            states.forEach((state) => state.listeners.forEach((notify) => notify())); states.clear();
        },
    };
}
