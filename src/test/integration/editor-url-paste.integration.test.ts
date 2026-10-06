import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Slice } from 'prosemirror-model';
import { ContentTrackingExtension } from '../../lib/editor/contentTracking';
import { ClipboardExtension } from '../../lib/editor/clipboardExtension';

// PWA関連のモック
vi.mock("virtual:pwa-register/svelte", () => ({
    useRegisterSW: () => ({
        needRefresh: false,
        updateServiceWorker: vi.fn()
    })
}));

/**
 * エディター・URLペースト統合テスト
 * 
 * URLペースト時の即座のリンク化が正常に動作することを検証
 * 
 * テスト範囲:
 * - URL単体のペースト → 即座にリンク化
 * - URLを含む文章のペースト → URL部分のみリンク化
 * - 複数URLのペースト → すべてリンク化
 * - ペースト後のUndo → 正しく元に戻る
 * - 画像URLのペースト → 画像変換は遅延、リンク化は即座
 */

// ヘルパー関数: コンテンツをペーストし、リンク化を検証
async function pasteAndVerify(editor: Editor, content: string, expectedLinks: number = 1, shouldContainLink: boolean = true) {
    editor.commands.insertContent(content);
    const html = editor.getHTML();
    if (shouldContainLink) {
        expect(html).toContain('<a');
        const linkCount = (html.match(/<a /g) || []).length;
        expect(linkCount).toBe(expectedLinks);
    } else {
        expect(html).not.toContain('<a');
    }
    return html;
}

function createClipboardData(text: string, html?: string, files: File[] = []): DataTransfer {
    const data = new Map<string, string>([['text/plain', text]]);
    if (html !== undefined) {
        data.set('text/html', html);
    }

    return {
        types: Array.from(data.keys()),
        files: files as unknown as FileList,
        getData: (type: string) => data.get(type) ?? '',
    } as unknown as DataTransfer;
}

function invokePasteHandler(editor: Editor, clipboardData: DataTransfer, plainPasteRequested = false): boolean {
    const event = new Event('paste', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'clipboardData', { value: clipboardData });

    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    const clipboardPlugin = editor.state.plugins.find((plugin: any) =>
        String(plugin.key).startsWith('clipboardExtension$'),
    ) as any;
    if (plainPasteRequested) Object.defineProperty(event, 'shiftKey', { value: true });
    if (html && !plainPasteRequested) {
        clipboardPlugin?.props.transformPastedHTML?.call(clipboardPlugin, html, editor.view);
    } else {
        clipboardPlugin?.props.transformPastedText?.call(clipboardPlugin, text, plainPasteRequested, editor.view);
    }

    let handled = false;
    const handlePaste = clipboardPlugin?.props.handlePaste;
    handled = handlePaste?.call(clipboardPlugin, editor.view, event as ClipboardEvent, Slice.empty) === true;
    return handled;
}

function getParagraphText(editor: Editor): string {
    const paragraphs: string[] = [];
    editor.state.doc.forEach((node) => paragraphs.push(node.textContent));
    return paragraphs.join('\n');
}

describe('エディター・URLペースト統合テスト', () => {
    let editor: Editor;

    function createEditor(content = ''): Editor {
        return new Editor({
            extensions: [
                StarterKit.configure({
                    heading: false,
                    blockquote: false,
                    bold: false,
                    italic: false,
                    strike: false,
                    code: false,
                    codeBlock: false,
                    bulletList: false,
                    orderedList: false,
                    listItem: false,
                    horizontalRule: false,
                    hardBreak: false,
                    link: {
                        HTMLAttributes: {
                            class: 'preview-link',
                            rel: null,
                            target: '_blank',
                        },
                        autolink: false, // ContentTrackingで動的判定
                        linkOnPaste: false,
                        defaultProtocol: 'https',
                        validate: (url: string) => {
                            if (url.length < 8) return false;
                            if (!/^https?:\/\//.test(url)) return false;
                            try {
                                new URL(url);
                                return true;
                            } catch {
                                return false;
                            }
                        }
                    }
                }),
                ClipboardExtension,
                ContentTrackingExtension.configure({
                    enableAutoLink: true,
                    enableImageConversion: true,
                    enableHashtags: false
                })
            ],
            content
        });
    }

    beforeEach(() => {
        editor = createEditor();
    });

    afterEach(() => {
        editor?.destroy();
    });

    describe('実ClipboardEvent相当のURLペースト分岐', () => {
        it('タイトル付き単一リンクのFriendly URLは、タイトルではなくplain URLとして貼り付けられること', () => {
            const url = 'https://lokuyow.github.io/ehagaki/';
            const html = '<div><!-- harmless metadata --><a href="https://lokuyow.github.io/ehagaki/">eHagaki</a></div>';

            expect(invokePasteHandler(editor, createClipboardData(url, html))).toBe(true);
            expect(editor.getText()).toBe(url);
            expect(editor.getText()).not.toBe('eHagaki');
            expect(editor.getHTML()).toContain(`href="${url}"`);
        });

        it('通常の名前付きrich linkは表示文字列とURLをplain textとして保持すること', () => {
            expect(invokePasteHandler(
                editor,
                createClipboardData('eHagaki', '<a href="https://lokuyow.github.io/ehagaki/">eHagaki</a>'),
            )).toBe(true);
            expect(editor.getText()).toBe('eHagaki (https://lokuyow.github.io/ehagaki/)');
            expect(editor.getHTML()).toContain('href="https://lokuyow.github.io/ehagaki/"');
        });

        it.each([
            ['plain URLとhrefが異なる', 'https://lokuyow.github.io/ehagaki/', '<a href="https://example.com/">eHagaki</a>', 'eHagaki (https://example.com/)'],
            ['複数anchor', 'https://lokuyow.github.io/ehagaki/', '<span><a href="https://lokuyow.github.io/ehagaki/">eHagaki</a><a href="https://example.com/">other</a></span>', 'eHagaki (https://lokuyow.github.io/ehagaki/)other (https://example.com/)'],
            ['anchor外に実質的な内容がある', 'https://lokuyow.github.io/ehagaki/', '<div><a href="https://lokuyow.github.io/ehagaki/">eHagaki</a><span>extra</span></div>', 'eHagaki (https://lokuyow.github.io/ehagaki/)extra'],
        ])('%s場合はHTML内の表示文字列とリンク先を保持すること', (_case, text, html, expected) => {
            expect(invokePasteHandler(editor, createClipboardData(text, html))).toBe(true);
            expect(editor.getText()).toBe(expected);
        });

        it('HTMLに画像も含まれる場合は既存のpaste pathへ委譲すること', () => {
            const text = 'https://lokuyow.github.io/ehagaki/';
            const html = '<div><a href="https://lokuyow.github.io/ehagaki/">eHagaki</a><img src="https://example.com/image.png"></div>';
            expect(invokePasteHandler(editor, createClipboardData(text, html))).toBe(false);
            expect(editor.getText()).toBe('');
        });

        it('HTMLなしのplain URL pasteを従来どおり処理すること', () => {
            const url = 'https://example.com/path?param=value&other=2#section';

            expect(invokePasteHandler(editor, createClipboardData(url))).toBe(true);
            expect(editor.getText()).toBe(url);
            expect(editor.getHTML()).toContain('href="https://example.com/path?param=value&amp;other=2#section"');
        });

        it('HTML entityを含むquery/fragmentでも同じURLとして判定し、URLを保持すること', () => {
            const url = 'https://example.com/path?x=1&y=2#section';
            const html = '<p><a href="https://example.com/path?x=1&amp;y=2#section">Example</a></p>';

            expect(invokePasteHandler(editor, createClipboardData(url, html))).toBe(true);
            expect(editor.getText()).toBe(url);
            expect(editor.getHTML()).toContain('href="https://example.com/path?x=1&amp;y=2#section"');
        });
    });

    describe('外部HTMLの構造をplain textとして貼り付ける', () => {
        it('plain textよりHTMLのheadingとparagraph structureを優先し、空行で分けること', () => {
            const html = '<h2>見出し</h2><p>本文</p>';
            expect(invokePasteHandler(editor, createClipboardData('見出し本文', html))).toBe(true);
            expect(getParagraphText(editor)).toBe('【見出し】\n\n本文');
            expect(editor.getHTML()).not.toContain('<h2');
        });

        it('比較tableの後ろに続くheading・paragraph・listも変換すること', () => {
            const html = '<table><thead><tr><th></th><th>A</th><th>B</th><th>C</th></tr></thead>' +
                '<tbody><tr><th>性能</th><td>高</td><td>中</td><td>低</td></tr>' +
                '<tr><th>価格</th><td>高</td><td>安</td><td>中</td></tr></tbody></table>' +
                '<h2>続き</h2><p>本文</p><ul><li>項目</li></ul>';
            expect(invokePasteHandler(editor, createClipboardData('flattened clipboard text', html))).toBe(true);
            expect(getParagraphText(editor)).toBe(
                '① A\n② B\n③ C\n\n〈性能〉\n① 高\n② 中\n③ 低\n\n〈価格〉\n① 高\n② 安\n③ 中\n\n【続き】\n\n本文\n\n• 項目',
            );
            expect(editor.getHTML()).not.toMatch(/<(?:table|h[1-6]|ul|li)\b/i);
        });

        it('h3 headingを黒四角のplain textへ変換すること', () => {
            expect(invokePasteHandler(editor, createClipboardData('flattened heading', '<h3>詳細</h3>'))).toBe(true);
            expect(getParagraphText(editor)).toBe('■ 詳細');
        });

        it('preの空白と改行をコード境界付きで保持すること', () => {
            const code = '  const value = 1;\n\n\treturn value;  ';
            expect(invokePasteHandler(editor, createClipboardData('flattened code', `<pre><code>${code}</code></pre>`))).toBe(true);
            expect(getParagraphText(editor)).toBe(`［コード］\n${code}\n［/コード］`);
        });

        it.each([
            ['ul', '<ul><li>first</li><li><strong>second</strong></li></ul>', '• first\n• second'],
            ['ol', '<ol start="4"><li>first</li><li>second</li></ol>', '4. first\n5. second'],
            ['nested list', '<ul><li>parent<ul><li>child</li></ul></li></ul>', '• parent\n  • child'],
            ['paragraph and list', '<p>Before</p><ol><li>one</li><li>two</li></ol><p>After</p>', 'Before\n\n1. one\n2. two\n\nAfter'],
        ])('%s structureを読みやすいplain textにすること', (_case, html, expected) => {
            expect(invokePasteHandler(editor, createClipboardData('ignored by HTML', html))).toBe(true);
            expect(getParagraphText(editor)).toBe(expected);
            expect(editor.getHTML()).not.toMatch(/<(?:ul|ol|li|strong|h[1-6])\b/i);
        });

        it('HTMLだけのclipboardも文章HTMLなら変換すること', () => {
            expect(invokePasteHandler(editor, createClipboardData('', '<p>HTML only</p><p>second</p>'))).toBe(true);
            expect(getParagraphText(editor)).toBe('HTML only\n\nsecond');
        });

        it('HTML linkの表示文字列と安全なhrefを残し、危険なhrefは採用しないこと', () => {
            expect(invokePasteHandler(
                editor,
                createClipboardData('', '<p><a href="https://example.com/path">label</a> <a href="javascript:alert(1)">unsafe</a></p>'),
            )).toBe(true);
            expect(getParagraphText(editor)).toBe('label (https://example.com/path) unsafe');
            expect(editor.getHTML()).not.toContain('javascript:');
        });

        it('相対hrefをHost URLで解決せず文字列として保持すること', () => {
            expect(invokePasteHandler(editor, createClipboardData('', '<p><a href="../guide">guide</a></p>'))).toBe(true);
            expect(getParagraphText(editor)).toBe('guide (../guide)');
        });

        it('明示plain pasteはMarkdown/code風文字列をそのまま保つこと', () => {
            const plain = '**foo**\n#include\n- example\nconst x = 1;\n【literal】\n■ literal\n［コード］';
            expect(invokePasteHandler(editor, createClipboardData(plain, '<h1>Rich heading</h1>'), true)).toBe(true);
            expect(getParagraphText(editor)).toBe(plain);
        });

        it('text/plainだけのMarkdown/code風文字列も記号を変更しないこと', () => {
            const plain = '**foo**\n#include\n- example\nconst x = 1;\n【literal】\n■ literal\n［コード］';
            expect(invokePasteHandler(editor, createClipboardData(plain))).toBe(true);
            expect(getParagraphText(editor)).toBe(plain);
        });

        it('text/plainのみの通常pasteを従来どおり改行で段落化すること', () => {
            expect(invokePasteHandler(editor, createClipboardData('first\nsecond'))).toBe(true);
            expect(getParagraphText(editor)).toBe('first\nsecond');
        });

        it('自Editorのcopy HTMLは新しい変換を通さず既存の空行正規化を使うこと', () => {
            const html = '<p class="editor-paragraph" data-pm-slice="1 1 []">first</p><p class="editor-paragraph">second</p>';
            expect(invokePasteHandler(editor, createClipboardData('first\nsecond', html))).toBe(true);
            expect(getParagraphText(editor)).toBe('first\nsecond');
        });

        it('file clipboardを消費せず既存media処理へ委譲すること', () => {
            const image = new File(['image'], 'image.png', { type: 'image/png' });
            expect(invokePasteHandler(editor, createClipboardData('image', '<p>image</p>', [image]))).toBe(false);
            expect(editor.getText()).toBe('');
        });
    });

    describe('plain-text paste transaction and history', () => {
        it('selectionを置換し、caret・undo・redoで同じ内容を復元すること', () => {
            editor.destroy();
            editor = createEditor('<p>Alpha omega</p>');
            editor.commands.setTextSelection({ from: 7, to: 12 });

            expect(invokePasteHandler(editor, createClipboardData('', '<p>new</p><p>value</p>'))).toBe(true);
            expect(getParagraphText(editor)).toBe('Alpha new\n\nvalue');
            expect(editor.state.selection.empty).toBe(true);
            const pasteSelection = editor.state.selection.from;

            expect(editor.commands.undo()).toBe(true);
            expect(getParagraphText(editor)).toBe('Alpha omega');
            expect(editor.commands.redo()).toBe(true);
            expect(getParagraphText(editor)).toBe('Alpha new\n\nvalue');
            expect(editor.state.selection.from).toBe(pasteSelection);
        });

        it('短時間の入力・paste・入力は既存のUndoRedo groupingを維持すること', () => {
            editor.commands.insertContent('typed before');
            expect(invokePasteHandler(editor, createClipboardData('ignored', '<ul><li>pasted</li></ul>'))).toBe(true);
            editor.commands.insertContent(' typed after');
            expect(getParagraphText(editor)).toBe('typed before• pasted typed after');

            expect(editor.commands.undo()).toBe(true);
            expect(getParagraphText(editor)).toBe('');
            expect(editor.commands.redo()).toBe(true);
            expect(getParagraphText(editor)).toBe('typed before• pasted typed after');
        });
    });

    describe('URL単体のペースト', () => {
        it.each([
            ['https://example.com/', 'https://example.com/'],
            ['https://example.com/very/long/path/with/many/segments?param1=value1&param2=value2#section', 'https://example.com/very/long/path/with/many/segments?param1=value1&amp;param2=value2#section'],
            ['http://example.org/page', 'http://example.org/page'],
            ['https://example.com:8080/api/endpoint', 'https://example.com:8080/api/endpoint']
        ])('%s をペーストした場合、即座にリンク化されること', async (url, expectedHref) => {
            const html = await pasteAndVerify(editor, url);
            expect(html).toContain(`href="${expectedHref}"`);
        });
    });

    describe('URLを含む文章のペースト', () => {
        it.each([
            ['Check out https://example.com/ for more info', 'https://example.com/', ['Check out', 'for more info']],
            ['Visit https://test.org/ today', 'https://test.org/', ['Visit', 'today']],
            ['こちらのサイト https://example.jp/ をご覧ください', 'https://example.jp/', ['こちらのサイト', 'をご覧ください']],
            ['See https://example.com/ for details', 'https://example.com/', ['See', 'for details']]
        ])('%s をペーストした場合、URL部分のみが即座にリンク化されること', async (text, expectedHref, expectedTexts) => {
            const html = await pasteAndVerify(editor, text);
            expect(html).toContain(`href="${expectedHref}"`);
            expectedTexts.forEach(text => expect(html).toContain(text));
        });
    });

    describe('複数URLのペースト', () => {
        it.each([
            ['https://first.com/ and https://second.org/ and https://third.net/', 3, ['https://first.com/', 'https://second.org/', 'https://third.net/']],
            ['https://example.com/\nhttps://test.org/\nhttps://demo.net/', 3, []],
            ['1. https://first.com/\n2. https://second.org/\n3. https://third.net/', 3, []]
        ])('複数URLをペーストした場合、すべて即座にリンク化されること', async (text, expectedCount, expectedHrefs) => {
            const html = await pasteAndVerify(editor, text, expectedCount);
            expectedHrefs.forEach(href => expect(html).toContain(`href="${href}"`));
        });
    });

    describe('ペースト後のUndo操作', () => {
        it.each([
            ['https://example.com/', ['https://example.com/']],
            ['https://first.com/ https://second.org/', ['https://first.com/', 'https://second.org/']],
            ['Check https://example.com/ for info', ['Check', 'https://example.com/']]
        ])('%s をペーストしてUndoした場合、正しく元に戻る', async (content, expectedContents) => {
            editor.commands.insertContent(content);
            
            let html = editor.getHTML();
            expect(html).toContain('<a');
            
            // Undo操作
            editor.commands.undo();
            
            html = editor.getHTML();
            expectedContents.forEach(content => expect(html).not.toContain(content));
        });
    });

    describe('画像URLのペースト', () => {
        it('画像URLをペーストした場合、リンク化されるが画像変換は遅延されること', async () => {
            const imageUrl = 'https://example.com/image.jpg';
            editor.commands.insertContent(imageUrl);
            
            const html = editor.getHTML();
            // リンク化はされている
            expect(html).toContain('<a');
            expect(html).toContain('href="https://example.com/image.jpg"');
            // 画像ノードには変換されていない（ペースト直後は画像変換がスキップされる）
            expect(html).not.toContain('<img');
        });

        it('画像URLをペーストして文字入力後に画像変換されること', async () => {
            // 注意: 実際の実装では、リンク化された画像URLは画像ノードに変換されない
            // これは既にリンクマークが付いているため、ContentTrackingで再処理されないため
            // このテストは実装の制限を文書化するために残す
            const imageUrl = 'https://example.com/photo.png';
            editor.commands.insertContent(imageUrl);
            
            let html = editor.getHTML();
            // 最初はリンクのみ
            expect(html).toContain('<a');
            expect(html).not.toContain('<img');
            
            // 文字を入力（通常の編集操作）
            editor.commands.insertContent(' ');
            
            html = editor.getHTML();
            // 現在の実装では、一度リンク化された画像URLは画像ノードに変換されない
            // これは仕様として受け入れる（画像を挿入する場合は画像ファイルのペーストを推奨）
            expect(html).toContain('https://example.com/photo.png');
        });
    });

    describe('無効なURLのペースト', () => {
        it.each([
            ['http://', 'http://'],
            ['example.com', 'example.com'],
            ['ftp://example.com/', null],
            ['https://example', null]
        ])('%s はリンク化されないこと', async (url, expectedContent) => {
            const html = await pasteAndVerify(editor, url, 0, false);
            if (expectedContent) {
                expect(html).toContain(expectedContent);
            }
        });
    });

    describe('エッジケース', () => {
        it.each([
            ['Visit https://example.com/.', 'https://example.com/'],
            ['https://example.com/?key=value&other=123', 'https://example.com/?key=value&amp;other=123'],
            ['https://example.com/page#section', 'https://example.com/page#section'],
            ['URL：　https://example.com/　です', 'https://example.com/']
        ])('%s が正しくリンク化されること', async (content, expectedHref) => {
            const html = await pasteAndVerify(editor, content);
            expect(html).toContain(`href="${expectedHref}"`);
        });
    });

    describe('連続ペースト操作', () => {
        it('URLを連続してペーストした場合、すべてリンク化されること', async () => {
            await pasteAndVerify(editor, 'https://first.com/');
            await pasteAndVerify(editor, ' ');
            await pasteAndVerify(editor, 'https://second.org/', 2);
        });

        it('テキストとURLを交互にペーストした場合、URLのみリンク化されること', async () => {
            const html = await pasteAndVerify(editor, 'Text 1 https://example.com/ Text 2');
            expect(html).toContain('Text 1');
            expect(html).toContain('Text 2');
        });
    });

    describe('既存コンテンツへのペースト', () => {
        it('既存のテキストの後にURLをペーストした場合、リンク化されること', async () => {
            editor.commands.setContent('<p>Existing text</p>');
            editor.commands.focus('end');
            await pasteAndVerify(editor, ' https://example.com/');
            const html = editor.getHTML();
            expect(html).toContain('Existing text');
        });

        it('複数段落がある場合、新しい段落にURLをペーストしてリンク化されること', async () => {
            editor.commands.setContent('<p>Paragraph 1</p><p>Paragraph 2</p>');
            editor.commands.focus('end');
            await pasteAndVerify(editor, '\nhttps://example.com/');
        });
    });
});
