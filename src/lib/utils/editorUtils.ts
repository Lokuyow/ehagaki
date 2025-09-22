import { ALLOWED_PROTOCOLS, ALLOWED_IMAGE_EXTENSIONS } from "../constants";
import type { NodeData, DragEvent, CleanUrlResult } from "../types";
import {
    blurEditorAndBody
} from "./appDomUtils";
import { domUtils } from "./appDomUtils";

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
            if (textContent.trim()) {
                fragments.push(textContent);
            }
        } else if (node.type.name === 'image') {
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

// === イベント作成 ===
export function createDragEventDetail(
    type: DragEvent['type'],
    details?: any,
    getPos?: () => number
): any {
    const eventDetails = {
        start: { nodePos: getPos?.() },
        move: details,
        end: {
            nodeData: details?.nodeData || { pos: getPos?.() },
            dropX: 0,
            dropY: 0,
            target: null,
            dropPosition: null,
            ...details,
        },
    };

    return eventDetails[type];
}

export function getEventName(type: DragEvent['type']): string {
    const eventMap = {
        start: "touch-image-drag-start",
        move: "touch-image-drag-move",
        end: "touch-image-drop",
    };
    return eventMap[type];
}

export function dispatchDragEvent(type: DragEvent['type'], details?: any, getPos?: () => number) {
    const eventName = getEventName(type);
    const eventDetail = createDragEventDetail(type, details, getPos);

    const customEvent = new CustomEvent(eventName, {
        detail: eventDetail,
        bubbles: true,
        cancelable: true,
    });

    window.dispatchEvent(customEvent);
    document.dispatchEvent(new CustomEvent(eventName, { detail: customEvent.detail }));
}

// === ドラッグプレビュー計算 ===
export function calculatePreviewDimensions(
    rect: DOMRect,
    maxSize: number = 140
): { width: number; height: number } {
    const previewWidth = Math.min(maxSize, rect.width || maxSize);
    const previewHeight = rect.width > 0
        ? Math.round((rect.height / rect.width) * previewWidth)
        : previewWidth;

    return { width: previewWidth, height: previewHeight };
}

export function createCanvasPreview(originalCanvas: HTMLCanvasElement): HTMLCanvasElement | null {
    if (!originalCanvas) return null;

    const newCanvas = document.createElement("canvas");
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height;

    const ctx = newCanvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(originalCanvas, 0, 0);
    }

    return newCanvas;
}

export function createImagePreview(originalImg: HTMLImageElement): HTMLImageElement | null {
    if (!originalImg) return null;

    const newImg = document.createElement("img");
    newImg.src = originalImg.src;
    newImg.alt = originalImg.alt || "";

    return newImg;
}

export function applyPreviewStyles(
    element: HTMLElement,
    dimensions: { width: number; height: number },
    position: { x: number; y: number }
): void {
    Object.assign(element.style, {
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        left: `${position.x - dimensions.width / 2}px`,
        top: `${position.y - dimensions.height / 2}px`,
        transformOrigin: "center center",
        transition: "transform 120ms ease, opacity 120ms ease"
    });
}

export function createDragPreview(
    element: HTMLElement,
    x: number,
    y: number,
    isPlaceholder: boolean = false
): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    const dimensions = calculatePreviewDimensions(rect);

    let previewEl: HTMLElement | null = null;

    if (isPlaceholder) {
        const origCanvas = element.querySelector("canvas") as HTMLCanvasElement | null;
        if (origCanvas) {
            previewEl = createCanvasPreview(origCanvas);
        }
    } else {
        const origImg = element.querySelector("img") as HTMLImageElement | null;
        if (origImg) {
            previewEl = createImagePreview(origImg);
        }
    }

    if (!previewEl) return null;

    applyPreviewStyles(previewEl, dimensions, { x, y });
    previewEl.classList.add("drag-preview");
    document.body.appendChild(previewEl);

    requestAnimationFrame(() => {
        previewEl!.style.transform = "scale(0.8) rotate(0deg)";
        previewEl!.style.opacity = "0.95";
    });

    return previewEl;
}

export function updateDragPreview(previewElement: HTMLElement | null, x: number, y: number) {
    if (!previewElement) return;

    const rect = previewElement.getBoundingClientRect();
    const w = rect.width || 100;
    const h = rect.height || 100;

    previewElement.style.left = `${x - w / 2}px`;
    previewElement.style.top = `${y - h / 2}px`;
}

export function removeDragPreview(previewElement: HTMLElement | null): void {
    previewElement?.parentNode?.removeChild(previewElement);
}

// === ドロップゾーン処理 ===
export function findDropZoneAtPosition(x: number, y: number): Element | null {
    const elementBelow = document.elementFromPoint(x, y);
    return elementBelow?.closest(".drop-zone-indicator") || null;
}

export function clearAllDropZoneHighlights(): void {
    domUtils.querySelectorAll(".drop-zone-indicator").forEach(zone => {
        zone.classList.remove("drop-zone-hover");
    });
}

export function highlightDropZone(dropZone: Element | null): void {
    dropZone?.classList.add("drop-zone-hover");
}

export function highlightDropZoneAtPosition(x: number, y: number) {
    clearAllDropZoneHighlights();
    const dropZone = findDropZoneAtPosition(x, y);
    highlightDropZone(dropZone);
}

export function checkMoveThreshold(
    currentX: number,
    currentY: number,
    startX: number,
    startY: number,
    threshold: number
): boolean {
    const dx = currentX - startX;
    const dy = currentY - startY;
    return dx * dx + dy * dy > threshold * threshold;
}

// === 画像インタラクション ===
export function shouldPreventInteraction(
    isDragging: boolean,
    isPlaceholder: boolean,
    justSelected: boolean,
    isTouch: boolean
): boolean {
    if (isDragging || isPlaceholder) return true;
    if (justSelected && !isTouch) return true;
    return false;
}

export function handleImageInteraction(
    event: MouseEvent | TouchEvent,
    isTouch: boolean,
    isDragging: boolean,
    isPlaceholder: boolean,
    selected: boolean,
    justSelected: boolean,
    imageSrc: string,
    imageAlt: string,
    getPos: () => number
): boolean {
    if (shouldPreventInteraction(isDragging, isPlaceholder, justSelected, isTouch)) {
        event.preventDefault();
        return false;
    }

    if (selected) {
        requestFullscreenImage(imageSrc, imageAlt);
    } else {
        requestNodeSelection(getPos);
    }

    event.preventDefault();
    if (!isTouch) {
        event.stopPropagation();
    }

    return true;
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

export function requestNodeSelection(getPos: () => number) {
    const pos = getPos();
    window.dispatchEvent(
        new CustomEvent("select-image-node", { detail: { pos } }),
    );
}

// === エディター状態管理 ===
export function setDraggingFalse(viewOrEditorView: any) {
    viewOrEditorView.dispatch(
        viewOrEditorView.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null })
    );
}

// === Blurhash描画 ===
export interface BlurhashRenderer {
    renderBlurhashToCanvas(blurhash: string, canvas: HTMLCanvasElement, width: number, height: number): void;
}

export function validateBlurhashParams(
    blurhash: string,
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number }
): boolean {
    return !!(blurhash && canvasRef && dimensions.displayWidth > 0 && dimensions.displayHeight > 0);
}

export function setupCanvas(
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number }
): void {
    canvasRef.width = dimensions.displayWidth;
    canvasRef.height = dimensions.displayHeight;
}

export function renderBlurhash(
    blurhash: string,
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number },
    isPlaceholder: boolean,
    devMode: boolean = false
) {
    if (!validateBlurhashParams(blurhash, canvasRef, dimensions)) {
        if (devMode) {
            console.log("[blurhash] renderBlurhash: invalid parameters", {
                blurhash: !!blurhash,
                canvasRef: !!canvasRef,
                dimensions,
                isPlaceholder
            });
        }
        return;
    }

    setupCanvas(canvasRef, dimensions);

    if (devMode) {
        console.log("[blurhash] renderBlurhash: rendering", {
            blurhash,
            width: dimensions.displayWidth,
            height: dimensions.displayHeight,
            isPlaceholder
        });
    }

    // @ts-ignore
    import("../tags/imetaTag").then(({ renderBlurhashToCanvas }) => {
        renderBlurhashToCanvas(blurhash, canvasRef, dimensions.displayWidth, dimensions.displayHeight);
    });
}
