import type { EventPacket, RxNostr, RxNostrUseOptions, RxReq } from "rx-nostr";
import { Observable, Subscription } from "rxjs";
import { RelayConfigUtils } from "../relayConfigUtils";
import { RelayOperation, createRelayQueryCompletion, RELAY_QUERY_TIMEOUT_MS, type RelayClock, type RelayEnd } from "./operation";

export const SERVER_LIST_PREPARATION_TIMEOUT_MS = 10_000;
export const SERVER_LIST_AUTH_TIMEOUT_MS = 30_000;
const SERVER_LIST_RESPONSE_TIMEOUT_MS = 4_000;
const SERVER_LIST_HARD_TIMEOUT_MS = SERVER_LIST_PREPARATION_TIMEOUT_MS + SERVER_LIST_AUTH_TIMEOUT_MS + SERVER_LIST_RESPONSE_TIMEOUT_MS;

export interface RelayQuerySummary {
    reason: RelayEnd;
    complete: boolean;
    phase?: "preparation" | "response" | "auth";
    authPending?: boolean;
    eoseRelays: string[];
}
export interface RelayQueryPolicy<T> extends RelayClock {
    timeoutMs?: number;
    deadlineAt?: number;
    quorum?: boolean;
    signal?: AbortSignal;
    operation?: RelayOperation;
    source?: (req: RxReq, options?: Partial<RxNostrUseOptions>) => Observable<T>;
    onEnd?: (result: RelayQuerySummary) => void;
}

/** Finite backward requests only. The caller retains filtering, selection and persistence. */
export function useRelayQuery<T extends EventPacket = EventPacket>(
    rx: RxNostr, req: RxReq, options?: Partial<RxNostrUseOptions>, policy: RelayQueryPolicy<T> = {},
): Observable<T> {
    return new Observable<T>(subscriber => {
        const resources = new Subscription();
        const on = options?.on;
        const defaults = typeof rx.getDefaultRelays === "function" ? Object.values(rx.getDefaultRelays()) : [];
        const relays = RelayConfigUtils.sanitizeExternalRelayUrls([
            ...(on?.relays ?? options?.relays ?? []),
            ...((!options || on?.defaultReadRelays) ? defaults.filter(r => r.read).map(r => r.url) : []),
            ...(on?.defaultWriteRelays ? defaults.filter(r => r.write).map(r => r.url) : []),
        ]);
        // A supplied source may be an injected transport without a default-relay inventory.
        const targets: Array<string | undefined> = relays.length ? relays : [undefined];
        const states = targets.map((relay, index) => ({ relay, requestId: `${req.rxReqId}-${index}`, eoseReceived: false, verificationDrained: false, finished: false, failed: false, eoseIds: new Set<string>() }));
        let expectedRequests = 0;
        let ended = false;
        let lastError: unknown;
        let operation: RelayOperation | undefined;
        subscriber.add(() => {
            resources.unsubscribe();
            if (!policy.operation) operation?.finish("cancelled");
        });
        const finish = (reason: RelayEnd) => {
            if (ended) return;
            ended = true;
            resources.unsubscribe();
            policy.onEnd?.({ reason, complete: states.every(s => s.eoseReceived && s.verificationDrained),
                eoseRelays: states.flatMap(s => s.relay && s.eoseReceived && s.verificationDrained ? [s.relay] : []) });
            if (reason === "error") subscriber.error(lastError ?? new Error("relay_query_failed"));
            else subscriber.complete();
        };
        const timeoutMs = Math.max(1, policy.timeoutMs ?? RELAY_QUERY_TIMEOUT_MS);
        operation = policy.operation ?? new RelayOperation(timeoutMs, finish, policy);
        const owner = operation;
        if (policy.deadlineAt !== undefined && !policy.operation) owner.setDeadline(Math.min(owner.startedAt + timeoutMs, policy.deadlineAt));
        if (policy.operation && policy.deadlineAt !== undefined) {
            const childDeadline = {};
            owner.schedule(childDeadline, policy.deadlineAt, () => finish("timeout"));
            resources.add(() => owner.unschedule(childDeadline));
        }
        const detach = owner.add(() => finish(owner.reason ?? "cancelled"));
        resources.add(detach);
        if (!policy.operation) owner.bind(policy.signal);
        const reconcile = createRelayQueryCompletion(owner, states, policy.quorum !== false,
            reason => policy.operation ? finish(reason) : owner.finish(reason));
        if (owner.reason) return;
        if (req.getReqPacketObservable) resources.add(req.getReqPacketObservable().subscribe({ next: () => { expectedRequests++; for (const state of states) state.eoseReceived = state.eoseIds.size >= expectedRequests; } }));
        const split = policy.quorum !== false && typeof rx.createAllMessageObservable === "function" && relays.length > 0;
        if (!split) for (const state of states) state.requestId = req.rxReqId;
        if (rx.createAllMessageObservable) resources.add(rx.createAllMessageObservable().subscribe({ next: packet => {
            if (packet.type !== "EOSE" || !packet.subId) return;
            const state = states.find(s => s.relay === RelayConfigUtils.normalizeExternalRelayUrl(packet.from));
            if (!state) return;
            const prefix = `${state.requestId}:`;
            if (!packet.subId.startsWith(prefix)) return;
            const suffix = packet.subId.slice(prefix.length);
            const index = Number(suffix);
            if (!Number.isSafeInteger(index) || index < 0 || index >= Math.max(1, expectedRequests) || String(index) !== suffix) return;
            state.eoseIds.add(packet.subId);
            state.eoseReceived = state.eoseIds.size >= Math.max(1, expectedRequests);
            reconcile();
        } }));
        for (const group of split ? states.map(state => [state]) : [states]) {
            if (ended) break;
            const targetOptions = split ? { on: { relays: [group[0].relay!] } }
                : relays.length ? { on: { relays } } : options;
            const scopedReq = split ? { ...req, rxReqId: group[0].requestId } : req;
            const source = policy.source ? policy.source(scopedReq, targetOptions) : (targetOptions === undefined ? rx.use(scopedReq) : rx.use(scopedReq, targetOptions)) as Observable<T>;
            resources.add(source.subscribe({
                next: packet => { if (!ended) subscriber.next(packet); },
                error: error => { lastError = error; for (const state of group) { state.finished = true; state.failed = true; } reconcile(); },
                complete: () => { for (const state of group) { state.finished = true; state.verificationDrained = true; } reconcile(); },
            }));
        }
        if (!expectedRequests && states.every(state => state.finished)) {
            const reason = states.every(state => state.failed) ? "error" : "complete";
            if (policy.operation) finish(reason); else owner.finish(reason);
        }

    });
}

/** Explicit user-triggered list synchronization has preparation and AUTH phases. */
export function usePreparedRelayQuery(rx: RxNostr, req: RxReq, relays: string[], policy: RelayQueryPolicy<EventPacket>): Observable<EventPacket> {
    return new Observable(subscriber => {
        const resources = new Subscription();
        const operation = new RelayOperation(SERVER_LIST_PREPARATION_TIMEOUT_MS, () => subscriber.complete());
        const pending = new Set(relays);
        const pendingAuth = new Set<string>();
        const hardDeadline = operation.startedAt + SERVER_LIST_HARD_TIMEOUT_MS;
        let authDeadline: number | undefined;
        const responseDeadline = () => {
            const deadline = pending.size ? operation.startedAt + SERVER_LIST_PREPARATION_TIMEOUT_MS
                : pendingAuth.size ? authDeadline! : operation.now() + (policy.timeoutMs ?? SERVER_LIST_RESPONSE_TIMEOUT_MS);
            operation.setDeadline(Math.min(hardDeadline, deadline));
        };
        operation.bind(policy.signal);
        if (operation.reason) return;
        if (rx.createOutgoingMessageObservable) {
            resources.add(rx.createOutgoingMessageObservable().subscribe({ next: packet => {
                if (packet.message[0] !== "REQ" || !String(packet.message[1]).startsWith(`${req.rxReqId}:`)) return;
                const relay = RelayConfigUtils.normalizeExternalRelayUrl(packet.to);
                if (!relay || !relays.includes(relay)) return;
                const dispatched = pending.delete(relay);
                const resumed = pendingAuth.delete(relay);
                if (dispatched || resumed) responseDeadline();
            } }));
            if (rx.createAllMessageObservable) resources.add(rx.createAllMessageObservable().subscribe({ next: packet => {
                if (packet.type !== "CLOSED" || !packet.subId?.startsWith(`${req.rxReqId}:`) || !packet.notice?.startsWith("auth-required:")) return;
                const relay = RelayConfigUtils.normalizeExternalRelayUrl(packet.from);
                if (!relay || !relays.includes(relay)) return;
                pendingAuth.add(relay);
                authDeadline ??= operation.now() + SERVER_LIST_AUTH_TIMEOUT_MS;
                responseDeadline();
            } }));
        } else operation.setDeadline(operation.startedAt + (policy.timeoutMs ?? SERVER_LIST_RESPONSE_TIMEOUT_MS));
        resources.add(useRelayQuery(rx, req, { on: { relays } }, { ...policy, quorum: false, operation,
            onEnd: summary => policy.onEnd?.({ ...summary, phase: pending.size ? "preparation" : pendingAuth.size ? "auth" : "response", authPending: pendingAuth.size > 0 }),
        }).subscribe({
            next: packet => subscriber.next(packet), error: error => subscriber.error(error), complete: () => subscriber.complete(),
        }));
        operation.add(() => resources.unsubscribe());
        return () => { resources.unsubscribe(); operation.finish("cancelled"); };
    });
}
