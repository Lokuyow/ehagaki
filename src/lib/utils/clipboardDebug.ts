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
    if (import.meta.env.MODE !== 'development') {
        return;
    }

    console.group(`📋 Clipboard Debug: ${source}`);
    
    // 利用可能な型をリスト
    console.log('Available types:', Array.from(clipboardData.types));
    
    // プレーンテキスト
    const plainText = clipboardData.getData('text/plain');
    if (plainText) {
        console.group('📝 Plain Text');
        console.log('Raw:', JSON.stringify(plainText));
        console.log('Visualized:', visualizeLineBreaks(plainText));
        console.log('Analysis:', analyzeLineBreaks(plainText));
        console.log('Length:', plainText.length);
        console.groupEnd();
    }
    
    // HTML
    const html = clipboardData.getData('text/html');
    if (html) {
        console.group('🌐 HTML');
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
        
        console.groupEnd();
    }
    
    // ファイル
    if (clipboardData.files && clipboardData.files.length > 0) {
        console.group('📁 Files');
        console.log('Count:', clipboardData.files.length);
        Array.from(clipboardData.files).forEach((file, i) => {
            console.log(`File ${i}:`, {
                name: file.name,
                type: file.type,
                size: file.size
            });
        });
        console.groupEnd();
    }
    
    console.groupEnd();
}

/**
 * ペースト処理の結果をログ出力
 */
export function debugPasteResult(
    source: string,
    originalText: string,
    normalizedLines: string[],
    paragraphCount: number
): void {
    if (import.meta.env.MODE !== 'development') {
        return;
    }

    console.group(`✨ Paste Result: ${source}`);
    console.log('Original length:', originalText.length);
    console.log('Lines:', normalizedLines.length);
    console.log('Paragraphs created:', paragraphCount);
    console.log('Lines detail:', normalizedLines.map((line, i) => 
        `${i}: "${line}" (${line.length} chars)`
    ));
    console.groupEnd();
}
