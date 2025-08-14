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