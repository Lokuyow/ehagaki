import { validateEvent } from "nostr-tools";
import { POST_HISTORY_FETCH_KINDS } from "./postHistoryRelayFetchService";
import { isPostHistoryAuthoredKind } from "./postHistoryKinds";
import { buildPostHistoryVisibleKindsKey } from "./storage/postHistoryVisibleRangeRepository";
import { postHistoryImportedRangesRepository, type DexiePostHistoryImportedRangesRepository } from "./storage/postHistoryImportedRangesRepository";
import { ehagakiDb } from "./storage/ehagakiDb";
import { getPostHistoryLocalRevision, PostHistoryLocalWriteStaleError, type PostHistoryLocalWriteScope } from "./storage/postHistoryLocalWriteScope";
import {
    createPostHistoryJsonlVerificationSession,
    type AttestedPostHistoryRawEvent,
    type PostHistoryJsonlVerificationSession,
    type PostHistoryRawEventAttestation,
} from "./postHistoryRawEventVerification";
import type { PostHistoryJsonlWorkerVerificationOptions } from "./postHistoryJsonlWorkerVerification";
import type { NostrEvent } from "./types";
import {
    sensitivePayloadRepository,
    type SensitivePayloadRepository,
} from "./storage/sensitivePayloadRepository";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";

export const POST_HISTORY_JSONL_IMPORT_BATCH_SIZE = 500;
export const POST_HISTORY_JSONL_IMPORT_QUEUE_SIZE = 32;

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
    localRevision?: number;
    restoredRangeChanged?: boolean;
    restoredRangeSaveFailed?: boolean;
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
    uniquePayloadEventCount: number;
    savedPayloadCandidateCount: number;
    failedPayloadEventCount: number;
}

export interface PostHistoryJsonlImportProgress {
    result: Readonly<PostHistoryJsonlImportResult>;
    processedBytes: number;
    totalBytes: number;
}

export interface PostHistoryJsonlImportInput {
    file: Pick<File, "stream" | "size"> & Partial<Pick<File, "name">>;
    ownerPubkeyHex: string;
    getCurrentPubkeyHex: () => string | null | undefined;
    signal?: AbortSignal;
    onProgress?: (progress: Readonly<PostHistoryJsonlImportProgress>) => void;
}

export interface PostHistoryJsonlImportServiceDeps {
    verificationSessionFactory?: (options: PostHistoryJsonlWorkerVerificationOptions) => PostHistoryJsonlVerificationSession;
    getLocalRevision?: (ownerPubkeyHex: string) => Promise<number>;
    importedRangesRepository?: Pick<DexiePostHistoryImportedRangesRepository, "record">;
    postHistoryRepository?: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "upsertImportedDeletionEvents"
    >;
    sensitivePayloadRepository?: Pick<SensitivePayloadRepository, "putCandidate">;
}

type BufferedImportEvent =
    | { type: "post"; event: NostrEvent; attestation: PostHistoryRawEventAttestation }
    | { type: "payload"; event: NostrEvent; attestation: PostHistoryRawEventAttestation }
    | { type: "deletion"; event: NostrEvent; attestation: PostHistoryRawEventAttestation };

type LineOutcome =
    | { type: "empty" }
    | { type: "bytes"; count: number }
    | { type: "rejected"; counter: "invalidJsonCount" | "invalidStructureCount" | "otherAccountCount" | "unsupportedKindCount" }
    | { type: "verified"; verified: AttestedPostHistoryRawEvent | null }
    | { type: "fatal" };

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
        uniquePayloadEventCount: 0,
        savedPayloadCandidateCount: 0,
        failedPayloadEventCount: 0,
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
    private readonly verificationSessionFactory: NonNullable<PostHistoryJsonlImportServiceDeps["verificationSessionFactory"]>;
    private getLocalRevision: (ownerPubkeyHex: string) => Promise<number>;
    private importedRangesRepository: Pick<DexiePostHistoryImportedRangesRepository, "record">;
    private postHistoryRepository: Pick<PostHistoryRepository, "upsertFetchedEvents">;
    private deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "upsertImportedDeletionEvents"
    >;
    private sensitivePayloadRepository: Pick<SensitivePayloadRepository, "putCandidate">;

    constructor(deps: PostHistoryJsonlImportServiceDeps = {}) {
        this.verificationSessionFactory = deps.verificationSessionFactory ?? createPostHistoryJsonlVerificationSession;
        this.getLocalRevision = deps.getLocalRevision ?? ((owner) => getPostHistoryLocalRevision(ehagakiDb, owner));
        this.importedRangesRepository = deps.importedRangesRepository ?? postHistoryImportedRangesRepository;
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.deletionRequestsRepository = deps.deletionRequestsRepository
            ?? postHistoryDeletionRequestsRepository;
        this.sensitivePayloadRepository = deps.sensitivePayloadRepository
            ?? sensitivePayloadRepository;
    }

    async importFile(input: PostHistoryJsonlImportInput): Promise<PostHistoryJsonlImportResult> {
        const result = createEmptyResult();
        const processedEventIds = new Set<string>();
        const buffer: BufferedImportEvent[] = [];
        let hadSaveFailure = false;
        let localWriteInvalidated = false;
        let localRevisionReadFailed = false;
        let oldestPost: number | null = null;
        let newestPost: number | null = null;
        let validPostTimes = true;
        let readBytes = 0;
        const nameTimestamp = /^citrine-([1-9]\d*)\.jsonl$/.exec(input.file.name ?? "")?.[1];
        const isCitrine = nameTimestamp !== undefined && Number.isSafeInteger(Number(nameTimestamp))
            && Number(nameTimestamp) <= 8_640_000_000_000_000;
        // Exporter clock skew may only narrow the candidates. Future posts are
        // still saved, but cannot certify the time between the backup and now.
        const restoredPostUpperBound = Math.floor(Math.min(Number(nameTimestamp), Date.now()) / 1000);
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
            if (localRevisionReadFailed) return result.nonEmptyLineCount > 0 ? "partial" : "failed";
            if (localWriteInvalidated) return "cancelled";
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
        try {
            result.localRevision = await this.getLocalRevision(input.ownerPubkeyHex);
        } catch {
            result.status = "failed";
            emitProgress(true);
            return result;
        }
        let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
        let workerFailure: Error | null = null;
        let session: PostHistoryJsonlVerificationSession | undefined;
        const cancelReader = (): void => { void reader?.cancel().catch(() => undefined); };
        try {
            try {
                session = this.verificationSessionFactory({
                    signal: input.signal,
                    onFatal: error => { workerFailure = error; cancelReader(); },
                });
                await session.ready;
            } catch {
                result.status = getStopStatus() ?? "failed";
                emitProgress(true);
                return result;
            }
            const verificationSession = session;
            const localWriteScope: PostHistoryLocalWriteScope = {
                ownerPubkeyHex: input.ownerPubkeyHex, expectedRevision: result.localRevision,
                isActive: () => getStopStatus() === null,
            };
            const checkLocalRevision = async (): Promise<PostHistoryJsonlImportStatus | null> => {
                try {
                    if (await this.getLocalRevision(input.ownerPubkeyHex) !== localWriteScope.expectedRevision) localWriteInvalidated = true;
                } catch {
                    localRevisionReadFailed = true;
                }
                return getStopStatus();
            };
            const flush = async (): Promise<PostHistoryJsonlImportStatus | null> => {
                const revisionStatus = await checkLocalRevision();
                if (revisionStatus) { buffer.length = 0; return revisionStatus; }
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
                    .map((item) => ({ event: item.event, attestation: item.attestation }));
                const payloads = buffer
                    .filter((item): item is Extract<BufferedImportEvent, { type: "payload" }> =>
                        item.type === "payload")
                    .map((item) => ({ event: item.event, attestation: item.attestation }));
                buffer.length = 0;

                if (posts.length > 0) {
                    try {
                        const summary = await this.postHistoryRepository.upsertFetchedEvents({
                            events: posts,
                            localWriteScope,
                        });
                        if (summary.applied === false) { localWriteInvalidated = true; return getStopStatus(); }
                        result.insertedPostCount += summary.insertedCount;
                        result.updatedPostCount += summary.updatedCount;
                        result.unchangedPostCount += summary.unchangedCount;
                        result.appliedDeletionPostCount += summary.appliedDeletionCount;
                    } catch (error) {
                        if (error instanceof PostHistoryLocalWriteStaleError) { localWriteInvalidated = true; return getStopStatus(); }
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
                                localWriteScope,
                            });
                        result.insertedDeletionRequestCount += summary.insertedCount;
                        result.updatedDeletionRequestCount += summary.updatedCount;
                        result.unchangedDeletionRequestCount += summary.unchangedCount;
                        result.unsupportedDeletionEventCount += summary.ignoredCount;
                        result.appliedDeletionPostCount += summary.appliedDeletionCount;
                    } catch (error) {
                        if (error instanceof PostHistoryLocalWriteStaleError) { localWriteInvalidated = true; return getStopStatus(); }
                        result.failedDeletionEventCount += deletionEvents.length;
                        hadSaveFailure = true;
                    }
                }

                for (const payload of payloads) {
                    const stopBeforePayload = getStopStatus();
                    if (stopBeforePayload) return stopBeforePayload;
                    try {
                        await this.sensitivePayloadRepository.putCandidate({ ...payload, localWriteScope });
                        result.savedPayloadCandidateCount += 1;
                    } catch (error) {
                        if (error instanceof PostHistoryLocalWriteStaleError) { localWriteInvalidated = true; return getStopStatus(); }
                        result.failedPayloadEventCount += 1;
                        hadSaveFailure = true;
                    }
                }

                emitProgress();
                return checkLocalRevision();
            };
            const prepareLine = (line: string): Promise<LineOutcome> => {
                if (line.trim().length === 0) return Promise.resolve({ type: "empty" });
                let parsed: unknown;
                try {
                    parsed = JSON.parse(line);
                } catch {
                    return Promise.resolve({ type: "rejected", counter: "invalidJsonCount" });
                }
                if (!validateEvent(parsed as never)) {
                    return Promise.resolve({ type: "rejected", counter: "invalidStructureCount" });
                }
                const event = parsed as NostrEvent;
                if (event.pubkey !== input.ownerPubkeyHex) {
                    return Promise.resolve({ type: "rejected", counter: "otherAccountCount" });
                }
                if (!isPostHistoryAuthoredKind(event.kind) && ![36, 5].includes(event.kind)) {
                    return Promise.resolve({ type: "rejected", counter: "unsupportedKindCount" });
                }
                // Observe rejection immediately, including ahead-of-consumer failures.
                return verificationSession.verify(event).then(
                    verified => ({ type: "verified", verified }),
                    () => ({ type: "fatal" }),
                );
            };
            const queue: Promise<LineOutcome>[] = [];
            const throwIfStopped = (): void => {
                const status = getStopStatus();
                if (status) throw new Error(status);
                if (workerFailure) throw workerFailure;
            };
            const consumeNext = async (checkRevision = false): Promise<void> => {
                throwIfStopped();
                const outcome = await queue.shift()!;
                if (checkRevision) await checkLocalRevision();
                throwIfStopped();
                if (outcome.type === "fatal") throw new Error("post_history_import_worker_failed");
                if (outcome.type === "empty") return;
                if (outcome.type === "bytes") { addProcessedBytes(outcome.count); emitProgress(); return; }
                result.nonEmptyLineCount += 1;
                if (outcome.type === "rejected") { result[outcome.counter] += 1; return; }
                const verified = outcome.verified;
                if (!verified) {
                    result.invalidIdOrSignatureCount += 1;
                    return;
                }
                const event = verified.event;
                if (processedEventIds.has(event.id)) {
                    result.fileDuplicateCount += 1;
                    return;
                }
                processedEventIds.add(event.id);

                if (event.kind === 36) {
                    result.uniquePayloadEventCount += 1;
                    buffer.push({ type: "payload", ...verified });
                } else if (isPostHistoryAuthoredKind(event.kind)) {
                    result.uniquePostEventCount += 1;
                    if (!Number.isSafeInteger(event.created_at) || event.created_at < 0 || event.created_at >= Number.MAX_SAFE_INTEGER) validPostTimes = false;
                    else if (event.created_at <= restoredPostUpperBound) {
                        oldestPost = Math.min(oldestPost ?? event.created_at, event.created_at);
                        newestPost = Math.max(newestPost ?? event.created_at, event.created_at);
                    }
                    buffer.push({ type: "post", ...verified });
                } else if (event.kind === 5) {
                    result.uniqueDeletionEventCount += 1;
                    const validETagCount = getValidDeletionETagCount(event);
                    result.validDeletionETagCount += validETagCount;
                    if (validETagCount === 0) {
                        result.unsupportedDeletionEventCount += 1;
                        return;
                    }
                    buffer.push({ type: "deletion", ...verified });
                }

                if (buffer.length >= POST_HISTORY_JSONL_IMPORT_BATCH_SIZE) {
                    const status = await flush();
                    if (status) throw new Error(status);
                }
            };
            let sliceStartedAt = performance.now();
            const enqueue = async (makeOutcome: () => Promise<LineOutcome>): Promise<void> => {
                if (queue.length >= POST_HISTORY_JSONL_IMPORT_QUEUE_SIZE) await consumeNext();
                throwIfStopped();
                queue.push(makeOutcome());
                if (performance.now() - sliceStartedAt >= 8) {
                    await new Promise<void>(resolve => setTimeout(resolve, 0));
                    sliceStartedAt = performance.now();
                    throwIfStopped();
                }
            };
            const drain = async (checkRevision = false): Promise<void> => {
                while (queue.length) await consumeNext(checkRevision);
            };
            try {
                reader = input.file.stream().getReader();
            } catch {
                result.status = "failed";
                emitProgress(true);
                return result;
            }
            input.signal?.addEventListener("abort", cancelReader, { once: true });
            const decoder = new TextDecoder("utf-8", { fatal: true });
            let remainder = "";
            let inputReadFailed = false;
            const decode = (bytes?: Uint8Array, stream = false): string => {
                try { return decoder.decode(bytes, { stream }); }
                catch (error) { inputReadFailed = true; throw error; }
            };
            try {
                while (true) {
                    throwIfStopped();
                    let chunk: ReadableStreamReadResult<Uint8Array>;
                    try { chunk = await reader.read(); }
                    catch (error) { inputReadFailed = true; throw error; }
                    throwIfStopped();
                    if (chunk.done) {
                        remainder += decode();
                        if (remainder.length > 0) {
                            await enqueue(() => prepareLine(remainder.replace(/\r$/, "")));
                        }
                        break;
                    }
                    readBytes += chunk.value.byteLength;
                    remainder += decode(chunk.value, true);
                    const lines = remainder.split("\n");
                    remainder = lines.pop() ?? "";
                    for (const rawLine of lines) {
                        await enqueue(() => prepareLine(rawLine.replace(/\r$/, "")));
                    }
                    const byteCount = chunk.value.byteLength;
                    await enqueue(() => Promise.resolve({ type: "bytes", count: byteCount }));
                }
                await drain();
            } catch {
                // Input failure stops reading, but keeps the healthy verifier alive
                // to preserve every already-decoded/submitted line of the prefix.
                cancelReader();
                await checkLocalRevision();
                if (inputReadFailed && !workerFailure && !getStopStatus()) {
                    try { await drain(true); } catch { /* terminal state wins below */ }
                }
                queue.length = 0;
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
                result.status = "partial";
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
            if (workerFailure) {
                result.status = "partial";
                emitProgress(true);
                return result;
            }
            result.status = hadSaveFailure || hasInputRejections() ? "partial" : "completed";
            if (isCitrine && result.status === "completed" && readBytes === totalBytes && validPostTimes
                && oldestPost !== null && newestPost !== null
                && result.insertedPostCount + result.updatedPostCount + result.unchangedPostCount === result.uniquePostEventCount) {
                try {
                    result.restoredRangeChanged = await this.importedRangesRepository.record({
                        ...localWriteScope, kindsKey: buildPostHistoryVisibleKindsKey([...POST_HISTORY_FETCH_KINDS]),
                        isActive: () => localWriteScope.isActive() && !workerFailure,
                        range: { since: oldestPost, until: newestPost },
                    });
                } catch (error) {
                    if (workerFailure && !getStopStatus()) {
                        result.status = "partial";
                    } else if (error instanceof PostHistoryLocalWriteStaleError) {
                        localWriteInvalidated = true;
                        result.status = getStopStatus()!;
                    } else {
                        result.status = "partial";
                        result.restoredRangeSaveFailed = true;
                    }
                }
            }
            emitProgress(true);
            return result;
        } finally {
            cancelReader();
            session?.dispose();
        }
    }
}

export const postHistoryJsonlImportService = new PostHistoryJsonlImportService();
