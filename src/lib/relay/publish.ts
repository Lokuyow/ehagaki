import { noopSigner, type RxNostr, type EventSigner } from "rx-nostr";
import { Subscription } from "rxjs";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { PostResult, RelayRejection, RelayRejectionCategory } from "../types";
import { RelayOperation, type RelayEnd } from "./operation";

export interface RelayPublishTask { acknowledged: Promise<PostResult>; settled: Promise<PostResult>; cancel(): void }
export interface RelayPublishOptions {
    signer?: EventSigner;
    targetRelays: string[];
    on?: NonNullable<Parameters<RxNostr["send"]>[1]>["on"];
    waitForAllRelays?: boolean;
    deadlineAt?: number;
    authDeadlineAt?: number;
    initialMs?: number;
    authMs?: number;
    settleSignal?: AbortSignal;
    operation?: RelayOperation;
    onProgress?: (result: PostResult) => void;
    onSettled?: (result: PostResult) => void;
}

const operations = new WeakMap<RxNostr, Set<RelayOperation>>();
export function cancelRelayOperations(rx: RxNostr): void {
    for (const operation of operations.get(rx) ?? []) operation.finish("cancelled");
}
export function ownRelayOperation(rx: RxNostr, operation: RelayOperation): void {
    let active = operations.get(rx);
    if (!active) operations.set(rx, active = new Set());
    active.add(operation);
    operation.add(() => active.delete(operation));
}

export function relayRejectionCategory(notice: unknown): RelayRejectionCategory {
    const prefix = typeof notice === "string" ? notice.split(":", 1)[0].trim().toLowerCase() : "";
    return ["auth-required", "restricted", "blocked", "rate-limited", "duplicate", "invalid", "pow", "error", "mute", "unsupported"].includes(prefix)
        ? prefix as RelayRejectionCategory : "unknown";
}

/** Resolving acknowledged never tears down delivery. Only settled releases the transport. */
export function startRelayPublish(rx: RxNostr, event: Parameters<RxNostr["send"]>[0], options: RelayPublishOptions): RelayPublishTask {
    const resources = new Subscription();
    const accepted = new Set<string>();
    const rejected = new Map<string, RelayRejection>();
    const authRequired = new Set<string>();
    const pendingAuth = new Set<string>();
    let done = false;
    let acknowledged = false;
    let eventId = event.id;
    let resolveAck!: (result: PostResult) => void;
    let resolveSettled!: (result: PostResult) => void;
    const task: RelayPublishTask = { acknowledged: new Promise(resolve => { resolveAck = resolve; }),
        settled: new Promise(resolve => { resolveSettled = resolve; }), cancel: () => finish("cancelled") };
    const snapshot = (final: boolean, reason?: RelayEnd): PostResult => {
        const pending = options.targetRelays.filter(relay => !accepted.has(relay) && !rejected.has(relay));
        const success = accepted.size > 0;
        return { success, ...(success ? { eventId } : { error: reason === "error" ? "post_network_error"
            : pending.length || !rejected.size ? "post_timeout" : "post_rejected" }),
            acceptedRelays: [...accepted],
            ...(!final && (pending.length || !options.targetRelays.length) ? { deliveryPending: true } : {}),
            ...(rejected.size ? { rejectedRelays: [...rejected.values()] } : {}),
            ...(final && pending.length && reason !== "cancelled" && reason !== "error" ? { timedOutRelays: pending } : {}),
            ...(authRequired.size ? { authRequiredRelays: [...authRequired] } : {}) };
    };
    const finish = (reason: RelayEnd) => {
        if (done) return;
        done = true;
        resources.unsubscribe();
        const result = snapshot(true, reason);
        if (!options.operation) operation.finish(reason);
        if (!acknowledged) { acknowledged = true; resolveAck(result); }
        resolveSettled(result);
        options.onSettled?.(result);
    };
    const operation = options.operation ?? new RelayOperation(options.initialMs ?? 12_000, finish);
    if (!options.operation) {
        ownRelayOperation(rx, operation);
        if (options.deadlineAt !== undefined) operation.setDeadline(options.deadlineAt);
    }
    resources.add(operation.add(() => finish(operation.reason ?? "cancelled")));
    const cancel = () => finish("cancelled");
    options.settleSignal?.addEventListener("abort", cancel, { once: true });
    resources.add(() => options.settleSignal?.removeEventListener("abort", cancel));
    if (options.settleSignal?.aborted || operation.reason) { finish("cancelled"); return task; }
    try {
        resources.add(rx.send(event, { signer: options.signer ?? noopSigner(), completeOn: "all-ok", ...(options.on ? { on: options.on } : {}) }).subscribe({
            next: packet => {
                if (done) return;
                const relay = RelayConfigUtils.normalizeExternalRelayUrl(packet.from) ?? packet.from;
                if (!relay || options.targetRelays.length && !options.targetRelays.includes(relay)) return;
                eventId = event.id ?? packet.eventId ?? eventId;
                if (!packet.done) {
                    if (!packet.ok && relayRejectionCategory(packet.notice) === "auth-required") {
                        authRequired.add(relay); pendingAuth.add(relay);
                        operation.setDeadline(options.authDeadlineAt ?? operation.startedAt + (options.authMs ?? 30_000));
                    }
                } else if (packet.ok) {
                    accepted.add(relay); rejected.delete(relay); pendingAuth.delete(relay);
                } else if (!accepted.has(relay)) {
                    pendingAuth.delete(relay);
                    rejected.set(relay, { relay, category: relayRejectionCategory(packet.notice), ...(packet.notice ? { reason: packet.notice } : {}) });
                }
                options.onProgress?.(snapshot(false));
                if (accepted.size && !acknowledged && !options.waitForAllRelays) {
                    acknowledged = true;
                    // UI operation cleanup must not cancel an acknowledged session delivery.
                    options.settleSignal?.removeEventListener("abort", cancel);
                    resolveAck({ ...snapshot(false), deliverySettled: task.settled });
                }
                if (options.targetRelays.length && !pendingAuth.size && options.targetRelays.every(r => accepted.has(r) || rejected.has(r))) finish("complete");
            },
            error: () => finish("error"),
            complete: () => finish("complete"),
        }));
    } catch { finish("error"); }
    return task;
}
