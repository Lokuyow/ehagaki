import type { NodeData, CleanUrlResult } from "../types";
import { blurEditorAndBody } from "./appDomUtils";
import { ALLOWED_PROTOCOLS, ALLOWED_IMAGE_EXTENSIONS } from "../constants";
import type { Editor as TipTapEditor } from "@tiptap/core";

// === URL検証・正規関数） ===
export function normalizeUrl(url: string): string {
    return encodeURI(url.trim());
}

export function isValidProtocol(protocol: string): boolean {
    return ALLOWED_PROTOCOLS.includes(protocol);
}

export function isValidImageExtension(pathname: string): boolean {
    const lower = pathname.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

export function validateAndNormalizeUrl(url: string): string | null {
    try {
        const normalized = normalizeUrl(url);
        const u = new URL(normalized);
        if (!isValidProtocol(u.protocol)) return null;
        return u.href;
    } catch {
        return null;
    }
}

export function validateAndNormalizeImageUrl(url: string): string | null {
    const baseUrl = validateAndNormalizeUrl(url);
    if (!baseUrl) return null;

    try {
        const u = new URL(baseUrl);
        if (!isValidImageExtension(u.pathname)) return null;
        return baseUrl;
    } catch {
        return null;
    }
}

// === 文字列処理（純粋関数） ===
export function isWordBoundary(char: string | undefined): boolean {
    return !char || /[\s\n\u3000]/.test(char);
}

export function extractTrailingPunctuation(url: string): { cleanUrl: string; trailingChars: string } {
    const trailingPattern = /([.,;:!?）】」』〉》】\]}>）]){2,}$/;
    const trailingMatch = url.match(trailingPattern);

    if (trailingMatch) {
        const trailingChars = trailingMatch[0];
        const cleanUrl = url.slice(0, -trailingChars.length);
        return { cleanUrl, trailingChars };
    }

    return { cleanUrl: url, trailingChars: '' };
}

export function cleanUrlEnd(url: string): CleanUrlResult {
    const { cleanUrl } = extractTrailingPunctuation(url);
    return { cleanUrl, actualLength: cleanUrl.length };
}

// === ドキュメント状態判定（純粋関数） ===
export function isDocumentEmpty(doc: any): boolean {
    if (doc.childCount === 1) {
        const firstChild = doc.firstChild;
        return firstChild?.type.name === 'paragraph' && firstChild.content.size === 0;
    }
    return doc.childCount === 0;
}

export function isEditorDocEmpty(state: any): boolean {
    return isDocumentEmpty(state.doc);
}

export function isParagraphWithOnlyImageUrl(node: any, urlLength: number): boolean {
    return node.type.name === 'paragraph' &&
        node.content.size === urlLength &&
        node.textContent.trim().length === urlLength;
}

// === ノード作成（純粋関数） ===
export function createImageNodeData(url: string, alt: string = 'Image'): NodeData | null {
    const normalizedUrl = validateAndNormalizeImageUrl(url);
    if (!normalizedUrl) return null;

    return {
        type: 'image',
        attrs: { src: normalizedUrl, alt }
    };
}

export function createParagraphNodeData(text: string): NodeData {
    return {
        type: 'paragraph',
        content: text.trim() ? [{ type: 'text', text }] : []
    };
}

export function parseTextToNodes(text: string): NodeData[] {
    const lines = text.split('\n');
    const nodes: NodeData[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const imageNode = createImageNodeData(trimmed);

        if (imageNode) {
            nodes.push(imageNode);
        } else {
            nodes.push(createParagraphNodeData(line));
        }
    }

    return nodes;
}

export function textToTiptapNodes(text: string): any {
    const nodes = parseTextToNodes(text);
    return {
        type: 'doc',
        content: nodes.length > 0 ? nodes : [{ type: 'paragraph' }]
    };
}

export function createNodeFromData(schema: any, nodeData: NodeData): any {
    switch (nodeData.type) {
        case 'image':
            return schema.nodes.image.create(nodeData.attrs);
        case 'paragraph':
            if (nodeData.content?.length) {
                const textNodes = nodeData.content.map((textData: any) =>
                    schema.text(textData.text)
                );
                return schema.nodes.paragraph.create({}, textNodes);
            }
            return schema.nodes.paragraph.create();
        default:
            return null;
    }
}

// === エディター操作の抽象化 ===
export interface EditorAdapter {
    getState(): any;
    dispatch(transaction: any): void;
    chain(): any;
    focus(): any;
}

export function createEditorAdapter(editor: any): EditorAdapter {
    return {
        getState: () => editor.view.state,
        dispatch: (transaction: any) => editor.view.dispatch(transaction),
        chain: () => editor.chain(),
        focus: () => editor.chain().focus()
    };
}

export function calculateInsertPositions(
    nodes: any[],
    startPos: number
): { node: any; position: number }[] {
    let currentPos = startPos;
    return nodes.map(node => {
        const result = { node, position: currentPos };
        currentPos += node.nodeSize;
        return result;
    });
}

function insertNodesToEditor(editor: any, nodeDataList: NodeData[]) {
    if (!editor) return;

    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;
    let insertPos = state.selection.from;
    const docIsEmpty = isEditorDocEmpty(state);

    if (docIsEmpty) {
        const nodes = nodeDataList.map(nodeData => createNodeFromData(schema, nodeData));
        if (nodes.length > 0) {
            const fragment = schema.nodes.doc.createAndFill({}, nodes);
            if (fragment) {
                transaction = transaction.replaceWith(0, state.doc.content.size, fragment.content);
            }
        }
    } else {
        nodeDataList.forEach(nodeData => {
            const node = createNodeFromData(schema, nodeData);
            if (node) {
                transaction = transaction.insert(insertPos, node);
                insertPos += node.nodeSize;
            }
        });
    }
    dispatch(transaction);
}

export function insertTextAsNodes(editor: any, text: string) {
    if (!editor) return;
    const nodeStructure = textToTiptapNodes(text);
    insertNodesToEditor(editor, nodeStructure.content);
}

export function prepareImageNodes(urls: string | string[]): NodeData[] {
    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);

    return urlList
        .map(url => createImageNodeData(url.trim(), 'Uploaded image'))
        .filter((node): node is NodeData => node !== null);
}

export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    editor.chain().focus().run();
    const imageNodes = prepareImageNodes(urlList);
    insertNodesToEditor(editor, imageNodes);
}

// === コンテンツ抽出 ===
export function extractFragmentsFromDoc(doc: any): string[] {
    const fragments: string[] = [];
    doc.descendants((node: any) => {
        if (node.type.name === 'paragraph') {
            const textContent = node.textContent;
            // 空の段落も含めて抽出（改行のみの行を維持）
            fragments.push(textContent);
        } else if (node.type.name === 'image') {
            const src = node.attrs?.src;
            if (src) {
                fragments.push(src);
            }
        } else if (node.type.name === 'video') {
            const src = node.attrs?.src;
            if (src) {
                fragments.push(src);
            }
        }
    });
    return fragments;
}

export function getDocumentFromEditor(editor: any): any | null {
    if (!editor) return null;

    try {
        const resolved = typeof editor === 'function' ? editor() : editor;
        return resolved?.state?.doc ?? resolved?.view?.state?.doc ?? null;
    } catch {
        return null;
    }
}

export function extractContentWithImages(editor: any): string {
    const doc = getDocumentFromEditor(editor);
    if (!doc) return '';

    const fragments = extractFragmentsFromDoc(doc);
    return fragments.join('\n');
}

// === ドラッグ＆ドロップ計算 ===
export function calculateDragPositions(
    dropPos: number,
    originalPos: number
): { insertPos: number; deleteStart: number; deleteEnd: number } | null {
    if (dropPos === originalPos) return null;

    if (dropPos < originalPos) {
        return {
            insertPos: dropPos,
            deleteStart: originalPos + 1,
            deleteEnd: originalPos + 2
        };
    } else if (dropPos > originalPos + 1) {
        return {
            insertPos: dropPos - 1,
            deleteStart: originalPos,
            deleteEnd: originalPos + 1
        };
    }

    return null; // 隣接位置への移動は無効
}

export function createMoveTransaction(
    transaction: any,
    imageNode: any,
    positions: { insertPos: number; deleteStart: number; deleteEnd: number }
): any {
    if (positions.insertPos < positions.deleteStart) {
        return transaction
            .insert(positions.insertPos, imageNode)
            .delete(positions.deleteStart, positions.deleteEnd);
    } else {
        return transaction
            .delete(positions.deleteStart, positions.deleteEnd)
            .insert(positions.insertPos, imageNode);
    }
}

export function moveImageNode(view: any, nodeData: any, dropPos: number): boolean {
    const { tr, schema } = view.state;
    const originalPos = nodeData.pos;

    const positions = calculateDragPositions(dropPos, originalPos);
    if (!positions) return true;

    const imageNode = schema.nodes.image.create(nodeData.attrs);

    try {
        const transaction = createMoveTransaction(tr, imageNode, positions);
        view.dispatch(transaction);
        return true;
    } catch (error) {
        console.error('Error moving image:', error);
        return false;
    }
}

// === カスタムイベント発火 ===
export function requestFullscreenImage(src: string, alt: string = "Image") {
    blurEditorAndBody();
    const fullscreenEvent = new CustomEvent("image-fullscreen-request", {
        detail: { src, alt },
        bubbles: true,
        cancelable: true,
    });
    window.dispatchEvent(fullscreenEvent);
}

// === エディター状態管理 ===
export function setDraggingFalse(viewOrEditorView: any) {
    viewOrEditorView.dispatch(
        viewOrEditorView.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null })
    );
}

// === エディターノードの検索と実行 ===
export function findAndExecuteOnNode(
    editor: TipTapEditor | null,
    predicate: (node: any, pos: number) => boolean,
    action: (node: any, pos: number) => void
): void {
    if (!editor) return;

    const doc = editor.state.doc;
    doc.descendants((node: any, pos: number) => {
        if (predicate(node, pos)) {
            action(node, pos);
            return false; // 最初のマッチで停止
        }
    });
}

// === 画像サイズマップの更新 ===
export function updateImageSizeMap(
    store: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    deleteKey?: string,
    addKey?: string,
    addValue?: any
): void {
    store.update(map => {
        const newMap = { ...map };
        if (deleteKey) delete newMap[deleteKey];
        if (addKey && addValue) newMap[addKey] = addValue;
        return newMap;
    });
}

// === プレースホルダーノードの削除 ===
export function removePlaceholderNode(
    placeholderId: string,
    isVideo: boolean,
    currentEditor: TipTapEditor | null,
    imageSizeMapStore: { update: (fn: (map: Record<string, any>) => Record<string, any>) => void },
    devMode: boolean = false
): void {
    if (!currentEditor) return;

    updateImageSizeMap(imageSizeMapStore, placeholderId);

    findAndExecuteOnNode(
        currentEditor,
        (node: any, pos: number) => {
            const nodeType = node.type?.name;
            const isSameNode = (isVideo && nodeType === "video") || (!isVideo && nodeType === "image");
            return isSameNode && (node.attrs?.src === placeholderId || node.attrs?.id === placeholderId);
        },
        (node: any, pos: number) => {
            const tr = currentEditor!.state.tr.delete(pos, pos + node.nodeSize);
            currentEditor!.view.dispatch(tr);

            if (devMode) {
                console.log(`[uploadHelper] Deleted placeholder:`, placeholderId);
            }
        }
    );
}
