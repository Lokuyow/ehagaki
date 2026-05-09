import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRelayFetchResult } from "./postHistoryRelayFetchService";
import type {
    ChannelMetadataCache,
} from "./storage/channelMetadataRepository";
import type { PostHistoryRecord } from "./storage/ehagakiDb";

export type ChannelDisplayState = {
    status: "loading" | "resolved" | "failed";
    name: string | null;
};

export function canContinueRelayHistory(
    result: PostHistoryRelayFetchResult,
): boolean {
    if (result.nextUntil === null) {
        return false;
    }

    return result.status === "success"
        ? result.hasMore
        : result.events.length > 0;
}

export function resolveSyncStatusAfterFetch(
    result: PostHistoryRelayFetchResult,
    didMateriallyChange: boolean,
): "idle" | "synced" | "failed" {
    if (result.status === "error") {
        return "failed";
    }

    if (result.status === "timeout") {
        return "idle";
    }

    return didMateriallyChange ? "synced" : "idle";
}

export function toChannelDisplayState(
    cachedRecord: ChannelMetadataCache | null,
    canLoad: boolean,
): ChannelDisplayState {
    if (!cachedRecord) {
        return {
            status: canLoad ? "loading" : "failed",
            name: null,
        };
    }

    return {
        status: cachedRecord.name ? "resolved" : "failed",
        name: cachedRecord.name,
    };
}

export function buildChannelRelayHints(
    sourcePost: PostHistoryRecord | undefined,
    cachedRecord: ChannelMetadataCache | null,
): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls(
        [
            ...(sourcePost?.channelRelayHints ?? []),
            ...(cachedRecord?.relayHints ?? []),
            ...(cachedRecord?.relays ?? []),
            ...(sourcePost?.relayHints ?? []),
            ...(sourcePost?.fetchedRelays ?? []),
            ...(sourcePost?.acceptedRelays ?? []),
        ],
        { limit: RelayConfigUtils.EXTERNAL_INPUT_RELAY_LIMIT },
    );
}

export function resolveSafePage(
    page: number,
    totalCount: number,
    pageSize: number,
): number {
    const nextTotalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    return totalCount === 0 ? 1 : Math.min(page, nextTotalPages);
}

export function formatPostedAt(
    postedAt: number,
    now: number = Date.now(),
): string {
    const postedDate = new Date(postedAt);
    const diffMs = Math.abs(now - postedAt);
    const minuteTimeFormat: Intl.DateTimeFormatOptions = {
        hour: "numeric",
        minute: "2-digit",
    };

    if (diffMs < 24 * 60 * 60 * 1000) {
        return new Intl.DateTimeFormat(undefined, minuteTimeFormat).format(
            postedDate,
        );
    }

    const monthDayTimeFormat: Intl.DateTimeFormatOptions = {
        month: "numeric",
        day: "numeric",
        ...minuteTimeFormat,
    };

    if (diffMs < 365 * 24 * 60 * 60 * 1000) {
        return new Intl.DateTimeFormat(
            undefined,
            monthDayTimeFormat,
        ).format(postedDate);
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    }).format(postedDate);
}

export function buildPreview(content: string): string {
    const normalized = content.trim();
    return normalized || " ";
}