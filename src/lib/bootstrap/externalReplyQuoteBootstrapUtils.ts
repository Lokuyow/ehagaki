import type { RelayProfileService } from '../relayProfileService';
import { ReplyQuoteService } from '../replyQuoteService';
import type { ReplyQuoteQueryTarget } from '../types';

export interface ProcessReplyQuoteReferenceParams {
    reference: ReplyQuoteQueryTarget;
    replyQuoteService: Pick<ReplyQuoteService, 'fetchReferencedEvent' | 'extractThreadInfo'>;
    relayProfileService?: Pick<RelayProfileService, 'fetchProfileRealtime'>;
    rxNostr?: any;
    relayConfig: any;
    updateReferencedEvent: (eventId: string, event: any, threadInfo: any) => void;
    updateAuthorDisplayName: (eventId: string, name: string) => void;
    setReplyQuoteError: (eventId: string, message: string) => void;
}

export async function processReplyQuoteReference({
    reference,
    replyQuoteService,
    relayProfileService,
    rxNostr,
    relayConfig,
    updateReferencedEvent,
    updateAuthorDisplayName,
    setReplyQuoteError,
}: ProcessReplyQuoteReferenceParams): Promise<void> {
    const event = await replyQuoteService.fetchReferencedEvent(
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

    if (!event.pubkey || !relayProfileService) {
        return;
    }

    const profile = await relayProfileService.fetchProfileRealtime(event.pubkey, {
        additionalRelays: reference.relayHints,
    });
    if (!profile) {
        return;
    }

    const displayName = profile.displayName || profile.name;
    if (displayName) {
        updateAuthorDisplayName(reference.eventId, displayName);
    }
}