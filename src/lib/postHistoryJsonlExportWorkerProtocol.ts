import type {
    PostHistoryJsonlExportProgress,
    PostHistoryJsonlExportResult,
} from "./postHistoryJsonlExportEngine";

export type {
    PostHistoryJsonlExportProgress,
    PostHistoryJsonlExportResult,
} from "./postHistoryJsonlExportEngine";

export type PostHistoryJsonlExportWorkerRequest = {
    type: "export";
    pubkeyHex: string;
};

export type PostHistoryJsonlExportWorkerResponse =
    | {
        type: "progress";
        progress: PostHistoryJsonlExportProgress;
    }
    | {
        type: "complete";
        result: Omit<PostHistoryJsonlExportResult, "jsonl">;
        blob: Blob;
    }
    | {
        type: "error";
        message: string;
    };
