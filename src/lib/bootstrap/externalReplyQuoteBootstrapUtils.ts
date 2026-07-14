import { ReplyQuoteService } from '../replyQuoteService';
import type { NostrEvent, ReplyQuoteQueryTarget } from '../types';

export interface ProcessReplyQuoteReferenceParams {
    reference: ReplyQuoteQueryTarget;
    replyQuoteService: Pick<ReplyQuoteService, 'fetchReferencedEvent' | 'extractThreadInfo'>;
    initialEvent?: NostrEvent;
    rxNostr?: any;
    relayConfig: any;
    updateReferencedEvent: (eventId: string, event: any, threadInfo: any) => void;
    initializeReplyNotificationRecipients?: (eventId: string, event: NostrEvent) => void;
    setReplyQuoteError: (eventId: string, message: string) => void;
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
}: ProcessReplyQuoteReferenceParams): Promise<void> {
    const event = initialEvent
        ?? await replyQuoteService.fetchReferencedEvent(
            reference.eventId,
            reference.relayHints,
            rxNostr,
            relayConfig,
        );

    if (!event) {
        setReplyQuoteError(reference.eventId, 'Event not found');
        return;
    }

    const threadInfo = replyQuoteService.extractThreadInfo(event);
    updateReferencedEvent(reference.eventId, event, threadInfo);
    initializeReplyNotificationRecipients?.(reference.eventId, event);
}
