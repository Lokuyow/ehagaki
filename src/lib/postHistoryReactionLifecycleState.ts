import { createRelationLifecycleInFlightRegistry } from "./postHistoryRelationDeletionLifecycle";

const inFlightPostHistoryReactionLifecycleRequests = createRelationLifecycleInFlightRegistry();

export function hasInFlightPostHistoryReactionLifecycleRequest(
    requestKey: string,
): boolean {
    return inFlightPostHistoryReactionLifecycleRequests.has(requestKey);
}

export function addInFlightPostHistoryReactionLifecycleRequests(
    requestKeys: string[],
): void {
    inFlightPostHistoryReactionLifecycleRequests.add(requestKeys);
}

export function removeInFlightPostHistoryReactionLifecycleRequests(
    requestKeys: string[],
): void {
    inFlightPostHistoryReactionLifecycleRequests.remove(requestKeys);
}

export function resetInFlightPostHistoryReactionLifecycleRequests(): void {
    inFlightPostHistoryReactionLifecycleRequests.reset();
}
