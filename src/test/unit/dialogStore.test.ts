import { describe, expect, it, beforeEach } from 'vitest';

import {
    isAnyDialogOpen,
    showAddAccountDialogStore,
    showComposerTargetDialogStore,
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
        showComposerTargetDialogStore.set(false);
        showDraftListDialogStore.set(false);
        showDraftLimitConfirmStore.set(false);
    });

    it('boolean dialog stores を set/get できる', () => {
        showLoginDialogStore.set(true);
        showAddAccountDialogStore.set(true);
        showDraftLimitConfirmStore.set(true);
        showComposerTargetDialogStore.set(true);

        expect(showLoginDialogStore.value).toBe(true);
        expect(showAddAccountDialogStore.value).toBe(true);
        expect(showDraftLimitConfirmStore.value).toBe(true);
        expect(showComposerTargetDialogStore.value).toBe(true);
    });

    it('いずれかの dialog が開いているか判定できる', () => {
        expect(isAnyDialogOpen()).toBe(false);

        showSettingsDialogStore.set(true);
        expect(isAnyDialogOpen()).toBe(true);

        showSettingsDialogStore.set(false);
        showDraftListDialogStore.set(true);
        expect(isAnyDialogOpen()).toBe(true);
    });
});
