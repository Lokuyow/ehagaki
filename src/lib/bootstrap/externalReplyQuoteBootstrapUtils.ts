import { ReplyQuoteService } from '../replyQuoteService';
import type {
    NostrEvent,
    ReplyQuoteHydrationTarget,
    ReplyQuoteUpdateTarget,
} from '../types';
import type { EmbedPreloadedProfilePresentation } from '../embedProtocol';

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

    const event = fetchedEvent;
    const threadInfo = replyQuoteService.extractThreadInfo(event);
    updateReferencedEvent(reference, event, threadInfo);
    if (preloadedProfiles && applyPreloadedAuthorPreviewPresentation) {
        applyPreloadedAuthorPreviewPresentation([reference], preloadedProfiles);
    }
    initializeReplyNotificationRecipients?.(reference, event);
}
