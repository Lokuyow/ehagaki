// ドキュメントが空かどうか判定（修正版）
export function isEditorDocEmpty(state: any): boolean {
    // 子ノードが1つで、それが空のパラグラフの場合
    if (state.doc.childCount === 1) {
        const firstChild = state.doc.firstChild;
        return firstChild?.type.name === 'paragraph' && firstChild.content.size === 0;
    }

    // 子ノードが0の場合も空と見なす
    if (state.doc.childCount === 0) {
        return true;
    }

    return false;
}

// パラグラフが実質的に画像URLのみを含んでいるか判定する新しい関数
export function isParagraphWithOnlyImageUrl(node: any, urlLength: number): boolean {
    return node.type.name === 'paragraph' &&
        node.content.size === urlLength &&
        node.textContent.trim().length === urlLength;
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
 * ノードデータ配列をエディタに挿入する共通関数
 */
function insertNodesToEditor(editor: any, nodeDataList: any[]) {
    if (!editor) return;

    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;
    let insertPos = state.selection.from;
    const docIsEmpty = isEditorDocEmpty(state);

    if (docIsEmpty) {
        const nodes = nodeDataList.map((nodeData: any) =>
            createNodeFromData(schema, nodeData)
        );
        if (nodes.length > 0) {
            const fragment = schema.nodes.doc.createAndFill({}, nodes);
            if (fragment) {
                transaction = transaction.replaceWith(0, state.doc.content.size, fragment.content);
            }
        }
    } else {
        nodeDataList.forEach((nodeData: any) => {
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
 * テキストをエディターに挿入（ノード構造を直接作成）
 */
export function insertTextAsNodes(editor: any, text: string) {
    if (!editor) return;
    const nodeStructure = textToTiptapNodes(text);
    insertNodesToEditor(editor, nodeStructure.content);
}

/**
 * 画像URLリストをエディターに挿入するヘルパー関数
 */
export function insertImagesToEditor(editor: any, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls) ? urls : urls.split('\n').map(s => s.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    editor.chain().focus().run();

    // 画像ノードデータを生成
    const imageNodes = urlList
        .map((url: string) => {
            const normalizedUrl = validateAndNormalizeImageUrl(url.trim());
            return normalizedUrl
                ? { type: 'image', attrs: { src: normalizedUrl, alt: 'Uploaded image' } }
                : null;
        })
        .filter(Boolean);

    insertNodesToEditor(editor, imageNodes);
}

/**
 * エディターからプレーンテキストと画像URLを抽出して結合
 */
export function extractContentWithImages(editor: any): string {
    if (!editor) return '';

    // editor が関数でラップされている場合に対応し、
    // editor.state または editor.view.state いずれからでも doc を取得するようにする
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

/**
 * 画像ノードの移動処理（ドラッグ＆ドロップ用）
 */
export function moveImageNode(view: any, nodeData: any, dropPos: number) {
    const { tr, schema } = view.state;
    let transaction = tr;
    const originalPos = nodeData.pos;

    // 同じ位置にドロップした場合は何もしない
    if (dropPos === originalPos) {
        return true;
    }

    const imageNode = schema.nodes.image.create(nodeData.attrs);

    try {
        if (dropPos < originalPos) {
            transaction = transaction.insert(dropPos, imageNode);
            transaction = transaction.delete(originalPos + 1, originalPos + 2);
        } else if (dropPos > originalPos + 1) {
            transaction = transaction.delete(originalPos, originalPos + 1);
            transaction = transaction.insert(dropPos - 1, imageNode);
        } else {
            // 隣接位置への移動は無視
            return true;
        }
        view.dispatch(transaction);
        return true;
    } catch (error) {
        console.error('Error moving image:', error);
        return false;
    }
}

/**
 * ドラッグイベントを発火する共通関数
 */
export function dispatchDragEvent(type: "start" | "move" | "end", details?: any, getPos?: () => number) {
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
    document.dispatchEvent(
        new CustomEvent(eventMap[type], { detail: customEvent.detail }),
    );
}

/**
 * ドロップゾーンのホバーハイライト処理
 */
export function highlightDropZoneAtPosition(x: number, y: number) {
    // 既存のハイライトをクリア
    document.querySelectorAll(".drop-zone-indicator").forEach((zone) => {
        zone.classList.remove("drop-zone-hover");
    });

    // カーソル位置の要素を取得
    const elementBelow = document.elementFromPoint(x, y);
    if (elementBelow) {
        const dropZone = elementBelow.closest(".drop-zone-indicator");
        if (dropZone) {
            dropZone.classList.add("drop-zone-hover");
        }
    }
}

/**
 * ドラッグプレビューを作成
 */
export function createDragPreview(
    element: HTMLElement,
    x: number,
    y: number,
    isPlaceholder: boolean = false
): HTMLElement | null {
    const rect = element.getBoundingClientRect();
    const MAX_PREVIEW = 140;
    const previewWidth = Math.min(MAX_PREVIEW, rect.width || MAX_PREVIEW);
    const previewHeight =
        rect.width > 0
            ? Math.round((rect.height / rect.width) * previewWidth)
            : previewWidth;

    let previewEl: HTMLElement | null = null;

    if (isPlaceholder) {
        const origCanvas = element.querySelector(
            "canvas",
        ) as HTMLCanvasElement | null;
        if (!origCanvas) return null;
        const newCanvas = document.createElement("canvas");
        newCanvas.width = origCanvas.width;
        newCanvas.height = origCanvas.height;
        const ctx = newCanvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(origCanvas, 0, 0);
        }
        previewEl = newCanvas;
    } else {
        const origImg = element.querySelector(
            "img",
        ) as HTMLImageElement | null;
        if (!origImg) return null;
        const newImg = document.createElement("img");
        newImg.src = origImg.src;
        newImg.alt = origImg.alt || "";
        previewEl = newImg;
    }

    previewEl.classList.add("drag-preview");
    previewEl.style.width = `${previewWidth}px`;
    previewEl.style.height = `${previewHeight}px`;
    previewEl.style.left = `${x - previewWidth / 2}px`;
    previewEl.style.top = `${y - previewHeight / 2}px`;
    previewEl.style.transformOrigin = "center center";
    previewEl.style.transition = "transform 120ms ease, opacity 120ms ease";

    document.body.appendChild(previewEl);

    requestAnimationFrame(() => {
        previewEl!.style.transform = "scale(0.8) rotate(0deg)";
        previewEl!.style.opacity = "0.95";
    });

    return previewEl;
}

/**
 * ドラッグプレビューの位置を更新
 */
export function updateDragPreview(previewElement: HTMLElement | null, x: number, y: number) {
    if (!previewElement) return;

    const rect = previewElement.getBoundingClientRect();
    const w = rect.width || 100;
    const h = rect.height || 100;

    previewElement.style.left = `${x - w / 2}px`;
    previewElement.style.top = `${y - h / 2}px`;
}

/**
 * ドラッグプレビューを削除
 */
export function removeDragPreview(previewElement: HTMLElement | null): void {
    if (previewElement?.parentNode) {
        previewElement.parentNode.removeChild(previewElement);
    }
}

/**
 * 移動距離の閾値チェック
 */
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

/**
 * 統合されたタップ/クリック処理
 */
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
) {
    // ドラッグ中やプレースホルダーの場合は何もしない
    if (isDragging || isPlaceholder) {
        event.preventDefault();
        return false;
    }

    // 直前の選択による抑制期間中はクリックを無視
    if (justSelected && !isTouch) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    if (selected) {
        // 既に選択済みなら全画面表示
        requestFullscreenImage(imageSrc, imageAlt);
    } else {
        // 未選択なら選択要求
        requestNodeSelection(getPos);
    }

    event.preventDefault();
    if (!isTouch) {
        event.stopPropagation();
    }

    return true;
}

// URL検証/正規化関数の重複を整理
import { ALLOWED_PROTOCOLS, ALLOWED_IMAGE_EXTENSIONS } from "../constants";

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
    try {
        const normalized = encodeURI(url.trim());
        const u = new URL(normalized);
        if (!ALLOWED_PROTOCOLS.includes(u.protocol)) return null;
        const lower = u.pathname.toLowerCase();
        if (!ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext))) return null;
        return u.href;
    } catch {
        return null;
    }
}

// 文字境界判定用の共通関数
export function isWordBoundary(char: string | undefined): boolean {
    return !char || /[\s\n\u3000]/.test(char);
}

// URLの末尾クリーンアップ関数（より柔軟な判定）
export function cleanUrlEnd(url: string): { cleanUrl: string; actualLength: number } {
    let cleanUrl = url;

    // 末尾の不要な文字を段階的に除去（ただし、入力中の場合は保持）
    // 連続する句読点や括弧のみを除去し、単独の場合は保持
    const trailingPattern = /([.,;:!?）】」』〉》】\]}>）]){2,}$/;
    const trailingMatch = cleanUrl.match(trailingPattern);
    if (trailingMatch) {
        cleanUrl = cleanUrl.slice(0, -trailingMatch[0].length);
    }

    return {
        cleanUrl,
        actualLength: cleanUrl.length
    };
}

/**
 * エディタやフォームコントロールのフォーカスを外し、bodyにフォーカスを移す
 */
export function blurEditorAndBody() {
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
