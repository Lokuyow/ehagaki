/**
 * クリップボードデバッグユーティリティ
 * 
 * 開発モードでクリップボードの内容を詳細に分析・表示
 */

import { visualizeLineBreaks, analyzeLineBreaks } from './clipboardUtils';

/**
 * クリップボードデータを詳細にログ出力
 */
export function debugClipboardData(clipboardData: DataTransfer, source: string = 'unknown'): void {
    // 環境情報を含めてログ出力（PC/Androidの違いを確認するため）
    const envInfo = `📋 Clipboard Debug: ${source} [${import.meta.env.MODE}]`;
    console.log(envInfo);

    // 利用可能な型をリスト
    console.log('Available types:', Array.from(clipboardData.types));

    // プレーンテキスト
    const plainText = clipboardData.getData('text/plain');
    if (plainText) {
        console.log('📝 Plain Text');
        console.log('Raw:', JSON.stringify(plainText));
        console.log('Visualized:', visualizeLineBreaks(plainText));
        console.log('Analysis:', analyzeLineBreaks(plainText));
        console.log('Length:', plainText.length);
    }

    // HTML
    const html = clipboardData.getData('text/html');
    if (html) {
        console.log('🌐 HTML');
        console.log('Preview:', html.substring(0, 500) + (html.length > 500 ? '...' : ''));
        console.log('Length:', html.length);

        // 自アプリからのコピー検出
        const isFromOwnApp = html.includes('data-block="true"') && html.includes('data-editor=');
        console.log('From own app:', isFromOwnApp);

        // リッチテキスト検出
        const hasRichFormatting = html.includes('<strong>') ||
            html.includes('<b>') ||
            html.includes('<em>') ||
            html.includes('<i>');
        console.log('Rich formatting:', hasRichFormatting);
    }

    // ファイル
    if (clipboardData.files && clipboardData.files.length > 0) {
        console.log('📁 Files');
        console.log('Count:', clipboardData.files.length);
        Array.from(clipboardData.files).forEach((file, i) => {
            console.log(`File ${i}:`, {
                name: file.name,
                type: file.type,
                size: file.size
            });
        });
    }
}