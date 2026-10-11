import { createRxBackwardReq, createRxNostr, noopSigner, type RxNostr } from "rx-nostr";
import { verifier } from "@rx-nostr/crypto";
import { matchFilter, type Filter } from "nostr-tools";
import { Subscription } from "rxjs";
import { postHistoryRelayFetchService, POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
    type PostHistoryRelayFetchRequest } from "./postHistoryRelayFetchService";
import { usePostHistoryRelayEvents, type AttestedPostHistoryRawEvent } from "./postHistoryRawEventVerification";
import type { NostrEvent } from "./types";
import { diagnosticErrorType, diagnosticRelayReason, getLocalRelayDiagnosticAbortReason,
    type LocalRelayDiagnosticTrace, type LocalRelayDiagnosticReason } from "./localRelayDiagnostics";

export interface LocalRelayTask<T> { promise: Promise<T | null>; cancel(): void }
export interface LocalRelayPage {
    events: AttestedPostHistoryRawEvent[];
    fetchedAt: number;
    nextUntil: number | null;
    hasMore: boolean;
}

/** An operation owns its socket. No external pool, AUTH, retries or pending deliveries. */
export class LocalRelayTransport {
    constructor(private createClient: typeof createRxNostr = createRxNostr) {}

    private run<T>(url: string, signal: AbortSignal, work: (rx: RxNostr, signal: AbortSignal) => Promise<T>, trace?: LocalRelayDiagnosticTrace): LocalRelayTask<T> {
        const abort = new AbortController();
        const cancel = () => abort.abort();
        let abortReason: LocalRelayDiagnosticReason | undefined;
        const parentCancelled = () => { abortReason = getLocalRelayDiagnosticAbortReason(signal); cancel(); };
        const diagnosticSubscriptions = new Subscription();
        let client: RxNostr | undefined;
        let messages: { unsubscribe(): void } | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let resolveCancelled: (value: null) => void = () => undefined;
        const cancelled = new Promise<null>((resolve) => { resolveCancelled = resolve; });
        abort.signal.addEventListener("abort", () => resolveCancelled(null), { once: true });
        signal.addEventListener("abort", parentCancelled, { once: true });
        if (signal.aborted) parentCancelled();
        const promise = (async (): Promise<T | null> => {
            if (abort.signal.aborted) { trace?.finish("aborted", { reason: abortReason }); return null; }
            try {
                trace?.record("client-creation-started");
                client = this.createClient({ verifier, signer: noopSigner(), skipVerify: false,
                    skipFetchNip11: true, retry: { strategy: "off" } });
                trace?.record("client-created");
                if (trace) {
                    diagnosticSubscriptions.add(client.createConnectionStateObservable().subscribe(({ state }) => trace.record("websocket-state", { state })));
                    diagnosticSubscriptions.add(client.createOutgoingMessageObservable().subscribe(({ message }) => {
                        // rx-nostr emits this immediately before native socket.send().
                        // It is a send boundary, not proof of relay receipt; OK is that proof.
                        if (message[0] === "EVENT") trace.record("event-socket-send-boundary", { kind: message[1].kind, eventId: message[1].id });
                    }));
                    diagnosticSubscriptions.add(client.createAllErrorObservable().subscribe(({ reason }) => trace.record("websocket-error", { errorType: diagnosticErrorType(reason) })));
                }
                messages = client.createAllMessageObservable().subscribe(({ type, message }) => {
                    if (type === "OK") trace?.record("relay-response", { eventId: message[1], ok: message[2], noticePresent: !!message[3], reason: diagnosticRelayReason(message[3]) });
                    if (type === "AUTH" || (Array.isArray(message) && message[0] === "CLOSED"
                        && typeof message[2] === "string" && message[2].startsWith("auth-required:"))) {
                        abortReason = "auth-required"; trace?.record("relay-response", { reason: abortReason }); cancel();
                    }
                });
                timer = setTimeout(() => { abortReason = "timeout-abort"; cancel(); }, POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS);
                const result = await Promise.race([work(client, abort.signal), cancelled]);
                if (abort.signal.aborted) trace?.finish(abortReason === "timeout-abort" ? "timeout" : "aborted", { reason: abortReason ?? "transport-local-abort" });
                else trace?.finish(result === true ? "accepted" : "rejected");
                return result;
            } catch (error) {
                trace?.finish("exception", { errorType: diagnosticErrorType(error) });
                return null;
            } finally {
                cancel();
                if (timer !== undefined) clearTimeout(timer);
                signal.removeEventListener("abort", parentCancelled);
                messages?.unsubscribe();
                client?.dispose();
                diagnosticSubscriptions.unsubscribe();
                trace?.record("transport-disposed");
            }
        })();
        return { promise, cancel };
    }

    fetchAuthored(url: string, request: PostHistoryRelayFetchRequest, signal: AbortSignal): LocalRelayTask<LocalRelayPage> {
        return this.run(url, signal, async (rx, operationSignal) => {
            const task = postHistoryRelayFetchService.fetchRelayPage(rx, { ...request, relayUrl: url,
                timeoutMs: POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS });
            const cancel = () => task.cancel();
            operationSignal.addEventListener("abort", cancel, { once: true });
            if (operationSignal.aborted) cancel();
            const result = await task.promise.finally(() => operationSignal.removeEventListener("abort", cancel));
            if (result.status !== "success") throw new Error("local_relay_fetch_failed");
            // Transport provenance and query coverage deliberately stop here.
            return { events: result.events.flatMap(({ event, attestation }) => attestation ? [{ event, attestation }] : []),
                fetchedAt: result.fetchedAt, nextUntil: result.nextUntil, hasMore: result.hasMore };
        });
    }

    fetchRelated(url: string, filter: Filter, signal: AbortSignal): LocalRelayTask<AttestedPostHistoryRawEvent[]> {
        return this.run(url, signal, async (rx, operationSignal) => {
            const request = createRxBackwardReq();
            const events = new Map<string, AttestedPostHistoryRawEvent>();
            return new Promise<AttestedPostHistoryRawEvent[]>((resolve) => {
                let subscription: { unsubscribe(): void } | undefined;
                const finish = () => {
                    subscription?.unsubscribe();
                    operationSignal.removeEventListener("abort", finish);
                    resolve([...events.values()]);
                };
                operationSignal.addEventListener("abort", finish, { once: true });
                subscription = usePostHistoryRelayEvents(rx, request, { on: { relays: [url] } }).subscribe({
                    next: ({ event, attestation }) => {
                        if (!operationSignal.aborted && matchFilter(filter, event) && events.size < (filter.limit ?? 150)) events.set(event.id, { event, attestation });
                    }, complete: finish, error: finish,
                });
                if (operationSignal.aborted) { finish(); return; }
                request.emit(filter);
                request.over();
            });
        });
    }

    storeSignedEvent(url: string, event: NostrEvent, signal: AbortSignal): LocalRelayTask<boolean> {
        return this.storeSignedEvents(url, [event], signal);
    }

    /** One finite batch shares one client/relay connection until its ACKs settle. */
    storeSignedEvents(url: string, events: NostrEvent[], signal: AbortSignal, trace?: LocalRelayDiagnosticTrace): LocalRelayTask<boolean> {
        trace?.record("transport-entered", { count: events.length });
        trace?.record("relay-target", { target: url });
        const uniqueEvents = [...new Map(events.map(event => [event.id, event])).values()];
        if (!uniqueEvents.length) {
            trace?.finish(signal.aborted ? "aborted" : "filtered", { reason: signal.aborted ? getLocalRelayDiagnosticAbortReason(signal) : "no-candidates" });
            return { promise: Promise.resolve(signal.aborted ? null : true), cancel() {} };
        }
        return this.run(url, signal, async (rx, operationSignal) => {
            const results = await Promise.all(uniqueEvents.map(event => this.sendSignedEvent(rx, url, event, operationSignal, trace)));
            return results.every(accepted => accepted);
        }, trace);
    }

    private sendSignedEvent(rx: RxNostr, url: string, event: NostrEvent, operationSignal: AbortSignal, trace?: LocalRelayDiagnosticTrace): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const subscription = new Subscription();
            const finish = (accepted = false) => {
                subscription.unsubscribe();
                operationSignal.removeEventListener("abort", cancel);
                resolve(accepted);
            };
            const cancel = () => finish();
            operationSignal.addEventListener("abort", cancel, { once: true });
            if (operationSignal.aborted) { cancel(); return; }
            trace?.record("event-send-attempt", { kind: event.kind, eventId: event.id });
            subscription.add(rx.send(event, { signer: noopSigner(), on: { relays: [url] }, completeOn: "all-ok" }).subscribe({
                next: (packet) => { if (packet.eventId === event.id) finish(packet.ok); },
                error: error => { trace?.finish("exception", { errorType: diagnosticErrorType(error) }); cancel(); }, complete: cancel,
            }));
            trace?.record("event-submitted-rx-nostr", { kind: event.kind, eventId: event.id });
        });
    }
}
