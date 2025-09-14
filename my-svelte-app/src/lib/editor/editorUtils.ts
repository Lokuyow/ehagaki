import { ALLOWED_PROTOCOLS, ALLOWED_IMAGE_EXTENSIONS } from "../constants";

// 型定義
interface NodeData {
    type: string;
    attrs?: any;
    content?: any[];
}

interface DragEvent {
    type: "start" | "move" | "end";
    details?: any;
    getPos?: () => number;
}

interface CleanUrlResult {
    cleanUrl: string;
    actualLength: number;
}

// URL検証/正規化関数（統合版）
export function validateAndNormalizeUrl(url: string): string | null {
    try {
        const normalized = encodeURI(url.trim());
        const u = new URL(normalized);
        if (!ALLOWED_PROTOCOLS.includes(u.protocol)) return null;
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
        const lower = u.pathname.toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext))) return null;
        return baseUrl;
    } catch {
        return null;
    }
}

// 文字/URL処理ユーティリティ
export function isWordBoundary(char: string | undefined): boolean {
    return !char || /[\s\n\u3000]/.test(char);
}

export function cleanUrlEnd(url: string): CleanUrlResult {
    let cleanUrl = url;
    const trailingPattern = /([.,;:!?）】」』〉》】\]}>）]){2,}$/;
    const trailingMatch = cleanUrl.match(trailingPattern);

    if (trailingMatch) {
        cleanUrl = cleanUrl.slice(0, -trailingMatch[0].length);
    }

    return { cleanUrl, actualLength: cleanUrl.length };
}

// ドキュメント状態判定
export function isEditorDocEmpty(state: any): boolean {
    if (state.doc.childCount === 1) {
        const firstChild = state.doc.firstChild;
        return firstChild?.type.name === 'paragraph' && firstChild.content.size === 0;
    }
    return state.doc.childCount === 0;
}

export function isParagraphWithOnlyImageUrl(node: any, urlLength: number): boolean {
    return node.type.name === 'paragraph' &&
        node.content.size === urlLength &&
        node.textContent.trim().length === urlLength;
}

// ノード作成・変換ユーティリティ
export function textToTiptapNodes(text: string): any {
    const lines = text.split('\n');
    const content: any[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const normalizedUrl = validateAndNormalizeImageUrl(trimmed);

        if (normalizedUrl) {
            content.push({
                type: 'image',
                attrs: { src: normalizedUrl, alt: 'Image' }
            });
        } else {
            content.push({
                type: 'paragraph',
                content: line.trim() ? [{ type: 'text', text: line }] : []
            });
        }
    }

    return {
        type: 'doc',
        content: content.length > 0 ? content : [{ type: 'paragraph' }]
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

// エディター操作ユーティリティ
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

export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    editor.chain().focus().run();

    const imageNodes = urlList
        .map(url => {
            const normalizedUrl = validateAndNormalizeImageUrl(url.trim());
            return normalizedUrl ? { type: 'image', attrs: { src: normalizedUrl, alt: 'Uploaded image' } } : null;
        })
        .filter((node): node is { type: string; attrs: { src: string; alt: string; } } => node !== null);

    insertNodesToEditor(editor, imageNodes);
}

export function extractContentWithImages(editor: any): string {
    if (!editor) return '';

    let doc: any | undefined;
    try {
        const resolved = typeof editor === 'function' ? editor() : editor;
        doc = resolved?.state?.doc ?? resolved?.view?.state?.doc;
    } catch {
        doc = undefined;
    }

    if (!doc) return '';

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

    return fragments.join('\n');
}

// ドラッグ＆ドロップ関連ユーティリティ（統合版）
export function moveImageNode(view: any, nodeData: any, dropPos: number): boolean {
    const { tr, schema } = view.state;
    const originalPos = nodeData.pos;

    if (dropPos === originalPos) return true;

    const imageNode = schema.nodes.image.create(nodeData.attrs);
    let transaction = tr;

    try {
        if (dropPos < originalPos) {
            transaction = transaction.insert(dropPos, imageNode);
            transaction = transaction.delete(originalPos + 1, originalPos + 2);
        } else if (dropPos > originalPos + 1) {
            transaction = transaction.delete(originalPos, originalPos + 1);
            transaction = transaction.insert(dropPos - 1, imageNode);
        } else {
            return true; // 隣接位置への移動は無視
        }

        view.dispatch(transaction);
        return true;
    } catch (error) {
        console.error('Error moving image:', error);
        return false;
    }
}

export function dispatchDragEvent(type: DragEvent['type'], details?: any, getPos?: () => number) {
    const eventMap = {
        start: "touch-image-drag-start",
        move: "touch-image-drag-move",
        end: "touch-image-drop",
    };

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

    const customEvent = new CustomEvent(eventMap[type], {
        detail: eventDetails[type],
        bubbles: true,
        cancelable: true,
    });

    window.dispatchEvent(customEvent);
    document.dispatchEvent(new CustomEvent(eventMap[type], { detail: customEvent.detail }));
}


// ドラッグプレビュー関連（統合版）
export function createDragPreview(
    element: HTMLElement,
    x: number,
    y: number,
    isPlaceholder: boolean = false
): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    const MAX_PREVIEW = 140;
    const previewWidth = Math.min(MAX_PREVIEW, rect.width || MAX_PREVIEW);
    const previewHeight = rect.width > 0
        ? Math.round((rect.height / rect.width) * previewWidth)
        : previewWidth;

    let previewEl: HTMLElement | null = null;

    if (isPlaceholder) {
        const origCanvas = element.querySelector("canvas") as HTMLCanvasElement | null;
        if (!origCanvas) return null;

        const newCanvas = document.createElement("canvas");
        newCanvas.width = origCanvas.width;
        newCanvas.height = origCanvas.height;
        const ctx = newCanvas.getContext("2d");
        if (ctx) ctx.drawImage(origCanvas, 0, 0);
        previewEl = newCanvas;
    } else {
        const origImg = element.querySelector("img") as HTMLImageElement | null;
        if (!origImg) return null;

        const newImg = document.createElement("img");
        newImg.src = origImg.src;
        newImg.alt = origImg.alt || "";
        previewEl = newImg;
    }

    // 共通スタイル設定
    Object.assign(previewEl.style, {
        width: `${previewWidth}px`,
        height: `${previewHeight}px`,
        left: `${x - previewWidth / 2}px`,
        top: `${y - previewHeight / 2}px`,
        transformOrigin: "center center",
        transition: "transform 120ms ease, opacity 120ms ease"
    });

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

export function highlightDropZoneAtPosition(x: number, y: number) {
    document.querySelectorAll(".drop-zone-indicator").forEach(zone => {
        zone.classList.remove("drop-zone-hover");
    });

    const elementBelow = document.elementFromPoint(x, y);
    const dropZone = elementBelow?.closest(".drop-zone-indicator");
    dropZone?.classList.add("drop-zone-hover");
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

// フォーカス・イベント処理ユーティリティ
export function blurEditorAndBody() {
    try {
        const active = document.activeElement as HTMLElement | null;
        if (active) {
            const isEditor = active.classList?.contains?.("tiptap-editor") || active.closest?.(".tiptap-editor");
            const isFormControl = ["INPUT", "TEXTAREA"].includes(active.tagName) || active.isContentEditable;

            if (isEditor || isFormControl) {
                active.blur?.();
                (document.body as HTMLElement)?.focus?.();
            }
        }
    } catch (e) {
        /* noop */
    }
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
    if (isDragging || isPlaceholder) {
        event.preventDefault();
        return false;
    }

    if (justSelected && !isTouch) {
        event.preventDefault();
        event.stopPropagation();
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

// blurhash描画ユーティリティ
try {
    const active = document.activeElement as HTMLElement | null;
    if (active) {
        const isEditor =
            active.classList?.contains?.("tiptap-editor") ||
            active.closest?.(".tiptap-editor");
        const isFormControl =
            ["INPUT", "TEXTAREA"].includes(active.tagName) ||
            active.isContentEditable;
        if (isEditor || isFormControl) {
            active.blur?.();
            (document.body as HTMLElement)?.focus?.();
        }
    }
} catch (e) {
    /* noop */
}

/**
 * 画像の全画面表示リクエストを発火
 */
export function requestFullscreenImage(src: string, alt: string = "Image") {
    blurEditorAndBody();
    const fullscreenEvent = new CustomEvent("image-fullscreen-request", {
        detail: { src, alt },
        bubbles: true,
        cancelable: true,
    });
    window.dispatchEvent(fullscreenEvent);
}

/**
 * 画像ノードの選択リクエストを発火
 */
export function requestNodeSelection(getPos: () => number) {
    const pos = getPos();
    window.dispatchEvent(
        new CustomEvent("select-image-node", { detail: { pos } }),
    );
}

/**
 * ドラッグ状態を解除する共通関数
 */
export function setDraggingFalse(viewOrEditorView: any) {
    viewOrEditorView.dispatch(
        viewOrEditorView.state.tr.setMeta('imageDrag', { isDragging: false, draggedNodePos: null })
    );
}

/**
 * blurhashをcanvasに描画する共通関数
 */
export function renderBlurhash(
    blurhash: string,
    canvasRef: HTMLCanvasElement,
    dimensions: { displayWidth: number; displayHeight: number },
    isPlaceholder: boolean,
    devMode: boolean = false
) {
    if (!blurhash || !canvasRef) {
        if (devMode) {
            console.log(
                "[blurhash] renderBlurhash: blurhash or canvasRef missing",
                { blurhash, canvasRef: !!canvasRef, isPlaceholder }
            );
        }
        return;
    }
    const width = dimensions.displayWidth;
    const height = dimensions.displayHeight;
    canvasRef.width = width;
    canvasRef.height = height;
    if (devMode) {
        console.log("[blurhash] renderBlurhash: rendering", {
            blurhash, width, height, isPlaceholder
        });
    }
    // 必要に応じて import { renderBlurhashToCanvas } from "../tags/imetaTag";
    // ここで呼び出し
    // @ts-ignore
    import("../tags/imetaTag").then(({ renderBlurhashToCanvas }) => {
        renderBlurhashToCanvas(blurhash, canvasRef, width, height);
    });
}
