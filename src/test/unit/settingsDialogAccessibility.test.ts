import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { locale, waitLocale } from 'svelte-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const swStoreState = vi.hoisted(() => {
    const createStore = <T>(initialValue: T) => {
        let value = initialValue;
        const subscribers = new Set<(nextValue: T) => void>();
        return {
            subscribe(run: (nextValue: T) => void) {
                run(value);
                subscribers.add(run);
                return () => subscribers.delete(run);
            },
            set(nextValue: T) {
                value = nextValue;
                subscribers.forEach((subscriber) => subscriber(value));
            },
        };
    };

    return {
        swNeedRefresh: createStore(false),
        swUpdateStatus: createStore<'idle' | 'installing' | 'ready'>('idle'),
        dbUpgradeBlocked: createStore(false),
    };
});

const staleAssetState = vi.hoisted(() => ({
    required: false,
    promptRevision: 0,
    requestPrompt: vi.fn(),
}));

vi.mock('../../stores/swStore.svelte', () => ({
    ...swStoreState,
    swUpdateServiceWorker: vi.fn(),
    swVersionStore: { value: null, set: vi.fn() },
    handleSwUpdate: vi.fn(),
    fetchSwVersion: vi.fn(async () => null),
}));

vi.mock('../../stores/staleAssetReloadStore.svelte', () => ({
    staleAssetReloadState: {
        get required() {
            return staleAssetState.required;
        },
        get promptRevision() {
            return staleAssetState.promptRevision;
        },
    },
    requestStaleReloadPrompt: staleAssetState.requestPrompt,
}));

import '../../i18n';
import SettingsDialog from '../../components/SettingsDialog.svelte';
import SettingsCompressionSection from '../../components/settings/SettingsCompressionSection.svelte';
import {
    dbUpgradeBlocked,
    swNeedRefresh,
    swUpdateStatus,
} from '../../stores/swStore.svelte';

describe('SettingsDialog accessibility', () => {
    beforeEach(async () => {
        staleAssetState.required = false;
        staleAssetState.promptRevision = 0;
        staleAssetState.requestPrompt.mockReset();
        locale.set('ja');
        await waitLocale('ja');
    });

    it('圧縮ラジオグループが表示ラベルをアクセシブルネームとして持つ', async () => {
        render(SettingsCompressionSection, {
            props: {
                compressionPairs: [[{ value: 'high', label: '高' }]],
                selectedCompression: 'high',
                onCompressionChange: () => {},
                videoCompressionPairs: [[{ value: 'high', label: '高' }]],
                selectedVideoCompression: 'high',
                onVideoCompressionChange: () => {},
            },
        });

        await tick();

        expect(
            screen.getByRole('radiogroup', {
                name: '画像品質',
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('radiogroup', {
                name: '動画品質',
            }),
        ).toBeTruthy();
    });

    it('圧縮説明ボタンはロケールに応じた名前を持つ', async () => {
        render(SettingsCompressionSection, {
            props: {
                compressionPairs: [[{ value: 'high', label: '高' }]],
                selectedCompression: 'high',
                onCompressionChange: () => {},
                videoCompressionPairs: [[{ value: 'high', label: '高' }]],
                selectedVideoCompression: 'high',
                onVideoCompressionChange: () => {},
            },
        });

        await tick();

        expect(
            screen.getByRole('button', {
                name: '画像圧縮設定の説明',
            }),
        ).toBeTruthy();

        locale.set('en');
        await waitLocale('en');
        cleanup();
        render(SettingsCompressionSection, {
            props: {
                compressionPairs: [[{ value: 'high', label: 'High' }]],
                selectedCompression: 'high',
                onCompressionChange: () => {},
                videoCompressionPairs: [[{ value: 'high', label: 'High' }]],
                selectedVideoCompression: 'high',
                onVideoCompressionChange: () => {},
            },
        });
        await tick();

        expect(
            screen.getByRole('button', {
                name: 'Image compression settings description',
            }),
        ).toBeTruthy();
    });

    it('英語ロケールで通知説明ボタンが自然な英語名を持つ', async () => {
        locale.set('en');
        await waitLocale('en');
        cleanup();

        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        const quoteButton = screen.getByRole('button', {
            name: 'Quote notification settings description',
        });
        const replyButton = screen.getByRole('button', {
            name: 'Reply notification settings description',
        });

        expect(quoteButton).toBeTruthy();
        expect(replyButton).toBeTruthy();
        expect(quoteButton.getAttribute('aria-label')).not.toMatch(/[一-龯ぁ-んァ-ヶ]/);
        expect(replyButton.getAttribute('aria-label')).not.toMatch(/[一-龯ぁ-んァ-ヶ]/);
    });

    it('テーマと設定スイッチが表示ラベルをアクセシブルネームとして持つ', async () => {
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        const mediaFreePlacementLabel = document.body.querySelector(
            '#media-free-placement-label',
        )?.textContent?.trim();
        const hideMascotLabel = document.body.querySelector('#hide-mascot-label')
            ?.textContent?.trim();
        const hideFlavorTextLabel = document.body.querySelector(
            '#hide-flavor-text-label',
        )?.textContent?.trim();
        const quoteNotificationLabel = document.body.querySelector(
            '#quote-notification-label',
        )?.textContent?.trim();
        const replyNotificationLabel = document.body.querySelector(
            '#reply-notification-label',
        )?.textContent?.trim();

        expect(mediaFreePlacementLabel).toBeTruthy();
        expect(hideMascotLabel).toBeTruthy();
        expect(hideFlavorTextLabel).toBeTruthy();
        expect(quoteNotificationLabel).toBeTruthy();
        expect(replyNotificationLabel).toBeTruthy();

        const themeModeLabel = document.body.querySelector('#theme-mode-label')
            ?.textContent?.trim();

        expect(themeModeLabel).toBeTruthy();
        expect(
            screen.getByRole('radiogroup', {
                name: themeModeLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: mediaFreePlacementLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: hideMascotLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: hideFlavorTextLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: quoteNotificationLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: replyNotificationLabel,
            }),
        ).toBeTruthy();
        expect(
            screen.getByRole('switch', {
                name: /client name|クライアント名|Client tag/i,
            }),
        ).toBeTruthy();

        expect(
            document.body.querySelector('.help-icon')?.getAttribute('aria-hidden'),
        ).toBe('true');
        expect(
            document.body.querySelector('.github-icon')?.getAttribute('aria-hidden'),
        ).toBe('true');
        const rotateRightIcon = document.body.querySelector(
            '.sw-update-btn .rotate-right-icon',
        );
        if (rotateRightIcon) {
            expect(rotateRightIcon.getAttribute('aria-hidden')).toBe('true');
        }
        expect(
            document.body.querySelector('.lang-icon-btn')?.getAttribute('aria-hidden'),
        ).toBe('true');
        expect(
            document.body.querySelector('.xmark-icon')?.getAttribute('aria-hidden'),
        ).toBe('true');
    });

    it('英語ロケールでもテーマのラジオグループが表示ラベルに合わせて取得できる', async () => {
        locale.set('en');
        await waitLocale('en');

        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        expect(
            screen.getByRole('radiogroup', {
                name: 'Mode',
            }),
        ).toBeTruthy();
    });

    it('作者リンクとGitHubボタンの外部リンク属性が適切に設定される', async () => {
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        const authorLink = document.body.querySelector(
            'a[href="https://lokuyow.github.io/"]',
        );
        expect(authorLink?.getAttribute('rel')).toBe('noopener noreferrer');

        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

        const githubButton = screen.getByRole('button', {
            name: 'GitHub Repository',
        });
        fireEvent.click(githubButton);

        expect(openSpy).toHaveBeenCalledWith(
            'https://github.com/Lokuyow/ehagaki',
            '_blank',
            'noopener',
        );
    });

    it('DB blocked解除後は待機中のSW更新表示とボタンを復元する', async () => {
        swUpdateStatus.set('ready');
        dbUpgradeBlocked.set(true);
        swNeedRefresh.set(true);
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });
        await tick();

        expect(screen.getByText('settingsDialog.db_upgrade_blocked')).toBeTruthy();
        expect(document.body.querySelector('.sw-update-btn')?.hasAttribute('disabled')).toBe(true);

        dbUpgradeBlocked.set(false);
        await tick();

        expect(screen.getByText('A new update is available')).toBeTruthy();
        expect(document.body.querySelector('.sw-update-btn')?.hasAttribute('disabled')).toBe(false);

        swUpdateStatus.set('idle');
        swNeedRefresh.set(false);
        await tick();
        expect(screen.queryByText('A new update is available')).toBeNull();
    });

    it('stale中の更新ボタンは通常更新を呼ばずreload promptを要求する', async () => {
        staleAssetState.required = true;
        swUpdateStatus.set('ready');
        swNeedRefresh.set(true);
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });
        await tick();

        expect(screen.getByText('Reload to use the new version')).toBeTruthy();
        const reloadButton = screen.getByRole('button', { name: 'Reload' });
        await fireEvent.click(reloadButton);

        expect(staleAssetState.requestPrompt).toHaveBeenCalledOnce();
    });
});
