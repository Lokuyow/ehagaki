import { describe, expect, it, beforeEach } from 'vitest';

import {
    isAnyDialogOpen,
    pendingDraftContentStore,
    showAddAccountDialogStore,
    showDraftListDialogStore,
    showDraftLimitConfirmStore,
    showLoginDialogStore,
    showLogoutDialogStore,
    showSettingsDialogStore,
    showWelcomeDialogStore,
} from '../../stores/dialogStore.svelte';

describe('dialogStore', () => {
    beforeEach(() => {
        showLoginDialogStore.set(false);
        showLogoutDialogStore.set(false);
        showSettingsDialogStore.set(false);
        showWelcomeDialogStore.set(false);
        showAddAccountDialogStore.set(false);
        showDraftListDialogStore.set(false);
        showDraftLimitConfirmStore.set(false);
        pendingDraftContentStore.set(null);
    });

    it('boolean dialog stores を set/get できる', () => {
        showLoginDialogStore.set(true);
        showAddAccountDialogStore.set(true);
        showDraftLimitConfirmStore.set(true);

        expect(showLoginDialogStore.value).toBe(true);
        expect(showAddAccountDialogStore.value).toBe(true);
        expect(showDraftLimitConfirmStore.value).toBe(true);
    });

    it('いずれかの dialog が開いているか判定できる', () => {
        expect(isAnyDialogOpen()).toBe(false);

        showSettingsDialogStore.set(true);
        expect(isAnyDialogOpen()).toBe(true);

        showSettingsDialogStore.set(false);
        showDraftListDialogStore.set(true);
        expect(isAnyDialogOpen()).toBe(true);
    });

    it('pending draft content を保持してクリアできる', () => {
        const draftContent = {
            content: '<p>draft</p>',
            galleryItems: [
                {
                    id: 'media-1',
                    type: 'image' as const,
                    src: 'https://example.com/a.jpg',
                    isPlaceholder: false,
                },
            ],
            channelData: {
                eventId: 'channel-root-event',
                relayHints: ['wss://channel-relay.example.com'],
                name: 'General',
                about: 'General discussion',
                picture: 'https://example.com/channel.png',
            },
        };

        pendingDraftContentStore.set(draftContent);
        expect(pendingDraftContentStore.value).toEqual(draftContent);

        pendingDraftContentStore.set(null);
        expect(pendingDraftContentStore.value).toBeNull();
    });
});
