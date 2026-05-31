import type { PostHistoryReplyFetchTask } from "./postHistoryReplyFetchService";
import type { PostHistoryDeletionFetchTask } from "./postHistoryDeletionFetchService";

export interface PostHistoryThreadGraphTaskTracker {
    getRequestId(): number;
    incrementRequestId(): number;
    createChildRequestToken(key: string): number;
    getChildRequestToken(key: string): number | undefined;
    deleteChildRequestToken(key: string): void;
    clearChildRequestTokens(): void;
    replaceChildrenFetchTask(key: string, task: PostHistoryReplyFetchTask): void;
    deleteChildrenFetchTask(key: string): void;
    replaceDeletionFetchTask(key: string, task: PostHistoryDeletionFetchTask): void;
    deleteDeletionFetchTask(key: string): void;
    cancelAndClearFetchTasks(): void;
}

export function createPostHistoryThreadGraphTaskTracker(): PostHistoryThreadGraphTaskTracker {
    let requestId = 0;
    let childRequestId = 0;
    const childRequestTokensByKey = new Map<string, number>();
    const childrenFetchTasksByKey = new Map<string, PostHistoryReplyFetchTask>();
    const deletionFetchTasksByKey = new Map<string, PostHistoryDeletionFetchTask>();

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

        replaceChildrenFetchTask(key: string, task: PostHistoryReplyFetchTask): void {
            childrenFetchTasksByKey.get(key)?.cancel();
            childrenFetchTasksByKey.set(key, task);
        },

        deleteChildrenFetchTask(key: string): void {
            childrenFetchTasksByKey.delete(key);
        },

        replaceDeletionFetchTask(key: string, task: PostHistoryDeletionFetchTask): void {
            deletionFetchTasksByKey.get(key)?.cancel();
            deletionFetchTasksByKey.set(key, task);
        },

        deleteDeletionFetchTask(key: string): void {
            deletionFetchTasksByKey.delete(key);
        },

        cancelAndClearFetchTasks(): void {
            childrenFetchTasksByKey.forEach((task) => task.cancel());
            deletionFetchTasksByKey.forEach((task) => task.cancel());
            childrenFetchTasksByKey.clear();
            deletionFetchTasksByKey.clear();
        },
    };
}
