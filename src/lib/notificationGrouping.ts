import type { NotificationRecord } from './storage/notificationRepository';
import { matchesReactionReferenceTarget, parseReactionReference } from './reactionReference';
import type { NostrEvent } from './types';

export interface NotificationGroup {
    id: string;
    record: NotificationRecord;
    reactions: NotificationRecord[];
    targetId?: string;
    authorHint?: string | null;
    kindHint?: number | null;
}

/** Keep each source event, placing a reaction group at its newest event's position. */
export function groupNotifications(records: NotificationRecord[], getTarget: (id: string) => NostrEvent | null): NotificationGroup[] {
    const groups: NotificationGroup[] = [];
    const byTarget = new Map<string, NotificationGroup[]>();
    for (const record of records) {
        const reference = record.event.kind === 7 ? parseReactionReference(record.event).reference : null;
        const target = reference && getTarget(reference.eventId);
        const incompatible = reference && target && !matchesReactionReferenceTarget(reference, {
            eventId: target.id, targetAuthorPubkey: target.pubkey, targetKind: target.kind,
        });
        if (!reference || incompatible) {
            groups.push({ id: record.id, record, reactions: record.event.kind === 7 ? [record] : [] });
            continue;
        }
        let group = byTarget.get(reference.eventId)?.find(item =>
            (!item.authorHint || !reference.authorHint || item.authorHint === reference.authorHint)
            && (item.kindHint == null || reference.targetKindHint == null || item.kindHint === reference.targetKindHint));
        if (!group) {
            group = { id: record.id, record, reactions: [], targetId: reference.eventId,
                authorHint: reference.authorHint, kindHint: reference.targetKindHint };
            groups.push(group);
            byTarget.set(reference.eventId, [...(byTarget.get(reference.eventId) ?? []), group]);
        }
        group.reactions.push(record);
        group.authorHint ??= reference.authorHint;
        group.kindHint ??= reference.targetKindHint;
        // Fetch using the least restrictive compatible reference; each event is
        // checked against the resolved target before joining its final group.
        const current = parseReactionReference(group.record.event).reference;
        if (current && current.targetKindHint != null && reference.targetKindHint == null) group.record = record;
    }
    return groups;
}
