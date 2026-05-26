const inFlightPostHistoryReactionLifecycleRequestKeys = new Set<string>();

export function hasInFlightPostHistoryReactionLifecycleRequest(
    requestKey: string,
): boolean {
    return inFlightPostHistoryReactionLifecycleRequestKeys.has(requestKey);
}

export function addInFlightPostHistoryReactionLifecycleRequests(
    requestKeys: string[],
): void {
    for (const requestKey of requestKeys) {
        if (!requestKey) {
            continue;
        }

        inFlightPostHistoryReactionLifecycleRequestKeys.add(requestKey);
    }
}

export function removeInFlightPostHistoryReactionLifecycleRequests(
    requestKeys: string[],
): void {
    for (const requestKey of requestKeys) {
        inFlightPostHistoryReactionLifecycleRequestKeys.delete(requestKey);
    }
}

export function resetInFlightPostHistoryReactionLifecycleRequests(): void {
    inFlightPostHistoryReactionLifecycleRequestKeys.clear();
}