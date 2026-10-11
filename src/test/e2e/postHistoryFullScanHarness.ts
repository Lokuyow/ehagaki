import { EMPTY, Observable, Subject } from "rxjs";
import type { EventPacket, MessagePacket, OutgoingMessagePacket, RxNostr, RxReq, RxNostrUseOptions } from "rx-nostr";
import { finalizeEvent, getPublicKey } from "nostr-tools";
import { PostHistoryRelayFullScanService, postHistoryRelayFullScanService } from "../../lib/postHistoryRelayFullScanService";
import { postHistoryRepository } from "../../lib/storage/postHistoryRepository";

export function createPostHistoryFullScanHarness(secret: Uint8Array, scenario: string) {
    const owner = getPublicKey(secret);
    const relayUrls = ["wss://full-scan-a.example/", "wss://full-scan-b.example/"];
    if (scenario.startsWith("relay-")) relayUrls.push("wss://a-very-long-relay-host-name-for-narrow-frame-progress.example/relay-path");
    if (scenario === "relay-progress") relayUrls.push("wss://full-scan-d.example/", "wss://full-scan-e.example/");
    const messages = new Subject<MessagePacket>();
    const outgoing = new Subject<OutgoingMessagePacket>();
    const pendingReplies = new Map<string, () => void>();
    const authIds = new Map<string, string>();
    const requestCounts = new Map<string, number>();
    const events = [50, 40].map((created_at) => finalizeEvent({ kind: 1, created_at, content: `full scan imported ${created_at}`, tags: [] }, secret));
    const control = { requests: 0, held: 0, releasedHeld: 0, relayUrls,
        readCount: () => postHistoryRepository.countForPubkey(owner),
        releaseRelay: (relayUrl: string) => { const reply = pendingReplies.get(relayUrl); pendingReplies.delete(relayUrl); reply?.(); },
        authenticateRelay: (from: string) => {
            const eventId = authIds.get(from);
            if (eventId) messages.next({ type: "OK", from, eventId, ok: true, message: ["OK", eventId, true, ""] });
        },
    };
    const runtime = {
        createAllMessageObservable: () => messages,
        createAllErrorObservable: () => EMPTY,
        createConnectionStateObservable: () => EMPTY,
        createOutgoingMessageObservable: () => outgoing,
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
                    const count = (requestCounts.get(from) ?? 0) + 1; requestCounts.set(from, count);
                    const respond = (selected: typeof events, hints: string[]) => {
                        if (subscriber.closed) return;
                        for (const event of selected) {
                            messages.next({ type: "EVENT", from, subId, event, message: ["EVENT", subId, event] });
                            subscriber.next({ type: "EVENT", from, subId, event, message: ["EVENT", subId, event] });
                        }
                        subscriber.complete();
                        messages.next({ type: "EOSE", from, subId,
                            message: ["EOSE", subId, hints] as unknown as Extract<MessagePacket, { type: "EOSE" }>["message"] });
                    };
                    if (scenario === "relay-progress") {
                        if (from === relayUrls[1] && count > 1) { respond([events[0]], ["finish"]); return; }
                        pendingReplies.set(from, () => {
                            if (from === relayUrls[1]) {
                                const auth = { ...finalizeEvent({ kind: 22242, created_at: 100, content: "", tags: [] }, secret), kind: 22242 as const };
                                authIds.set(from, auth.id); outgoing.next({ to: from, message: ["AUTH", auth] });
                                respond([], ["auth", "finish"]);
                            } else respond(from === relayUrls[2] ? [] : events, ["finish"]);
                        });
                        return;
                    }
                    if (full && scenario === "hold" && filter.until === 40) { control.held++; held = true; return; }
                    if (scenario === "timeout" && from === relayUrls[1]) return;
                    if (full && (scenario === "failed" || scenario === "partial" && from === relayUrls[1])) {
                        messages.next({ type: "CLOSED", from, subId, notice: "error: fixture", message: ["CLOSED", subId, "error: fixture"] });
                        subscriber.complete(); return;
                    }
                    const selected = from === relayUrls[2] ? [] : events.filter((event) => event.created_at >= filter.since! && event.created_at <= filter.until!);
                    respond(selected, scenario === "hold" || (scenario === "ambiguous" && from === relayUrls[0]) ? [] : ["finish"]);
                });
            });
            return () => { subscription.unsubscribe(); pendingReplies.delete(from); if (held) control.releasedHeld++; };
        }),
    } as unknown as RxNostr;
    // Deterministic operation clock/window; production retains the 30-day default.
    const service = new PostHistoryRelayFullScanService({ now: () => 100_000, options: { windowSeconds: 101,
        ...(scenario === "timeout" ? { pageTimeoutMs: 100 } : {}) } });
    postHistoryRelayFullScanService.start = service.start.bind(service);
    return { runtime, control, relayConfig: Object.fromEntries(relayUrls.map((url) => [url, { read: true, write: true }])) };
}
