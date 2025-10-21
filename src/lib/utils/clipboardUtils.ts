/**
 * クリップボード処理のユーティリティ関数
 * 
 * クリップボードのテキスト処理における改行コードの正規化と
 * 末尾の改行処理を統一的に管理
 */
import { normalizeLineBreaks } from './editorUtils';

/**
 * テキストの改行コードを統一し、末尾の改行を適切に処理
 * 
 * @param text - 処理対象のテキスト
 * @param options - オプション設定
 * @returns 正規化されたテキストと行の配列
 */
export function normalizeClipboardText(
    text: string,
    options: {
        collapseEmptyLines?: boolean; // 連続した空行を1つに集約
        maxConsecutiveEmptyLines?: number; // 許可する最大連続空行数
    } = {}
): {
    normalized: string;
    lines: string[];
} {
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
 * 段落の配列をテキストに変換
 * 
 * @param paragraphs - 段落のテキスト配列（空文字列は空行を表す）
 * @returns 改行で区切られたテキスト
 */
export function serializeParagraphs(paragraphs: string[]): string {
    // 段落を\nで結合
    // ブラウザのクリップボードAPIが自動的にプラットフォームに応じた改行コードに変換
    return paragraphs.join('\n');
}

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
 * テキストの改行統計を取得
 * 
 * @param text - 分析対象のテキスト
 * @returns 改行に関する統計情報
 */
export function analyzeLineBreaks(text: string): {
    crlfCount: number;
    lfCount: number;
    crCount: number;
    totalLines: number;
    hasTrailingNewline: boolean;
} {
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
