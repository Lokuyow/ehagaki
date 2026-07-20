import { ReplyQuoteService } from '../replyQuoteService';
import type {
    NostrEvent,
    ReplyQuoteHydrationTarget,
    ReplyQuoteUpdateTarget,
} from '../types';

export interface ProcessReplyQuoteReferenceParams {
    reference: ReplyQuoteHydrationTarget;
    replyQuoteService: Pick<ReplyQuoteService, 'fetchReferencedEvent' | 'extractThreadInfo'>;
    initialEvent?: NostrEvent;
    rxNostr?: any;
    relayConfig: any;
    updateReferencedEvent: (target: ReplyQuoteUpdateTarget, event: any, threadInfo: any) => void;
    initializeReplyNotificationRecipients?: (target: ReplyQuoteUpdateTarget, event: NostrEvent) => void;
    setReplyQuoteError: (target: ReplyQuoteUpdateTarget, message: string) => void;
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
        setReplyQuoteError(reference, 'Event not found');
        return;
    }

    const threadInfo = replyQuoteService.extractThreadInfo(event);
    updateReferencedEvent(reference, event, threadInfo);
    initializeReplyNotificationRecipients?.(reference, event);
}
