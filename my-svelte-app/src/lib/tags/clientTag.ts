// 新規ファイル: clientTag 用ユーティリティ

/**
 * client タグのデフォルト内容（既存実装を移植）
 */
const DEFAULT_CLIENT_TAG = [
    "client",
    "eHagaki",
    "31990:ec42c765418b3db9c85abff3a88f4a3bbe57535eebbdc54522041fa5328c0600:1754918316480",
    "wss://relay.nostr.band"
];

/**
 * localStorage から clientTag の有効/無効を読み取り、有効ならタグ配列を返す
 * デフォルト動作は有効(true)（既存実装に合わせる）
 */
export function getClientTag(): string[] | null {
    try {
        const stored = localStorage.getItem("clientTagEnabled");
        const enabled = stored === null ? true : stored === "true";
        return enabled ? [...DEFAULT_CLIENT_TAG] : null;
    } catch {
        // localStorage にアクセスできない環境ではデフォルトで有効を返す
        return [...DEFAULT_CLIENT_TAG];
    }
}

/**
 * clientTag の有効/無効を保存するユーティリティ
 */
export function setClientTagEnabled(enabled: boolean): void {
    try {
        localStorage.setItem("clientTagEnabled", enabled ? "true" : "false");
    } catch {
        // silent
    }
}
