import type { RelayConfig } from "./types";

export type PostHistoryDeletionAwareSaveStatus = "saved" | "cancelled";

export interface PostHistoryDeletionAwareSaveRequest<Item> {
    items: Item[];
    relayHints?: string[];
    relayConfig?: RelayConfig | null;
    fetchedAt?: number;
    isActive?: () => boolean;
}

export interface PostHistoryDeletionAwareSaveResult {
    status: PostHistoryDeletionAwareSaveStatus;
    deletedEventIds: string[];
    deletionConfirmationIncomplete: boolean;
}

export interface PostHistoryDeletionAwareSaveTask<Result> {
    promise: Promise<Result>;
    cancel: () => void;
}
