import { afterEach, expect, it, vi } from 'vitest';
vi.unmock('../../stores/postUIStore.svelte');
import { postComponentUIStore } from '../../stores/postUIStore.svelte';
import { submitPendingPostWithSecretKey } from '../../lib/postComponentUtils';

afterEach(() => postComponentUIStore.hideSecretKeyDialog());

it('owns copied content/emoji tags until consumption and computes metadata at confirmation', async () => {
    const tags = [['emoji', 'wave', 'https://example.invalid/wave.png']];
    postComponentUIStore.showSecretKeyDialog('checked :wave:', tags);
    tags[0][1] = 'changed';
    const pendingPost = postComponentUIStore.getPendingPost();
    const pendingEmojiTags = postComponentUIStore.getPendingEmojiTags();
    const currentEditor = {} as any;
    const metadata = { image: { blurhash: 'confirmation-time' } };
    const postManager = {
        prepareImageBlurhashMap: vi.fn(() => metadata),
        submitPost: vi.fn(async () => ({ success: true })),
    };
    await submitPendingPostWithSecretKey({
        postManager, currentEditor, imageOxMap: {}, imageXMap: {}, pendingPost, pendingEmojiTags,
        onStart: () => postComponentUIStore.hideSecretKeyDialog(), onSuccess: vi.fn(), onFailure: vi.fn(),
    });
    expect(postManager.prepareImageBlurhashMap).toHaveBeenCalledOnce();
    expect(postManager.submitPost).toHaveBeenCalledWith('checked :wave:', metadata, [['emoji', 'wave', 'https://example.invalid/wave.png']]);
    expect(postComponentUIStore.value.showSecretKeyDialog).toBe(false);
    expect(postComponentUIStore.getPendingPost()).toBe('');
    expect(postComponentUIStore.getPendingEmojiTags()).toEqual([]);
});

it('discards all pending values on cancellation', () => {
    postComponentUIStore.showSecretKeyDialog('pending', [['emoji', 'wave', 'url']]);
    postComponentUIStore.hideSecretKeyDialog();
    expect(postComponentUIStore.value.showSecretKeyDialog).toBe(false);
    expect(postComponentUIStore.getPendingPost()).toBe('');
    expect(postComponentUIStore.getPendingEmojiTags()).toEqual([]);
});
