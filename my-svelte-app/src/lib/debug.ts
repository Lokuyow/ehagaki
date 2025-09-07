import { writable, type Writable } from "svelte/store";

// --- dev環境判定ストア ---
export const isDev = writable(import.meta.env.MODE === "development");

// --- dev用: console.log履歴ストア ---
export const devLog: Writable<string[]> = writable([]);

function logToDevFooter(...args: any[]) {
    const entry = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
    devLog.update((logs) => [entry, ...logs].slice(0, 250)); // 50→250に変更
}

// --- dev用: console.logフック有効/無効切り替え ---
export const ENABLE_DEV_LOG_HOOK = false; // ← ここに移動

// --- 開発時のみconsole.logをフック ---
// ↓ ENABLE_DEV_LOG_HOOK で切り替え
if (import.meta.env.MODE === "development" && ENABLE_DEV_LOG_HOOK) {
    const origLog = console.log;
    // すでにフック済みなら再度フックしない
    if (!(window as any).__devLogHooked) {
        console.log = function (...args: any[]) {
            origLog.apply(console, args);
            logToDevFooter(...args);
        };
        (window as any).__devLogHooked = true;
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
    if (import.meta.env.MODE === "development") {
        // 開発時のみログ出力
        console.log("[DEBUG]", ...args);
    }
}

// 認証状態専用のデバッグログ
export function debugAuthState(label: string, authState: any) {
    if (import.meta.env.MODE === "development") {
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
    if (import.meta.env.MODE !== "development") return;
    try {
        const cloned = response.clone();
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
import { swNeedRefresh } from "./stores";
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
import { editorState } from "./editor/store";
if (import.meta.env.MODE === "development") {
    (window as any).showPostSuccessDebug = () => {
        editorState.update((state) => ({
            ...state,
            postStatus: {
                ...state.postStatus,
                success: true,
                error: false,
                message: "post_success",
                completed: true // ← これを追加
            },
        }));
    };
    (window as any).showPostErrorDebug = () => {
        editorState.update((state) => ({
            ...state,
            postStatus: {
                ...state.postStatus,
                success: false,
                error: true,
                message: "post_error",
                completed: false // ← これも明示的に
            },
        }));
    };
}