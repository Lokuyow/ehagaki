import type { Observable } from "rxjs";
import type { RelayDeliveryEvent, RelayDeliveryProgress } from "./deliveryProgress";

export interface RelayDeliveryToast { progress: RelayDeliveryProgress; fading: boolean; fadeMs: number }

/** Presentation timers only. Dismissing a row never touches the transport. */
export function createRelayDeliveryToasts(source: Observable<RelayDeliveryEvent>, onChange: (rows: RelayDeliveryToast[]) => void) {
    const rows = new Map<number, RelayDeliveryToast>();
    const hidden = new Set<number>();
    const timers = new Map<number, ReturnType<typeof setTimeout>>();
    const notify = () => onChange([...rows.values()]);
    const remove = (id: number) => {
        clearTimeout(timers.get(id)); timers.delete(id); rows.delete(id);
    };
    const clear = () => {
        for (const id of rows.keys()) remove(id);
        hidden.clear(); notify();
    };
    const fade = (id: number, duration: number) => {
        const row = rows.get(id);
        if (!row) return;
        clearTimeout(timers.get(id));
        rows.set(id, { ...row, fading: true, fadeMs: duration }); notify();
        timers.set(id, setTimeout(() => { remove(id); notify(); }, duration));
    };
    const subscription = source.subscribe(event => {
        if (event.type === "reset") { clear(); return; }
        const progress = event.progress;
        if (hidden.has(progress.id)) {
            if (progress.state !== "sending") hidden.delete(progress.id);
            return;
        }
        if (progress.state === "cancelled") { remove(progress.id); notify(); return; }
        const previous = rows.get(progress.id);
        rows.set(progress.id, { progress, fading: false, fadeMs: 0 });
        if (rows.size > 3) {
            const oldest = rows.keys().next().value!;
            hidden.add(oldest); remove(oldest);
        }
        notify();
        if (progress.state === "complete" && previous?.progress.state !== "complete") {
            clearTimeout(timers.get(progress.id));
            timers.set(progress.id, setTimeout(() => fade(progress.id, 150), 250));
        } else if (progress.state === "incomplete" && previous?.progress.state !== "incomplete") fade(progress.id, 300);
        else if (progress.state === "sending" && !progress.discovering && progress.accepted > 0
            && (!previous || previous.progress.discovering || previous.progress.accepted !== progress.accepted)) {
            clearTimeout(timers.get(progress.id));
            timers.set(progress.id, setTimeout(() => {
                // A stalled display can retire while the session keeps delivering.
                hidden.add(progress.id);
                fade(progress.id, 300);
            }, 1500));
        }
    });
    return {
        dismiss(id: number) { if (rows.get(id)?.progress.state === "sending") hidden.add(id); remove(id); notify(); },
        dispose() { subscription.unsubscribe(); clear(); },
    };
}
