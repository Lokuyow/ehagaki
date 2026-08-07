import type { PostHistoryJsonlExportResult } from "./postHistoryJsonlExportService";

export type PostHistoryJsonlExportPhase = "loading" | "verifying" | "creating";

export type PostHistoryJsonlExportProgress = {
    phase: PostHistoryJsonlExportPhase;
    processed?: number;
    total?: number;
};

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
