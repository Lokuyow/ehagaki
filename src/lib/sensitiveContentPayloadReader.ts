import type { RxNostr } from "rx-nostr";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "./sensitiveContentPayload";
import { isFullyVerifiedEvent } from "./sensitiveEventUtils";
import { postHistoryContextFetchService } from "./postHistoryContextFetchService";
import { RelayConfigUtils } from "./relayConfigUtils";
import { sensitivePayloadRepository } from "./storage/sensitivePayloadRepository";
import type { NostrEvent, RelayConfig } from "./types";

/** Called only after the viewer explicitly asks to reveal a Sensitive body. */
export async function loadSensitivePayloadContent(params: {
    structure: NostrEvent;
    relayHints?: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}): Promise<string | null> {
    const { structure } = params;
    if (!isFullyVerifiedEvent(structure)) return null;
    const reference = getSensitivePayloadReference(structure);
    if (!reference) return null;

    const cachedRecords = await sensitivePayloadRepository.getByIds([reference.eventId]);
    const cached = cachedRecords.find((record) => record.deletedAt === undefined);
    if (cached) {
        const payload = cached.rawEvent as NostrEvent;
        if (verifySensitivePayloadLink(structure, payload, reference.eventId)) {
            return payload.content;
        }
    }

    if (!params.rxNostr) return null;
    const relayHints = RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(reference.relayHint ? [reference.relayHint] : []),
        ...(params.relayHints ?? []),
    ]);
    const task = postHistoryContextFetchService.fetchEventById(params.rxNostr, {
        eventId: reference.eventId,
        relayHints,
        relayConfig: params.relayConfig,
    });
    const result = await task.promise;
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
    return result.event.content;
}

export function createSensitivePayloadBodyLoader(params: {
    structure: NostrEvent | null | undefined;
    relayHints?: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
}): (() => Promise<string | null>) | undefined {
    if (!params.structure || !getSensitivePayloadReference(params.structure)) return undefined;
    return () => loadSensitivePayloadContent({
        structure: params.structure!,
        relayHints: params.relayHints,
        rxNostr: params.rxNostr,
        relayConfig: params.relayConfig,
    });
}
