import { writable, type Writable } from "svelte/store";

// --- dev環境判定ストア ---
export const isDev = writable(import.meta.env.MODE === "development");

// --- preview環境判定ストア（追加） ---
export const isPreview = writable(import.meta.env.MODE === "development" || window.location.port === "4173" || window.location.hostname === "localhost");

// --- dev or preview環境判定ストア（追加） ---
// 削除（下でshouldShowDevLog()を使って再定義）

// --- dev用: console.log履歴ストア ---
export const devLog: Writable<string[]> = writable([]);

function logToDevFooter(...args: any[]) {
    const entry = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
    devLog.update((logs) => [entry, ...logs].slice(0, 250)); // 50→250に変更
}

// --- dev用: console.logフック有効/無効切り替え ---
export const ENABLE_DEV_LOG_HOOK = true; // ← ここに移動

// --- 本番環境でもfloating-dev-console-logを強制表示する設定 ---
export const FORCE_SHOW_FLOATING_DEV_LOG = true; // trueで本番環境でも表示

// オリジナルのconsole.logを保存
const originalConsoleLog = console.log;
if (typeof window !== "undefined") {
    (window as any).__originalConsoleLog = originalConsoleLog;
}

// --- previewOrDev判定関数（本番強制表示対応） ---
export function shouldShowDevLog(): boolean {
    // 強制表示フラグがtrueなら常に表示
    if (FORCE_SHOW_FLOATING_DEV_LOG) return true;

    // 通常の開発・previewモード判定
    return import.meta.env.MODE === "development" ||
        window.location.port === "4173" ||
        window.location.hostname === "localhost";
}

// --- 既存のストアを更新（本番強制表示対応） ---
export const isPreviewOrDev = writable(shouldShowDevLog());

// --- 開発時・previewモード・本番強制表示時でconsole.logをフック ---
// ↓ ENABLE_DEV_LOG_HOOK で切り替え
if (
    (
        import.meta.env.MODE === "development" || 
        window.location.port === "4173" || 
        window.location.hostname === "localhost" ||
        FORCE_SHOW_FLOATING_DEV_LOG // 本番強制表示時もフック有効
    ) && 
    ENABLE_DEV_LOG_HOOK
) {
    // すでにフック済みなら再度フックしない
    if (!(window as any).__devLogHooked) {
        console.log = function (...args: any[]) {
            // 特定のデバッグメッセージは無限ループを避けるためフックしない
            const firstArg = args[0];
            if (typeof firstArg === 'string' && firstArg.includes('[FooterInfoDisplay Debug]')) {
                originalConsoleLog.apply(console, args);
                return;
            }

            originalConsoleLog.apply(console, args);
            logToDevFooter(...args);
        };
        (window as any).__devLogHooked = true;
        
        // 本番環境で強制表示時は初期ログを追加
        if (FORCE_SHOW_FLOATING_DEV_LOG && import.meta.env.MODE === "production") {
            logToDevFooter("🔧 Debug mode enabled in production");
            logToDevFooter("Current environment:", import.meta.env.MODE);
            logToDevFooter("Location:", window.location.href);
        }
    }
}

// dev-console-logをタップしたら全内容をコピー（下が最新）
// 変更: Promise を返すようにして呼び出し側で失敗を検知できるようにする
export function copyDevLog(): Promise<void> {
    return new Promise((resolve, reject) => {
        let logs: string[] = [];
        devLog.subscribe(v => logs = v)(); // 即時取得
        const joined = logs?.join("\n") ?? "";
        if (!joined) {
            resolve();
            return;
        }
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            navigator.clipboard.writeText(joined).then(resolve).catch(reject);
        } else {
            // Clipboard API が使えない環境では拒否する（呼び出し元で textarea フォールバックを行う）
            reject(new Error("Clipboard API not available"));
        }
    });
}

// 追加: Clipboard API が使えなかった場合に textarea を用いたフォールバックまで行う
export async function copyDevLogWithFallback(logsArg?: string[]): Promise<void> {
    let logs: string[] = [];
    if (logsArg) {
        logs = logsArg;
    } else {
        devLog.subscribe(v => logs = v)(); // 即時取得
    }
    const joined = logs?.join("\n") ?? "";
    if (!joined) {
        // ログが空なら成功扱いで返す（Footer 側では何もしない）
        return;
    }

    // 1) まず Navigator.clipboard を試す
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        try {
            await navigator.clipboard.writeText(joined);
            return;
        } catch (e) {
            // 続行してフォールバックへ
        }
    }

    // 2) フォールバック: textarea を利用（iOS 向けに font-size 調整）
    try {
        const textarea = document.createElement("textarea");
        textarea.value = joined;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        textarea.style.fontSize = "12px"; // iOS の自動ズーム回避
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            textarea.setSelectionRange(0, textarea.value.length);
        } catch (_) {
            // ignore
        }
        const successful = document.execCommand && document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
            return;
        } else {
            throw new Error("execCommand copy failed");
        }
    } catch (err) {
        // 最後まで失敗したらエラーを投げる
        throw err;
    }
}

// デバッグ用ユーティリティ（本番ビルド時は何もしない）

export function debugLog(...args: any[]) {
    // previewモードでも表示するように修正
    if (import.meta.env.MODE === "development" || window.location.port === "4173" || window.location.hostname === "localhost") {
        // 開発時・previewモードでログ出力
        console.log("[DEBUG]", ...args);
    }
}

// 認証状態専用のデバッグログ
export function debugAuthState(label: string, authState: any) {
    // previewモードでも表示するように修正
    if (import.meta.env.MODE === "development" || window.location.port === "4173" || window.location.hostname === "localhost") {
        console.log(`[AUTH DEBUG] ${label}:`, {
            type: authState.type,
            isAuthenticated: authState.isAuthenticated,
            isInitialized: authState.isInitialized,
            pubkey: authState.pubkey ? `${authState.pubkey.slice(0, 8)}...` : 'empty'
        });
    }
}

// --- 画像アップロード時のHTTPレスポンスをdevモードのみログ出力 ---
export async function debugLogUploadResponse(response: Response) {
    // previewモードでも表示するように修正
    if (import.meta.env.MODE !== "development" && !(window.location.port === "4173" || window.location.hostname === "localhost")) return;
    try {
        // 常に clone して安全に読み取る
        const cloned = response.clone();

        // ステータスが200の場合はまずJSONを試みてオブジェクトでログ出力（可読性向上）
        if (response.status === 200) {
            try {
                const json = await cloned.json();
                console.log("[UPLOAD RESPONSE]", {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    body: json
                });
                return;
            } catch {
                // JSONパースに失敗したらテキストにフォールバックしてログ出力する
                try {
                    const text = await cloned.text();
                    console.log("[UPLOAD RESPONSE]", {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        body: text
                    });
                    return;
                } catch (e) {
                    console.log("[UPLOAD RESPONSE] (failed to read body)", e);
                    return;
                }
            }
        }

        // 200以外は従来どおりテキストを読み取ってログ出力
        try {
            const text = await cloned.text();
            console.log("[UPLOAD RESPONSE]", {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
                body: text
            });
        } catch (e) {
            console.log("[UPLOAD RESPONSE] (failed to read body)", e);
        }
    } catch (e) {
        console.log("[UPLOAD RESPONSE] (unexpected error)", e);
    }
}

// デバッグ用の関数やモックデータなどもここに追加可能

// --- showSwUpdateModalDebug: 設定ボタンランプとSettingsDialog内の更新ボタンを強制表示するデバッグ関数型 ---
declare global {
    interface Window {
        showSwUpdateModalDebug?: () => void;
    }
}

// --- ここから修正: SW更新ボタン強制表示デバッグ機能 ---
// 以前は「モーダル」だったが、現在は設定ボタンランプとSettingsDialog内の更新ボタン表示用
import { swNeedRefresh } from "../stores/appStore.svelte";
// --- SW更新ボタン強制表示デバッグ機能 ---
// 必ずグローバルwindowに生やす（import後に実行）
if (typeof window !== "undefined") {
    window.showSwUpdateModalDebug = () => {
        swNeedRefresh.set(true);
        console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
    };
}

// --- dev用: post success/error強制表示デバッグ ---
// editorState をここでimport
import { editorState } from "../stores/editorStore.svelte";
// previewモードでも有効にするように修正
if (shouldShowDevLog()) {
    // デバッグ用テスト関数を追加
    (window as any).testDevLog = () => {
        console.log("テスト用ログ出力:", new Date().toISOString());
        logToDevFooter("直接devLogに追加:", Math.random());
    };

    (window as any).showPostSuccessDebug = () => {
        // editorStateは$stateストアなのでプロパティ単位で代入
        editorState.postStatus = {
            ...editorState.postStatus,
            success: true,
            error: false,
            message: "post_success",
            completed: true // ← これを追加
        };
    };
    (window as any).showPostErrorDebug = () => {
        editorState.postStatus = {
            ...editorState.postStatus,
            success: false,
            error: true,
            message: "post_error",
            completed: false // ← これも明示的に
        };
    };
}

// 圧縮画像プレビュー表示（dev用デバッグ）
const ENABLE_COMPRESSED_IMAGE_PREVIEW = false; // trueで有効、falseで無効
export function showCompressedImagePreview(file: File) {
    // previewモードでも有効にするように修正
    if (
        (import.meta.env.MODE === "development" || window.location.port === "4173" || window.location.hostname === "localhost") &&
        ENABLE_COMPRESSED_IMAGE_PREVIEW
    ) {
        try {
            const blobUrl = URL.createObjectURL(file);
            const win = window.open(blobUrl, "_blank");
            if (win) {
                const revoke = () => {
                    URL.revokeObjectURL(blobUrl);
                    win.removeEventListener("beforeunload", revoke);
                };
                win.addEventListener("beforeunload", revoke);
            } else {
                setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
            }
        } catch { }
    }
}