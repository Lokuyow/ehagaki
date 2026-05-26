export type PendingDeletionRequestStatus =
    | "pending"
    | "processing"
    | "success"
    | "failed";

export const pendingDeletionRequestsState = $state<
    Record<string, PendingDeletionRequestStatus | undefined>
>({});

export function setPendingDeletionRequest(
    eventId: string,
    status: PendingDeletionRequestStatus,
): void {
    if (!eventId) {
        return;
    }

    pendingDeletionRequestsState[eventId] = status;
}

export function updatePendingDeletionRequests(
    nextEntries: Record<string, PendingDeletionRequestStatus | undefined>,
): void {
    for (const [eventId, status] of Object.entries(nextEntries)) {
        if (!eventId) {
            continue;
        }

        if (status === undefined) {
            delete pendingDeletionRequestsState[eventId];
            continue;
        }

        pendingDeletionRequestsState[eventId] = status;
    }
}

export function clearPendingDeletionRequest(eventId: string): void {
    if (!eventId) {
        return;
    }

    delete pendingDeletionRequestsState[eventId];
}

export function resetPendingDeletionRequests(): void {
    for (const eventId of Object.keys(pendingDeletionRequestsState)) {
        delete pendingDeletionRequestsState[eventId];
    }
}

export function replacePendingDeletionRequests(
    nextEntries: Record<string, PendingDeletionRequestStatus | undefined>,
): void {
    resetPendingDeletionRequests();
    updatePendingDeletionRequests(nextEntries);
}