import type { RxNostr } from "rx-nostr";
import { liveQuery } from "dexie";
import { preloadCustomEmojiImageWithMeta } from "./customEmoji";
import type { SensitiveBodyCacheStatus, SensitiveBodyLoader } from "./postContentPreview";
import { ehagakiDb } from "./storage/ehagakiDb";
import { isValidDeletionRequestForTarget } from "./postHistoryDeletionUtils";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "./sensitiveContentPayload";
import { isFullyVerifiedEvent } from "./sensitiveEventUtils";
import { postHistoryContextFetchService } from "./postHistoryContextFetchService";
import { RelayConfigUtils } from "./relayConfigUtils";
import { sensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import type { NostrEvent, RelayConfig } from "./types";

async function isPairDeleted(structure: NostrEvent, payloadId: string): Promise<boolean> {
    const local = await ehagakiDb.postHistory.get(structure.id);
    if (local?.deletedAt !== undefined) return true;
    const requests = await ehagakiDb.postHistoryDeletionRequests
        .where("targetEventId").anyOf([structure.id, payloadId]).toArray();
    return requests.some((record) => {
        const deletion = record.rawEvent as NostrEvent;
        return isFullyVerifiedEvent(deletion)
            && deletion.pubkey === structure.pubkey
            && isValidDeletionRequestForTarget(deletion, {
                id: record.targetEventId,
                pubkey: structure.pubkey,
            });
    });
}

/** Loads a payload only after validating its association with this Structure. */
export async function loadVerifiedSensitivePayloadEvent(params: {
    structure: NostrEvent;
    relayHints?: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    signal?: AbortSignal;
}): Promise<NostrEvent | null> {
    const { structure } = params;
    if (params.signal?.aborted || !isFullyVerifiedEvent(structure)) return null;
    const reference = getSensitivePayloadReference(structure);
    if (!reference) return null;

    const cachedRecords = await sensitivePayloadRepository.getByIds([reference.eventId]);
    const cached = cachedRecords[0];
    if (cached?.deletedAt !== undefined || await isPairDeleted(structure, reference.eventId)) return null;
    if (cached) {
        const payload = cached.rawEvent as NostrEvent;
        if (verifySensitivePayloadLink(structure, payload, reference.eventId)) {
            return params.signal?.aborted ? null : payload;
        }
    }

    if (!params.rxNostr || params.signal?.aborted) return null;
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(reference.relayHint ? [reference.relayHint] : []),
        ...(params.relayHints ?? []),
        ...(cached?.acceptedRelays ?? []),
        ...(cached?.fetchedRelays ?? []),
    ]);
    const task = postHistoryContextFetchService.fetchEventById(params.rxNostr, {
        eventId: reference.eventId,
        relayHints,
        relayConfig: params.relayConfig,
    });
    const cancel = () => task.cancel();
    params.signal?.addEventListener("abort", cancel, { once: true });
    const result = await task.promise.finally(() => params.signal?.removeEventListener("abort", cancel));
    if (params.signal?.aborted) return null;
    if (!result.event || !verifySensitivePayloadLink(structure, result.event, reference.eventId)) {
        return null;
    }
    const fetchedRelays = RelayConfigUtils.sanitizeExternalRelayUrls(
        result.relayUrl ? [result.relayUrl] : [],
        { limit: 1 },
    );
    try {
        await sensitivePayloadRepository.putCandidate({
            event: result.event,
            fetchedRelays,
            relayHints: fetchedRelays,
        });
    } catch {
        // The verified in-memory payload can still be revealed if caching fails.
    }
    const [current] = await sensitivePayloadRepository.getByIds([reference.eventId]);
    if (params.signal?.aborted || current?.deletedAt !== undefined
        || await isPairDeleted(structure, reference.eventId)) return null;
    return result.event;
}

/** Called only after the viewer explicitly asks to reveal a Sensitive body. */
export async function loadSensitivePayloadContent(params: {
    structure: NostrEvent;
    relayHints?: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    signal?: AbortSignal;
}): Promise<string | null> {
    const payload = await loadVerifiedSensitivePayloadEvent(params);
    return payload?.content ?? null;
}

export function createSensitivePayloadBodyLoader(params: {
    structure: NostrEvent | null | undefined;
    relayHints?: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    ownerPubkey?: string | null;
}): SensitiveBodyLoader | undefined {
    if (!params.structure || !getSensitivePayloadReference(params.structure)) return undefined;
    const structure = params.structure;
    const reference = getSensitivePayloadReference(structure)!;
    const loader: SensitiveBodyLoader = (signal) => loadSensitivePayloadContent({
        structure: params.structure!,
        relayHints: params.relayHints,
        rxNostr: params.rxNostr,
        relayConfig: params.relayConfig,
        signal,
    });
    loader.scope = { runtime: params.rxNostr, ownerPubkey: params.ownerPubkey };
    loader.loadEmoji = preloadCustomEmojiImageWithMeta;
    loader.observe = (onChange) => {
        const subscription = liveQuery(async (): Promise<SensitiveBodyCacheStatus> => {
            const record = await ehagakiDb.sensitivePayloads.get(reference.eventId);
            if (record?.deletedAt !== undefined || await isPairDeleted(structure, reference.eventId)) return "deleted";
            if (!record) return "missing";
            return verifySensitivePayloadLink(structure, record.rawEvent as NostrEvent, reference.eventId)
                ? "available" : "invalid";
        }).subscribe({ next: onChange, error: () => onChange("invalid") });
        return () => subscription.unsubscribe();
    };
    return loader;
}
