/**
 * クリップボード処理のユーティリティ関数
 * 
 * 責務:
 * - テキストの改行コード正規化（CRLF/CR/LF → LF）
 * - 末尾改行の適切な処理
 * - 段落配列とテキストの相互変換
 * 
 * 注意: ProseMirror/Tiptapのノード操作は含まない（clipboardExtension.tsが担当）
 */
import { normalizeLineBreaks } from './editorUtils';

/**
 * クリップボードテキストの正規化オプション
 */
export interface NormalizeClipboardTextOptions {
    /** 連続した空行を1つに集約 */
    collapseEmptyLines?: boolean;
    /** 許可する最大連続空行数（collapseEmptyLines=true時のみ有効） */
    maxConsecutiveEmptyLines?: number;
}

/**
 * クリップボードテキストの正規化結果
 */
export interface NormalizedClipboardText {
    /** 正規化されたテキスト（LF改行） */
    normalized: string;
    /** 改行で分割された行の配列 */
    lines: string[];
}

/**
 * テキストの改行コードを統一し、末尾の改行を適切に処理
 * 
 * 処理フロー:
 * 1. 改行コードを統一 (CRLF, CR → LF)
 * 2. 連続した空行を制限（オプション）
 * 3. 改行で分割
 * 4. 末尾の改行による空要素を削除
 * 5. 完全に空のテキストの場合は空配列を返す
 * 
 * @param text - 処理対象のテキスト
 * @param options - オプション設定
 * @returns 正規化されたテキストと行の配列
 */
export function normalizeClipboardText(
    text: string,
    options: NormalizeClipboardTextOptions = {}
): NormalizedClipboardText {
    const {
        collapseEmptyLines = false,
        maxConsecutiveEmptyLines = 2
    } = options;

    // 1. 改行コードを統一 (CRLF, CR → LF)
    let normalized = normalizeLineBreaks(text);

    // 2. 連続した空行を制限（オプション）
    if (collapseEmptyLines) {
        // 連続する改行を指定された数+1に制限
        // 例: maxConsecutiveEmptyLines=1の場合、\n\n（空行1つ）まで許可
        const pattern = new RegExp(`\\n{${maxConsecutiveEmptyLines + 2},}`, 'g');
        normalized = normalized.replace(pattern, '\n'.repeat(maxConsecutiveEmptyLines + 1));
    }

    // 3. 改行で分割
    let lines = normalized.split('\n');

    // 4. 末尾の改行による空要素を削除
    // split('\n')は末尾に\nがある場合、最後に空文字列を追加する
    // 例: "a\nb\n" → ["a", "b", ""]
    // この空文字列は「次の行が空」ではなく「最後の行の終わり」を示すため削除
    if (lines.length > 0 && lines[lines.length - 1] === '') {
        lines = lines.slice(0, -1);
    }

    // 5. 完全に空のテキストの場合は空配列を返す
    if (lines.length === 1 && lines[0] === '') {
        lines = [];
    }

    return { normalized, lines };
}

/**
 * 段落の配列をテキストに変換（シリアライズ）
 * 
 * 用途: エディタの段落をクリップボード用のプレーンテキストに変換
 * 
 * 注意: ブラウザのClipboard APIが自動的にプラットフォームに応じた
 *      改行コード（Windows: CRLF, Unix/Mac: LF）に変換するため、
 *      ここでは常にLF(\n)を使用
 * 
 * @param paragraphs - 段落のテキスト配列（空文字列は空行を表す）
 * @returns 改行で区切られたテキスト
 */
export function serializeParagraphs(paragraphs: string[]): string {
    return paragraphs.join('\n');
}

// ================================================================================
// デバッグ用ユーティリティ（開発環境のみ使用）
// ================================================================================

/**
 * デバッグ用: テキストの改行構造を可視化
 * 
 * @param text - 確認対象のテキスト
 * @returns 改行コードが可視化された文字列
 */
export function visualizeLineBreaks(text: string): string {
    return text
        .replace(/\r\n/g, '[CRLF]')
        .replace(/\n/g, '[LF]')
        .replace(/\r/g, '[CR]');
}

/**
 * 改行統計情報
 */
export interface LineBreakAnalysis {
    /** CRLF改行の数 */
    crlfCount: number;
    /** LF改行の数（CRLF以外） */
    lfCount: number;
    /** CR改行の数（CRLF以外） */
    crCount: number;
    /** 総行数 */
    totalLines: number;
    /** 末尾に改行があるか */
    hasTrailingNewline: boolean;
}

/**
 * テキストの改行統計を取得
 * 
 * @param text - 分析対象のテキスト
 * @returns 改行に関する統計情報
 */
export function analyzeLineBreaks(text: string): LineBreakAnalysis {
    const crlfCount = (text.match(/\r\n/g) || []).length;
    const lfCount = (text.match(/(?<!\r)\n/g) || []).length;
    const crCount = (text.match(/\r(?!\n)/g) || []).length;

    const normalized = normalizeLineBreaks(text);
    const lines = normalized.split('\n');
    const hasTrailingNewline = normalized.endsWith('\n');

    return {
        crlfCount,
        lfCount,
        crCount,
        totalLines: hasTrailingNewline ? lines.length - 1 : lines.length,
        hasTrailingNewline
    };
}
