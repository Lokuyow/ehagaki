import type { Observable } from "rxjs";
import type { RelayDeliveryEvent, RelayDeliveryProgress } from "./deliveryProgress";

export interface RelayDeliveryToast { progress: RelayDeliveryProgress; fading: boolean; fadeMs: number }

/** Presentation timers only. Dismissing a row never touches the transport. */
export function createRelayDeliveryToasts(source: Observable<RelayDeliveryEvent>, onChange: (rows: RelayDeliveryToast[]) => void, onReady: (id: number) => void = () => {}) {
    const rows = new Map<number, RelayDeliveryToast>();
    const hidden = new Set<number>();
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    const signalled = new Set<number>();
    const signal = (id: number) => { if (!signalled.has(id)) { signalled.add(id); onReady(id); } };
    const notify = () => onChange([...rows.values()].filter(row => !hidden.has(row.progress.id)));
    const remove = (id: number) => {
        clearTimeout(timers.get(id)); timers.delete(id); rows.delete(id);
    };
    const clear = () => {
        for (const id of rows.keys()) remove(id);
        hidden.clear(); signalled.clear(); notify();
    };
    const fade = (id: number, duration: number) => {
        const row = rows.get(id);
        if (!row) return;
        clearTimeout(timers.get(id));
        rows.set(id, { ...row, fading: true, fadeMs: duration }); notify();
        timers.set(id, setTimeout(() => {
            if (rows.get(id)?.progress.state === "sending") hidden.add(id);
            else signalled.delete(id);
            remove(id); notify();
        }, duration));
    };
    const subscription = source.subscribe(event => {
        if (event.type === "reset") { clear(); return; }
        const progress = event.progress;
        if (hidden.has(progress.id) && !rows.has(progress.id)) {
            if (progress.state !== "sending") { hidden.delete(progress.id); signalled.delete(progress.id); }
            return;
        }
        if (progress.state === "cancelled") { remove(progress.id); hidden.delete(progress.id); signalled.delete(progress.id); notify(); return; }
        const previous = rows.get(progress.id);
        if (previous?.fading && signalled.has(progress.id)) {
            if (progress.state !== "sending") rows.set(progress.id, { ...previous,
                progress: { ...previous.progress, state: "incomplete" } });
            return;
        }
        rows.set(progress.id, { progress, fading: false, fadeMs: 0 });
        const visible = [...rows.keys()].filter(id => !hidden.has(id));
        if (visible.length > 3) hidden.add(visible[0]);
        notify();
        if (progress.state !== "sending") {
            signal(progress.id);
            if (hidden.has(progress.id)) { remove(progress.id); hidden.delete(progress.id); signalled.delete(progress.id); return; }
        }
        if (progress.state === "complete" && previous?.progress.state !== "complete") {
            clearTimeout(timers.get(progress.id));
            timers.set(progress.id, setTimeout(() => fade(progress.id, 150), 250));
        } else if (progress.state === "incomplete" && previous?.progress.state !== "incomplete") fade(progress.id, 300);
        else if (progress.state === "sending" && !progress.discovering && progress.accepted > 0
            && (!previous || previous.progress.discovering || previous.progress.accepted !== progress.accepted)) {
            clearTimeout(timers.get(progress.id));
            timers.set(progress.id, setTimeout(() => {
                // A stalled display can retire while the session keeps delivering.
                signal(progress.id);
                if (hidden.has(progress.id)) { remove(progress.id); return; }
                fade(progress.id, 300);
            }, 2000));
        }
    });
    return {
        dismiss(id: number) {
            if (rows.get(id)?.progress.state === "sending") hidden.add(id);
            else { remove(id); hidden.delete(id); signalled.delete(id); }
            notify();
        },
        dispose() { subscription.unsubscribe(); clear(); },
    };
}
