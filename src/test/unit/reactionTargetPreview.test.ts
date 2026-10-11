import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { buildComposerInteractionRenderModel } from '../../lib/composerTargetRelatedPreview';
import ReactionTargetPreview from '../../components/ReactionTargetPreview.svelte';
vi.mock('svelte-i18n', () => ({ _: readable((key: string) => key) }));

describe('Reaction target main presentation', () => {
    it.each([6, 16])('kind %s keeps embedded JSON opaque and displays outer identity', async kind => {
        const embedded = finalizeEvent({ kind: 1, content: 'NEVER-EXPOSE https://private.example/body https://private.example/image.png https://private.example/video.mp4',
            tags: [['imeta', 'url https://private.example/hidden.png']], created_at: 42 }, generateSecretKey());
        const event = finalizeEvent({ kind, content: JSON.stringify(embedded), tags: [['e', embedded.id], ['p', embedded.pubkey]], created_at: 100 }, generateSecretKey());
        const { container } = render(ReactionTargetPreview, { props: { target: { event, eventId: event.id, authorPubkey: event.pubkey, kind, relayHints: [], ownerToken: Symbol() }, onClear: vi.fn() } });
        expect(container.querySelector('[data-reaction-target-id]')?.getAttribute('data-reaction-target-id')).toBe(event.id);
        expect(container.textContent).toContain(kind === 6 ? 'repost.entry' : 'composerTarget.genericRepost');
        expect(container.textContent).toContain(event.pubkey.slice(0, 12));
        await fireEvent.click(screen.getByRole('button', { name: 'reaction.target' }));
        expect(container.textContent).not.toContain('NEVER-EXPOSE'); expect(container.innerHTML).not.toContain('private.example');
        expect(container.textContent).not.toContain(embedded.pubkey);
        expect(container.querySelectorAll('a, img, video, [data-related-event-id]')).toHaveLength(0);
        expect(container.querySelector('.preview-content')).toBeNull();
    });
    it.each(['+', '👍🏽', ':blob:'])('kind 7 shares established Reaction interpretation for %s', async content => {
        const event = finalizeEvent({ kind: 7, content, tags: content === ':blob:' ? [['emoji', 'blob', 'https://emoji.example/blob.png']] : [], created_at: 100 }, generateSecretKey());
        const model = buildComposerInteractionRenderModel(event);
        const { container } = render(ReactionTargetPreview, { props: { target: { event, eventId: event.id, authorPubkey: event.pubkey, kind: 7, relayHints: [], ownerToken: Symbol() }, onClear: vi.fn(),
            emojiLoadStateByUrl: { 'https://emoji.example/blob.png': 'ready' } } });
        await fireEvent.click(screen.getByRole('button', { name: 'reaction.target' }));
        expect(container.querySelector('.preview-content')).not.toBeNull();
        expect(model.hasRenderableText).toBe(true);
        if (content === '+') expect(container.querySelector('.preview-content')?.textContent).not.toContain('+');
        if (content === '👍🏽') expect(container.textContent).toContain('👍🏽');
        if (content === ':blob:') expect(container.querySelector('img[alt=":blob:"]')?.getAttribute('src')).toBe('https://emoji.example/blob.png');
    });
});
