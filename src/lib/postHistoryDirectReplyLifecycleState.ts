const inFlightPostHistoryDirectReplyLifecycleRequestKeys = new Set<string>();

export function hasInFlightPostHistoryDirectReplyLifecycleRequest(
    requestKey: string,
): boolean {
    return inFlightPostHistoryDirectReplyLifecycleRequestKeys.has(requestKey);
}

export function addInFlightPostHistoryDirectReplyLifecycleRequests(
    requestKeys: string[],
): void {
    for (const requestKey of requestKeys) {
        if (!requestKey) {
            continue;
        }

        inFlightPostHistoryDirectReplyLifecycleRequestKeys.add(requestKey);
    }
}

export function removeInFlightPostHistoryDirectReplyLifecycleRequests(
    requestKeys: string[],
): void {
    for (const requestKey of requestKeys) {
        inFlightPostHistoryDirectReplyLifecycleRequestKeys.delete(requestKey);
    }
}

export function resetInFlightPostHistoryDirectReplyLifecycleRequests(): void {
    inFlightPostHistoryDirectReplyLifecycleRequestKeys.clear();
}
