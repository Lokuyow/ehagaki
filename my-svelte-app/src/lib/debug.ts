import { writable, type Writable } from "svelte/store";

// --- dev環境判定ストア ---
export const isDev = writable(import.meta.env.MODE === "development");

// --- dev用: console.log履歴ストア ---
export const devLog: Writable<string[]> = writable([]);

function logToDevFooter(...args: any[]) {
    const entry = args
        .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");
    devLog.update((logs) => [entry, ...logs].slice(0, 10));
}

// --- 開発時のみconsole.logをフック ---
if (import.meta.env.MODE === "development") {
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

// デバッグ用の関数やモックデータなどもここに追加可能

// SW更新ダイアログを強制表示するデバッグ関数型
declare global {
    interface Window {
        showSwUpdateModalDebug?: () => void;
    }
}