import { ReplyQuoteService } from '../replyQuoteService';
import type {
    NostrEvent,
    ReplyQuoteHydrationTarget,
    ReplyQuoteUpdateTarget,
} from '../types';
import type { EmbedPreloadedProfilePresentation } from '../embedProtocol';
import {
    getSensitiveCanonicalRelayHints,
    getSensitiveCompanionReference,
    resolveSensitiveCompanionCanonicalEvent,
} from '../sensitiveEventUtils';
import { postHistoryDeletionRequestsRepository } from '../storage/postHistoryDeletionRequestsRepository';

export interface ProcessReplyQuoteReferenceParams {
    reference: ReplyQuoteHydrationTarget;
    replyQuoteService: Pick<ReplyQuoteService, 'fetchReferencedEvent' | 'extractThreadInfo'>
        & Partial<Pick<ReplyQuoteService, 'fetchReferencedEventTask'>>;
    initialEvent?: NostrEvent;
    rxNostr?: any;
    relayConfig: any;
    updateReferencedEvent: (target: ReplyQuoteUpdateTarget, event: any, threadInfo: any) => void;
    initializeReplyNotificationRecipients?: (target: ReplyQuoteUpdateTarget, event: NostrEvent) => void;
    setReplyQuoteError: (target: ReplyQuoteUpdateTarget, message: string) => void;
    preloadedProfiles?: Readonly<Record<string, EmbedPreloadedProfilePresentation>>;
    applyPreloadedAuthorPreviewPresentation?: (
        targets: readonly ReplyQuoteUpdateTarget[],
        profiles: Readonly<Record<string, EmbedPreloadedProfilePresentation>>,
    ) => void;
}

export async function processReplyQuoteReference({
    reference,
    replyQuoteService,
    initialEvent,
    rxNostr,
    relayConfig,
    updateReferencedEvent,
    initializeReplyNotificationRecipients,
    setReplyQuoteError,
    preloadedProfiles,
    applyPreloadedAuthorPreviewPresentation,
}: ProcessReplyQuoteReferenceParams): Promise<void> {
    const fetchedEvent = initialEvent
        ?? await replyQuoteService.fetchReferencedEvent(
            reference.eventId,
            reference.relayHints,
            rxNostr,
            relayConfig,
        );

    if (!fetchedEvent) {
        setReplyQuoteError(reference, 'Event not found');
        return;
    }

    let event = fetchedEvent;
    let resolvedTarget = reference;
    let updateTarget = reference;
    if (getSensitiveCompanionReference(fetchedEvent)) {
        let canonicalRelayUrl: string | null = null;
        const canonicalEvent = await resolveSensitiveCompanionCanonicalEvent(
            fetchedEvent,
            async (eventId, relayHints) => {
                if (replyQuoteService.fetchReferencedEventTask) {
                    const result = await replyQuoteService.fetchReferencedEventTask(
                        eventId,
                        relayHints,
                        rxNostr,
                        relayConfig,
                    ).promise;
                    if (result.status !== 'found') return null;
                    canonicalRelayUrl = result.relayUrl;
                    return result.event;
                }
                return await replyQuoteService.fetchReferencedEvent(
                    eventId,
                    relayHints,
                    rxNostr,
                    relayConfig,
                );
            },
            async (target) => {
                const deleted = await postHistoryDeletionRequestsRepository.getDeletedTargets([{
                    targetAuthorPubkey: target.pubkey,
                    targetEventId: target.id,
                }]);
                return deleted.get(target.pubkey)?.has(target.id) ?? false;
            },
        );
        if (!canonicalEvent) {
            setReplyQuoteError(reference, 'Event not found');
            return;
        }
        event = canonicalEvent;
        const canonicalRelayHints = getSensitiveCanonicalRelayHints(fetchedEvent, {
            fetchedRelayUrl: canonicalRelayUrl,
        });
        updateTarget = { ...reference, relayHints: canonicalRelayHints };
        resolvedTarget = {
            ...reference,
            eventId: canonicalEvent.id,
            relayHints: canonicalRelayHints,
            authorPubkey: canonicalEvent.pubkey,
        };
    }

    const threadInfo = replyQuoteService.extractThreadInfo(event);
    updateReferencedEvent(updateTarget, event, threadInfo);
    if (preloadedProfiles && applyPreloadedAuthorPreviewPresentation) {
        applyPreloadedAuthorPreviewPresentation([resolvedTarget], preloadedProfiles);
    }
    initializeReplyNotificationRecipients?.(resolvedTarget, event);
}
