export type PendingDeletionRequestStatus = "sending" | "failed";

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