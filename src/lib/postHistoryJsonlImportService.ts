import { validateEvent } from "nostr-tools";
import {
    attestFullyVerifiedPostHistoryRawEvent,
    type PostHistoryRawEventAttestation,
} from "./postHistoryRawEventVerification";
import type { NostrEvent } from "./types";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";

export const POST_HISTORY_JSONL_IMPORT_BATCH_SIZE = 500;

const POST_HISTORY_JSONL_IMPORT_PROGRESS_INTERVAL_MS = 250;

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

export interface PostHistoryJsonlImportProgress {
    result: Readonly<PostHistoryJsonlImportResult>;
    processedBytes: number;
    totalBytes: number;
}

export interface PostHistoryJsonlImportInput {
    file: Pick<File, "stream" | "size">;
    ownerPubkeyHex: string;
    getCurrentPubkeyHex: () => string | null | undefined;
    signal?: AbortSignal;
    onProgress?: (progress: Readonly<PostHistoryJsonlImportProgress>) => void;
}

export interface PostHistoryJsonlImportServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "upsertImportedDeletionEvents"
    >;
}

type BufferedImportEvent =
    | { type: "post"; event: NostrEvent; attestation: PostHistoryRawEventAttestation }
    | { type: "deletion"; event: NostrEvent; attestation: PostHistoryRawEventAttestation };

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
        let lastProgressNotificationAt: number | null = null;
        const totalBytes = Number.isFinite(input.file.size) && input.file.size > 0
            ? input.file.size
            : 0;
        let processedBytes = 0;
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
        const emitProgress = (force = false): void => {
            if (!input.onProgress) {
                return;
            }
            const now = performance.now();
            if (!force
                && lastProgressNotificationAt !== null
                && now - lastProgressNotificationAt < POST_HISTORY_JSONL_IMPORT_PROGRESS_INTERVAL_MS) {
                return;
            }
            lastProgressNotificationAt = now;
            input.onProgress({
                result: copyResult(result),
                processedBytes,
                totalBytes,
            });
        };
        const addProcessedBytes = (byteCount: number): void => {
            if (byteCount <= 0) {
                return;
            }
            processedBytes = Math.min(
                totalBytes,
                Math.max(processedBytes, processedBytes + byteCount),
            );
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
                .map((item) => ({
                    event: item.event,
                    attestation: item.attestation,
                }));
            const deletionEvents = buffer
                .filter((item): item is Extract<BufferedImportEvent, { type: "deletion" }> =>
                    item.type === "deletion")
                .map((item) => item.event);
            buffer.length = 0;

            if (posts.length > 0) {
                try {
                    const summary = await this.postHistoryRepository.upsertFetchedEvents({
                        events: posts,
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
                    result.unsupportedDeletionEventCount += summary.ignoredCount;
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
            if (event.pubkey !== input.ownerPubkeyHex) {
                result.otherAccountCount += 1;
                return null;
            }
            if (event.kind !== 1 && event.kind !== 42 && event.kind !== 5) {
                result.unsupportedKindCount += 1;
                return null;
            }
            const verified = attestFullyVerifiedPostHistoryRawEvent(event);
            if (!verified) {
                result.invalidIdOrSignatureCount += 1;
                return null;
            }
            if (processedEventIds.has(event.id)) {
                result.fileDuplicateCount += 1;
                return null;
            }
            processedEventIds.add(event.id);

            if (event.kind === 1 || event.kind === 42) {
                result.uniquePostEventCount += 1;
                buffer.push({ type: "post", ...verified });
            } else if (event.kind === 5) {
                result.uniqueDeletionEventCount += 1;
                const validETagCount = getValidDeletionETagCount(event);
                result.validDeletionETagCount += validETagCount;
                if (validETagCount === 0) {
                    result.unsupportedDeletionEventCount += 1;
                    return null;
                }
                buffer.push({ type: "deletion", ...verified });
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
            emitProgress(true);
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
                    emitProgress(true);
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
                            emitProgress(true);
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
                        emitProgress(true);
                        return result;
                    }
                }
                addProcessedBytes(chunk.value.byteLength);
                emitProgress();
            }
        } catch {
            const stopStatus = getStopStatus();
            if (stopStatus) {
                result.status = stopStatus;
                buffer.length = 0;
                emitProgress(true);
                return result;
            }

            const flushStopStatus = await flush();
            if (flushStopStatus) {
                result.status = flushStopStatus;
                emitProgress(true);
                return result;
            }
            result.status = result.nonEmptyLineCount > 0 ? "partial" : "failed";
            emitProgress(true);
            return result;
        } finally {
            input.signal?.removeEventListener("abort", cancelReader);
            reader.releaseLock();
        }

        const stopStatus = await flush();
        if (stopStatus) {
            result.status = stopStatus;
            emitProgress(true);
            return result;
        }
        result.status = hadSaveFailure || hasInputRejections() ? "partial" : "completed";
        emitProgress(true);
        return result;
    }
}

export const postHistoryJsonlImportService = new PostHistoryJsonlImportService();
