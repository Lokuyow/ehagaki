import type { Node as PMNode } from '@tiptap/pm/model';
import { normalizeCustomEmojiSelection, type CustomEmojiSelection } from './customEmojiUsage';
import { normalizeEmojiShortcode, parseEmojiSetAddress } from './customEmoji';
import type { MediaGalleryItem } from './types/media';
import { segmentGraphemes } from './utils/graphemeUtils';

export type ReactionValue = { type: 'text'; text: string } | { type: 'customEmoji'; emoji: CustomEmojiSelection };
export type ReactionInputMode = 'singleValue' | 'uploadedShortcode';
export interface ReactionMediaContext { items: readonly MediaGalleryItem[]; ownedItemIds: ReadonlySet<string> }

export function getReactionInputMode(context: ReactionMediaContext): ReactionInputMode {
    const item = context.items[0];
    return context.items.length === 1 && item.type === 'image' && context.ownedItemIds.has(item.id)
        ? 'uploadedShortcode' : 'singleValue';
}

export function inspectShortcodeDocument(doc: PMNode) {
    let text = '';
    let forbidden = doc.childCount === 1 && doc.firstChild?.type.name === 'paragraph' ? 0 : 1;
    doc.descendants(node => {
        if (node.isText) {
            text += node.text ?? '';
            if (node.marks.length || /[\r\n\u2028\u2029]/u.test(node.text ?? '')) forbidden++;
        }
        else if (node.type.name !== 'paragraph') forbidden++;
    });
    return { text, forbidden, count: [...segmentGraphemes(text)].length };
}

/** Editing permits incomplete/invalid text; wire validation is a separate boundary. */
export function canApplyReactionEdit(before: PMNode, after: PMNode, mode: ReactionInputMode): boolean {
    const previous = mode === 'uploadedShortcode' ? inspectShortcodeDocument(before) : inspectReactionDocument(before);
    const next = mode === 'uploadedShortcode' ? inspectShortcodeDocument(after) : inspectReactionDocument(after);
    if (next.forbidden === 0 && (mode === 'uploadedShortcode' || next.count <= 1)) return true;
    return (previous.count > 1 || previous.forbidden > 0)
        && next.count <= previous.count && next.forbidden <= previous.forbidden;
}

export function normalizeReactionValue(value: ReactionValue): { content: string; emojiTag?: string[] } {
    if (value.type === 'text') {
        if (!value.text.trim() || [...segmentGraphemes(value.text)].length !== 1 || /[\r\n]/.test(value.text)) {
            throw new Error('invalid_reaction_value');
        }
        return { content: value.text };
    }
    const emoji = normalizeCustomEmojiSelection(value.emoji);
    if (!emoji || !/^[a-zA-Z0-9_-]+$/.test(emoji.shortcode)) throw new Error('invalid_reaction_value');
    const tag = ['emoji', emoji.shortcode, emoji.src];
    const set = parseEmojiSetAddress(emoji.setAddress);
    if (set && /^[0-9a-f]{64}$/i.test(set.pubkey)) tag.push(set.address);
    return { content: `:${emoji.shortcode}:`, emojiTag: tag };
}

/** Count rich tokens before serialization: a customEmoji is one value, never its shortcode text. */
export function inspectReactionDocument(doc: PMNode, media: boolean | ReactionMediaContext = false) {
    if (typeof media !== 'boolean' && media.items.length > 0) {
        const inspection = inspectShortcodeDocument(doc);
        const item = media.items[0];
        let value: ReactionValue | null = null;
        if (getReactionInputMode(media) === 'uploadedShortcode' && !item.isPlaceholder && !inspection.forbidden
            && !/\s/u.test(inspection.text)) {
            const shortcode = normalizeEmojiShortcode(inspection.text);
            if (/^[A-Za-z0-9_-]+$/.test(shortcode)) {
                const candidate: ReactionValue = { type: 'customEmoji', emoji: { shortcode, src: item.src } };
                try { normalizeReactionValue(candidate); value = candidate; } catch { /* Invalid upload URL. */ }
            }
        }
        return { ...inspection, value };
    }
    const hasGalleryMedia = typeof media === 'boolean' ? media : false;
    let text = '';
    const emojis: CustomEmojiSelection[] = [];
    let forbidden = hasGalleryMedia ? 1 : 0;
    let paragraphs = 0;
    doc.descendants(node => {
        if (node.isText) text += node.text ?? '';
        else if (node.type.name === 'customEmoji') emojis.push(node.attrs as CustomEmojiSelection);
        else if (node.type.name === 'paragraph') paragraphs++;
        else if (node.type.name !== 'doc') forbidden++;
    });
    forbidden += Math.max(0, paragraphs - 1);
    const count = [...segmentGraphemes(text)].length + emojis.length;
    let value: ReactionValue | null = null;
    if (!forbidden && count === 1) {
        const candidate: ReactionValue = emojis.length ? { type: 'customEmoji', emoji: { ...emojis[0] } } : { type: 'text', text };
        try { normalizeReactionValue(candidate); value = candidate; } catch { /* Invalid rich attributes remain editable. */ }
    }
    return { value, count, forbidden };
}
