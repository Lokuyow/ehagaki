import { settingsStore } from "../../stores/settingsStore.svelte";

/**
 * client タグのデフォルト内容（既存実装を移植）
 */
const DEFAULT_CLIENT_TAG = [
    "client",
    "eHagaki",
    "31990:ec42c765418b3db9c85abff3a88f4a3bbe57535eebbdc54522041fa5328c0600:1754918316480"
];

/**
 * localStorage から clientTag の有効/無効を読み取り、有効ならタグ配列を返す
 * デフォルト動作は有効(true)（既存実装に合わせる）
 */
export function getClientTag(): string[] | null {
    return settingsStore.clientTagEnabled ? [...DEFAULT_CLIENT_TAG] : null;
}

/**
 * clientTag の有効/無効を保存するユーティリティ
 */
export function setClientTagEnabled(enabled: boolean): void {
    settingsStore.clientTagEnabled = enabled;
}
