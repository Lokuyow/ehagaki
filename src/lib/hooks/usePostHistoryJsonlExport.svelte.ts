import {
    postHistoryJsonlExportService,
    type PostHistoryJsonlExportResult,
} from "../postHistoryJsonlExportService";
import type { PostHistoryJsonlExportProgress } from "../postHistoryJsonlExportWorkerProtocol";

type PostHistoryJsonlExportMessageKey =
    | "postHistory.exportComplete"
    | "postHistory.exportPartial"
    | "postHistory.exportFailed";

const EXPORT_MESSAGE_DURATION_MS = 5000;

function getLocalExportDate(): string {
    const now = new Date();
    return [
        String(now.getFullYear()).padStart(4, "0"),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

/**
 * JSONL export of the saved post history: runs the worker export, hands the
 * file to the browser as a download, and owns the result message. Callers
 * cancel it when the dialog closes or the account changes.
 */
export function usePostHistoryJsonlExport(input: {
    getShow: () => boolean;
    getPubkeyHex: () => string | null | undefined;
    /** Element the temporary download link is attached to. */
    downloadContainer: Node;
    /** Called once the export has been accepted, before the worker starts. */
    onStart?: () => void;
}) {
    let running = $state(false);
    let progress = $state<PostHistoryJsonlExportProgress>({
        phase: "loading",
    });
    let abortController: AbortController | undefined;
    let ownerPubkeyHex: string | undefined;
    let showMessage = $state(false);
    let messageKey = $state<PostHistoryJsonlExportMessageKey>(
        "postHistory.exportComplete",
    );
    let messageValues = $state<Record<string, number>>({});
    let messageTimeout: ReturnType<typeof setTimeout> | undefined;

    function cancel(): void {
        abortController?.abort();
    }

    function hideMessage(): void {
        if (messageTimeout) {
            clearTimeout(messageTimeout);
            messageTimeout = undefined;
        }
        showMessage = false;
    }

    function showResultMessage(
        result: Omit<PostHistoryJsonlExportResult, "jsonl">,
    ): void {
        hideMessage();
        messageKey = result.isPartial
            ? "postHistory.exportPartial"
            : "postHistory.exportComplete";
        messageValues = {
            exported: result.exportedEventCount,
            skipped: result.skippedPostCount
                + result.missingDeletionRawEventCount
                + result.invalidDeletionRawEventCount,
        };
        showMessage = true;
        messageTimeout = setTimeout(() => {
            showMessage = false;
            messageTimeout = undefined;
        }, EXPORT_MESSAGE_DURATION_MS);
    }

    async function start(): Promise<void> {
        const pubkeyHex = input.getPubkeyHex();
        if (!pubkeyHex || running) {
            return;
        }

        running = true;
        progress = { phase: "loading" };
        const controller = new AbortController();
        abortController = controller;
        ownerPubkeyHex = pubkeyHex;
        input.onStart?.();
        hideMessage();
        try {
            const { result, blob } = await postHistoryJsonlExportService
                .exportForPubkeyInWorker(pubkeyHex, {
                    signal: controller.signal,
                    onProgress: (nextProgress) => {
                        if (!controller.signal.aborted && input.getShow() && abortController === controller) progress = nextProgress;
                    },
                });
            if (controller.signal.aborted) {
                return;
            }
            const objectUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = objectUrl;
            anchor.download = `ehagaki-post-history-${getLocalExportDate()}.jsonl`;
            anchor.style.display = "none";
            input.downloadContainer.appendChild(anchor);
            anchor.click();
            setTimeout(() => {
                anchor.remove();
                URL.revokeObjectURL?.(objectUrl);
            }, 1000);
            showResultMessage(result);
        } catch (error) {
            if (controller.signal.aborted || (error instanceof DOMException
                && error.name === "AbortError")) {
                return;
            }
            messageKey = "postHistory.exportFailed";
            messageValues = {};
            showMessage = true;
            messageTimeout = setTimeout(() => {
                showMessage = false;
                messageTimeout = undefined;
            }, EXPORT_MESSAGE_DURATION_MS);
        } finally {
            if (abortController === controller) {
                abortController = undefined;
                ownerPubkeyHex = undefined;
                running = false;
            }
        }
    }

    return {
        get running() {
            return running;
        },
        get progress() {
            return progress;
        },
        /** Account the running export belongs to; not reactive. */
        get ownerPubkeyHex() {
            return ownerPubkeyHex;
        },
        get showMessage() {
            return showMessage;
        },
        get messageKey() {
            return messageKey;
        },
        get messageValues() {
            return messageValues;
        },
        start,
        cancel,
        hideMessage,
    };
}
