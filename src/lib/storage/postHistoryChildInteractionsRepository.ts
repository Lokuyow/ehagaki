import Dexie from "dexie";
import { cloneNostrEvent, isPostHistoryRawEventConsistent, isSameSignedNostrEvent } from "../postHistoryEventUtils";
import { parsePostHistoryThreadReferences } from "../postHistoryNip10Utils";
import { attestFullyVerifiedPostHistoryRawEvent } from "../postHistoryRawEventVerification";
import { matchesReactionReferenceTarget, parseReactionReference, type ReactionReferenceTarget } from "../reactionReference";
import type { RelatedEventReference } from "../relatedEventVerification";
import { RelayConfigUtils } from "../relayConfigUtils";
import type { NostrEvent } from "../types";
import { areStringArraysEqual } from "../utils/arrayEqualityUtils";
import {
    ehagakiDb,
    type EHagakiDB,
    type PostHistoryChildInteractionRecord,
} from "./ehagakiDb";
import { getPostHistoryChildWriteGeneration } from "./postHistoryLocalWriteScope";

export const POST_HISTORY_REPLY_EVENT_SCHEMA_VERSION = 1;

export interface PostHistoryChildInteractionItem {
    event: NostrEvent;
    relayUrls?: string[];
}

export interface UpsertPostHistoryChildInteractionsInput {
    parentEventId: string;
    events: PostHistoryChildInteractionItem[];
    fetchedAt?: number | null;
    reactionTarget?: ReactionReferenceTarget;
    expectedChildGeneration?: number;
}

export interface UpsertPostHistoryChildInteractionsResult {
    insertedCount: number;
    updatedCount: number;
    unchangedCount: number;
    ignoredCount: number;
}

export interface PostHistoryChildInteractionsRepository {
    getChildInteractions(parentEventId: string, reactionTarget?: ReactionReferenceTarget): Promise<PostHistoryChildInteractionRecord[]>;
    getChildInteractionsForParents(parentEventIds: string[], reactionTargets?: ReactionReferenceTarget[]): Promise<PostHistoryChildInteractionRecord[]>;
    getDirectReplyInteractions(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getReactionInteractions(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    upsertChildInteractions(input: UpsertPostHistoryChildInteractionsInput): Promise<UpsertPostHistoryChildInteractionsResult>;
    deleteChildInteractionByEventId(eventId: string): Promise<void>;
    deleteChildInteractionsForParent(parentEventId: string): Promise<void>;
    deleteChildInteractionsForParents(parentEventIds: string[]): Promise<void>;
    deleteChildInteractionsForPostHistoryPubkey(pubkeyHex: string | null | undefined): Promise<void>;
}

function normalizeRelayUrls(relayUrls: string[] | undefined): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        relayUrls ?? [],
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );
}

function sortRelatedEvents(records: PostHistoryChildInteractionRecord[]): PostHistoryChildInteractionRecord[] {
    return records.sort((left, right) => {
        if (left.createdAt !== right.createdAt) {
            return left.createdAt - right.createdAt;
        }

        return left.eventId.localeCompare(right.eventId);
    });
}

function areTagsEqual(left: string[][], right: string[][]): boolean {
    return left.length === right.length
        && left.every((tag, index) => areStringArraysEqual(tag, right[index]));
}

function isSupportedRelatedEventKind(kind: number): kind is 1 | 7 | 42 | 1111 {
    return kind === 1 || kind === 7 || kind === 42 || kind === 1111;
}

function resolveRelatedEventParentId(event: NostrEvent): string | null {
    if (event.kind === 1 || event.kind === 42 || event.kind === 1111) {
        return parsePostHistoryThreadReferences(event).parentId;
    }

    if (event.kind === 7) {
        return parseReactionReference(event).reference?.eventId ?? null;
    }

    return null;
}

function resolveRelatedEventRootId(event: NostrEvent): string | undefined {
    if (event.kind !== 1 && event.kind !== 42 && event.kind !== 1111) {
        return undefined;
    }

    return parsePostHistoryThreadReferences(event).rootId ?? undefined;
}

function resolveRelatedEventDiscoveryKinds(event: NostrEvent): string[] {
    return event.kind === 7 ? ["reaction"] : ["direct-reply"];
}

function filterDirectReplyRecords(
    records: PostHistoryChildInteractionRecord[],
): PostHistoryChildInteractionRecord[] {
    return records.filter((record) => record.kind === 1 || record.kind === 42 || record.kind === 1111);
}

function filterReactionRecords(
    records: PostHistoryChildInteractionRecord[],
): PostHistoryChildInteractionRecord[] {
    return records.filter((record) => record.kind === 7);
}

function hasMaterialChildInteractionChanges(
    existingRecord: PostHistoryChildInteractionRecord,
    nextRecord: PostHistoryChildInteractionRecord,
): boolean {
    return existingRecord.parentEventId !== nextRecord.parentEventId
        || existingRecord.rootEventId !== nextRecord.rootEventId
        || existingRecord.authorPubkey !== nextRecord.authorPubkey
        || existingRecord.kind !== nextRecord.kind
        || existingRecord.content !== nextRecord.content
        || existingRecord.createdAt !== nextRecord.createdAt
        || !areStringArraysEqual(existingRecord.relayUrls, nextRecord.relayUrls)
        || !areStringArraysEqual(existingRecord.discoveredAs, nextRecord.discoveredAs)
        || !areTagsEqual(existingRecord.tags, nextRecord.tags)
        || !isSameSignedNostrEvent(existingRecord.rawEvent, nextRecord.rawEvent as NostrEvent);
}

export class DexiePostHistoryChildInteractionsRepository
    implements PostHistoryChildInteractionsRepository {
    private reactionRepairPromise: Promise<void> | undefined;

    constructor(
        private db: EHagakiDB = ehagakiDb,
        private now: () => number = Date.now,
        private console: Console = typeof globalThis.console !== "undefined"
            ? globalThis.console
            : { log: () => undefined, warn: () => undefined, error: () => undefined } as Console,
    ) { }

    private ensureSavedReactionsRepaired(): Promise<void> {
        if (!this.reactionRepairPromise) {
            this.reactionRepairPromise = this.repairSavedReactions().catch((error) => {
                this.reactionRepairPromise = undefined;
                throw error;
            });
        }
        return this.reactionRepairPromise;
    }

    private async repairSavedReactions(): Promise<void> {
        // Refetch cannot repair offline/unavailable reactions or remove invalid
        // references. Reclassify the complete reaction cache before any reader
        // can observe it, including readers that start at the corrected parent.
        await this.db.transaction("rw", this.db.postHistoryChildInteractions, this.db.postHistory, async () => {
            const records = await this.db.postHistoryChildInteractions.where("kind").equals(7).toArray();
            const valid: Array<{ record: PostHistoryChildInteractionRecord; reference: RelatedEventReference }> = [];
            const invalidIds: string[] = [];
            for (const record of records) {
                if (record.id !== record.eventId || !isPostHistoryRawEventConsistent(record.rawEvent, {
                    ...record, pubkeyHex: record.authorPubkey,
                })) {
                    invalidIds.push(record.id);
                    continue;
                }
                // Full verification clones away library verification caches and
                // checks the hash and signature before raw tags select a parent.
                const verified = attestFullyVerifiedPostHistoryRawEvent(record.rawEvent);
                const reference = verified ? parseReactionReference(verified.event).reference : null;
                if (!reference || reference.eventId === record.eventId) {
                    invalidIds.push(record.id);
                    continue;
                }
                valid.push({ record, reference });
            }
            const parentIds = Array.from(new Set(valid.map(({ reference }) => reference.eventId)));
            const parents = await this.db.postHistory.bulkGet(parentIds);
            const parentsById = new Map(parents.flatMap(parent => parent ? [[parent.eventId, parent] as const] : []));
            const updated: PostHistoryChildInteractionRecord[] = [];
            for (const { record, reference } of valid) {
                const parent = parentsById.get(reference.eventId);
                if (parent && !matchesReactionReferenceTarget(reference, {
                    eventId: parent.eventId, targetAuthorPubkey: parent.pubkeyHex, targetKind: parent.kind,
                })) {
                    invalidIds.push(record.id);
                } else if (record.parentEventId !== reference.eventId) {
                    updated.push({ ...record, parentEventId: reference.eventId, updatedAt: this.now() });
                }
            }
            if (invalidIds.length) await this.db.postHistoryChildInteractions.bulkDelete(invalidIds);
            if (updated.length) await this.db.postHistoryChildInteractions.bulkPut(updated);
        });
    }

    private async filterKnownReactionTargets(
        records: PostHistoryChildInteractionRecord[],
        targets: ReactionReferenceTarget[],
    ): Promise<PostHistoryChildInteractionRecord[]> {
        const targetsById = new Map(targets.map(target => [target.eventId, target]));
        const invalidIds: string[] = [];
        const visible = records.filter(record => {
            const target = targetsById.get(record.parentEventId);
            if (record.kind !== 7 || !target) return true;
            const reference = parseReactionReference(record).reference;
            if (reference && matchesReactionReferenceTarget(reference, target)) return true;
            invalidIds.push(record.id);
            return false;
        });
        if (invalidIds.length) await this.db.postHistoryChildInteractions.bulkDelete(invalidIds);
        return visible;
    }

    async getChildInteractions(parentEventId: string, reactionTarget?: ReactionReferenceTarget): Promise<PostHistoryChildInteractionRecord[]> {
        if (!parentEventId) {
            return [];
        }

        await this.ensureSavedReactionsRepaired();

        const records = await this.db.postHistoryChildInteractions
            .where("[parentEventId+createdAt]")
            .between([parentEventId, Dexie.minKey], [parentEventId, Dexie.maxKey])
            .toArray();

        return sortRelatedEvents(reactionTarget
            ? await this.filterKnownReactionTargets(records, [reactionTarget]) : records);
    }

    async getChildInteractionsForParents(
        parentEventIds: string[],
        reactionTargets?: ReactionReferenceTarget[],
    ): Promise<PostHistoryChildInteractionRecord[]> {
        const uniqueParentEventIds = Array.from(
            new Set(parentEventIds.filter((eventId) => !!eventId)),
        );
        if (uniqueParentEventIds.length === 0) {
            return [];
        }

        await this.ensureSavedReactionsRepaired();

        const records = await this.db.postHistoryChildInteractions
            .where("parentEventId")
            .anyOf(uniqueParentEventIds)
            .toArray();
        return reactionTargets ? this.filterKnownReactionTargets(records, reactionTargets) : records;
    }

    async getDirectReplyInteractions(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return filterDirectReplyRecords(await this.getChildInteractions(parentEventId));
    }

    async getReactionInteractions(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]> {
        return filterReactionRecords(await this.getChildInteractions(parentEventId));
    }

    async upsertChildInteractions(input: UpsertPostHistoryChildInteractionsInput): Promise<UpsertPostHistoryChildInteractionsResult> {
        if (!input.parentEventId || input.events.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount: input.events.length,
            };
        }

        await this.ensureSavedReactionsRepaired();

        const fetchedAt = input.fetchedAt === undefined ? this.now() : input.fetchedAt;
        let ignoredCount = 0;
        const normalizedItems = new Map<string, PostHistoryChildInteractionItem>();

        for (const item of input.events) {
            if (!item?.event?.id || !isSupportedRelatedEventKind(item.event.kind)) {
                ignoredCount += 1;
                continue;
            }

            const resolvedParentEventId = resolveRelatedEventParentId(item.event);
            if (
                resolvedParentEventId !== input.parentEventId
                || item.event.id === input.parentEventId
            ) {
                ignoredCount += 1;
                continue;
            }

            const existing = normalizedItems.get(item.event.id);
            if (existing && !isSameSignedNostrEvent(existing.event, item.event)) {
                this.console.warn("post_history_child_interaction_conflict", item.event.id);
                ignoredCount += 1;
                continue;
            }

            normalizedItems.set(item.event.id, {
                event: item.event,
                relayUrls: normalizeRelayUrls([
                    ...(existing?.relayUrls ?? []),
                    ...(item.relayUrls ?? []),
                ]),
            });
        }

        const items = Array.from(normalizedItems.values());
        if (items.length === 0) {
            return {
                insertedCount: 0,
                updatedCount: 0,
                unchangedCount: 0,
                ignoredCount,
            };
        }

        let insertedCount = 0;
        let updatedCount = 0;
        let unchangedCount = 0;

        await this.db.transaction(
            "rw",
            this.db.postHistoryChildInteractions,
            this.db.postHistory,
            this.db.postHistoryChildWriteGeneration,
            async () => {
            if (
                typeof input.expectedChildGeneration === "number"
                && await getPostHistoryChildWriteGeneration(this.db) !== input.expectedChildGeneration
            ) {
                return;
            }
            const parent = items.some(item => item.event.kind === 7)
                ? await this.db.postHistory.get(input.parentEventId) : undefined;
            const reactionTargets: ReactionReferenceTarget[] = [
                ...(input.reactionTarget ? [input.reactionTarget] : []),
                ...(parent ? [{ eventId: parent.eventId, targetAuthorPubkey: parent.pubkeyHex, targetKind: parent.kind }] : []),
            ];
            const acceptedItems = items.filter(item => {
                if (item.event.kind !== 7) return true;
                const reference = parseReactionReference(item.event).reference;
                if (!reference || reactionTargets.some(target => !matchesReactionReferenceTarget(reference, target))) {
                    ignoredCount += 1;
                    return false;
                }
                return true;
            });
            if (acceptedItems.length === 0) return;
            const eventIds = acceptedItems.map(item => item.event.id);
            const existingRecords = await this.db.postHistoryChildInteractions.bulkGet(eventIds);
            const existingMap = new Map<string, PostHistoryChildInteractionRecord>();
            existingRecords.forEach((record) => {
                if (record) {
                    existingMap.set(record.eventId, record);
                }
            });

            const nextRecords = acceptedItems.map((item) => {
                const existingRecord = existingMap.get(item.event.id);
                const relayUrls = normalizeRelayUrls([
                    ...(existingRecord?.relayUrls ?? []),
                    ...(item.relayUrls ?? []),
                ]);
                const rootEventId = resolveRelatedEventRootId(item.event);
                const discoveredAs = Array.from(new Set([
                    ...(existingRecord?.discoveredAs ?? []),
                    ...resolveRelatedEventDiscoveryKinds(item.event),
                ]));
                const nextRecord = {
                    id: item.event.id,
                    eventId: item.event.id,
                    parentEventId: input.parentEventId,
                    ...(rootEventId ? { rootEventId } : {}),
                    authorPubkey: item.event.pubkey,
                    kind: item.event.kind,
                    content: item.event.content,
                    tags: item.event.tags.map((tag) => [...tag]),
                    createdAt: item.event.created_at,
                    relayUrls,
                    discoveredAs,
                    rawEvent: cloneNostrEvent(item.event),
                    fetchedAt: fetchedAt ?? existingRecord?.fetchedAt ?? 0,
                    updatedAt: this.now(),
                    schemaVersion: POST_HISTORY_REPLY_EVENT_SCHEMA_VERSION,
                } satisfies PostHistoryChildInteractionRecord;

                if (!existingRecord) {
                    insertedCount += 1;
                } else if (hasMaterialChildInteractionChanges(existingRecord, nextRecord)) {
                    updatedCount += 1;
                } else {
                    unchangedCount += 1;
                }

                return nextRecord;
            });

            await this.db.postHistoryChildInteractions.bulkPut(nextRecords);
        });

        return {
            insertedCount,
            updatedCount,
            unchangedCount,
            ignoredCount,
        };
    }

    async deleteChildInteractionsForParent(parentEventId: string): Promise<void> {
        if (!parentEventId) {
            return;
        }

        await this.db.postHistoryChildInteractions
            .where("parentEventId")
            .equals(parentEventId)
            .delete();
    }

    async deleteChildInteractionsForParents(parentEventIds: string[]): Promise<void> {
        const uniqueParentEventIds = Array.from(new Set(parentEventIds.filter((eventId) => !!eventId)));
        if (uniqueParentEventIds.length === 0) {
            return;
        }

        await this.db.transaction("rw", this.db.postHistoryChildInteractions, async () => {
            for (const parentEventId of uniqueParentEventIds) {
                await this.db.postHistoryChildInteractions
                    .where("parentEventId")
                    .equals(parentEventId)
                    .delete();
            }
        });
    }

    async deleteChildInteractionsForPostHistoryPubkey(pubkeyHex: string | null | undefined): Promise<void> {
        if (!pubkeyHex) {
            return;
        }

        const parentEventIds = await this.db.postHistory
            .where("pubkeyHex")
            .equals(pubkeyHex)
            .primaryKeys();

        // TODO(PR5+): Consider adding ownerPubkeyHex to postHistoryChildInteractions via migration
        // so owner-scoped cleanup does not have to infer scope from current postHistory parents.
        await this.deleteChildInteractionsForParents(parentEventIds.map(String));
    }

    async deleteChildInteractionByEventId(eventId: string): Promise<void> {
        if (!eventId) {
            return;
        }

        await this.db.postHistoryChildInteractions.delete(eventId);
    }
}

export const postHistoryChildInteractionsRepository =
    new DexiePostHistoryChildInteractionsRepository();
