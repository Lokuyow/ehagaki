import {
    runPostHistoryJsonlExportEngine,
    type PostHistoryJsonlExportProgress,
    type PostHistoryJsonlExportResult,
} from "./postHistoryJsonlExportEngine";
import type {
    PostHistoryDeletionRequestRecord,
    PostHistoryRecord,
} from "./storage/ehagakiDb";
import {
    postHistoryDeletionRequestsRepository,
    type PostHistoryDeletionRequestsRepository,
} from "./storage/postHistoryDeletionRequestsRepository";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import type { PostHistoryJsonlExportWorkerResponse } from "./postHistoryJsonlExportWorkerProtocol";

export type { PostHistoryJsonlExportProgress, PostHistoryJsonlExportResult } from "./postHistoryJsonlExportEngine";

export interface PostHistoryJsonlExportServiceDeps {
    postHistoryRepository?: Pick<PostHistoryRepository, "getAll">;
    deletionRequestsRepository?: Pick<
        PostHistoryDeletionRequestsRepository,
        "getAllForTargetAuthorPubkey"
    >;
    workerFactory?: () => PostHistoryJsonlExportWorker;
}

export interface PostHistoryJsonlExportWorker {
    onmessage: ((event: MessageEvent<PostHistoryJsonlExportWorkerResponse>) => void) | null;
    onerror: ((event: ErrorEvent) => void) | null;
    postMessage(message: { type: "export"; pubkeyHex: string }): void;
    terminate(): void;
}

export type PostHistoryJsonlExportWorkerResult = {
    result: Omit<PostHistoryJsonlExportResult, "jsonl">;
    blob: Blob;
};

export type PostHistoryJsonlExportWorkerOptions = {
    onProgress?: (progress: PostHistoryJsonlExportProgress) => void;
    signal?: AbortSignal;
};

function createEmptyResult(): PostHistoryJsonlExportResult {
    return {
        jsonl: "",
        exportedEventCount: 0,
        exportedPostEventCount: 0,
        exportedDeletionEventCount: 0,
        skippedPostCount: 0,
        missingDeletionRawEventCount: 0,
        invalidDeletionRawEventCount: 0,
        isPartial: false,
    };
}

export class PostHistoryJsonlExportService {
    private readonly postHistoryRepository: Pick<PostHistoryRepository, "getAll">;
    private readonly deletionRequestsRepository: Pick<
        PostHistoryDeletionRequestsRepository,
        "getAllForTargetAuthorPubkey"
    >;
    private readonly workerFactory: () => PostHistoryJsonlExportWorker;

    constructor(deps: PostHistoryJsonlExportServiceDeps = {}) {
        this.postHistoryRepository = deps.postHistoryRepository ?? postHistoryRepository;
        this.deletionRequestsRepository = deps.deletionRequestsRepository
            ?? postHistoryDeletionRequestsRepository;
        this.workerFactory = deps.workerFactory ?? (() =>
            new Worker(
                new URL("./postHistoryJsonlExportWorker.ts", import.meta.url),
                { type: "module" },
            ));
    }

    exportForPubkeyInWorker(
        pubkeyHex: string | null | undefined,
        options: PostHistoryJsonlExportWorkerOptions = {},
    ): Promise<PostHistoryJsonlExportWorkerResult> {
        if (!pubkeyHex) {
            const { jsonl: _jsonl, ...result } = createEmptyResult();
            return Promise.resolve({
                result,
                blob: new Blob([], { type: "application/x-ndjson;charset=utf-8" }),
            });
        }

        return new Promise((resolve, reject) => {
            const worker = this.workerFactory();
            let settled = false;
            const cleanup = () => {
                worker.onmessage = null;
                worker.onerror = null;
                options.signal?.removeEventListener("abort", onAbort);
                worker.terminate();
            };
            const fail = (error: Error) => {
                if (settled) return;
                settled = true;
                cleanup();
                reject(error);
            };
            const onAbort = () => fail(new DOMException("Export aborted", "AbortError"));

            if (options.signal?.aborted) {
                onAbort();
                return;
            }

            options.signal?.addEventListener("abort", onAbort, { once: true });
            worker.onmessage = (event) => {
                const message = event.data;
                if (message.type === "progress") {
                    options.onProgress?.(message.progress);
                    return;
                }
                if (message.type === "error") {
                    fail(new Error(message.message));
                    return;
                }
                if (message.type === "complete") {
                    if (settled) return;
                    settled = true;
                    cleanup();
                    resolve({ result: message.result, blob: message.blob });
                }
            };
            worker.onerror = () => fail(new Error("post_history_export_worker_failed"));
            worker.postMessage({ type: "export", pubkeyHex });
        });
    }

    /**
     * Compatibility API for non-UI callers and detailed tests. It delegates
     * to the same engine used by the production Worker; the Worker path asks
     * the engine for a Blob without joining the complete JSONL string.
     */
    async exportForPubkey(
        pubkeyHex: string | null | undefined,
    ): Promise<PostHistoryJsonlExportResult> {
        if (!pubkeyHex) {
            return createEmptyResult();
        }

        const [postRecords, deletionRecords] = await Promise.all([
            this.postHistoryRepository.getAll({ pubkeyHex }),
            this.deletionRequestsRepository.getAllForTargetAuthorPubkey(pubkeyHex),
        ]);
        const exported = await runPostHistoryJsonlExportEngine({
            pubkeyHex,
            postRecords: postRecords as PostHistoryRecord[],
            deletionRecords: deletionRecords as PostHistoryDeletionRequestRecord[],
            includeJsonl: true,
        });
        return {
            ...exported.result,
            jsonl: exported.jsonl ?? "",
        };
    }
}

export const postHistoryJsonlExportService = new PostHistoryJsonlExportService();
