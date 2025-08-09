// デバッグ用ユーティリティ（本番ビルド時は何もしない）

export function debugLog(...args: any[]) {
    if (import.meta.env.MODE === "development") {
        // 開発時のみログ出力
        console.log("[DEBUG]", ...args);
    }
}

// デバッグ用の関数やモックデータなどもここに追加可能

// SW更新ダイアログを強制表示するデバッグ関数型
declare global {
    interface Window {
        showSwUpdateModalDebug?: () => void;
    }
}