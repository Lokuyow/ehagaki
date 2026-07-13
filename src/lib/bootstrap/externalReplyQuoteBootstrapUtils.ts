import type { RelayProfileService } from '../relayProfileService';
import { ReplyQuoteService } from '../replyQuoteService';
import type { NostrEvent, ReplyQuoteQueryTarget } from '../types';

export interface ProcessReplyQuoteReferenceParams {
    reference: ReplyQuoteQueryTarget;
    replyQuoteService: Pick<ReplyQuoteService, 'fetchReferencedEvent' | 'extractThreadInfo'>;
    initialEvent?: NostrEvent;
    relayProfileService?: Pick<RelayProfileService, 'fetchProfileRealtime'>;
    rxNostr?: any;
    relayConfig: any;
    updateReferencedEvent: (eventId: string, event: any, threadInfo: any) => void;
    updateAuthorDisplayName: (eventId: string, name: string) => void;
    initializeReplyNotificationRecipients?: (eventId: string, event: NostrEvent) => void;
    updateReplyNotificationRecipientDisplayName?: (
        eventId: string,
        pubkey: string,
        name: string,
    ) => void;
    setReplyQuoteError: (eventId: string, message: string) => void;
}

export async function processReplyQuoteReference({
    reference,
    replyQuoteService,
    initialEvent,
    relayProfileService,
    rxNostr,
    relayConfig,
    updateReferencedEvent,
    updateAuthorDisplayName,
    initializeReplyNotificationRecipients,
    updateReplyNotificationRecipientDisplayName,
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

    if (!event.pubkey || !relayProfileService) {
        return;
    }

    const applyProfileName = async (pubkey: string, onName: (name: string) => void) => {
        const profile = await relayProfileService.fetchProfileRealtime(pubkey, {
            additionalRelays: reference.relayHints,
        });
        const displayName = profile?.displayName || profile?.name;
        if (displayName) {
            onName(displayName);
        }
    };

    const recipientPubkeys = Array.from(new Set(
        event.tags
            .filter((tag) => tag[0] === 'p' && !!tag[1] && tag[1] !== event.pubkey)
            .map((tag) => tag[1]),
    ));

    await Promise.allSettled([
        applyProfileName(event.pubkey, (name) => updateAuthorDisplayName(reference.eventId, name)),
        ...recipientPubkeys.map((pubkey) => applyProfileName(pubkey, (name) =>
            updateReplyNotificationRecipientDisplayName?.(reference.eventId, pubkey, name),
        )),
    ]);
}
