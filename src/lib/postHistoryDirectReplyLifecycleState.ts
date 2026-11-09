import { createRelationLifecycleInFlightRegistry } from "./postHistoryRelationDeletionLifecycle";

const inFlightPostHistoryDirectReplyLifecycleRequests = createRelationLifecycleInFlightRegistry();

export function hasInFlightPostHistoryDirectReplyLifecycleRequest(
    requestKey: string,
): boolean {
    return inFlightPostHistoryDirectReplyLifecycleRequests.has(requestKey);
}

export function addInFlightPostHistoryDirectReplyLifecycleRequests(
    requestKeys: string[],
): void {
    inFlightPostHistoryDirectReplyLifecycleRequests.add(requestKeys);
}

export function removeInFlightPostHistoryDirectReplyLifecycleRequests(
    requestKeys: string[],
): void {
    inFlightPostHistoryDirectReplyLifecycleRequests.remove(requestKeys);
}

export function resetInFlightPostHistoryDirectReplyLifecycleRequests(): void {
    inFlightPostHistoryDirectReplyLifecycleRequests.reset();
}
