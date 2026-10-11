import { EMPTY, Observable, Subject } from "rxjs";
import type { EventPacket, MessagePacket, RxNostr, RxReq, RxNostrUseOptions } from "rx-nostr";
import { finalizeEvent, getPublicKey } from "nostr-tools";
import { PostHistoryRelayFullScanService, postHistoryRelayFullScanService } from "../../lib/postHistoryRelayFullScanService";
import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";

export function createPostHistoryFullScanHarness(secret: Uint8Array, scenario: string) {
    const owner = getPublicKey(secret);
    const relayUrls = ["wss://full-scan-a.example/", "wss://full-scan-b.example/"];
    const messages = new Subject<MessagePacket>();
    const events = [50, 40].map((created_at) => finalizeEvent({ kind: 1, created_at, content: `full scan imported ${created_at}`, tags: [] }, secret));
    const control = { requests: 0, held: 0, releasedHeld: 0, readCount: () => postHistoryRepository.countForPubkey(owner) };
    const runtime = {
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => EMPTY,
        createConnectionStateObservable: () => EMPTY,
        createOutgoingMessageObservable: () => EMPTY,
        use: (req: RxReq, options?: Partial<RxNostrUseOptions>) => new Observable<EventPacket>((subscriber) => {
            const relayUrl = options?.on && "relays" in options.on ? options.on.relays?.[0] : relayUrls[0];
            const from = relayUrl ?? relayUrls[0]; const subId = `${req.rxReqId}:0`;
            let held = false;
            const subscription = req.getReqPacketObservable().subscribe(({ filters }) => {
                const filter = filters[0] as { authors?: string[]; kinds?: number[]; since?: number; until?: number; limit?: number };
                if (!filter) return;
                queueMicrotask(() => {
                    if (subscriber.closed) return;
                    const full = filter.limit === 250 && filter.authors?.[0] === owner;
                    // Keep the original harness's quiet normal synchronization.
                    if (!full) return;
                    control.requests++;
                    if (full && scenario === "hold" && filter.until === 40) { control.held++; held = true; return; }
                    if (full && (scenario === "failed" || scenario === "partial" && from === relayUrls[1])) {
                        messages.next({ type: "CLOSED", from, subId, notice: "error: fixture", message: ["CLOSED", subId, "error: fixture"] });
                        subscriber.complete(); return;
                    }
                    const selected = full ? events.filter((event) => event.created_at >= filter.since! && event.created_at <= filter.until!) : [];
                    for (const event of selected) {
                        messages.next({ type: "EVENT", from, subId, event, message: ["EVENT", subId, event] });
                        subscriber.next({ type: "EVENT", from, subId, event, message: ["EVENT", subId, event] });
                    }
                    subscriber.complete();
                    messages.next({ type: "EOSE", from, subId,
                        message: ["EOSE", subId, scenario === "hold" && full ? [] : ["finish"]] as unknown as Extract<MessagePacket, { type: "EOSE" }>["message"] });
                });
            });
            return () => { subscription.unsubscribe(); if (held) control.releasedHeld++; };
        }),
    } as unknown as RxNostr;
    // Deterministic operation clock/window; production retains the 30-day default.
    const service = new PostHistoryRelayFullScanService({ now: () => 100_000, options: { windowSeconds: 101 } });
    postHistoryRelayFullScanService.start = service.start.bind(service);
    return { runtime, control, relayConfig: Object.fromEntries(relayUrls.map((url) => [url, { read: true, write: true }])) };
}
