import type { NodeData } from '../types';
import type { Editor as TipTapEditor, ChainedCommands } from '@tiptap/core';
import type { Node as PMNode, Schema } from '@tiptap/pm/model';
import type { EditorState, Transaction } from '@tiptap/pm/state';
import {
    validateAndNormalizeImageUrl,
    validateAndNormalizeVideoUrl,
} from './editorUrlUtils';
import {
    createCustomEmojiIdentityKey,
    normalizeEmojiShortcode,
    normalizeEmojiShortcodeForLookup,
} from '../customEmoji';

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

export interface ExtractedPostContent {
    content: string;
    emojiTags: string[][];
}

const TEXT_SHORTCODE_REGEX = /:([A-Za-z0-9_-]{1,64}):/g;

function iterateChildNodes(node: PMNode, callback: (child: PMNode) => void): void {
    if (typeof node.forEach === 'function') {
        node.forEach((child: PMNode) => callback(child));
    }
}

function isValidEmojiImageUrl(value: unknown): value is string {
    if (typeof value !== 'string' || !value) return false;
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

interface CustomEmojiSerializationItem {
    identityKey: string;
    shortcode: string;
    shortcodeLower: string;
    src: string;
    setAddress: string;
}

type InlinePostFragment =
    | { type: 'text'; text: string }
    | { type: 'customEmoji'; emoji: CustomEmojiSerializationItem };

type PostBlockFragment =
    | { type: 'inline'; parts: InlinePostFragment[] }
    | { type: 'media'; text: string };

function createCustomEmojiSerializationItem(
    attrs: Record<string, unknown> | undefined,
): CustomEmojiSerializationItem | null {
    const shortcode = normalizeEmojiShortcode(attrs?.shortcode);
    const src = attrs?.src;
    if (!shortcode || !isValidEmojiImageUrl(src)) return null;

    const setAddress = typeof attrs?.setAddress === 'string' ? attrs.setAddress.trim() : '';
    const identityKey = typeof attrs?.identityKey === 'string' && attrs.identityKey
        ? attrs.identityKey
        : createCustomEmojiIdentityKey({
            shortcodeLower: normalizeEmojiShortcodeForLookup(shortcode),
            src,
            setAddress: setAddress || null,
        });

    return {
        identityKey,
        shortcode,
        shortcodeLower: normalizeEmojiShortcodeForLookup(shortcode),
        src,
        setAddress,
    };
}

function createCustomEmojiFragment(attrs: Record<string, unknown> | undefined): InlinePostFragment {
    const item = createCustomEmojiSerializationItem(attrs);
    if (item) {
        return { type: 'customEmoji', emoji: item };
    }

    const shortcode = normalizeEmojiShortcode(attrs?.shortcode);
    return { type: 'text', text: shortcode ? `:${shortcode}:` : '' };
}

function extractInlineFragmentsWithEmoji(node: PMNode): InlinePostFragment[] {
    const parts: InlinePostFragment[] = [];

    iterateChildNodes(node, (child) => {
        if (child.isText) {
            parts.push({ type: 'text', text: child.text ?? '' });
            return;
        }

        if (child.type.name === 'customEmoji') {
            parts.push(createCustomEmojiFragment(child.attrs));
            return;
        }

        parts.push({ type: 'text', text: child.textContent ?? '' });
    });

    return parts;
}

function reserveTextShortcodes(text: string, reservedShortcodes: Set<string>): void {
    for (const match of text.matchAll(TEXT_SHORTCODE_REGEX)) {
        const shortcode = normalizeEmojiShortcodeForLookup(match[1]);
        if (shortcode) {
            reservedShortcodes.add(shortcode);
        }
    }
}

function collectSerializationContext(blocks: PostBlockFragment[]): {
    reservedTextShortcodes: Set<string>;
    emojiOrder: CustomEmojiSerializationItem[];
    originalOwners: Map<string, Set<string>>;
} {
    const reservedTextShortcodes = new Set<string>();
    const emojiOrder: CustomEmojiSerializationItem[] = [];
    const seenEmojiIdentities = new Set<string>();
    const originalOwners = new Map<string, Set<string>>();

    for (const block of blocks) {
        if (block.type === 'media') {
            reserveTextShortcodes(block.text, reservedTextShortcodes);
            continue;
        }

        for (const part of block.parts) {
            if (part.type === 'text') {
                reserveTextShortcodes(part.text, reservedTextShortcodes);
                continue;
            }

            const owners = originalOwners.get(part.emoji.shortcodeLower) ?? new Set<string>();
            owners.add(part.emoji.identityKey);
            originalOwners.set(part.emoji.shortcodeLower, owners);

            if (!seenEmojiIdentities.has(part.emoji.identityKey)) {
                seenEmojiIdentities.add(part.emoji.identityKey);
                emojiOrder.push(part.emoji);
            }
        }
    }

    return { reservedTextShortcodes, emojiOrder, originalOwners };
}

function isAliasAvailable(params: {
    alias: string;
    emoji: CustomEmojiSerializationItem;
    isOriginalShortcode: boolean;
    usedAliasShortcodes: Set<string>;
    reservedTextShortcodes: Set<string>;
    originalOwners: Map<string, Set<string>>;
}): boolean {
    const aliasLower = normalizeEmojiShortcodeForLookup(params.alias);
    if (!aliasLower || params.usedAliasShortcodes.has(aliasLower)) return false;
    if (params.reservedTextShortcodes.has(aliasLower)) return false;

    if (!params.isOriginalShortcode) {
        const owners = params.originalOwners.get(aliasLower);
        if (owners && !(owners.size === 1 && owners.has(params.emoji.identityKey))) {
            return false;
        }
    }

    return true;
}

function createCustomEmojiAliasMap(blocks: PostBlockFragment[]): Map<string, string> {
    const {
        reservedTextShortcodes,
        emojiOrder,
        originalOwners,
    } = collectSerializationContext(blocks);
    const aliasByIdentity = new Map<string, string>();
    const usedAliasShortcodes = new Set<string>();

    for (const emoji of emojiOrder) {
        if (isAliasAvailable({
            alias: emoji.shortcode,
            emoji,
            isOriginalShortcode: true,
            usedAliasShortcodes,
            reservedTextShortcodes,
            originalOwners,
        })) {
            aliasByIdentity.set(emoji.identityKey, emoji.shortcode);
            usedAliasShortcodes.add(emoji.shortcodeLower);
            continue;
        }

        let suffix = 2;
        while (true) {
            const alias = `${emoji.shortcode}_${suffix}`;
            const aliasLower = normalizeEmojiShortcodeForLookup(alias);
            if (isAliasAvailable({
                alias,
                emoji,
                isOriginalShortcode: false,
                usedAliasShortcodes,
                reservedTextShortcodes,
                originalOwners,
            })) {
                aliasByIdentity.set(emoji.identityKey, alias);
                usedAliasShortcodes.add(aliasLower);
                break;
            }
            suffix++;
        }
    }

    return aliasByIdentity;
}

function renderPostBlocks(blocks: PostBlockFragment[]): ExtractedPostContent {
    const aliasByIdentity = createCustomEmojiAliasMap(blocks);
    const emojiTags: string[][] = [];
    const seenTaggedIdentities = new Set<string>();

    const fragments = blocks.map((block) => {
        if (block.type === 'media') {
            return block.text;
        }

        let text = '';
        for (const part of block.parts) {
            if (part.type === 'text') {
                text += part.text;
                continue;
            }

            const alias = aliasByIdentity.get(part.emoji.identityKey) ?? part.emoji.shortcode;
            text += `:${alias}:`;
            if (!seenTaggedIdentities.has(part.emoji.identityKey)) {
                seenTaggedIdentities.add(part.emoji.identityKey);
                const tag = ['emoji', alias, part.emoji.src];
                if (part.emoji.setAddress) {
                    tag.push(part.emoji.setAddress);
                }
                emojiTags.push(tag);
            }
        }
        return text;
    });

    return {
        content: fragments.join('\n'),
        emojiTags,
    };
}

export function extractPostContentFromDoc(doc: PMNode): ExtractedPostContent {
    const blocks: PostBlockFragment[] = [];

    if (typeof doc.forEach !== 'function' && typeof doc.descendants === 'function') {
        doc.descendants((node: PMNode) => {
            if (node.type.name === 'paragraph') {
                blocks.push({
                    type: 'inline',
                    parts: [{ type: 'text', text: node.textContent }],
                });
            } else if (node.type.name === 'image' || node.type.name === 'video') {
                const src = node.attrs?.src;
                if (src) {
                    blocks.push({ type: 'media', text: src });
                }
            } else if (node.type.name === 'customEmoji') {
                blocks.push({
                    type: 'inline',
                    parts: [createCustomEmojiFragment(node.attrs)],
                });
            }
        });
        return renderPostBlocks(blocks);
    }

    iterateChildNodes(doc, (node) => {
        if (node.type.name === 'paragraph') {
            blocks.push({
                type: 'inline',
                parts: extractInlineFragmentsWithEmoji(node),
            });
            return;
        }

        if (node.type.name === 'image' || node.type.name === 'video') {
            const src = node.attrs?.src;
            if (src) {
                blocks.push({ type: 'media', text: src });
            }
            return;
        }

        if (node.type.name === 'customEmoji') {
            blocks.push({
                type: 'inline',
                parts: [createCustomEmojiFragment(node.attrs)],
            });
        }
    });

    return renderPostBlocks(blocks);
}

export function extractFragmentsFromDoc(doc: PMNode): string[] {
    return extractPostContentFromDoc(doc).content.split('\n');
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

    return extractPostContentFromDoc(doc).content;
}

export function extractPostContentWithEmojiTags(editor: TipTapEditor | null): ExtractedPostContent {
    const doc = getDocumentFromEditor(editor);
    if (!doc) {
        return { content: '', emojiTags: [] };
    }

    return extractPostContentFromDoc(doc);
}
