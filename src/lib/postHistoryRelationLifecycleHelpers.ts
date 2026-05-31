export function normalizeNonEmptyEventIds(eventIds: string[]): string[] {
    return Array.from(new Set(eventIds.filter((eventId) => !!eventId)));
}

export function uniqueRequestKeysFromCandidates<Candidate extends { requestKey: string }>(
    candidates: Candidate[],
): string[] {
    return Array.from(new Set(candidates.map((candidate) => candidate.requestKey)));
}

export function mapStateRecordsByRequestKey<StateRecord extends { requestKey: string }>(
    records: StateRecord[],
): Map<string, StateRecord> {
    return new Map(records.map((record) => [record.requestKey, record]));
}

export interface PartitionRelationLifecycleCandidatesParams<
    Candidate extends { requestKey: string },
    StateRecord,
> {
    candidates: Candidate[];
    existingStateByRequestKey: Map<string, StateRecord>;
    hasInFlightRequest: (requestKey: string) => boolean;
    isFailedState: (state: StateRecord) => boolean;
    canRetryFailedState: (state: StateRecord) => boolean;
}

export function partitionRelationLifecycleCandidates<
    Candidate extends { requestKey: string },
    StateRecord,
>({
    candidates,
    existingStateByRequestKey,
    hasInFlightRequest,
    isFailedState,
    canRetryFailedState,
}: PartitionRelationLifecycleCandidatesParams<Candidate, StateRecord>): {
    admittedCandidates: Candidate[];
    skippedCandidates: Candidate[];
} {
    const admittedCandidates: Candidate[] = [];
    const skippedCandidates: Candidate[] = [];

    for (const candidate of candidates) {
        const existingState = existingStateByRequestKey.get(candidate.requestKey);
        const blockedByFailedState = !!existingState
            && isFailedState(existingState)
            && !canRetryFailedState(existingState);
        if (hasInFlightRequest(candidate.requestKey) || blockedByFailedState) {
            skippedCandidates.push(candidate);
            continue;
        }

        admittedCandidates.push(candidate);
    }

    return {
        admittedCandidates,
        skippedCandidates,
    };
}

export interface NormalizeRelationLifecycleRecordsParams<
    StateRecord extends { requestKey: string },
    Candidate,
    StatePatch,
> {
    records: StateRecord[];
    toCandidate: (record: StateRecord) => Candidate;
    verifyConsistency: (params: {
        candidates: Candidate[];
        statesByRequestKey: Map<string, StateRecord>;
    }) => Promise<{
        statePatches: StatePatch[];
        resolvedRequestKeys?: string[];
    }>;
    saveMany: (patches: StatePatch[]) => Promise<StateRecord[]>;
    deleteMany: (requestKeys: string[]) => Promise<void>;
}

export async function normalizeRelationLifecycleRecords<
    StateRecord extends { requestKey: string },
    Candidate,
    StatePatch,
>({
    records,
    toCandidate,
    verifyConsistency,
    saveMany,
    deleteMany,
}: NormalizeRelationLifecycleRecordsParams<StateRecord, Candidate, StatePatch>): Promise<StateRecord[]> {
    if (records.length === 0) {
        return records;
    }

    const verificationResult = await verifyConsistency({
        candidates: records.map((record) => toCandidate(record)),
        statesByRequestKey: mapStateRecordsByRequestKey(records),
    });
    const resolvedRequestKeys = verificationResult.resolvedRequestKeys ?? [];

    if (verificationResult.statePatches.length === 0) {
        if (resolvedRequestKeys.length === 0) {
            return records;
        }

        await deleteMany(resolvedRequestKeys);
        const resolvedRequestKeySet = new Set(resolvedRequestKeys);
        return records.filter((record) => !resolvedRequestKeySet.has(record.requestKey));
    }

    const normalizedRecords = await saveMany(verificationResult.statePatches);
    if (resolvedRequestKeys.length > 0) {
        await deleteMany(resolvedRequestKeys);
    }
    const normalizedRecordsByRequestKey = mapStateRecordsByRequestKey(normalizedRecords);
    const resolvedRequestKeySet = new Set(resolvedRequestKeys);

    return records.flatMap((record) => {
        if (resolvedRequestKeySet.has(record.requestKey)) {
            return [];
        }

        return [normalizedRecordsByRequestKey.get(record.requestKey) ?? record];
    });
}
