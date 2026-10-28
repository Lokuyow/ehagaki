import { describe, expect, it } from 'vitest';
import { Schema } from '@tiptap/pm/model';
import { inspectReactionDocument, getReactionInputMode } from '../../lib/reactionValue';
import { buildReactionEvent } from '../../lib/postReactionUtils';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import type { ReactionMediaContext } from '../../lib/reactionValue';
const schema = new Schema({ nodes: { doc: { content: 'paragraph+' }, paragraph: { content: 'text*' }, text: {} } });
const doc = (text: string) => schema.node('doc', null, schema.node('paragraph', null, text ? schema.text(text) : undefined));
const context: ReactionMediaContext = { items: [{ id: 'own', src: 'https://upload.example/emoji.png', type: 'image', isPlaceholder: false }], ownedItemIds: new Set(['own']), originalFileNames: new Map([['own', 'cat.png']]) };
describe('Uploaded custom emoji reaction value', () => {
    it.each(['cat', ':cat', 'cat:', ':cat:', '::cat::'])('canonicalizes %s with exactly one emoji tag and no set address', text => {
        const value = inspectReactionDocument(doc(text), context).value;
        expect(value).toEqual({ type: 'customEmoji', emoji: { shortcode: 'cat', src: context.items[0].src } });
        const target = finalizeEvent({ kind: 1, content: '', tags: [], created_at: 1 }, generateSecretKey());
        const event = buildReactionEvent(target, target.pubkey, value!, [], 2);
        expect(event.content).toBe(':cat:'); expect(event.tags.filter(tag => tag[0] === 'emoji')).toEqual([['emoji', 'cat', context.items[0].src]]);
        expect(event.tags.some(tag => tag[0] === 'imeta')).toBe(false);
    });
    it.each([' ', ':', '::', 'cat ', ' cat', ' :cat: ', 'ca t', '\tcat', 'cat\n', 'cat\u00a0', '\u3000cat', 'ca:t', '猫', 'cat+'])('rejects raw invalid text %j before normalization', text => {
        expect(inspectReactionDocument(doc(text), context).value).toBeNull();
    });
    it.each([['cat.png', 'cat'], ['a b.png', 'a_b'], ['猫.png', 'emoji'], ['cat.face.PNG', 'cat_face'], ['_Cat-2_.webp', '_Cat-2_'], ['cat', 'cat'], ['', 'emoji']])('uses filename %s as %s without editing the document', (name, shortcode) => {
        const document = doc('');
        const media = { ...context, originalFileNames: new Map([['own', name]]) };
        const value = inspectReactionDocument(document, media).value;
        expect(value).toEqual({ type: 'customEmoji', emoji: { shortcode, src: context.items[0].src } });
        expect(document.textContent).toBe('');
        const target = finalizeEvent({ kind: 1, content: '', tags: [], created_at: 1 }, generateSecretKey());
        const event = buildReactionEvent(target, target.pubkey, value!, [], 2);
        expect(event.content).toBe(`:${shortcode}:`);
        expect(event.tags.filter(tag => tag[0] === 'emoji')).toEqual([['emoji', shortcode, context.items[0].src]]);
        expect(inspectReactionDocument(doc('override'), media).value).toMatchObject({ emoji: { shortcode: 'override' } });
    });
    it('permits placeholder editing but never submission', () => {
        const pending = { ...context, items: [{ ...context.items[0], isPlaceholder: true }] };
        expect(getReactionInputMode(pending)).toBe('uploadedShortcode');
        expect(inspectReactionDocument(doc('cat'), pending).value).toBeNull();
        expect(inspectReactionDocument(doc(''), pending).value).toBeNull();
    });
    it('rejects existing draft media, multiple items and video', () => {
        for (const invalid of [{ ...context, ownedItemIds: new Set<string>() }, { ...context, items: [...context.items, { ...context.items[0], id: 'other' }] },
            { ...context, items: [{ ...context.items[0], type: 'video' as const }] }]) expect(inspectReactionDocument(doc('cat'), invalid).value).toBeNull();
    });
    it('still requires one grapheme without an image', () => {
        expect(inspectReactionDocument(doc(''), { ...context, items: [] }).value).toBeNull();
        expect(inspectReactionDocument(doc('cat'), { items: [], ownedItemIds: new Set(), originalFileNames: new Map() }).value).toBeNull();
        expect(inspectReactionDocument(doc('👍🏽'), { items: [], ownedItemIds: new Set(), originalFileNames: new Map() }).value).toEqual({ type: 'text', text: '👍🏽' });
    });
});
