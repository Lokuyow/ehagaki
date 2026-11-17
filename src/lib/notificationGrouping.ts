import type { NotificationRecord } from './storage/notificationRepository';
import { matchesReactionReferenceTarget, parseReactionReference } from './reactionReference';
import { getRepostReference } from './postRepostUtils';
import type { RelatedEventReference } from './relatedEventVerification';
import type { NostrEvent } from './types';

export interface NotificationTargetReference extends RelatedEventReference {
    excludedKinds?: number[];
}

const targetReferenceByEvent = new WeakMap<NostrEvent, NotificationTargetReference | null>();

/** Parsed once per event; callers must not mutate the returned reference. */
export function notificationTargetReference(record: NotificationRecord): NotificationTargetReference | null {
    const event = record.event;
    if (targetReferenceByEvent.has(event)) return targetReferenceByEvent.get(event)!;
    let value: NotificationTargetReference | null;
    if (event.kind === 7) value = parseReactionReference(event).reference;
    else {
        const reference = getRepostReference(event);
        value = reference ? { ...reference, targetKindHint: event.kind === 6 ? 1 : reference.targetKindHint,
            excludedKinds: event.kind === 16 ? [1] : undefined } : null;
    }
    targetReferenceByEvent.set(event, value);
    return value;
}

function sameStrings(left: readonly string[], right: readonly string[]) {
    return left === right || left.length === right.length && left.every((value, index) => value === right[index]);
}

/**
 * Reuse unchanged records from the previous local read. Every read hydrates new
 * objects, so without this a read-state write re-renders every mounted card.
 * Only fields the list renders are compared; `unread` and `receivedAt` are not.
 */
export function reuseNotificationRecords(previous: readonly NotificationRecord[], next: NotificationRecord[]): NotificationRecord[] {
    if (!previous.length) return next;
    const byId = new Map(previous.map(record => [record.id, record]));
    let changed = previous.length !== next.length;
    const result = next.map((record, index) => {
        const old = byId.get(record.id);
        const reused = old && old.eventId === record.eventId && old.createdAt === record.createdAt
            && old.event.id === record.event.id && sameStrings(old.relayUrls, record.relayUrls) ? old : record;
        changed ||= reused !== previous[index];
        return reused;
    });
    return changed ? result : previous as NotificationRecord[];
}

function sameRecords(left: readonly NotificationRecord[], right: readonly NotificationRecord[]) {
    return left.length === right.length && left.every((record, index) => record === right[index]);
}

/**
 * Keep the previous group object when it holds the same records, so resolving
 * one target re-renders only the cards whose grouping actually changed.
 */
export function shareNotificationGroups(previous: readonly NotificationGroup[], next: NotificationGroup[]): NotificationGroup[] {
    if (!previous.length) return next;
    const byId = new Map(previous.map(group => [group.id, group]));
    let changed = previous.length !== next.length;
    const result = next.map((group, index) => {
        const old = byId.get(group.id);
        const reused = old && old.record === group.record && old.targetId === group.targetId
            && sameRecords(old.reactions, group.reactions) && sameRecords(old.reposts, group.reposts) ? old : group;
        changed ||= reused !== previous[index];
        return reused;
    });
    return changed ? result : previous as NotificationGroup[];
}

const sourceIdsByGroup = new WeakMap<NotificationGroup, string[]>();

/** Event IDs a card stands for: its reactions and reposts, or the record itself. */
export function notificationGroupSourceIds(group: NotificationGroup): string[] {
    let ids = sourceIdsByGroup.get(group);
    if (!ids) {
        const sources = [...group.reactions, ...group.reposts];
        ids = sources.length ? sources.map(item => item.eventId) : [group.record.eventId];
        sourceIdsByGroup.set(group, ids);
    }
    return ids;
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
