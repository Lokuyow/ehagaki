import { createRxBackwardReq, createRxNostr, noopSigner, type RxNostr } from "rx-nostr";
import { verifier } from "@rx-nostr/crypto";
import { matchFilter, type Filter } from "nostr-tools";
import { Subscription } from "rxjs";
import { postHistoryRelayFetchService, POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS,
    type PostHistoryRelayFetchRequest } from "./postHistoryRelayFetchService";
import { usePostHistoryRelayEvents, type AttestedPostHistoryRawEvent } from "./postHistoryRawEventVerification";
import type { NostrEvent } from "./types";
import type { PostHistoryCoverageRange } from "./postHistoryRelayCoverage";

export interface LocalRelayTask<T> { promise: Promise<T | null>; cancel(): void }
export interface LocalRelayPage {
    events: AttestedPostHistoryRawEvent[];
    fetchedAt: number;
    nextUntil: number | null;
    hasMore: boolean;
    browsingRanges: PostHistoryCoverageRange[];
}

/** An operation owns its socket. No external pool, NIP-42 handshake, retries or pending deliveries. */
export class LocalRelayTransport {
    constructor(private createClient: typeof createRxNostr = createRxNostr) {}

    private run<T>(url: string, signal: AbortSignal, work: (rx: RxNostr, signal: AbortSignal) => Promise<T>): LocalRelayTask<T> {
        const abort = new AbortController();
        const cancel = () => abort.abort();
        let client: RxNostr | undefined;
        let messages: { unsubscribe(): void } | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        let resolveCancelled: (value: null) => void = () => undefined;
        const cancelled = new Promise<null>((resolve) => { resolveCancelled = resolve; });
        abort.signal.addEventListener("abort", () => resolveCancelled(null), { once: true });
        signal.addEventListener("abort", cancel, { once: true });
        if (signal.aborted) cancel();
        const promise = (async (): Promise<T | null> => {
            if (abort.signal.aborted) return null;
            try {
                client = this.createClient({ verifier, signer: noopSigner(), skipVerify: false,
                    skipFetchNip11: true, retry: { strategy: "off" } });
                messages = client.createAllMessageObservable().subscribe(({ message }) => {
                    // Citrine sends an initial AUTH challenge even for unauthenticated localhost I/O.
                    // Ignore challenges without authenticating; only an actual REQ rejection cancels.
                    if (Array.isArray(message) && message[0] === "CLOSED"
                        && typeof message[2] === "string" && message[2].startsWith("auth-required:")) cancel();
                });
                timer = setTimeout(cancel, POST_HISTORY_DIALOG_OPEN_REFRESH_TIMEOUT_MS);
                return await Promise.race([work(client, abort.signal), cancelled]);
            } catch {
                return null;
            } finally {
                cancel();
                if (timer !== undefined) clearTimeout(timer);
                signal.removeEventListener("abort", cancel);
                messages?.unsubscribe();
                client?.dispose();
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
            // Only completed, verification-drained query bounds cross this seam.
            // Local transport URLs never become external coverage/provenance.
            return { events: result.events.flatMap(({ event, attestation }) => attestation ? [{ event, attestation }] : []),
                fetchedAt: result.fetchedAt, nextUntil: result.nextUntil, hasMore: result.hasMore,
                browsingRanges: result.relayFetchCoverage?.flatMap(({ ranges }) => ranges) ?? [] };
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
    storeSignedEvents(url: string, events: NostrEvent[], signal: AbortSignal): LocalRelayTask<boolean> {
        const uniqueEvents = [...new Map(events.map(event => [event.id, event])).values()];
        if (!uniqueEvents.length) return { promise: Promise.resolve(signal.aborted ? null : true), cancel() {} };
        return this.run(url, signal, async (rx, operationSignal) => {
            const results = await Promise.all(uniqueEvents.map(event => this.sendSignedEvent(rx, url, event, operationSignal)));
            return results.every(accepted => accepted);
        });
    }

    private sendSignedEvent(rx: RxNostr, url: string, event: NostrEvent, operationSignal: AbortSignal): Promise<boolean> {
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
            subscription.add(rx.send(event, { signer: noopSigner(), on: { relays: [url] }, completeOn: "all-ok" }).subscribe({
                next: (packet) => { if (packet.eventId === event.id) finish(packet.ok); },
                error: cancel, complete: cancel,
            }));
        });
    }
}
