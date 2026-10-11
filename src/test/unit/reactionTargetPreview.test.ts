import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import { finalizeEvent, generateSecretKey } from 'nostr-tools';
import { buildComposerInteractionRenderModel } from '../../lib/composerTargetRelatedPreview';
import ReactionTargetPreview from '../../components/ReactionTargetPreview.svelte';
import type { ProfileData } from '../../lib/types';
import type { ReactionComposerState } from '../../stores/reactionComposerStore.svelte';
vi.mock('svelte-i18n', () => ({ _: readable((key: string) => key) }));

describe('Reaction target main presentation', () => {
    it.each([6, 16])('kind %s keeps embedded JSON opaque and displays outer identity', async kind => {
        const embedded = finalizeEvent({ kind: 1, content: 'NEVER-EXPOSE https://private.example/body https://private.example/image.png https://private.example/video.mp4',
            tags: [['imeta', 'url https://private.example/hidden.png']], created_at: 42 }, generateSecretKey());
        const event = finalizeEvent({ kind, content: JSON.stringify(embedded), tags: [['e', embedded.id], ['p', embedded.pubkey]], created_at: 100 }, generateSecretKey());
        const { container } = render(ReactionTargetPreview, { props: { target: { event, eventId: event.id, authorPubkey: event.pubkey, kind, relayHints: [], ownerToken: Symbol() }, onClear: vi.fn() } });
        expect(container.querySelector('[data-reaction-target-id]')?.getAttribute('data-reaction-target-id')).toBe(event.id);
        expect(container.querySelector('.author-name')?.textContent).toMatch(/^npub1/);
        await fireEvent.click(screen.getByRole('button', { name: 'reaction.target' }));
        expect(container.textContent).toContain(kind === 6 ? 'repost.entry' : 'composerTarget.genericRepost');
        expect(container.textContent).not.toContain('NEVER-EXPOSE'); expect(container.innerHTML).not.toContain('private.example');
        expect(container.textContent).not.toContain(embedded.pubkey);
        expect(container.querySelectorAll('a, img, video, [data-related-event-id]')).toHaveLength(0);
        expect(container.querySelector('.preview-content')).not.toBeNull();
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

    it('uses the shared profile row and synchronizes kind 0 presentation without changing target identity', async () => {
        const event = finalizeEvent({ kind: 1, content: 'Target body', tags: [], created_at: 100 }, generateSecretKey());
        const target: ReactionComposerState = { event, eventId: event.id, authorPubkey: event.pubkey,
            kind: 1, relayHints: ['wss://target.example/'], ownerToken: Symbol() };
        let publishProfile: (profile: ProfileData | null) => void = () => {};
        const unsubscribe = vi.fn();
        const profile = { name: 'alice', displayName: 'Alice', picture: 'https://profile.example/alice.png', npub: '', nprofile: '' };
        const profileService = {
            fetchProfileRealtime: vi.fn(async () => profile),
            subscribeProfile: vi.fn((_pubkey: string, callback: typeof publishProfile) => { publishProfile = callback; return unsubscribe; }),
        };
        const onClear = vi.fn();
        const { container, unmount } = render(ReactionTargetPreview, { props: { target, profileService, onClear } });
        await waitFor(() => expect(container.querySelector('.author-name')?.textContent).toBe('Alice'));
        expect(profileService.fetchProfileRealtime).toHaveBeenCalledWith(event.pubkey, { additionalRelays: target.relayHints });
        expect(profileService.subscribeProfile).toHaveBeenCalledWith(event.pubkey, expect.any(Function));
        expect(container.querySelector('.author-profile img')?.getAttribute('src')).toBe('https://profile.example/alice.png?profile=true');
        expect(container.querySelector('.preview-content')).toBeNull();
        publishProfile({ ...profile, displayName: '', name: 'Updated Alice' });
        await waitFor(() => expect(container.querySelector('.author-name')?.textContent).toBe('Updated Alice'));
        expect(target.event).toEqual(event);
        expect(container.querySelector('[data-reaction-target-id]')?.getAttribute('data-reaction-target-id')).toBe(event.id);
        await fireEvent.click(screen.getByRole('button', { name: 'reaction.clear' }));
        expect(onClear).toHaveBeenCalledOnce();
        await unmount();
        expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it('ignores old profile requests and subscriptions after target or runtime changes', async () => {
        const event = finalizeEvent({ kind: 1, content: '', tags: [], created_at: 100 }, generateSecretKey());
        const target: ReactionComposerState = { event, eventId: event.id, authorPubkey: event.pubkey,
            kind: 1, relayHints: [], ownerToken: Symbol() };
        const profile = { name: '', displayName: 'Old author', picture: '', npub: '', nprofile: '' };
        const completions: ((profile: ProfileData | null) => void)[] = [];
        const updates: ((profile: ProfileData | null) => void)[] = [];
        const unsubscribe = vi.fn();
        const profileService = {
            fetchProfileRealtime: vi.fn(() => new Promise<ProfileData | null>(resolve => completions.push(resolve))),
            subscribeProfile: vi.fn((_pubkey: string, callback: typeof updates[number]) => { updates.push(callback); return unsubscribe; }),
        };
        const onClear = vi.fn();
        const { container, rerender, unmount } = render(ReactionTargetPreview, { props: { target, profileService, onClear } });
        await rerender({ target: { ...target, ownerToken: Symbol() }, profileService, onClear });
        completions[0](profile); updates[0](profile);
        await waitFor(() => expect(container.querySelector('.author-name')?.textContent).toMatch(/^npub1/));
        expect(unsubscribe).toHaveBeenCalledOnce();
        const nextProfileService = { ...profileService, fetchProfileRealtime: vi.fn(async () => ({ ...profile, displayName: 'Current author' })) };
        await rerender({ target: { ...target, ownerToken: Symbol() }, profileService: nextProfileService, onClear });
        completions[1](profile); updates[1](profile);
        await waitFor(() => expect(container.querySelector('.author-name')?.textContent).toBe('Current author'));
        expect(unsubscribe).toHaveBeenCalledTimes(2);
        await unmount(); updates[2](profile);
        expect(unsubscribe).toHaveBeenCalledTimes(3);
    });
});
