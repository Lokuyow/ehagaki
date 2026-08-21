import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import '../../i18n';
import { locale, waitLocale } from 'svelte-i18n';
import NodeViewTestWrapper from './NodeViewTestWrapper.svelte';

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/utils/clipboardUtils', () => ({
    tryCopyToClipboard: vi.fn().mockResolvedValue(true),
}));

vi.mock('../../lib/profilePictureUrlUtils', async () => {
    const actual = await vi.importActual<typeof import('../../lib/profilePictureUrlUtils')>(
        '../../lib/profilePictureUrlUtils',
    );

    return {
        ...actual,
        ensureProfilePictureMarker: vi.fn((url: string) => url || ''),
        isSameOriginProfilePictureUrl: vi.fn(() => true),
    };
});

vi.mock('../../lib/utils/mediaNodeUtils', async () => {
    const actual = await vi.importActual<typeof import('../../lib/utils/mediaNodeUtils')>(
        '../../lib/utils/mediaNodeUtils',
    );

    return {
        ...actual,
        handleImageInteraction: vi.fn(actual.handleImageInteraction),
        requestNodeSelection: vi.fn(actual.requestNodeSelection),
    };
});

vi.mock('../../lib/keyManager.svelte', () => ({
    PublicKeyState: class MockPublicKeyState {
        private valid = false;
        private npubValue = '';
        private nprofileValue = '';

        setNsec(value: string) {
            this.valid = value.startsWith('nsec1');
            this.npubValue = this.valid ? 'npub1test' : '';
            this.nprofileValue = this.valid ? 'nprofile1test' : '';
        }

        get isValid() {
            return this.valid;
        }

        get npub() {
            return this.npubValue;
        }

        get nprofile() {
            return this.nprofileValue;
        }
    },
}));

import PostComponent from '../../components/PostComponent.svelte';
import SvelteImageNode from '../../components/SvelteImageNode.svelte';
import SvelteVideoNode from '../../components/SvelteVideoNode.svelte';
import ProfileComponent from '../../components/ProfileComponent.svelte';
import { authState } from '../../stores/authStore.svelte';
import { currentEditorStore, editorState, resetEditorState, resetPostStatus, updatePostStatus } from '../../stores/editorStore.svelte';
import { isLoadingProfileStore, profileDataStore, profileLoadedStore } from '../../stores/profileStore.svelte';
import { handleImageInteraction, requestNodeSelection } from '../../lib/utils/mediaNodeUtils';

function createImageNode(attrs: Record<string, unknown> = {}) {
    return {
        type: 'image',
        attrs: {
            src: 'https://example.com/image.png',
            ...attrs,
        },
    };
}

function createVideoNode(attrs: Record<string, unknown> = {}) {
    return {
        type: 'video',
        attrs: {
            src: 'https://example.com/video.mp4',
            ...attrs,
        },
    };
}

function renderNodeView(component: any, props: Record<string, unknown>) {
    return render(NodeViewTestWrapper, {
        props: {
            component,
            props,
        },
    } as any);
}

function createProfileAccounts() {
    return [{ pubkeyHex: 'a'.repeat(64), type: 'nip46' as const, addedAt: Date.now() }];
}

describe('accessibility component tests', () => {
    beforeEach(async () => {
        locale.set('ja');
        await waitLocale();
        (authState as any).value = {
            ...authState.value,
            isAuthenticated: true,
            type: 'nip46',
            pubkey: 'a'.repeat(64),
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: '',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
        (profileLoadedStore as any).value = false;
        (isLoadingProfileStore as any).value = false;
        resetEditorState();
    });

    it('PostComponent exposes localized editor aria-label in Japanese and English', async () => {
        const { rerender } = render(PostComponent, {
            hasStoredKey: false,
        });

        expect(screen.getByRole('textbox', { name: '投稿エディター' })).toBeTruthy();

        await rerender({ hasStoredKey: false });
        locale.set('en');
        await waitLocale();

        expect(screen.getByRole('textbox', { name: 'Post editor' })).toBeTruthy();
    });

    it('shows the active account avatar only while the editor is empty', async () => {
        (profileDataStore as any).value = {
            name: 'current-name',
            displayName: 'Current display',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
        (profileLoadedStore as any).value = true;

        const { container } = render(PostComponent, { hasStoredKey: true });
        const editor = await waitFor(() => {
            const instance = currentEditorStore.value;
            if (!instance) throw new Error('Editor was not initialized');
            return instance;
        });
        const avatarPlaceholder = container.querySelector('.editor-account-placeholder');

        expect(avatarPlaceholder).toBeTruthy();
        expect(avatarPlaceholder?.querySelector('img')?.getAttribute('src')).toBe(
            'https://example.com/current.png',
        );
        expect(container.querySelector('.tiptap-editor p')?.getAttribute('data-placeholder')).toBe(
            'いまどうしてる？',
        );

        editor.commands.insertContent('本文');
        await waitFor(() => {
            expect(container.querySelector('.editor-account-placeholder')).toBeNull();
        });
        expect(JSON.stringify(editor.getJSON())).not.toContain('current.png');

        editor.commands.clearContent();
        await waitFor(() => {
            expect(container.querySelector('.editor-account-placeholder')).toBeTruthy();
        });
    });

    it('does not show the avatar when unauthenticated or while switching accounts', async () => {
        (profileDataStore as any).value = {
            name: 'current-name',
            displayName: 'Current display',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };
        (profileLoadedStore as any).value = true;

        const { container, rerender } = render(PostComponent, { hasStoredKey: false });
        await waitFor(() => expect(currentEditorStore.value).toBeTruthy());
        expect(container.querySelector('.editor-account-placeholder')).toBeNull();

        await rerender({ hasStoredKey: true, isSwitchingAccount: true });
        expect(container.querySelector('.editor-account-placeholder')).toBeNull();
    });

    it('uses the latest profile store value after the active account changes', async () => {
        (profileDataStore as any).value = {
            name: 'first-name',
            displayName: 'First display',
            picture: 'https://example.com/first.png',
            npub: 'npub1first',
            nprofile: 'nprofile1first',
        };
        (profileLoadedStore as any).value = true;

        const { container, unmount } = render(PostComponent, { hasStoredKey: true });
        await waitFor(() => expect(container.querySelector('.editor-account-placeholder')).toBeTruthy());
        expect(container.querySelector('.editor-account-placeholder img')?.getAttribute('src')).toBe(
            'https://example.com/first.png',
        );

        (profileDataStore as any).value = {
            name: 'second-name',
            displayName: 'Second display',
            picture: 'https://example.com/second.png',
            npub: 'npub1second',
            nprofile: 'nprofile1second',
        };
        unmount();
        cleanup();
        const { container: nextContainer } = render(PostComponent, { hasStoredKey: true });

        expect(nextContainer.querySelector('.editor-account-placeholder img')?.getAttribute('src')).toBe(
            'https://example.com/second.png',
        );
    });

    it('makes the editor read-only only while a post is sending', async () => {
        resetPostStatus();
        const { component, unmount } = render(PostComponent, {
            hasStoredKey: true,
        });
        const editorContainer = screen.getByRole('textbox', { name: '投稿エディター' });
        const tiptapEditor = await waitFor(() => {
            const element = editorContainer.querySelector<HTMLElement>('.tiptap-editor');
            if (!element || !currentEditorStore.value) {
                throw new Error('Editor was not initialized');
            }
            return element;
        });
        const editor = currentEditorStore.value!;
        editor.commands.setContent('<p>送信中も確認できる本文</p>', { emitUpdate: false });
        const updateListener = vi.fn();
        editor.on('update', updateListener);

        expect(editor.isEditable).toBe(true);
        expect(tiptapEditor.getAttribute('contenteditable')).toBe('true');
        expect(editorContainer.classList.contains('sending')).toBe(false);

        updatePostStatus({ ...editorState.postStatus, sending: true });
        await tick();

        expect(editor.isEditable).toBe(false);
        expect(tiptapEditor.getAttribute('contenteditable')).toBe('false');
        expect(editorContainer.classList.contains('sending')).toBe(true);
        expect(editorContainer.getAttribute('aria-disabled')).toBe('true');
        expect(editorContainer.textContent).toContain('送信中も確認できる本文');
        expect(updateListener).not.toHaveBeenCalled();

        const contentBeforeInput = editor.getJSON();
        await fireEvent.input(tiptapEditor, {
            inputType: 'insertText',
            data: '変更不可',
        });
        expect(editor.getJSON()).toEqual(contentBeforeInput);

        (component as any).insertCustomEmoji({
            identityKey: 'test\u0000https://example.com/test.webp',
            shortcode: 'test',
            src: 'https://example.com/test.webp',
            setAddress: null,
        });
        expect(editor.getJSON()).toEqual(contentBeforeInput);

        updatePostStatus({ ...editorState.postStatus, sending: false });
        await tick();

        expect(editor.isEditable).toBe(true);
        expect(tiptapEditor.getAttribute('contenteditable')).toBe('true');
        expect(editorContainer.classList.contains('sending')).toBe(false);
        expect(editorContainer.getAttribute('aria-disabled')).toBeNull();

        unmount();
        resetPostStatus();
    });

    it('SvelteImageNode uses the provided alt and localized fallbacks', async () => {
        const { unmount } = renderNodeView(SvelteImageNode, {
            node: createImageNode({ alt: 'Custom alt' }),
            selected: false,
            getPos: () => 0,
            deleteNode: vi.fn(),
        });

        const button = screen.getByRole('button', { name: 'Custom alt' });
        expect(button).toBeTruthy();
        const image = button.querySelector('img');
        expect(image?.getAttribute('alt')).toBe('Custom alt');

        vi.mocked(handleImageInteraction).mockClear();
        await fireEvent.click(button);
        const customAltCall = vi.mocked(handleImageInteraction).mock.calls.at(-1);
        expect(customAltCall?.[7]).toBe('Custom alt');

        unmount();
        cleanup();
        renderNodeView(SvelteImageNode, {
            node: createImageNode(),
            selected: false,
            getPos: () => 0,
            deleteNode: vi.fn(),
        });

        const japaneseButton = screen.getByRole('button', { name: '画像' });
        expect(japaneseButton).toBeTruthy();
        const japaneseImage = japaneseButton.querySelector('img');
        expect(japaneseImage?.getAttribute('alt')).toBe('画像');

        vi.mocked(handleImageInteraction).mockClear();
        await fireEvent.click(japaneseButton);
        const japaneseFallbackCall = vi.mocked(handleImageInteraction).mock.calls.at(-1);
        expect(japaneseFallbackCall?.[7]).toBe('画像');

        locale.set('en');
        await waitLocale();
        cleanup();
        const { unmount: unmountEnglish } = renderNodeView(SvelteImageNode, {
            node: createImageNode(),
            selected: false,
            getPos: () => 0,
            deleteNode: vi.fn(),
        });

        const englishButton = screen.getByRole('button', { name: 'Image' });
        expect(englishButton).toBeTruthy();
        const englishImage = englishButton.querySelector('img');
        expect(englishImage?.getAttribute('alt')).toBe('Image');

        vi.mocked(handleImageInteraction).mockClear();
        await fireEvent.click(englishButton);
        const englishFallbackCall = vi.mocked(handleImageInteraction).mock.calls.at(-1);
        expect(englishFallbackCall?.[7]).toBe('Image');

        unmountEnglish();
    });

    it('SvelteVideoNode exposes localized selection labels and handles Enter/Space', async () => {
        const getPos = () => 21;
        renderNodeView(SvelteVideoNode, {
            node: createVideoNode(),
            selected: false,
            getPos,
            deleteNode: vi.fn(),
        });

        const button = screen.getByRole('button', { name: '動画を選択' });
        expect(button).toBeTruthy();

        vi.mocked(requestNodeSelection).mockClear();
        await fireEvent.keyDown(button, { key: 'Enter' });
        expect(vi.mocked(requestNodeSelection)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(requestNodeSelection).mock.calls[0]?.[0]()).toBe(21);

        vi.mocked(requestNodeSelection).mockClear();
        await fireEvent.keyDown(button, { key: ' ' });
        expect(vi.mocked(requestNodeSelection)).toHaveBeenCalledTimes(1);
        expect(vi.mocked(requestNodeSelection).mock.calls[0]?.[0]()).toBe(21);

        locale.set('en');
        await waitLocale();
        expect(screen.getByRole('button', { name: 'Select video' })).toBeTruthy();
    });

    it('ProfileComponent uses displayName, name, and localized fallbacks for avatar alt text', async () => {
        (profileDataStore as any).value = {
            name: 'current-name',
            displayName: 'Current display',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: 'list-name', displayName: 'List display', picture: 'https://example.com/list.png' },
            ]]),
        });
        await tick();

        expect(screen.getByAltText('Current display')).toBeTruthy();
        expect(screen.getByAltText('List display')).toBeTruthy();

        (profileDataStore as any).value = {
            name: 'current-name',
            displayName: '',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: 'list-name', displayName: '', picture: 'https://example.com/list.png' },
            ]]),
        });
        await tick();

        expect(screen.getByAltText('current-name')).toBeTruthy();
        expect(screen.getByAltText('list-name')).toBeTruthy();

        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: 'https://example.com/list.png' },
            ]]),
        });
        await tick();

        expect(screen.getAllByAltText('プロフィール')).toHaveLength(2);

        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: '',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: '' },
            ]]),
        });
        await tick();

        expect(screen.getAllByLabelText('プロフィール画像')).toHaveLength(2);

        locale.set('en');
        await waitLocale();
        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: 'https://example.com/current.png',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: 'https://example.com/list.png' },
            ]]),
        });
        await tick();
        expect(screen.getAllByAltText('Profile')).toHaveLength(2);

        (profileDataStore as any).value = {
            name: '',
            displayName: '',
            picture: '',
            npub: 'npub1testprofile',
            nprofile: 'nprofile1testprofile',
        };

        cleanup();
        render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: '' },
            ]]),
        });
        await tick();
        expect(screen.getAllByLabelText('Profile image')).toHaveLength(2);
    });
});
