/// <reference lib="webworker" />
import { eventRecords } from "./storage/eventRepository";

import {
    runPostHistoryJsonlExportEngine,
    type PostHistoryVerificationStores,
} from "./postHistoryJsonlExportEngine";
import type {
    PostHistoryJsonlExportWorkerRequest,
    PostHistoryJsonlExportWorkerResponse,
} from "./postHistoryJsonlExportWorkerProtocol";
import { ehagakiDb } from "./storage/ehagakiDb";

function send(message: PostHistoryJsonlExportWorkerResponse): void {
    self.postMessage(message);
}

function createVerificationStores(): PostHistoryVerificationStores {
    return {
        post: eventRecords(ehagakiDb, "postHistory"),
        deletion: eventRecords(ehagakiDb, "postHistoryDeletionRequests"),
        transaction: {
            post: (run) => ehagakiDb.transaction(
                "rw", ehagakiDb.events,
                ehagakiDb.postHistory,
                run,
            ),
            deletion: (run) => ehagakiDb.transaction(
                "rw", ehagakiDb.events,
                ehagakiDb.postHistoryDeletionRequests,
                run,
            ),
        },
    };
}

async function exportForPubkey(pubkeyHex: string): Promise<{
    result: Awaited<ReturnType<typeof runPostHistoryJsonlExportEngine>>["result"];
    blob: Blob;
}> {
    send({ type: "progress", progress: { phase: "loading" } });
    const [postRecords, deletionRecords] = await Promise.all([
        ehagakiDb.postHistory.where("pubkeyHex").equals(pubkeyHex).toArray().then(rows => eventRecords(ehagakiDb, "postHistory").hydrate(rows)),
        ehagakiDb.postHistoryDeletionRequests
            .where("targetAuthorPubkey")
            .equals(pubkeyHex)
            .toArray().then(rows => eventRecords(ehagakiDb, "postHistoryDeletionRequests").hydrate(rows)),
    ]);
    const sensitivePayloadRecords = await ehagakiDb.sensitivePayloads
        .where("pubkeyHex")
        .equals(pubkeyHex)
        .toArray().then(rows => eventRecords(ehagakiDb, "sensitivePayloads").hydrate(rows));
    const { result, blob } = await runPostHistoryJsonlExportEngine({
        pubkeyHex,
        postRecords,
        deletionRecords,
        sensitivePayloadRecords,
        verificationStores: createVerificationStores(),
        onProgress: (progress) => send({ type: "progress", progress }),
    });
    return { result, blob };
}

self.addEventListener("message", (message: MessageEvent<PostHistoryJsonlExportWorkerRequest>) => {
    if (message.data?.type !== "export") {
        return;
    }

    void exportForPubkey(message.data.pubkeyHex)
        .then(({ result, blob }) => send({ type: "complete", result, blob }))
        .catch((error: unknown) => send({
            type: "error",
            message: error instanceof Error ? error.message : "post_history_export_worker_failed",
        }));
});

export {};
