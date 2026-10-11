import type { Node as PMNode } from '@tiptap/pm/model';
import { normalizeCustomEmojiSelection, type CustomEmojiSelection } from './customEmojiUsage';
import { parseEmojiSetAddress } from './customEmoji';

export type ReactionValue = { type: 'text'; text: string } | { type: 'customEmoji'; emoji: CustomEmojiSelection };
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

export function normalizeReactionValue(value: ReactionValue): { content: string; emojiTag?: string[] } {
    if (value.type === 'text') {
        if (!value.text.trim() || [...segmenter.segment(value.text)].length !== 1 || /[\r\n]/.test(value.text)) {
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
export function inspectReactionDocument(doc: PMNode, hasGalleryMedia = false) {
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
    const count = [...segmenter.segment(text)].length + emojis.length;
    let value: ReactionValue | null = null;
    if (!forbidden && count === 1) {
        const candidate: ReactionValue = emojis.length ? { type: 'customEmoji', emoji: { ...emojis[0] } } : { type: 'text', text };
        try { normalizeReactionValue(candidate); value = candidate; } catch { /* Invalid rich attributes remain editable. */ }
    }
    return { value, count, forbidden };
}
