import { fireEvent, render, screen, waitFor, within } from "@testing-library/svelte";
import { readable } from "svelte/store";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PostHistoryImportDialog from "../../components/PostHistoryImportDialog.svelte";
import type { PostHistoryJsonlImportResult } from "../../lib/postHistoryJsonlImportService";

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
    "postHistory.importTitle": "投稿履歴を読み込む",
    "postHistory.importDescription": "Citrineなどから書き出したNostr JSONLに対応",
    "postHistory.importChooseFile": "JSONLファイルを選択",
    "postHistory.importReading": "読み込み中...",
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

    it("ファイル選択キャンセルをエラーにせずimportを開始しない", async () => {
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });

        const input = screen.getByRole("dialog", { name: "投稿履歴を読み込む" })
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
        const input = screen.getByRole("dialog", { name: "投稿履歴を読み込む" })
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

        const dialog = screen.getByRole("dialog", { name: "投稿履歴を読み込む" });
        expect(within(dialog).getByRole("heading", { name: "入力" })).toBeTruthy();
        expect(within(dialog).getByRole("heading", { name: "投稿履歴" })).toBeTruthy();
        expect(within(dialog).getByRole("heading", { name: "削除要求" })).toBeTruthy();
        expect(dialog.textContent).toContain("ファイル内重複");
        expect(dialog.textContent).toContain("削除状態を反映");
        expect(dialog.textContent).toContain("対象外の削除要求");
        expect(onImported).toHaveBeenCalledTimes(1);
    });

    it("部分成功の結果を表示する", async () => {
        importFileMock.mockResolvedValue(createResult({
            status: "partial",
            failedPostEventCount: 1,
            insertedPostCount: 0,
        }));
        render(PostHistoryImportDialog, {
            props: {
                open: true,
                ownerPubkeyHex: "a".repeat(64),
                getCurrentPubkeyHex: () => "a".repeat(64),
            },
        });
        const input = screen.getByRole("dialog", { name: "投稿履歴を読み込む" })
            .querySelector('input[type="file"]') as HTMLInputElement;

        await fireEvent.change(input, {
            target: { files: [new File(["{}"], "history.jsonl")] },
        });

        expect(await screen.findByText(
            "処理を完了しましたが、一部を取り込めませんでした",
        )).toBeTruthy();
    });
});
