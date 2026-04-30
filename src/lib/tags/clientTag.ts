/**
 * client タグのデフォルト内容（既存実装を移植）
 */
export const DEFAULT_CLIENT_TAG = [
    "client",
    "eHagaki",
    "31990:ec42c765418b3db9c85abff3a88f4a3bbe57535eebbdc54522041fa5328c0600:1754918316480"
];

/**
 * clientTag の有効/無効に応じてタグ配列を返す。
 */
export function buildClientTag(enabled: boolean): string[] | null {
    return enabled ? [...DEFAULT_CLIENT_TAG] : null;
}
