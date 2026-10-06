import {
    comparePostHistoryDeletionRequests,
    isValidDeletionRequestForTarget,
    POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
    toPostHistoryDeletionState,
} from "../postHistoryDeletionUtils";
import { isPostHistoryRawEventConsistent } from "../postHistoryEventUtils";
import { getSensitivePayloadReference, verifySensitivePayloadLink } from "../sensitiveContentPayload";
import { isFullyVerifiedEvent } from "../sensitiveEventUtils";
import type { NostrEvent } from "../types";
import { bumpPostHistorySearchRevision } from "../postHistoryLocalSearchRevision";
import {
    RAW_EVENT_VERIFICATION_RULE_VERSION,
} from "../postHistoryRawEventVerification";
import { ehagakiDb, type EHagakiDB } from "./ehagakiDb";

/** Applies an imported deletion to a payload only after its canonical Structure pair is known. */
export async function reconcileSensitivePayloadDeletionForStructure(
    structureId: string,
    db: EHagakiDB = ehagakiDb,
    now: () => number = Date.now,
): Promise<boolean> {
    const structureRecord = await db.postHistory.get(structureId);
    if (!structureRecord || !isPostHistoryRawEventConsistent(
        structureRecord.rawEvent,
        structureRecord,
    )) {
        return false;
    }
    const structure = structureRecord.rawEvent as NostrEvent;
    const reference = getSensitivePayloadReference(structure);
    if (!reference || !isFullyVerifiedEvent(structure)) return false;
    const payloadRecord = await db.sensitivePayloads.get(reference.eventId);
    if (
        !payloadRecord
        || payloadRecord.deletedAt !== undefined
        || payloadRecord.pubkeyHex !== structure.pubkey
        || !verifySensitivePayloadLink(structure, payloadRecord.rawEvent as NostrEvent, reference.eventId)
    ) {
        return false;
    }

    let changed = false;
    await db.transaction(
        "rw",
        db.postHistory,
        db.sensitivePayloads,
        db.postHistoryDeletionRequests,
        async () => {
        const currentStructureRecord = await db.postHistory.get(structureId);
        const currentPayload = await db.sensitivePayloads.get(reference.eventId);
        if (
            !currentStructureRecord
            || !isPostHistoryRawEventConsistent(currentStructureRecord.rawEvent, currentStructureRecord)
            || !isFullyVerifiedEvent(currentStructureRecord.rawEvent)
            || !currentPayload
            || currentPayload.deletedAt !== undefined
            || currentPayload.pubkeyHex !== currentStructureRecord.pubkeyHex
            || !verifySensitivePayloadLink(
                currentStructureRecord.rawEvent as NostrEvent,
                currentPayload.rawEvent as NostrEvent,
                reference.eventId,
            )
        ) {
            return;
        }

        const requests = await db.postHistoryDeletionRequests
            .where("targetEventId")
            .equals(reference.eventId)
            .toArray();
        const applicable = requests.filter((record) => {
            if (
                record.targetAuthorPubkey !== currentStructureRecord.pubkeyHex
                || record.deletionEventPubkey !== currentStructureRecord.pubkeyHex
                || record.rawEventVerification?.status !== "valid"
                || record.rawEventVerification.ruleVersion !== RAW_EVENT_VERIFICATION_RULE_VERSION
            ) {
                return false;
            }
            const deletion = record.rawEvent as NostrEvent;
            return isFullyVerifiedEvent(deletion)
                && isValidDeletionRequestForTarget(deletion, {
                    id: currentPayload.id,
                    pubkey: currentPayload.pubkeyHex,
                });
        }).sort(comparePostHistoryDeletionRequests);
        if (applicable.length === 0) return;

        const selected = applicable[0]!;
        for (const request of applicable) {
            if (request.targetVerified !== true) {
                await db.postHistoryDeletionRequests.put({
                    ...request,
                    targetVerified: true,
                    updatedAt: now(),
                    schemaVersion: POST_HISTORY_DELETION_REQUEST_SCHEMA_VERSION,
                });
            }
        }
        await db.sensitivePayloads.put({
            ...currentPayload,
            ...toPostHistoryDeletionState(selected),
            updatedAt: now(),
        });
        changed = true;
        },
    );

    if (changed) bumpPostHistorySearchRevision(structure.pubkey);
    return changed;
}

/** Finds existing Structure references from pending deletion requests, without adding an alias index. */
export async function reconcileSensitivePayloadDeletionForCandidate(
    payloadId: string,
    db: EHagakiDB = ehagakiDb,
    now: () => number = Date.now,
): Promise<void> {
    const requests = await db.postHistoryDeletionRequests
        .where("targetEventId")
        .equals(payloadId)
        .toArray();
    const structureIds = new Set<string>();
    for (const request of requests) {
        if (
            request.rawEventVerification?.status !== "valid"
            || request.rawEventVerification.ruleVersion !== RAW_EVENT_VERIFICATION_RULE_VERSION
        ) {
            continue;
        }
        const deletion = request.rawEvent as NostrEvent;
        if (!isFullyVerifiedEvent(deletion) || deletion.kind !== 5) continue;
        for (const tag of deletion.tags) {
            if (tag[0] === "e" && tag[1] && tag[1] !== payloadId) {
                structureIds.add(tag[1]);
            }
        }
    }

    for (const structureId of structureIds) {
        await reconcileSensitivePayloadDeletionForStructure(structureId, db, now);
    }
}
