import { writable, type Writable } from "svelte/store";
import { swNeedRefresh } from "../stores/appStore.svelte";
import { editorState } from "../stores/editorStore.svelte";
import { copyToClipboard } from "./utils/clipboardUtils";

// --- dev環境判定ストア ---
export const isDev = writable(import.meta.env.MODE === "development");

// --- preview環境判定ストア（追加） ---
export const isPreview = writable(isPreviewOrDevEnv());

// --- dev用: console.log履歴ストア ---
export const devLog: Writable<string[]> = writable([]);

// --- 設定 ---
export const ENABLE_DEV_LOG_HOOK = false; // falseでconsole.logフック無効化
export const FORCE_SHOW_FLOATING_DEV_LOG = false; // trueで本番環境でも表示

// --- 共通: preview/dev判定関数 ---
function isPreviewOrDevEnv(): boolean {
    return import.meta.env.MODE === "development" ||
        window.location.port === "4173" ||
        window.location.hostname === "localhost";
}

// --- dev-log表示判定 ---
export function shouldShowDevLog(): boolean {
    if (FORCE_SHOW_FLOATING_DEV_LOG) return true;
    return isPreviewOrDevEnv();
}

// --- 既存のストアを更新 ---
export const isPreviewOrDev = writable(shouldShowDevLog());

// --- devLog追加関数 ---
function logToDevFooter(...args: any[]) {
    const entry = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
    devLog.update((logs) => [entry, ...logs].slice(0, 250));
}

// --- devLog追加関数をエクスポート ---
export { logToDevFooter };

// --- console.logフック ---
const originalConsoleLog = console.log;
if (typeof window !== "undefined") {
    (window as any).__originalConsoleLog = originalConsoleLog;
}

if (
    (shouldShowDevLog() || FORCE_SHOW_FLOATING_DEV_LOG) &&
    ENABLE_DEV_LOG_HOOK &&
    !(window as any).__devLogHooked
) {
    console.log = function (...args: any[]) {
        const firstArg = args[0];
        if (typeof firstArg === 'string' && firstArg.includes('[FooterInfoDisplay Debug]')) {
            originalConsoleLog.apply(console, args);
            return;
        }
        originalConsoleLog.apply(console, args);
        logToDevFooter(...args);
    };
    (window as any).__devLogHooked = true;

    if (FORCE_SHOW_FLOATING_DEV_LOG && import.meta.env.MODE === "production") {
        logToDevFooter("🔧 Debug mode enabled in production");
        logToDevFooter("Current environment:", import.meta.env.MODE);
        logToDevFooter("Location:", window.location.href);
    }
}

// --- dev-console-logコピー ---
export function copyDevLog(): Promise<void> {
    return new Promise((resolve, reject) => {
        let logs: string[] = [];
        devLog.subscribe(v => logs = v)();
        const joined = logs?.join("\n") ?? "";
        if (!joined) {
            resolve();
            return;
        }
        // clipboardUtils.tsのcopyToClipboard関数を使用
        copyToClipboard(joined, "dev log", navigator, window);
        resolve();
    });
}

export async function copyDevLogWithFallback(logsArg?: string[]): Promise<void> {
    let logs: string[] = [];
    if (logsArg) {
        logs = logsArg;
    } else {
        devLog.subscribe(v => logs = v)();
    }
    const joined = logs?.join("\n") ?? "";
    if (!joined) return;

    // clipboardUtils.tsのcopyToClipboard関数を使用
    copyToClipboard(joined, "dev log", navigator, window);
}

// --- デバッグ用ユーティリティ ---
export function debugLog(...args: any[]) {
    if (shouldShowDevLog()) {
        console.log("[DEBUG]", ...args);
    }
}

// DEBUG_ENABLED: devログ表示判定に基づくフラグ
const DEBUG_ENABLED = shouldShowDevLog();

export function debugAuthState(message: string, authState: any) {
    if (!DEBUG_ENABLED) return;

    // authStateが未定義の場合の安全な処理
    const safeAuthState = authState || {
        type: 'undefined',
        isAuthenticated: 'undefined',
        isInitialized: 'undefined',
        pubkey: 'undefined'
    };

    console.log(`[AUTH DEBUG] ${message}:`, {
        type: safeAuthState.type ?? 'undefined',
        isAuthenticated: safeAuthState.isAuthenticated ?? 'undefined',
        isInitialized: safeAuthState.isInitialized ?? 'undefined',
        isValid: safeAuthState.isValid ?? 'undefined',
        pubkey: safeAuthState.pubkey ?
            (safeAuthState.pubkey.substring(0, 8) + '...') : 'empty'
    });
}

// --- showSwUpdateModalDebug: SW更新ボタン強制表示デバッグ機能 ---
declare global {
    interface Window {
        showSwUpdateModalDebug?: () => void;
    }
}
if (typeof window !== "undefined") {
    window.showSwUpdateModalDebug = () => {
        swNeedRefresh.set(true);
        console.log("SW更新ボタンを強制表示しました（設定ボタンランプ＋SettingsDialog内）");
    };
}

// --- dev用: post success/error強制表示デバッグ ---
if (shouldShowDevLog()) {
    (window as any).testDevLog = () => {
        console.log("テスト用ログ出力:", new Date().toISOString());
        logToDevFooter("直接devLogに追加:", Math.random());
    };
    (window as any).showPostSuccessDebug = () => {
        editorState.postStatus = {
            ...editorState.postStatus,
            success: true,
            error: false,
            message: "post_success",
            completed: true
        };
    };
    (window as any).showPostErrorDebug = () => {
        editorState.postStatus = {
            ...editorState.postStatus,
            success: false,
            error: true,
            message: "post_error",
            completed: false
        };
    };
}

// 圧縮画像プレビュー表示（dev用デバッグ）
const ENABLE_COMPRESSED_IMAGE_PREVIEW = false;
export function showCompressedImagePreview(file: File) {
    if (shouldShowDevLog() && ENABLE_COMPRESSED_IMAGE_PREVIEW) {
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