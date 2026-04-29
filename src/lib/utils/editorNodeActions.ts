import type { Editor as TipTapEditor } from '@tiptap/core';
import type { Node as PMNode } from '@tiptap/pm/model';
import { NodeSelection } from '@tiptap/pm/state';
import type { Transaction } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { isMediaPlaceholder } from './mediaNodeUtils';

export function calculateDragPositions(
    dropPos: number,
    originalPos: number,
    doc?: PMNode,
): { insertPos: number; deleteStart: number; deleteEnd: number } | null {
    if (dropPos === originalPos) return null;

    let adjustedDropPos = dropPos;
    if (doc) {
        const $dropPos = doc.resolve(dropPos);
        const dropNode = $dropPos.parent;
        if (dropNode.type.name === 'paragraph') {
            adjustedDropPos = $dropPos.after();
        }
    }

    if (adjustedDropPos < originalPos) {
        return {
            insertPos: adjustedDropPos,
            deleteStart: originalPos + 1,
            deleteEnd: originalPos + 2,
        };
    }

    if (adjustedDropPos > originalPos + 1) {
        return {
            insertPos: adjustedDropPos - 1,
            deleteStart: originalPos,
            deleteEnd: originalPos + 1,
        };
    }

    return null;
}

export function createMoveTransaction(
    transaction: Transaction,
    imageNode: PMNode,
    positions: { insertPos: number; deleteStart: number; deleteEnd: number },
): Transaction {
    if (positions.insertPos < positions.deleteStart) {
        return transaction
            .insert(positions.insertPos, imageNode)
            .delete(positions.deleteStart, positions.deleteEnd);
    }

    return transaction
        .delete(positions.deleteStart, positions.deleteEnd)
        .insert(positions.insertPos, imageNode);
}

export function moveImageNode(
    view: EditorView,
    nodeData: { pos: number; attrs: Record<string, unknown> },
    dropPos: number,
): boolean {
    const { tr, doc, schema } = view.state;
    const originalPos = nodeData.pos;

    const positions = calculateDragPositions(dropPos, originalPos, doc);
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

export function getCustomEmojiDropPositions(
    doc: PMNode,
    draggedNodePos?: number | null,
): number[] {
    const positions = new Set<number>();

    doc.descendants((node, pos) => {
        if (node.type.name !== 'paragraph') {
            return;
        }

        const paragraphStart = pos + 1;
        const paragraphEnd = pos + node.nodeSize - 1;
        positions.add(paragraphStart);
        positions.add(paragraphEnd);

        node.descendants((child, childOffset) => {
            if (child.type.name !== 'customEmoji') {
                return;
            }

            const emojiPos = paragraphStart + childOffset;
            positions.add(emojiPos);
            positions.add(emojiPos + child.nodeSize);
        });
    });

    if (typeof draggedNodePos === 'number') {
        const draggedNode = doc.nodeAt(draggedNodePos);
        const draggedNodeSize = draggedNode?.type.name === 'customEmoji' ? draggedNode.nodeSize : 1;
        positions.delete(draggedNodePos);
        positions.delete(draggedNodePos + draggedNodeSize);
    }

    return [...positions].sort((left, right) => left - right);
}

export function isCustomEmojiOriginalDropPosition(
    doc: PMNode,
    dropPos: number,
    draggedNodePos?: number | null,
): boolean {
    if (typeof draggedNodePos !== 'number') return false;

    const draggedNode = doc.nodeAt(draggedNodePos);
    if (draggedNode?.type.name !== 'customEmoji') return false;

    return dropPos >= draggedNodePos && dropPos <= draggedNodePos + draggedNode.nodeSize;
}

export function findClosestCustomEmojiDropPosition(
    doc: PMNode,
    dropPos: number,
    draggedNodePos?: number | null,
): number | null {
    if (isCustomEmojiOriginalDropPosition(doc, dropPos, draggedNodePos)) {
        return draggedNodePos ?? null;
    }

    const positions = getCustomEmojiDropPositions(doc, draggedNodePos);
    if (positions.length === 0) return null;

    return positions.reduce((closest, position) => {
        const closestDistance = Math.abs(closest - dropPos);
        const positionDistance = Math.abs(position - dropPos);
        return positionDistance < closestDistance ? position : closest;
    }, positions[0]);
}

export function moveCustomEmojiNode(
    view: EditorView,
    nodeData: { pos: number; attrs: Record<string, unknown> },
    dropPos: number,
): boolean {
    const { tr, doc, schema } = view.state;
    const originalPos = nodeData.pos;
    const originalNode = doc.nodeAt(originalPos);

    if (originalNode?.type.name !== 'customEmoji') {
        return false;
    }

    if (dropPos === originalPos || dropPos === originalPos + originalNode.nodeSize) {
        return true;
    }

    const allowedPositions = getCustomEmojiDropPositions(doc, originalPos);
    if (!allowedPositions.includes(dropPos)) {
        return true;
    }

    const customEmojiNode = schema.nodes.customEmoji.create({
        ...originalNode.attrs,
        ...nodeData.attrs,
    });

    try {
        const insertPos =
            dropPos < originalPos
                ? dropPos
                : dropPos - originalNode.nodeSize;
        const transaction =
            dropPos < originalPos
                ? tr
                    .insert(insertPos, customEmojiNode)
                    .delete(originalPos + customEmojiNode.nodeSize, originalPos + customEmojiNode.nodeSize + originalNode.nodeSize)
                : tr
                    .delete(originalPos, originalPos + originalNode.nodeSize)
                    .insert(insertPos, customEmojiNode);

        transaction.setSelection(NodeSelection.create(transaction.doc, insertPos));
        view.dispatch(transaction.scrollIntoView());
        return true;
    } catch (error) {
        console.error('Error moving custom emoji:', error);
        return false;
    }
}

export function setDraggingFalse(viewOrEditorView: EditorView) {
    viewOrEditorView.dispatch(
        viewOrEditorView.state.tr.setMeta('imageDrag', {
            isDragging: false,
            draggedNodePos: null,
        }),
    );
}

export function findAndExecuteOnNode(
    editor: TipTapEditor | null,
    predicate: (node: PMNode, pos: number) => boolean,
    action: (node: PMNode, pos: number) => void,
): void {
    if (!editor) return;

    const doc = editor.state.doc;
    doc.descendants((node: PMNode, pos: number) => {
        if (predicate(node, pos)) {
            action(node, pos);
            return false;
        }
    });
}

export function updateImageSizeMap<TMap extends Record<string, unknown>>(
    store: { update: (fn: (map: TMap) => TMap) => void },
    deleteKey?: string,
    addKey?: string,
    addValue?: unknown,
): void {
    store.update((map: TMap) => {
        const newMap: Record<string, unknown> = { ...map };
        if (deleteKey) delete newMap[deleteKey];
        if (addKey && addValue) newMap[addKey] = addValue;
        return newMap as TMap;
    });
}

export function removePlaceholderNode<TMap extends Record<string, unknown>>(
    placeholderId: string,
    isVideo: boolean,
    currentEditor: TipTapEditor | null,
    imageSizeMapStore: { update: (fn: (map: TMap) => TMap) => void },
    devMode: boolean = false,
): void {
    if (!currentEditor) return;

    updateImageSizeMap(imageSizeMapStore, placeholderId);

    findAndExecuteOnNode(
        currentEditor,
        (node: PMNode) => {
            const nodeType = node.type?.name;
            const isSameNode = (isVideo && nodeType === 'video') || (!isVideo && nodeType === 'image');
            return isSameNode && (node.attrs?.src === placeholderId || node.attrs?.id === placeholderId);
        },
        (node: PMNode, pos: number) => {
            const tr = currentEditor.state.tr.delete(pos, pos + node.nodeSize);
            currentEditor.view.dispatch(tr);

            if (devMode) {
                console.log('[uploadHelper] Deleted placeholder:', placeholderId);
            }
        },
    );
}

export function removeAllPlaceholders(
    currentEditor: TipTapEditor | null,
    devMode: boolean = false,
): void {
    if (!currentEditor) return;

    const { state } = currentEditor;
    const { doc } = state;
    const tr = state.tr;
    let deletedCount = 0;
    const nodesToDelete: { pos: number; size: number }[] = [];

    doc.descendants((node, pos) => {
        const nodeType = node.type?.name;
        const isPlaceholder = isMediaPlaceholder(node.attrs);

        if ((nodeType === 'image' || nodeType === 'video') && isPlaceholder) {
            nodesToDelete.push({ pos, size: node.nodeSize });
        }
    });

    nodesToDelete.reverse().forEach(({ pos, size }) => {
        tr.delete(pos, pos + size);
        deletedCount++;
    });

    if (deletedCount > 0) {
        currentEditor.view.dispatch(tr);
        if (devMode) {
            console.log(`[editorNodeActions] Deleted ${deletedCount} placeholder(s)`);
        }
    }
}
