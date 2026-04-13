import type { NodeData } from '../types';
import type { Editor as TipTapEditor, ChainedCommands } from '@tiptap/core';
import type { Node as PMNode, Schema } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import {
    validateAndNormalizeImageUrl,
    validateAndNormalizeVideoUrl,
} from './editorUrlUtils';

export function isDocumentEmpty(doc: PMNode): boolean {
    if (doc.childCount === 1) {
        const firstChild = doc.firstChild;
        return firstChild?.type.name === 'paragraph' && firstChild.content.size === 0;
    }
    return doc.childCount === 0;
}

export function isEditorDocEmpty(state: EditorState): boolean {
    return isDocumentEmpty(state.doc);
}

export function isParagraphWithOnlyImageUrl(node: PMNode, urlLength: number): boolean {
    return node.type.name === 'paragraph'
        && node.content.size === urlLength
        && node.textContent.trim().length === urlLength;
}

export function createImageNodeData(url: string, alt: string = 'Image'): NodeData | null {
    const normalizedUrl = validateAndNormalizeImageUrl(url);
    if (!normalizedUrl) return null;

    return {
        type: 'image',
        attrs: { src: normalizedUrl, alt },
    };
}

export function createVideoNodeData(url: string): NodeData | null {
    const normalizedUrl = validateAndNormalizeVideoUrl(url);
    if (!normalizedUrl) return null;

    return {
        type: 'video',
        attrs: { src: normalizedUrl },
    };
}

export function createParagraphNodeData(text: string): NodeData {
    return {
        type: 'paragraph',
        content: text.trim() ? [{ type: 'text', text }] : [],
    };
}

export function parseTextToNodes(text: string): NodeData[] {
    const lines = text.split('\n');
    const nodes: NodeData[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        const imageNode = createImageNodeData(trimmed);
        const videoNode = !imageNode ? createVideoNodeData(trimmed) : null;

        if (imageNode) {
            nodes.push(imageNode);
        } else if (videoNode) {
            nodes.push(videoNode);
        } else {
            nodes.push(createParagraphNodeData(line));
        }
    }

    return nodes;
}

export function textToTiptapNodes(text: string): NodeData {
    const nodes = parseTextToNodes(text);
    return {
        type: 'doc',
        content: nodes.length > 0 ? nodes : [{ type: 'paragraph' }],
    };
}

export function createNodeFromData(schema: Schema, nodeData: NodeData): PMNode | null {
    switch (nodeData.type) {
        case 'image':
            return schema.nodes.image.create(nodeData.attrs);
        case 'video':
            return schema.nodes.video.create(nodeData.attrs);
        case 'paragraph':
            if (nodeData.content?.length) {
                const textNodes = nodeData.content.map((textData: { text: string }) =>
                    schema.text(textData.text),
                );
                return schema.nodes.paragraph.create({}, textNodes);
            }
            return schema.nodes.paragraph.create();
        default:
            return null;
    }
}

export interface EditorAdapter {
    getState(): EditorState;
    dispatch(transaction: Transaction): void;
    chain(): ChainedCommands;
    focus(): ChainedCommands;
}

export function createEditorAdapter(editor: TipTapEditor): EditorAdapter {
    return {
        getState: () => editor.view.state,
        dispatch: (transaction: Transaction) => editor.view.dispatch(transaction),
        chain: () => editor.chain(),
        focus: () => editor.chain().focus(),
    };
}

export function calculateInsertPositions(
    nodes: PMNode[],
    startPos: number,
): { node: PMNode; position: number }[] {
    let currentPos = startPos;
    return nodes.map(node => {
        const result = { node, position: currentPos };
        currentPos += node.nodeSize;
        return result;
    });
}

function insertNodesToEditor(editor: TipTapEditor, nodeDataList: NodeData[]) {
    const { state, dispatch } = editor.view;
    const { tr, schema } = state;
    let transaction = tr;
    let insertPos = state.selection.from;
    const docIsEmpty = isEditorDocEmpty(state);

    if (docIsEmpty) {
        const nodes = nodeDataList
            .map(nodeData => createNodeFromData(schema, nodeData))
            .filter((node): node is PMNode => node !== null);
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

export function insertTextAsNodes(editor: TipTapEditor | null, text: string) {
    if (!editor) return;
    const nodeStructure = textToTiptapNodes(text);
    insertNodesToEditor(editor, nodeStructure.content ?? []);
}

export function prepareImageNodes(urls: string | string[]): NodeData[] {
    const urlList = Array.isArray(urls)
        ? urls
        : urls.split('\n').map(value => value.trim()).filter(Boolean);

    return urlList
        .map(url => createImageNodeData(url.trim(), 'Uploaded image'))
        .filter((node): node is NodeData => node !== null);
}

export function insertImagesToEditor(editor: TipTapEditor | null, urls: string | string[]) {
    if (!editor) return;

    const urlList = Array.isArray(urls)
        ? urls
        : urls.split('\n').map(value => value.trim()).filter(Boolean);
    if (urlList.length === 0) return;

    editor.chain().focus().run();
    const imageNodes = prepareImageNodes(urlList);
    insertNodesToEditor(editor, imageNodes);
}

export function extractFragmentsFromDoc(doc: PMNode): string[] {
    const fragments: string[] = [];
    doc.descendants((node: PMNode) => {
        if (node.type.name === 'paragraph') {
            fragments.push(node.textContent);
        } else if (node.type.name === 'image' || node.type.name === 'video') {
            const src = node.attrs?.src;
            if (src) {
                fragments.push(src);
            }
        }
    });
    return fragments;
}

export function getDocumentFromEditor(editor: TipTapEditor | null): PMNode | null {
    if (!editor) return null;
    try {
        return editor.state?.doc ?? editor.view?.state?.doc ?? null;
    } catch {
        return null;
    }
}

export function extractContentWithImages(editor: TipTapEditor | null): string {
    const doc = getDocumentFromEditor(editor);
    if (!doc) return '';

    const fragments = extractFragmentsFromDoc(doc);
    return fragments.join('\n');
}