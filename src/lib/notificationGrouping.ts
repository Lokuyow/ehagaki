import type { NotificationRecord } from './storage/notificationRepository';
import { matchesReactionReferenceTarget, parseReactionReference } from './reactionReference';
import { getRepostReference } from './postRepostUtils';
import type { RelatedEventReference } from './relatedEventVerification';
import type { NostrEvent } from './types';

export interface NotificationTargetReference extends RelatedEventReference {
    excludedKinds?: number[];
}

export function notificationTargetReference(record: NotificationRecord): NotificationTargetReference | null {
    if (record.event.kind === 7) return parseReactionReference(record.event).reference;
    const reference = getRepostReference(record.event);
    return reference ? { ...reference, targetKindHint: record.event.kind === 6 ? 1 : reference.targetKindHint,
        excludedKinds: record.event.kind === 16 ? [1] : undefined } : null;
}

export interface NotificationGroup {
    id: string;
    record: NotificationRecord;
    reactions: NotificationRecord[];
    reposts: NotificationRecord[];
    targetId?: string;
}

interface TargetConstraints {
    authors: string[] | null;
    kind: number | null;
    excludedKinds: number[];
}
function constraints(reference: NotificationTargetReference): TargetConstraints {
    return { authors: reference.authorHint ? [reference.authorHint] : reference.authorHints?.length ? reference.authorHints : null,
        kind: reference.targetKindHint ?? null, excludedKinds: reference.excludedKinds ?? [] };
}
function mergeConstraints(left: TargetConstraints, right: TargetConstraints): TargetConstraints | null {
    const authors = left.authors && right.authors ? left.authors.filter(author => right.authors!.includes(author)) : left.authors ?? right.authors;
    const kind = left.kind ?? right.kind;
    const excludedKinds = [...new Set([...left.excludedKinds, ...right.excludedKinds])];
    if (authors?.length === 0 || (left.kind != null && right.kind != null && left.kind !== right.kind)
        || (kind != null && excludedKinds.includes(kind))) return null;
    return { authors, kind, excludedKinds };
}

/** Group received reactions and reposts at their newest source event's position. */
export function groupNotifications(records: NotificationRecord[], getTarget: (id: string) => NostrEvent | null): NotificationGroup[] {
    const groups: NotificationGroup[] = [];
    const byTarget = new Map<string, Array<{ group: NotificationGroup; constraints: TargetConstraints }>>();
    const seen = new Set<string>();
    for (const record of records) {
        if (seen.has(record.eventId)) continue;
        seen.add(record.eventId);
        const reference = notificationTargetReference(record);
        const target = reference && getTarget(reference.eventId);
        const incompatible = reference && target && (!matchesReactionReferenceTarget(reference, {
            eventId: target.id, targetAuthorPubkey: target.pubkey, targetKind: target.kind,
        }) || (reference.authorHints?.length && !reference.authorHints.includes(target.pubkey))
            || reference.excludedKinds?.includes(target.kind));
        const standalone: NotificationGroup = { id: record.id, record,
            reactions: record.event.kind === 7 ? [record] : [], reposts: [6, 16].includes(record.event.kind) ? [record] : [] };
        if (!reference || incompatible) {
            groups.push(standalone);
            continue;
        }
        const incoming = constraints(reference);
        const candidates = byTarget.get(reference.eventId) ?? [];
        const existing = candidates.find(item => mergeConstraints(item.constraints, incoming));
        if (!existing) {
            standalone.targetId = reference.eventId;
            groups.push(standalone);
            byTarget.set(reference.eventId, [...candidates, { group: standalone, constraints: incoming }]);
            continue;
        }
        const group = existing.group;
        existing.constraints = mergeConstraints(existing.constraints, incoming)!;
        group.reactions.push(...standalone.reactions);
        group.reposts.push(...standalone.reposts);
        // Use a less restrictive source to resolve a missing target, while validating
        // every source against the resolved target before retaining it in the group.
        const current = notificationTargetReference(group.record)!;
        if (current.targetKindHint != null && reference.targetKindHint == null
            || current.targetKindHint == null && reference.targetKindHint == null
                && current.excludedKinds?.length && !reference.excludedKinds?.length) group.record = record;
    }
    return groups;
}
