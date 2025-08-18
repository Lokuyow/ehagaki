import { validateAndNormalizeImageUrl } from './utils';

// ドキュメントが空かどうか判定
export function isEditorDocEmpty(state: any): boolean {
    return state.doc.childCount === 1 && state.doc.firstChild?.type.name === 'paragraph' && state.doc.firstChild.content.size === 0;
}

/**
 * プレーンテキストをTiptap用のノード構造に変換
 */
export function textToTiptapNodes(text: string): any {
    const lines = text.split('\n');
    const content: any[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const normalizedUrl = validateAndNormalizeImageUrl(trimmed);

        if (normalizedUrl) {
            // 画像ノードを追加
            content.push({
                type: 'image',
                attrs: {
                    src: normalizedUrl,
                    alt: 'Image'
                }
            });
        } else {
            // パラグラフノードを追加（空行でも空のパラグラフとして追加）
            content.push({
                type: 'paragraph',
                content: line.trim() ? [
                    {
                        type: 'text',
                        text: line
                    }
                ] : []
            });
        }
    }

    return {
        type: 'doc',
        content: content.length > 0 ? content : [{ type: 'paragraph' }]
    };
}

/**
 * スキーマからノードデータを作成するヘルパー関数
 */
export function createNodeFromData(schema: any, nodeData: any): any {
    switch (nodeData.type) {
        case 'image':
            return schema.nodes.image.create(nodeData.attrs);
        case 'paragraph':
            if (nodeData.content && nodeData.content.length > 0) {
                const textNodes = nodeData.content.map((textData: any) =>
                    schema.text(textData.text)
                );
                return schema.nodes.paragraph.create({}, textNodes);
            } else {
                return schema.nodes.paragraph.create();
            }
        default:
            return null;
    }
}

/**
 * テキストをエディターに挿入（ノード構造を直接作成）
 */
export function insertTextAsNodes(editor: any, text: string) {
    if (!editor) return;

    const nodeStructure = textToTiptapNodes(text);
    const { state, dispatch } = editor.view;
    const { tr, schema } = state;

    let transaction = tr;
    const docIsEmpty = isEditorDocEmpty(state);

    if (docIsEmpty) {
        // 空のエディタの場合は全体を置き換え
        const nodes = nodeStructure.content.map((nodeData: any) =>
            createNodeFromData(schema, nodeData)
        );

        if (nodes.length > 0) {
            const fragment = schema.nodes.doc.createAndFill({}, nodes);
            if (fragment) {
                transaction = transaction.replaceWith(0, state.doc.content.size, fragment.content);
            }
        }
    } else {
        // 既存コンテンツがある場合は挿入位置に追加
        let insertPos = state.selection.from;

        nodeStructure.content.forEach((nodeData: any) => {
            const node = createNodeFromData(schema, nodeData);
            if (node) {
                transaction = transaction.insert(insertPos, node);
                insertPos += node.nodeSize;
            }
        });
    }

    dispatch(transaction);
}

/**
 * 画像URLリストをエディターに挿入するヘルパー関数
 */
export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);

    if (urlList.length === 0) return;

    editor.chain().focus().run();

    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;

    let insertPos = state.selection.from;

    // 共通化した空判定関数を利用
    const docIsEmpty = isEditorDocEmpty(state);

    urlList.forEach((url, index) => {
        const trimmedUrl = (typeof url === 'string') ? url.trim() : '';
        const normalizedUrl = validateAndNormalizeImageUrl(trimmedUrl);
        if (normalizedUrl) {
            const imageNode = schema.nodes.image.create({
                src: normalizedUrl,
                alt: 'Uploaded image'
            });

            if (index === 0 && docIsEmpty) {
                transaction = transaction.replaceWith(0, state.doc.content.size, imageNode);
                insertPos = imageNode.nodeSize;
            } else {
                transaction = transaction.insert(insertPos, imageNode);
                insertPos += imageNode.nodeSize;
            }
        }
    });

    dispatch(transaction);
}

/**
 * エディターからプレーンテキストと画像URLを抽出して結合
 */
export function extractContentWithImages(editor: any): string {
    if (!editor) return '';

    const doc = editor.state.doc;
    const fragments: string[] = [];

    doc.descendants((node: any) => {
        if (node.type.name === 'paragraph') {
            // パラグラフ内のテキストを取得
            const textContent = node.textContent;
            if (textContent.trim()) {
                fragments.push(textContent);
            }
        } else if (node.type.name === 'image') {
            // 画像ノードからURLを抽出
            const src = node.attrs.src;
            if (src) {
                fragments.push(src);
            }
        }
    });

    return fragments.join('\n');
}
