import { validateEvent, verifyEvent } from "nostr-tools";
import type { NostrEvent } from "./types";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";

export const POST_HISTORY_JSONL_IMPORT_BATCH_SIZE = 100;

const NOSTR_EVENT_ID_PATTERN = /^[0-9a-f]{64}$/;

export type PostHistoryJsonlImportStatus =
    | "completed"
    | "partial"
    | "cancelled"
    | "account-changed"
    | "failed";

export interface PostHistoryJsonlImportResult {
    status: PostHistoryJsonlImportStatus;
    nonEmptyLineCount: number;
    invalidJsonCount: number;
    invalidStructureCount: number;
    invalidIdOrSignatureCount: number;
    fileDuplicateCount: number;
    otherAccountCount: number;
    unsupportedKindCount: number;
    uniquePostEventCount: number;
    insertedPostCount: number;
    updatedPostCount: number;
    unchangedPostCount: number;
    failedPostEventCount: number;
    uniqueDeletionEventCount: number;
    validDeletionETagCount: number;
    insertedDeletionRequestCount: number;
    updatedDeletionRequestCount: number;
    unchangedDeletionRequestCount: number;
    unsupportedDeletionEventCount: number;
    failedDeletionEventCount: number;
    appliedDeletionPostCount: number;
}

export interface PostHistoryJsonlImportInput {
    file: Pick<File, "stream">;
    ownerPubkeyHex: string;
    getCurrentPubkeyHex: () => string | null | undefined;
    signal?: AbortSignal;
    onProgress?: (result: Readonly<PostHistoryJsonlImportResult>) => void;
}

export interface PostHistoryJsonlImportServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "upsertImportedDeletionEvents"
    >;
}

type BufferedImportEvent =
    | { type: "post"; event: NostrEvent }
    | { type: "deletion"; event: NostrEvent };

function createEmptyResult(): PostHistoryJsonlImportResult {
    return {
        status: "completed",
        nonEmptyLineCount: 0,
        invalidJsonCount: 0,
        invalidStructureCount: 0,
        invalidIdOrSignatureCount: 0,
        fileDuplicateCount: 0,
        otherAccountCount: 0,
        unsupportedKindCount: 0,
        uniquePostEventCount: 0,
        insertedPostCount: 0,
        updatedPostCount: 0,
        unchangedPostCount: 0,
        failedPostEventCount: 0,
        uniqueDeletionEventCount: 0,
        validDeletionETagCount: 0,
        insertedDeletionRequestCount: 0,
        updatedDeletionRequestCount: 0,
        unchangedDeletionRequestCount: 0,
        unsupportedDeletionEventCount: 0,
        failedDeletionEventCount: 0,
        appliedDeletionPostCount: 0,
    };
}

function copyResult(result: PostHistoryJsonlImportResult): PostHistoryJsonlImportResult {
    return { ...result };
}

function getValidDeletionETagCount(event: NostrEvent): number {
    return event.tags.filter((tag) =>
        tag[0] === "e"
        && typeof tag[1] === "string"
        && NOSTR_EVENT_ID_PATTERN.test(tag[1])
    ).length;
}

export class PostHistoryJsonlImportService {
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "upsertImportedDeletionEvents"
    >;

    constructor(deps: PostHistoryJsonlImportServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.deletionRequestsRepository = deps.deletionRequestsRepository
            ?? postHistoryDeletionRequestsRepository;
    }

    async importFile(input: PostHistoryJsonlImportInput): Promise<PostHistoryJsonlImportResult> {
        const result = createEmptyResult();
        const processedEventIds = new Set<string>();
        const buffer: BufferedImportEvent[] = [];
        let hadSaveFailure = false;
        const hasInputRejections = (): boolean =>
            result.invalidJsonCount > 0
            || result.invalidStructureCount > 0
            || result.invalidIdOrSignatureCount > 0;

        const getStopStatus = (): PostHistoryJsonlImportStatus | null => {
            if (input.signal?.aborted) {
                return "cancelled";
            }
            if (input.getCurrentPubkeyHex() !== input.ownerPubkeyHex) {
                return "account-changed";
            }
            return null;
        };
        const emitProgress = (): void => {
            input.onProgress?.(copyResult(result));
        };
        const flush = async (): Promise<PostHistoryJsonlImportStatus | null> => {
            if (buffer.length === 0) {
                return getStopStatus();
            }
            const stopStatus = getStopStatus();
            if (stopStatus) {
                buffer.length = 0;
                return stopStatus;
            }

            const posts = buffer
                .filter((item): item is Extract<BufferedImportEvent, { type: "post" }> =>
                    item.type === "post")
                .map((item) => item.event);
            const deletionEvents = buffer
                .filter((item): item is Extract<BufferedImportEvent, { type: "deletion" }> =>
                    item.type === "deletion")
                .map((item) => item.event);
            buffer.length = 0;

            if (posts.length > 0) {
                try {
                    const summary = await this.postHistoryRepository.upsertFetchedEvents({
                        events: posts.map((event) => ({ event })),
                    });
                    result.insertedPostCount += summary.insertedCount;
                    result.updatedPostCount += summary.updatedCount;
                    result.unchangedPostCount += summary.unchangedCount;
                    result.appliedDeletionPostCount += summary.appliedDeletionCount;
                } catch {
                    result.failedPostEventCount += posts.length;
                    hadSaveFailure = true;
                }
            }

            const stopAfterPosts = getStopStatus();
            if (stopAfterPosts) {
                emitProgress();
                return stopAfterPosts;
            }

            if (deletionEvents.length > 0) {
                try {
                    const summary = await this.deletionRequestsRepository
                        .upsertImportedDeletionEvents({
                            ownerPubkeyHex: input.ownerPubkeyHex,
                            deletionEvents,
                        });
                    result.insertedDeletionRequestCount += summary.insertedCount;
                    result.updatedDeletionRequestCount += summary.updatedCount;
                    result.unchangedDeletionRequestCount += summary.unchangedCount;
                    result.appliedDeletionPostCount += summary.appliedDeletionCount;
                } catch {
                    result.failedDeletionEventCount += deletionEvents.length;
                    hadSaveFailure = true;
                }
            }

            emitProgress();
            return getStopStatus();
        };
        const processLine = async (line: string): Promise<PostHistoryJsonlImportStatus | null> => {
            const stopStatus = getStopStatus();
            if (stopStatus) {
                return stopStatus;
            }
            if (line.trim().length === 0) {
                return null;
            }

            result.nonEmptyLineCount += 1;
            let parsed: unknown;
            try {
                parsed = JSON.parse(line);
            } catch {
                result.invalidJsonCount += 1;
                return null;
            }

            if (!validateEvent(parsed as never)) {
                result.invalidStructureCount += 1;
                return null;
            }
            const event = parsed as NostrEvent;
            if (!verifyEvent(event as never)) {
                result.invalidIdOrSignatureCount += 1;
                return null;
            }
            if (processedEventIds.has(event.id)) {
                result.fileDuplicateCount += 1;
                return null;
            }
            processedEventIds.add(event.id);

            if (event.pubkey !== input.ownerPubkeyHex) {
                result.otherAccountCount += 1;
                return null;
            }
            if (event.kind === 1 || event.kind === 42) {
                result.uniquePostEventCount += 1;
                buffer.push({ type: "post", event });
            } else if (event.kind === 5) {
                result.uniqueDeletionEventCount += 1;
                const validETagCount = getValidDeletionETagCount(event);
                result.validDeletionETagCount += validETagCount;
                if (validETagCount === 0) {
                    result.unsupportedDeletionEventCount += 1;
                    return null;
                }
                buffer.push({ type: "deletion", event });
            } else {
                result.unsupportedKindCount += 1;
                return null;
            }

            if (buffer.length >= POST_HISTORY_JSONL_IMPORT_BATCH_SIZE) {
                return flush();
            }
            return null;
        };

        let reader: ReadableStreamDefaultReader<Uint8Array>;
        try {
            reader = input.file.stream().getReader();
        } catch {
            result.status = "failed";
            emitProgress();
            return result;
        }
        const cancelReader = (): void => {
            void reader.cancel().catch(() => undefined);
        };
        input.signal?.addEventListener("abort", cancelReader, { once: true });
        const decoder = new TextDecoder("utf-8", { fatal: true });
        let remainder = "";
        try {
            while (true) {
                const stopStatus = getStopStatus();
                if (stopStatus) {
                    result.status = stopStatus;
                    await reader.cancel().catch(() => undefined);
                    buffer.length = 0;
                    return result;
                }

                const chunk = await reader.read();
                if (chunk.done) {
                    remainder += decoder.decode();
                    if (remainder.length > 0) {
                        const lineStatus = await processLine(remainder.replace(/\r$/, ""));
                        if (lineStatus) {
                            result.status = lineStatus;
                            buffer.length = 0;
                            return result;
                        }
                    }
                    break;
                }

                remainder += decoder.decode(chunk.value, { stream: true });
                const lines = remainder.split("\n");
                remainder = lines.pop() ?? "";
                for (const rawLine of lines) {
                    const lineStatus = await processLine(rawLine.replace(/\r$/, ""));
                    if (lineStatus) {
                        result.status = lineStatus;
                        await reader.cancel().catch(() => undefined);
                        buffer.length = 0;
                        return result;
                    }
                }
            }
        } catch {
            const stopStatus = getStopStatus();
            if (stopStatus) {
                result.status = stopStatus;
                buffer.length = 0;
                return result;
            }

            const flushStopStatus = await flush();
            if (flushStopStatus) {
                result.status = flushStopStatus;
                return result;
            }
            result.status = result.nonEmptyLineCount > 0 ? "partial" : "failed";
            emitProgress();
            return result;
        } finally {
            input.signal?.removeEventListener("abort", cancelReader);
            reader.releaseLock();
        }

        const stopStatus = await flush();
        if (stopStatus) {
            result.status = stopStatus;
            return result;
        }
        result.status = hadSaveFailure || hasInputRejections() ? "partial" : "completed";
        emitProgress();
        return result;
    }
}

export const postHistoryJsonlImportService = new PostHistoryJsonlImportService();
