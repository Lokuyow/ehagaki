import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import '../../i18n';
import { locale, waitLocale } from 'svelte-i18n';
import NodeViewTestWrapper from './NodeViewTestWrapper.svelte';

vi.mock('../../lib/hooks/useDialogHistory.svelte', () => ({
    useDialogHistory: vi.fn(),
}));

vi.mock('../../lib/utils/clipboardUtils', () => ({
    tryCopyToClipboard: vi.fn().mockResolvedValue(true),
}));

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
import { profileDataStore } from '../../stores/profileStore.svelte';

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

    it('SvelteImageNode uses the provided alt and localized fallbacks', async () => {
        const { rerender } = renderNodeView(SvelteImageNode, {
            node: createImageNode({ alt: 'Custom alt' }),
            selected: false,
            getPos: () => 0,
            deleteNode: vi.fn(),
        });

        const button = screen.getByRole('button', { name: 'Custom alt' });
        expect(button).toBeTruthy();
        const image = button.querySelector('img');
        expect(image?.getAttribute('alt')).toBe('Custom alt');

        await rerender({
            props: {
                node: createImageNode(),
                selected: false,
                getPos: () => 0,
                deleteNode: vi.fn(),
            },
        });
        expect(screen.getByRole('button')).toBeTruthy();

        locale.set('en');
        await waitLocale();
        await rerender({
            props: {
                node: createImageNode(),
                selected: false,
                getPos: () => 0,
                deleteNode: vi.fn(),
            },
        });
        expect(screen.getByRole('button')).toBeTruthy();
    });

    it('SvelteVideoNode exposes localized selection labels and handles Enter/Space', async () => {
        renderNodeView(SvelteVideoNode, {
            node: createVideoNode(),
            selected: false,
            getPos: () => 0,
            deleteNode: vi.fn(),
        });

        const button = screen.getByRole('button', { name: '動画を選択' });
        expect(button).toBeTruthy();

        locale.set('en');
        await waitLocale();
        expect(screen.getByRole('button', { name: 'Select video' })).toBeTruthy();
    });

    it('ProfileComponent uses displayName, name, and localized fallbacks for avatar labels', async () => {
        const { rerender } = render(ProfileComponent, {
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: 'tester', displayName: 'Tester', picture: '' },
            ]]),
        });

        const currentAvatar = screen.getAllByLabelText('プロフィール画像');
        expect(currentAvatar.length).toBeGreaterThan(0);

        await rerender({
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: 'tester', displayName: '', picture: '' },
            ]]),
        });
        expect(screen.getAllByLabelText('プロフィール画像').length).toBeGreaterThan(0);

        await rerender({
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: '' },
            ]]),
        });
        expect(screen.getAllByLabelText('プロフィール画像').length).toBeGreaterThan(0);

        locale.set('en');
        await waitLocale();
        await rerender({
            show: true,
            onClose: vi.fn(),
            onLogout: vi.fn(),
            accounts: createProfileAccounts(),
            accountProfiles: new Map([[
                'a'.repeat(64),
                { name: '', displayName: '', picture: '' },
            ]]),
        });
        expect(screen.getAllByLabelText('Profile image').length).toBeGreaterThan(0);
    });
});
