import { buildStorageVector, negentropySync } from "applesauce-relay/negentropy";
import { Observable } from "rxjs";
import { isPostHistoryRawEventConsistent } from "./postHistoryEventUtils";
import { RAW_EVENT_VERIFICATION_RULE_VERSION } from "./rawEventVerificationState";
import { RelayOperation } from "./relay/operation";
import { RelayConfigUtils } from "./relayConfigUtils";
import { postHistoryRepository, type PostHistoryTimelineCursor } from "./storage/postHistoryRepository";

const EVENT_ID = /^[0-9a-f]{64}$/;
const FIRST_RESPONSE_MS = 5_000;
const MAX_INCOMING_HEX_LENGTH = 128 * 1024 * 2;
const MAX_ROUNDS = 256;
const MAX_MISSING_IDS = 100_000;

interface IncludedEvent {
    id: string;
    created_at: number;
}

type HistoryFilter = {
    authors: string[];
    kinds: number[];
    since: number;
    until: number;
};

export async function readPostHistoryNegentropySeeds(
    input: { owner: string; kinds: number[]; until: number; relayUrls: string[]; isActive: () => boolean },
    repository: Pick<typeof postHistoryRepository, "getSearchScanChunk"> = postHistoryRepository,
): Promise<Map<string, IncludedEvent[]>> {
    const seeds = new Map(input.relayUrls.map((url) => [url, new Map<string, IncludedEvent>()]));
    let cursor: PostHistoryTimelineCursor | undefined;
    while (input.isActive()) {
        const chunk = await repository.getSearchScanChunk({ pubkeyHex: input.owner, cursor, limit: 500 });
        if (!input.isActive()) break;
        for (const record of chunk.items) {
            const event = record.rawEvent;
            const verification = record.rawEventVerification;
            if (record.pubkeyHex !== input.owner || !input.kinds.includes(record.kind)
                || !Number.isSafeInteger(record.createdAt) || record.createdAt < 0 || record.createdAt > input.until
                || verification?.status !== "valid" || verification.ruleVersion !== RAW_EVENT_VERIFICATION_RULE_VERSION
                || !isPostHistoryRawEventConsistent(event, record) || !EVENT_ID.test(event.id)) continue;

            // ID lists can disclose individual event IDs during negotiation.
            const pair = { id: event.id, created_at: event.created_at };
            for (const url of record.fetchedRelays ?? []) {
                const normalized = RelayConfigUtils.normalizeExternalRelayUrl(url);
                if (normalized) seeds.get(normalized)?.set(event.id, pair);
            }
        }
        if (!chunk.hasMore || !chunk.nextCursor) break;
        cursor = chunk.nextCursor;
    }
    return new Map([...seeds].map(([url, events]) => [url, [...events.values()]]));
}

interface PostHistoryNegentropyResult {
    ids: string[];
    hasMatchedLocalEvents: boolean;
}

export function reconcilePostHistoryRelay(input: {
    relayUrl: string;
    filter: HistoryFilter;
    seed: IncludedEvent[];
    timeoutMs: number;
    signal: AbortSignal;
}): Promise<PostHistoryNegentropyResult | null> {
    return new Promise((resolve) => {
        let result: PostHistoryNegentropyResult | null = null;
        const operation = new RelayOperation(Math.min(35_000, input.timeoutMs), () => resolve(result));
        operation.bind(input.signal);
        if (operation.reason) return;
        operation.schedule("first-response", operation.startedAt + FIRST_RESPONSE_MS, () => operation.finish("timeout"));

        try {
            const storage = buildStorageVector(input.seed);
            const seedIds = new Set(input.seed.map(({ id }) => id));
            const localOnly = new Set<string>();
            const missing = new Set<string>();
            let send = (_message: unknown): void => {};
            const socket: Parameters<typeof negentropySync>[1] = {
                next: (message: unknown) => { if (!operation.reason) send(message); },
                multiplex: (open, close, matches) => new Observable<unknown[]>((subscriber) => {
                    const ws = new WebSocket(input.relayUrl);
                    let waitingForResponse = false;
                    send = (message) => {
                        waitingForResponse = true;
                        try { ws.send(JSON.stringify(message)); }
                        catch { operation.finish("error"); }
                    };
                    const openSubscription = () => send(open());
                    const fail = () => subscriber.error(new Error("Negentropy connection ended"));
                    let rounds = 0;
                    const receive = ({ data }: MessageEvent<unknown>) => {
                        try {
                            if (typeof data !== "string" || data.length > MAX_INCOMING_HEX_LENGTH + 1024) {
                                throw new Error("Invalid Negentropy frame size");
                            }
                            const message: unknown = JSON.parse(data);
                            if (!Array.isArray(message) || message[0] === "AUTH") {
                                throw new Error("Invalid Negentropy response or relay requires authentication");
                            }
                            if (!matches(message)) return;
                            if (!waitingForResponse) throw new Error("Unexpected Negentropy response");
                            waitingForResponse = false;
                            if (message[0] === "NEG-MSG") {
                                const hex: unknown = message[2];
                                if (typeof hex !== "string" || hex.length > MAX_INCOMING_HEX_LENGTH
                                    || hex.length < 2 || hex.length % 2 || !/^[0-9a-f]+$/i.test(hex)
                                    || ++rounds > MAX_ROUNDS) throw new Error("Invalid Negentropy message");
                                operation.unschedule("first-response");
                            }
                            subscriber.next(message);
                        } catch (error) {
                            subscriber.error(error);
                        }
                    };
                    ws.addEventListener("open", openSubscription);
                    ws.addEventListener("close", fail);
                    ws.addEventListener("error", fail);
                    ws.addEventListener("message", receive);
                    return () => {
                        ws.removeEventListener("open", openSubscription);
                        ws.removeEventListener("close", fail);
                        ws.removeEventListener("error", fail);
                        ws.removeEventListener("message", receive);
                        send = () => undefined;
                        if (ws.readyState === WebSocket.OPEN) {
                            try { ws.send(JSON.stringify(close())); }
                            catch { /* closing the socket also ends the subscription */ }
                        }
                        ws.close();
                    };
                }),
            };
            const subscription = negentropySync(storage, socket, input.filter, { frameSizeLimit: 50_000 }).subscribe({
                next: ({ have, need }) => {
                    if (have.some((id) => !seedIds.has(id)) || need.some((id) => !EVENT_ID.test(id) || seedIds.has(id))) {
                        operation.finish("error");
                        return;
                    }
                    have.forEach((id) => localOnly.add(id));
                    need.forEach((id) => missing.add(id));
                    if (missing.size > MAX_MISSING_IDS) operation.finish("error");
                },
                error: () => operation.finish("error"),
                complete: () => {
                    if (operation.reason) return;
                    result = { ids: [...missing], hasMatchedLocalEvents: localOnly.size < seedIds.size };
                    operation.finish();
                },
            });
            operation.add(() => subscription.unsubscribe());
        } catch {
            operation.finish("error");
        }
    });
}
