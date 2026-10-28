import type { RxNostr } from "rx-nostr";
import { Observable, Subject } from "rxjs";
import { RelayConfigUtils } from "../relayConfigUtils";

export interface RelayDeliveryProgress {
    id: number;
    total: number;
    accepted: number;
    discovering: boolean;
    state: "sending" | "complete" | "incomplete" | "cancelled";
}
export type RelayDeliveryEvent = { type: "progress"; progress: RelayDeliveryProgress } | { type: "reset" };
interface DeliverySession { active: Map<number, RelayDeliveryProgress>; events: Subject<RelayDeliveryEvent> }
const sessions = new WeakMap<RxNostr, DeliverySession>();
let nextId = 0;
function sessionFor(rx: RxNostr): DeliverySession {
    let session = sessions.get(rx);
    if (!session) sessions.set(rx, session = { active: new Map(), events: new Subject() });
    return session;
}

/** A presentation stream, backed by the existing transport subscription only. */
export function observeRelayDeliveries(rx: RxNostr): Observable<RelayDeliveryEvent> {
    return new Observable(subscriber => {
        const session = sessionFor(rx);
        for (const progress of session.active.values()) subscriber.next({ type: "progress", progress });
        return session.events.subscribe(subscriber);
    });
}
export function resetRelayDeliveries(rx: RxNostr): void {
    const session = sessions.get(rx);
    session?.active.clear();
    session?.events.next({ type: "reset" });
}

/** One tracker per user operation; staged sends share their owner's tracker. */
export function beginRelayDelivery(rx: RxNostr, targets: readonly string[], discovering = false) {
    const session = sessionFor(rx);
    const id = ++nextId;
    let unresolved = false;
    let ended = false;
    let progress: RelayDeliveryProgress = { id, total: RelayConfigUtils.sanitizeExternalRelayUrls([...targets]).length,
        accepted: 0, discovering, state: "sending" };
    const emit = () => {
        session.active.set(id, progress);
        session.events.next({ type: "progress", progress });
    };
    emit();
    return {
        update(targets: readonly string[], accepted: readonly string[], discovering = false, unresolvedRoutes = false) {
            if (ended || !session.active.has(id)) return;
            const unique = new Set(RelayConfigUtils.sanitizeExternalRelayUrls([...targets]));
            const count = RelayConfigUtils.sanitizeExternalRelayUrls([...accepted]).filter(relay => unique.has(relay)).length;
            unresolved = unresolvedRoutes;
            if (progress.total === unique.size && progress.accepted === count && progress.discovering === discovering) return;
            progress = { ...progress, total: unique.size, accepted: count, discovering };
            emit();
        },
        finish(cancelled = false) {
            if (ended) return;
            ended = true;
            if (!session.active.delete(id)) return;
            progress = { ...progress, state: cancelled ? "cancelled"
                : !unresolved && !progress.discovering && progress.total > 0 && progress.accepted === progress.total ? "complete" : "incomplete" };
            session.events.next({ type: "progress", progress });
        },
    };
}
