/**
 * Shared deletion lifecycle for child relations (reactions, direct replies).
 *
 * The per-kind modules (postHistoryReaction* / postHistoryDirectReply*) keep
 * their public names, persisted record field names and Route A entry points;
 * this module holds the logic once, expressed with neutral "target" names.
 * It must not import the per-kind modules or the pending-deletion reconcile
 * module, which depend on them.
 */
import type { RxNostr } from "rx-nostr";
import {
    postHistoryDeletionFetchService,
    type PostHistoryDeletionFetchService,
} from "./postHistoryDeletionFetchService";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryChildInteractionsRepository,
    type PostHistoryChildInteractionsRepository,
} from "./storage/postHistoryChildInteractionsRepository";
import {
    mapStateRecordsByRequestKey,
    normalizeNonEmptyEventIds,
    partitionRelationLifecycleCandidates,
    uniqueRequestKeysFromCandidates,
} from "./postHistoryRelationLifecycleHelpers";
import type {
    PostHistoryRelationLifecycleSource,
    PostHistoryRelationLifecycleStateStatus,
} from "./postHistoryRelationLifecycleTypes";
import type { PostHistoryChildInteractionRecord } from "./storage/ehagakiDb";
import type { NostrEvent, RelayConfig } from "./types";

// --- In-flight request registry -------------------------------------------

export interface RelationLifecycleInFlightRegistry {
    has(requestKey: string): boolean;
    add(requestKeys: string[]): void;
    remove(requestKeys: string[]): void;
    reset(): void;
}

export function createRelationLifecycleInFlightRegistry(): RelationLifecycleInFlightRegistry {
    const requestKeys = new Set<string>();
    return {
        has: (requestKey) => requestKeys.has(requestKey),
        add: (keys) => {
            for (const requestKey of keys) {
                if (!requestKey) {
                    continue;
                }

                requestKeys.add(requestKey);
            }
        },
        remove: (keys) => {
            for (const requestKey of keys) {
                requestKeys.delete(requestKey);
            }
        },
        reset: () => requestKeys.clear(),
    };
}

// --- Deletion cleanup -------------------------------------------------------

export interface RelationDeletionCleanupRequest {
    parentEventIds: string[];
    targetEventIds?: string[];
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface RelationDeletionCleanupResult {
    status: "completed" | "partial" | "cancelled";
    checkedParentEventIds: string[];
    deletedEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

export interface RelationDeletionCleanupDeps {
    getRecords: (parentEventId: string) => Promise<PostHistoryChildInteractionRecord[]>;
    deletionFetchService?: Pick<PostHistoryDeletionFetchService, "fetchDeletionRequests">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getDeletedTargets" | "upsertValidDeletionRequests"
    >;
    childInteractionsRepository?: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;
}

interface RelationCleanupItem {
    parentEventId: string;
    record: PostHistoryChildInteractionRecord;
    targetEvent: NostrEvent;
}

const EMPTY_CLEANUP_RESULT: RelationDeletionCleanupResult = {
    status: "completed",
    checkedParentEventIds: [],
    deletedEventIds: [],
    deletionConfirmationIncomplete: false,
};

function toTargetEvent(record: PostHistoryChildInteractionRecord): NostrEvent {
    return {
        id: record.eventId,
        pubkey: record.authorPubkey,
        created_at: record.createdAt,
        kind: record.kind,
        tags: record.tags.map((tag) => [...tag]),
        content: record.content,
        sig: "",
    };
}

function toDeletedEventIds(
    items: RelationCleanupItem[],
    deletedTargets: Map<string, Set<string>>,
): string[] {
    return normalizeNonEmptyEventIds(
        items
            .filter((item) =>
                deletedTargets.get(item.targetEvent.pubkey)?.has(item.targetEvent.id),
            )
            .map((item) => item.record.eventId),
    );
}

export class RelationDeletionCleanup {
    private getRecords: RelationDeletionCleanupDeps["getRecords"];
    private deletionFetchService: NonNullable<RelationDeletionCleanupDeps["deletionFetchService"]>;
    private deletionRequestsRepository: NonNullable<RelationDeletionCleanupDeps["deletionRequestsRepository"]>;
    private childInteractionsRepository: NonNullable<RelationDeletionCleanupDeps["childInteractionsRepository"]>;

    constructor(deps: RelationDeletionCleanupDeps) {
        this.getRecords = deps.getRecords;
        this.deletionFetchService = deps.deletionFetchService ?? postHistoryDeletionFetchService;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async cleanup(
        rxNostr: RxNostr,
        params: RelationDeletionCleanupRequest,
    ): Promise<RelationDeletionCleanupResult> {
        const isActive = () => params.isActive?.() !== false;
        const checkedParentEventIds = normalizeNonEmptyEventIds(params.parentEventIds);
        const checkedTargetEventIds = normalizeNonEmptyEventIds(params.targetEventIds ?? []);
        if (checkedParentEventIds.length === 0) {
            return EMPTY_CLEANUP_RESULT;
        }

        const allItems = await this.loadItems(checkedParentEventIds, checkedTargetEventIds);
        if (!isActive()) {
            return {
                ...EMPTY_CLEANUP_RESULT,
                status: "cancelled",
                checkedParentEventIds,
            };
        }

        const knownDeleted = await this.filterKnownDeleted(allItems);
        if (!isActive()) {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedEventIds: knownDeleted.deletedEventIds,
                deletionConfirmationIncomplete: false,
            };
        }

        if (knownDeleted.visibleItems.length === 0) {
            return {
                status: "completed",
                checkedParentEventIds,
                deletedEventIds: knownDeleted.deletedEventIds,
                deletionConfirmationIncomplete: false,
            };
        }

        const fetchTask = this.deletionFetchService.fetchDeletionRequests(rxNostr, {
            targets: knownDeleted.visibleItems.map((item) => ({
                event: item.targetEvent,
                relayUrls: item.record.relayUrls,
            })),
            relayConfig: params.relayConfig,
        });
        const fetchResult = await fetchTask.promise;
        if (!isActive() || fetchResult.status === "cancelled") {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedEventIds: knownDeleted.deletedEventIds,
                deletionConfirmationIncomplete: fetchResult.status !== "success",
            };
        }

        if (fetchResult.events.length > 0) {
            await this.deletionRequestsRepository.upsertValidDeletionRequests({
                targetEvents: knownDeleted.visibleItems.map((item) => item.targetEvent),
                deletionEvents: fetchResult.events,
                fetchedAt: fetchResult.fetchedAt,
            });
        }

        if (!isActive()) {
            return {
                status: "cancelled",
                checkedParentEventIds,
                deletedEventIds: knownDeleted.deletedEventIds,
                deletionConfirmationIncomplete: fetchResult.status !== "success",
            };
        }

        const confirmedDeleted = await this.filterKnownDeleted(knownDeleted.visibleItems);
        const deletedEventIds = normalizeNonEmptyEventIds([
            ...knownDeleted.deletedEventIds,
            ...confirmedDeleted.deletedEventIds,
        ]);
        const deletionConfirmationIncomplete = fetchResult.status !== "success";

        return {
            status: deletionConfirmationIncomplete ? "partial" : "completed",
            checkedParentEventIds,
            deletedEventIds,
            deletionConfirmationIncomplete,
        };
    }

    private async loadItems(
        parentEventIds: string[],
        targetEventIds: string[],
    ): Promise<RelationCleanupItem[]> {
        const items: RelationCleanupItem[] = [];
        const allowedTargetEventIdSet = targetEventIds.length > 0
            ? new Set(targetEventIds)
            : null;

        for (const parentEventId of parentEventIds) {
            const records = await this.getRecords(parentEventId);
            for (const record of records) {
                if (
                    allowedTargetEventIdSet
                    && !allowedTargetEventIdSet.has(record.eventId)
                ) {
                    continue;
                }

                items.push({
                    parentEventId,
                    record,
                    targetEvent: toTargetEvent(record),
                });
            }
        }

        return items;
    }

    private async filterKnownDeleted(
        items: RelationCleanupItem[],
    ): Promise<{
        visibleItems: RelationCleanupItem[];
        deletedEventIds: string[];
    }> {
        if (items.length === 0) {
            return {
                visibleItems: [],
                deletedEventIds: [],
            };
        }

        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            items.map((item) => ({
                targetAuthorPubkey: item.targetEvent.pubkey,
                targetEventId: item.targetEvent.id,
            })),
        );
        const deletedEventIds = toDeletedEventIds(items, deletedTargets);
        await this.purgeDeletedCache(deletedEventIds);
        const deletedEventIdSet = new Set(deletedEventIds);

        return {
            visibleItems: items.filter((item) => !deletedEventIdSet.has(item.record.eventId)),
            deletedEventIds,
        };
    }

    private async purgeDeletedCache(eventIds: string[]): Promise<void> {
        for (const eventId of normalizeNonEmptyEventIds(eventIds)) {
            await this.childInteractionsRepository.deleteChildInteractionByEventId(eventId);
        }
    }
}

// --- Consistency verification ----------------------------------------------

/** Neutral view of a per-kind lifecycle candidate. */
export interface RelationLifecycleTarget {
    requestKey: string;
    parentEventId: string;
    targetEventId: string;
    targetAuthorPubkey: string;
}

export interface RelationLifecycleStateView {
    source: PostHistoryRelationLifecycleSource;
    status: PostHistoryRelationLifecycleStateStatus;
    attemptCount: number;
}

export interface RelationDeletionConsistencyRequest<
    Candidate,
    StateRecord extends RelationLifecycleStateView,
> {
    candidates: Candidate[];
    statesByRequestKey: Map<string, StateRecord>;
    deletionConfirmationIncomplete?: boolean;
    isActive?: () => boolean;
}

export interface RelationDeletionConsistencyResult<StatePatch> {
    deletedEventIds: string[];
    correctedRequestKeys: string[];
    resolvedRequestKeys: string[];
    statePatches: StatePatch[];
}

export interface RelationDeletionConsistencyDeps<Candidate, StateRecord, StatePatch> {
    getRecords: (parentEventId: string) => Promise<PostHistoryChildInteractionRecord[]>;
    toTarget: (candidate: Candidate) => RelationLifecycleTarget;
    hasInFlightRequest: (requestKey: string) => boolean;
    buildFailedStatePatch: (candidate: Candidate, state: StateRecord) => StatePatch;
    deletionRequestsRepository?: Pick<PostHistoryDeletionRequestsRepository, "getDeletedTargets">;
    childInteractionsRepository?: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;
}

function emptyConsistencyResult<StatePatch>(): RelationDeletionConsistencyResult<StatePatch> {
    return {
        deletedEventIds: [],
        correctedRequestKeys: [],
        resolvedRequestKeys: [],
        statePatches: [],
    };
}

export class RelationDeletionConsistency<
    Candidate extends { requestKey: string },
    StateRecord extends RelationLifecycleStateView,
    StatePatch,
> {
    private deps: RelationDeletionConsistencyDeps<Candidate, StateRecord, StatePatch>;
    private deletionRequestsRepository: Pick<PostHistoryDeletionRequestsRepository, "getDeletedTargets">;
    private childInteractionsRepository: Pick<
        PostHistoryChildInteractionsRepository,
        "deleteChildInteractionByEventId"
    >;

    constructor(deps: RelationDeletionConsistencyDeps<Candidate, StateRecord, StatePatch>) {
        this.deps = deps;
        this.deletionRequestsRepository =
            deps.deletionRequestsRepository ?? postHistoryDeletionRequestsRepository;
        this.childInteractionsRepository =
            deps.childInteractionsRepository ?? postHistoryChildInteractionsRepository;
    }

    async verifyConsistency(
        params: RelationDeletionConsistencyRequest<Candidate, StateRecord>,
    ): Promise<RelationDeletionConsistencyResult<StatePatch>> {
        const isActive = () => params.isActive?.() !== false;
        const uniqueCandidates = Array.from(new Map(
            params.candidates.map((candidate) => [candidate.requestKey, candidate]),
        ).values());
        if (uniqueCandidates.length === 0) {
            return emptyConsistencyResult();
        }

        const targets = uniqueCandidates.map((candidate) => this.deps.toTarget(candidate));
        const uniqueParentEventIds = normalizeNonEmptyEventIds(
            targets.map((target) => target.parentEventId),
        );
        const recordsByParentEventId = new Map<string, PostHistoryChildInteractionRecord[]>();
        for (const parentEventId of uniqueParentEventIds) {
            recordsByParentEventId.set(parentEventId, await this.deps.getRecords(parentEventId));
        }
        if (!isActive()) {
            return emptyConsistencyResult();
        }

        const rowsByParentEventId = new Map<string, Map<string, PostHistoryChildInteractionRecord>>();
        for (const parentEventId of uniqueParentEventIds) {
            rowsByParentEventId.set(
                parentEventId,
                new Map(
                    (recordsByParentEventId.get(parentEventId) ?? []).map((record) => [
                        record.eventId,
                        record,
                    ]),
                ),
            );
        }
        const deletedTargets = await this.deletionRequestsRepository.getDeletedTargets(
            targets.map((target) => ({
                targetAuthorPubkey: target.targetAuthorPubkey,
                targetEventId: target.targetEventId,
            })),
        );

        const deletedEventIds: string[] = [];
        const correctedRequestKeys: string[] = [];
        const resolvedRequestKeys: string[] = [];
        const statePatches: StatePatch[] = [];
        for (const [index, candidate] of uniqueCandidates.entries()) {
            const target = targets[index];
            const currentState = params.statesByRequestKey.get(candidate.requestKey);
            if (!currentState) {
                continue;
            }

            const rowsByEventId = rowsByParentEventId.get(target.parentEventId) ?? new Map();
            const rowExists = rowsByEventId.has(target.targetEventId);
            const deletionRequestExists =
                deletedTargets.get(target.targetAuthorPubkey)?.has(target.targetEventId)
                ?? false;

            let nextRowExists = rowExists;
            if (deletionRequestExists && rowExists) {
                await this.childInteractionsRepository.deleteChildInteractionByEventId(
                    target.targetEventId,
                );
                nextRowExists = false;
                correctedRequestKeys.push(candidate.requestKey);
                deletedEventIds.push(target.targetEventId);
            }

            if (deletionRequestExists || !nextRowExists || currentState.status === "success") {
                resolvedRequestKeys.push(candidate.requestKey);
                continue;
            }

            const isInFlight = this.deps.hasInFlightRequest(candidate.requestKey);
            const shouldPersistFailure =
                params.deletionConfirmationIncomplete === true
                || (
                    (currentState.status === "pending" || currentState.status === "processing")
                    && !isInFlight
                );

            if (!shouldPersistFailure) {
                resolvedRequestKeys.push(candidate.requestKey);
                continue;
            }

            if (currentState.status === "failed") {
                continue;
            }

            statePatches.push(this.deps.buildFailedStatePatch(candidate, currentState));
        }

        return {
            deletedEventIds: normalizeNonEmptyEventIds(deletedEventIds),
            correctedRequestKeys: normalizeNonEmptyEventIds(correctedRequestKeys),
            resolvedRequestKeys: normalizeNonEmptyEventIds(resolvedRequestKeys),
            statePatches,
        };
    }
}

// --- Lifecycle trigger --------------------------------------------------------

export interface RelationLifecycleTriggerRequest {
    source: PostHistoryRelationLifecycleSource;
    parentEventIds: string[];
    rxNostr?: RxNostr;
    relayConfig?: RelayConfig | null;
    isActive?: () => boolean;
}

export interface RelationLifecycleTriggerResult extends RelationDeletionCleanupResult {
    source: PostHistoryRelationLifecycleSource;
}

export interface RelationLifecycleRecordsSource {
    getRecords(parentEventId: string): Promise<PostHistoryChildInteractionRecord[]>;
    getRecordsForParents?: (parentEventIds: string[]) => Promise<PostHistoryChildInteractionRecord[]>;
}

export type RelationLifecycleStateTransition = {
    status: PostHistoryRelationLifecycleStateStatus;
    attemptCount?: number;
};

export interface RelationLifecycleTriggerConfig<
    Candidate extends { requestKey: string; parentEventId: string },
    StateRecord extends RelationLifecycleStateView & {
        requestKey: string;
        updatedAt: number;
    },
    StateInput,
> {
    /** Resolved per call so test doubles and late-bound singletons are honored. */
    getRecordsSource: () => RelationLifecycleRecordsSource;
    getStateRepository: () => {
        getMany(requestKeys: string[]): Promise<StateRecord[]>;
        saveMany(inputs: StateInput[]): Promise<StateRecord[]>;
        deleteMany(requestKeys: string[]): Promise<void>;
    };
    toCandidate: (parentEventId: string, record: PostHistoryChildInteractionRecord) => Candidate;
    getTargetEventId: (candidate: Candidate) => string;
    toStateInput: (
        candidate: Candidate,
        source: PostHistoryRelationLifecycleSource,
        transition: RelationLifecycleStateTransition,
    ) => StateInput;
    inFlight: Pick<RelationLifecycleInFlightRegistry, "has" | "add" | "remove">;
    canRetryFailedState: (state: StateRecord) => boolean;
    cleanup: (
        rxNostr: RxNostr,
        params: RelationDeletionCleanupRequest,
    ) => Promise<RelationDeletionCleanupResult>;
    verifyConsistency: (params: {
        candidates: Candidate[];
        statesByRequestKey: Map<string, StateRecord>;
        deletionConfirmationIncomplete: boolean;
        isActive?: () => boolean;
    }) => Promise<{
        deletedEventIds: string[];
        resolvedRequestKeys?: string[];
        statePatches: StateInput[];
    }>;
    reconcilePendingDeletionRequests: (requestKeys: string[]) => Promise<unknown>;
}

async function loadRelationLifecycleCandidates<Candidate extends { requestKey: string }>(
    parentEventIds: string[],
    recordsSource: RelationLifecycleRecordsSource,
    toCandidate: (parentEventId: string, record: PostHistoryChildInteractionRecord) => Candidate,
): Promise<Candidate[]> {
    const candidates: Candidate[] = [];
    const recordsByParentEventId = new Map<string, PostHistoryChildInteractionRecord[]>();

    if (recordsSource.getRecordsForParents) {
        const records = await recordsSource.getRecordsForParents(parentEventIds);
        for (const record of records) {
            const parentRecords = recordsByParentEventId.get(record.parentEventId) ?? [];
            parentRecords.push(record);
            recordsByParentEventId.set(record.parentEventId, parentRecords);
        }
    }

    for (const parentEventId of parentEventIds) {
        const records = recordsSource.getRecordsForParents
            ? recordsByParentEventId.get(parentEventId) ?? []
            : await recordsSource.getRecords(parentEventId);
        for (const record of records) {
            candidates.push(toCandidate(parentEventId, record));
        }
    }

    return Array.from(new Map(
        candidates.map((candidate) => [candidate.requestKey, candidate]),
    ).values());
}

export function createRelationLifecycleTrigger<
    Candidate extends { requestKey: string; parentEventId: string },
    StateRecord extends RelationLifecycleStateView & {
        requestKey: string;
        updatedAt: number;
    },
    StateInput,
>(
    config: RelationLifecycleTriggerConfig<Candidate, StateRecord, StateInput>,
): (request: RelationLifecycleTriggerRequest) => Promise<RelationLifecycleTriggerResult> {
    const reconcile = (requestKeys: string[]) =>
        config.reconcilePendingDeletionRequests(requestKeys).catch(() => undefined);

    return async (request) => {
        const stateRepository = config.getStateRepository();
        const saveTransitions = async (
            candidates: Candidate[],
            transition: (candidate: Candidate) => RelationLifecycleStateTransition,
        ): Promise<StateRecord[]> => {
            if (candidates.length === 0) {
                return [];
            }

            return stateRepository.saveMany(
                candidates.map((candidate) =>
                    config.toStateInput(candidate, request.source, transition(candidate))),
            );
        };

        const parentEventIds = normalizeNonEmptyEventIds(request.parentEventIds);
        if (parentEventIds.length === 0) {
            return {
                source: request.source,
                status: "completed",
                checkedParentEventIds: parentEventIds,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            };
        }

        const candidates = await loadRelationLifecycleCandidates(
            parentEventIds,
            config.getRecordsSource(),
            config.toCandidate,
        );
        const existingStateRecords = await stateRepository.getMany(
            uniqueRequestKeysFromCandidates(candidates),
        );
        const existingStateByRequestKey = mapStateRecordsByRequestKey(existingStateRecords);
        const {
            skippedCandidates,
            admittedCandidates,
        } = partitionRelationLifecycleCandidates({
            candidates,
            existingStateByRequestKey,
            hasInFlightRequest: config.inFlight.has,
            isFailedState: (state) => state.status === "failed",
            canRetryFailedState: config.canRetryFailedState,
        });

        if (!request.rxNostr || admittedCandidates.length === 0) {
            await reconcile(uniqueRequestKeysFromCandidates(candidates));

            return {
                source: request.source,
                status: "completed",
                checkedParentEventIds: parentEventIds,
                deletedEventIds: [],
                deletionConfirmationIncomplete: false,
            };
        }

        const admittedRequestKeys = uniqueRequestKeysFromCandidates(admittedCandidates);
        const admittedParentEventIds = () => Array.from(new Set(
            admittedCandidates.map((candidate) => candidate.parentEventId),
        ));
        config.inFlight.add(admittedRequestKeys);

        try {
            const pendingStateRecords = await saveTransitions(
                admittedCandidates,
                (candidate) => ({
                    status: "pending",
                    attemptCount:
                        (existingStateByRequestKey.get(candidate.requestKey)?.attemptCount ?? 0) + 1,
                }),
            );
            await reconcile(admittedRequestKeys);

            const pendingStateByRequestKey = new Map(
                pendingStateRecords.map((record) => [record.requestKey, record]),
            );
            const processingStateRecords = await saveTransitions(
                admittedCandidates,
                () => ({ status: "processing" }),
            );
            await reconcile(admittedRequestKeys);

            const processingStateByRequestKey = new Map(
                [...pendingStateByRequestKey.values(), ...processingStateRecords]
                    .map((record) => [record.requestKey, record]),
            );

            const result = await config.cleanup(request.rxNostr, {
                parentEventIds: admittedParentEventIds(),
                targetEventIds: admittedCandidates.map((candidate) => config.getTargetEventId(candidate)),
                relayConfig: request.relayConfig,
                isActive: request.isActive,
            });

            if (result.status === "cancelled") {
                await saveTransitions(admittedCandidates, () => ({ status: "failed" }));

                return {
                    source: request.source,
                    ...result,
                };
            }

            const consistencyResult = await config.verifyConsistency({
                candidates: admittedCandidates,
                statesByRequestKey: processingStateByRequestKey,
                deletionConfirmationIncomplete:
                    result.status !== "completed"
                    || result.deletionConfirmationIncomplete,
                isActive: request.isActive,
            });
            const resolvedRequestKeys = consistencyResult.resolvedRequestKeys ?? [];
            const finalStateRecords = consistencyResult.statePatches.length > 0
                ? await stateRepository.saveMany(consistencyResult.statePatches)
                : [];
            if (resolvedRequestKeys.length > 0) {
                await stateRepository.deleteMany(resolvedRequestKeys);
            }
            const deletedEventIds = Array.from(new Set([
                ...result.deletedEventIds,
                ...consistencyResult.deletedEventIds,
            ]));
            const hasFailedState = finalStateRecords.some((record) => record.status === "failed");

            return {
                source: request.source,
                status:
                    result.deletionConfirmationIncomplete || hasFailedState
                        ? "partial"
                        : "completed",
                checkedParentEventIds: admittedParentEventIds(),
                deletedEventIds,
                deletionConfirmationIncomplete:
                    result.deletionConfirmationIncomplete || hasFailedState,
            };
        } catch {
            await saveTransitions(admittedCandidates, () => ({ status: "failed" }))
                .catch(() => undefined);

            return {
                source: request.source,
                status: "partial",
                checkedParentEventIds: admittedParentEventIds(),
                deletedEventIds: [],
                deletionConfirmationIncomplete: true,
            };
        } finally {
            config.inFlight.remove(admittedRequestKeys);
            await reconcile([
                ...admittedRequestKeys,
                ...uniqueRequestKeysFromCandidates(skippedCandidates),
            ]);
        }
    };
}
