export interface PostHistoryThreadGraphTaskTracker {
    getRequestId(): number;
    incrementRequestId(): number;
    createChildRequestToken(key: string): number;
    getChildRequestToken(key: string): number | undefined;
    deleteChildRequestToken(key: string): void;
    clearChildRequestTokens(): void;
}

export function createPostHistoryThreadGraphTaskTracker(): PostHistoryThreadGraphTaskTracker {
    let requestId = 0;
    let childRequestId = 0;
    const childRequestTokensByKey = new Map<string, number>();

    return {
        getRequestId(): number {
            return requestId;
        },

        incrementRequestId(): number {
            requestId += 1;
            return requestId;
        },

        createChildRequestToken(key: string): number {
            childRequestId += 1;
            childRequestTokensByKey.set(key, childRequestId);
            return childRequestId;
        },

        getChildRequestToken(key: string): number | undefined {
            return childRequestTokensByKey.get(key);
        },

        deleteChildRequestToken(key: string): void {
            childRequestTokensByKey.delete(key);
        },

        clearChildRequestTokens(): void {
            childRequestTokensByKey.clear();
        },
    };
}
