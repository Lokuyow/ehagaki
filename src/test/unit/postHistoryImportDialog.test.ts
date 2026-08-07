import { createEvent, fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PostHistoryImportDialog from "../../components/PostHistoryImportDialog.svelte";
import type {
    PostHistoryJsonlImportProgress,
    PostHistoryJsonlImportResult,
} from "../../lib/postHistoryJsonlImportService";

const importFileMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/postHistoryJsonlImportService", async (importOriginal) => {
    const actual = await importOriginal<typeof import("../../lib/postHistoryJsonlImportService")>();
    return {
        ...actual,
        postHistoryJsonlImportService: {
            importFile: importFileMock,
        },
    };
});

const translations: Record<string, string> = {
    "postHistory.importTitle": "JSONLをインポート",
    "postHistory.importDescription": "Citrineなどから書き出したNostr JSONLに対応",
    "postHistory.importChooseFile": "JSONLファイルを選択",
    "postHistory.importDropHint": "JSONLファイルをここにドラッグ＆ドロップ",
    "postHistory.importDropActive": "ここにドロップ",
    "postHistory.importReading": "読み込み中...",
    "postHistory.importProgress": "進捗",
    "postHistory.importElapsedTime": "経過時間",
    "postHistory.importEstimatedRemainingTime": "推定残り時間",
    "postHistory.importRemainingTimeCalculating": "計算中...",
    "postHistory.importRemainingTimeUnavailable": "--:--",
    "postHistory.importProgressBarLabel": "JSONLインポートの進捗",
    "postHistory.importComplete": "読み込みが完了しました",
    "postHistory.importPartial": "処理を完了しましたが、一部を取り込めませんでした",
    "postHistory.importFailed": "ファイルを読み込めませんでした",
    "postHistory.importCancelled": "読み込みを中止しました",
    "postHistory.importAccountChanged": "アカウントが変更されたため読み込みを中止しました",
    "postHistory.importInputResults": "入力",
    "postHistory.importPostResults": "投稿履歴",
    "postHistory.importDeletionResults": "削除要求",
    "postHistory.importNonEmptyLines": "非空行",
    "postHistory.importFileDuplicates": "ファイル内重複",
    "postHistory.importOtherAccount": "別アカウント",
    "postHistory.importUnsupportedKind": "対象外kind",
    "postHistory.importInvalidJson": "不正JSON",
    "postHistory.importInvalidStructure": "不正な構造",
    "postHistory.importInvalidCrypto": "不正なIDまたは署名",
    "postHistory.importPostEvents": "投稿イベント",
    "postHistory.importInserted": "新規追加",
    "postHistory.importUpdated": "既存を更新",
    "postHistory.importUnchanged": "既存と同一",
    "postHistory.importPostFailures": "投稿保存失敗",
    "postHistory.importDeletionApplied": "削除状態を反映",
    "postHistory.importDeletionEvents": "kind 5イベント",
    "postHistory.importDeletionTags": "有効なeタグ",
    "postHistory.importDeletionRequestsInserted": "削除要求を追加",
    "postHistory.importDeletionRequestsUpdated": "削除要求を更新",
    "postHistory.importDeletionRequestsUnchanged": "削除要求と同一",
    "postHistory.importUnsupportedDeletion": "対象外の削除要求",
    "postHistory.importDeletionFailures": "削除要求保存失敗",
    "global.close": "閉じる",
};

vi.mock("svelte-i18n", () => ({
    _: readable((key: string) => translations[key] ?? key),
}));

function createResult(
    overrides: Partial<PostHistoryJsonlImportResult> = {},
): PostHistoryJsonlImportResult {
    return {
        status: "completed",
        nonEmptyLineCount: 1,
        invalidJsonCount: 0,
        invalidStructureCount: 0,
        invalidIdOrSignatureCount: 0,
        fileDuplicateCount: 0,
        otherAccountCount: 0,
        unsupportedKindCount: 0,
        uniquePostEventCount: 1,
        insertedPostCount: 1,
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
        ...overrides,
    };
}

describe("PostHistoryImportDialog", () => {
    beforeEach(() => {
        importFileMock.mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    function getDropZone() {
        return screen.getByText("JSONLファイルをここにドラッグ＆ドロップ").parentElement as HTMLElement;
    }

    function createFile() {
        return new File(["{}"], "history.jsonl", { type: "application/x-ndjson" });
    }

    it("ファイル選択で既存のインポートサービスへ先頭のファイルを渡す", async () => {
        importFileMock.mockResolvedValue(createResult());
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        const firstFile = createFile();
        await fireEvent.change(input, {
            target: { files: [firstFile, createFile()] },
        });

        await waitFor(() => expect(importFileMock).toHaveBeenCalledTimes(1));
        expect(importFileMock.mock.calls[0][0].file).toBe(firstFile);
    });

    it("ファイルのドロップで既存のインポートサービスへ渡す", async () => {
        importFileMock.mockResolvedValue(createResult());
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const file = createFile();
        await fireEvent.drop(getDropZone(), {
            dataTransfer: { types: ["Files"], files: [file, createFile()] },
        });

        await waitFor(() => expect(importFileMock).toHaveBeenCalledTimes(1));
        expect(importFileMock.mock.calls[0][0].file).toBe(file);
    });

    it("ファイルを含まないドロップではインポートを開始しない", async () => {
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });

        await fireEvent.drop(getDropZone(), {
            dataTransfer: { types: ["text/uri-list"], files: [] },
        });

        expect(importFileMock).not.toHaveBeenCalled();
    });

    it("非ファイルのdragoverとdropでもブラウザの既定動作を抑止する", () => {
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const dropZone = getDropZone();
        const dataTransfer = { types: ["text/uri-list"], files: [] };
        const dragOverEvent = createEvent.dragOver(dropZone, {
            bubbles: true,
            cancelable: true,
            dataTransfer,
        });
        const dropEvent = createEvent.drop(dropZone, {
            bubbles: true,
            cancelable: true,
            dataTransfer,
        });

        dropZone.dispatchEvent(dragOverEvent);
        dropZone.dispatchEvent(dropEvent);

        expect(dragOverEvent.defaultPrevented).toBe(true);
        expect(dropEvent.defaultPrevented).toBe(true);
        expect(importFileMock).not.toHaveBeenCalled();
        expect(screen.queryByText("ここにドロップ")).toBeNull();
    });

    it("処理中のドロップで二重実行せず、所有者がいない場合も開始しない", async () => {
        let resolveImport!: (result: PostHistoryJsonlImportResult) => void;
        importFileMock.mockReturnValue(new Promise((resolve) => {
            resolveImport = resolve;
        }));
        const view = render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const dropZone = getDropZone();
        const file = createFile();
        await fireEvent.drop(dropZone, { dataTransfer: { types: ["Files"], files: [file] } });
        await fireEvent.drop(dropZone, { dataTransfer: { types: ["Files"], files: [file] } });
        expect(importFileMock).toHaveBeenCalledTimes(1);
        resolveImport(createResult());
        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());

        await view.rerender({
            open: true,
            ownerPubkeyHex: null,
            getCurrentPubkeyHex: () => null,
        });
        await fireEvent.drop(getDropZone(), { dataTransfer: { types: ["Files"], files: [file] } });
        expect(importFileMock).toHaveBeenCalledTimes(1);
    });

    it("ドロップ経由でも完了結果とonImported通知を維持する", async () => {
        importFileMock.mockResolvedValue(createResult({ insertedPostCount: 2 }));
        const onImported = vi.fn();
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
                onImported,
            },
        });

        await fireEvent.drop(getDropZone(), {
            dataTransfer: { types: ["Files"], files: [createFile()] },
        });

        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());
        expect(screen.getByText("新規追加").parentElement?.textContent).toContain("2");
        expect(onImported).toHaveBeenCalledTimes(1);
    });

    it("ダイアログを閉じて再表示するとドラッグ状態をリセットする", async () => {
        let open = true;
        const view = render(PostHistoryImportDialog, {
            props: {
                open,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const dropZone = getDropZone();
        const dataTransfer = { types: ["Files"], files: [createFile()] };
        await fireEvent.dragEnter(dropZone, {
            dataTransfer,
        });
        await fireEvent.dragEnter(dropZone, { dataTransfer });
        expect(screen.getByText("ここにドロップ")).toBeTruthy();
        await fireEvent.dragLeave(dropZone, { dataTransfer });
        expect(screen.getByText("ここにドロップ")).toBeTruthy();
        await fireEvent.dragLeave(dropZone, { dataTransfer });
        expect(screen.getByText("JSONLファイルをここにドラッグ＆ドロップ")).toBeTruthy();

        open = false;
        await view.rerender({
            open,
            ownerPubkeyHex: "a".repeat(64),
            getCurrentPubkeyHex: () => "a".repeat(64),
        });
        open = true;
        await view.rerender({
            open,
            ownerPubkeyHex: "a".repeat(64),
            getCurrentPubkeyHex: () => "a".repeat(64),
        });

        expect(screen.queryByText("ここにドロップ")).toBeNull();
        expect(screen.getByText("JSONLファイルをここにドラッグ＆ドロップ")).toBeTruthy();
    });

    it("ファイル選択キャンセルをエラーにせずimportを開始しない", async () => {
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });

        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, { target: { files: [] } });

        expect(importFileMock).not.toHaveBeenCalled();
        expect(screen.queryByText("ファイルを読み込めませんでした")).toBeNull();
    });

    it("処理中の二重実行を防ぎ完了件数を3群で表示して一覧更新を通知する", async () => {
        let resolveImport!: (result: PostHistoryJsonlImportResult) => void;
        importFileMock.mockReturnValue(new Promise((resolve) => {
            resolveImport = resolve;
        }));
        const onImported = vi.fn();
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
                onImported,
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        const file = new File(["{}"], "history.jsonl", { type: "application/x-ndjson" });

        await fireEvent.change(input, { target: { files: [file] } });
        expect(importFileMock).toHaveBeenCalledTimes(1);
        expect((screen.getByRole("button", {
            name: "JSONLファイルを選択",
        }) as HTMLButtonElement).disabled).toBe(true);
        expect(screen.getByText("読み込み中...")).toBeTruthy();
        await fireEvent.change(input, { target: { files: [file] } });
        expect(importFileMock).toHaveBeenCalledTimes(1);

        resolveImport(createResult({
            nonEmptyLineCount: 4,
            fileDuplicateCount: 1,
            uniqueDeletionEventCount: 1,
            validDeletionETagCount: 2,
            insertedDeletionRequestCount: 2,
            unsupportedDeletionEventCount: 1,
            appliedDeletionPostCount: 1,
        }));
        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());

        const dialog = screen.getByRole("dialog", { name: "JSONLをインポート" });
        expect(within(dialog).getByRole("heading", { name: "入力" })).toBeTruthy();
        expect(within(dialog).getByRole("heading", { name: "投稿履歴" })).toBeTruthy();
        expect(within(dialog).getByRole("heading", { name: "削除要求" })).toBeTruthy();
        expect(dialog.textContent).toContain("ファイル内重複");
        expect(dialog.textContent).toContain("削除状態を反映");
        expect(dialog.textContent).toContain("対象外の削除要求");
        expect(onImported).toHaveBeenCalledTimes(1);
    });

    it("部分成功の結果を表示する", async () => {
        importFileMock.mockImplementation(async ({ onProgress }) => {
            const partialResult = createResult({
                status: "partial",
                failedPostEventCount: 1,
                insertedPostCount: 0,
            });
            onProgress({
                result: partialResult,
                processedBytes: 75,
                totalBytes: 100,
            });
            return partialResult;
        });
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;

        await fireEvent.change(input, {
            target: { files: [new File(["{}"], "history.jsonl")] },
        });

        expect(await screen.findByText(
            "処理を完了しましたが、一部を取り込めませんでした",
        )).toBeTruthy();
        expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("75");
        expect(screen.getByText("処理を完了しましたが、一部を取り込めませんでした")
            .closest(".import-progress")?.getAttribute("aria-label"))
            .toBe("進捗");
    });

    it("インポート中にバイト進捗、経過時間、計算中の残り時間を表示する", async () => {
        vi.useFakeTimers();
        let now = 0;
        vi.spyOn(performance, "now").mockImplementation(() => now);
        let emitProgress!: (progress: Readonly<PostHistoryJsonlImportProgress>) => void;
        importFileMock.mockImplementation(({ onProgress }) => {
            emitProgress = onProgress;
            return new Promise<PostHistoryJsonlImportResult>(() => undefined);
        });
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;

        await fireEvent.change(input, {
            target: { files: [new File(["1234567890"], "history.jsonl")] },
        });

        expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("0%");
        expect(screen.getByText("進捗").parentElement?.textContent).toContain("0%");
        expect(screen.getByText("経過時間").parentElement?.textContent).toContain("0:00");
        expect(screen.getByText("推定残り時間").parentElement?.textContent)
            .toContain("計算中...");

        now = 12_000;
        vi.advanceTimersByTime(1_000);
        emitProgress({
            result: createResult(),
            processedBytes: 50,
            totalBytes: 100,
        });
        await waitFor(() => {
            expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
        });
        expect(screen.getByText("進捗").parentElement?.textContent).toContain("50%");
        expect(screen.getByText("経過時間").parentElement?.textContent).toContain("0:12");
        expect(screen.getByText("推定残り時間").parentElement?.textContent)
            .toContain("0:12");
        expect(screen.getByText("推定残り時間").parentElement?.textContent)
            .not.toContain("約");
    });

    it("1時間以上の経過時間をh:mm:ssで表示する", async () => {
        vi.useFakeTimers();
        let now = 0;
        vi.spyOn(performance, "now").mockImplementation(() => now);
        let emitProgress!: (progress: Readonly<PostHistoryJsonlImportProgress>) => void;
        importFileMock.mockImplementation(({ onProgress }) => {
            emitProgress = onProgress;
            return new Promise<PostHistoryJsonlImportResult>(() => undefined);
        });
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, {
            target: { files: [new File(["1"], "history.jsonl")] },
        });

        now = 3_722_000;
        vi.advanceTimersByTime(1_000);
        emitProgress({
            result: createResult(),
            processedBytes: 1,
            totalBytes: 2,
        });
        await waitFor(() => {
            expect(screen.getByText("経過時間").parentElement?.textContent)
                .toContain("1:02:02");
        });
    });

    it("処理中の状態を進捗領域に表示しimport-statusを作らない", async () => {
        let resolveImport!: (result: PostHistoryJsonlImportResult) => void;
        importFileMock.mockReturnValue(new Promise((resolve) => {
            resolveImport = resolve;
        }));
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, {
            target: { files: [new File(["1"], "history.jsonl")] },
        });

        const status = screen.getByText("読み込み中...");
        expect(status.closest(".import-progress")).toBeTruthy();
        expect(status.closest(".import-progress-status")?.getAttribute("aria-live"))
            .toBe("polite");
        expect(screen.queryByText("読み込み中...")?.closest(".import-progress-summary"))
            .toBeNull();
        expect(screen.queryByText("読み込み中...")?.closest(".import-status")).toBeNull();
        expect(screen.getByRole("progressbar")).toBeTruthy();

        resolveImport(createResult());
        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());
    });

    it("正常完了後も最終進捗、経過時間、完了状態を表示する", async () => {
        vi.useFakeTimers();
        let now = 0;
        vi.spyOn(performance, "now").mockImplementation(() => now);
        let resolveImport!: (result: PostHistoryJsonlImportResult) => void;
        let emitProgress!: (progress: Readonly<PostHistoryJsonlImportProgress>) => void;
        importFileMock.mockImplementation(({ onProgress }) => {
            emitProgress = onProgress;
            return new Promise((resolve) => {
                resolveImport = resolve;
            });
        });
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, {
            target: { files: [new File(["1"], "history.jsonl")] },
        });

        now = 5_000;
        vi.advanceTimersByTime(1_000);
        emitProgress({
            result: createResult(),
            processedBytes: 1,
            totalBytes: 1,
        });
        resolveImport(createResult());
        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());

        expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
        expect(screen.getByText("経過時間").parentElement?.textContent).toContain("0:05");
        expect(screen.getByText("推定残り時間").parentElement?.textContent).toContain("0:00");
        expect(screen.getAllByText(/進捗|経過時間|推定残り時間/)).toHaveLength(3);
    });

    it("失敗時は実際の最終進捗を維持し100%へ上書きしない", async () => {
        importFileMock.mockImplementation(async ({ onProgress }) => {
            const failedResult = createResult({ status: "failed" });
            onProgress({
                result: failedResult,
                processedBytes: 42,
                totalBytes: 100,
            });
            return failedResult;
        });
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, {
            target: { files: [new File(["1"], "history.jsonl")] },
        });

        await waitFor(() => expect(screen.getByText("ファイルを読み込めませんでした")).toBeTruthy());
        expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("42");
        expect(screen.getByText("推定残り時間").parentElement?.textContent).toContain("--:--");
    });

    it("完了後に閉じて再表示すると進捗表示をリセットする", async () => {
        importFileMock.mockImplementation(async ({ onProgress }) => {
            const completedResult = createResult();
            onProgress({
                result: completedResult,
                processedBytes: 100,
                totalBytes: 100,
            });
            return completedResult;
        });
        const view = render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "JSONLをインポート" })
            .querySelector('input[type="file"]') as HTMLInputElement;
        await fireEvent.change(input, {
            target: { files: [new File(["1"], "history.jsonl")] },
        });
        await waitFor(() => expect(screen.getByText("読み込みが完了しました")).toBeTruthy());

        await view.rerender({
            open: false,
            ownerPubkeyHex: "a".repeat(64),
            getCurrentPubkeyHex: () => "a".repeat(64),
        });
        await view.rerender({
            open: true,
            ownerPubkeyHex: "a".repeat(64),
            getCurrentPubkeyHex: () => "a".repeat(64),
        });
        expect(screen.queryByRole("progressbar")).toBeNull();
        expect(screen.queryByText("読み込みが完了しました")).toBeNull();
    });
});
