import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { locale, waitLocale } from 'svelte-i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
import { settingsStore } from '../../stores/settingsStore.svelte';
import { themeColorStore } from '../../stores/themeColorStore.svelte';

describe('SettingsDialog accessibility', () => {
    beforeEach(async () => {
        staleAssetState.required = false;
        staleAssetState.promptRevision = 0;
        staleAssetState.requestPrompt.mockReset();
        locale.set('ja');
        await waitLocale('ja');
    });

    afterEach(() => {
        themeColorStore.reset();
        settingsStore.externalNostrClient = 'nostter';
        settingsStore.locale = 'en';
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

    it('外部クライアント設定のセレクトとカスタムURL validationを扱える', async () => {
        settingsStore.locale = 'ja';
        settingsStore.externalNostrClient = 'nostter';
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        const clientSelect = screen.getByRole('combobox', {
            name: '投稿を開くクライアント',
        }) as HTMLSelectElement;
        expect(Array.from(clientSelect.options).map((option) => option.text)).toEqual([
            'nostter',
            'Jumble',
            'Lumilumi',
            'Primal',
            'njump',
            'カスタム',
        ]);

        await fireEvent.change(clientSelect, { target: { value: 'custom' } });
        await tick();

        const customUrlInput = screen.getByLabelText('カスタムURL');
        expect(customUrlInput).toBeTruthy();
        await fireEvent.input(customUrlInput, {
            target: { value: 'http://example.com/{nevent}' },
        });
        expect(screen.getByRole('alert').textContent).toContain('HTTPS URL');

        await fireEvent.input(customUrlInput, {
            target: { value: 'https://example.com/note/{nevent}' },
        });
        expect(screen.queryByRole('alert')).toBeNull();
        expect(settingsStore.externalNostrClientCustomUrl).toBe(
            'https://example.com/note/{nevent}',
        );

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

    it('カラー入力は有効なHEXだけを即時反映し、標準へ戻せる', async () => {
        render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });
        await tick();

        const accentHex = document.querySelector('#accent-color-input') as HTMLInputElement;
        const accentPicker = accentHex.parentElement?.querySelector(
            'input[type="color"]',
        ) as HTMLInputElement;
        const basePicker = document.querySelector('#base-color-input')
            ?.parentElement?.querySelector('input[type="color"]') as HTMLInputElement;
        const baseHex = document.querySelector('#base-color-input') as HTMLInputElement;

        expect(accentHex).toBeTruthy();
        expect(accentPicker).toBeTruthy();
        expect(basePicker).toBeTruthy();

        await fireEvent.input(accentHex, { target: { value: 'ff0000' } });
        expect(document.documentElement.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
        expect(window.localStorage.getItem('accentColor')).toBe('#ff0000');
        expect(accentPicker.value).toBe('#ff0000');

        await fireEvent.input(accentHex, { target: { value: '#ff000' } });
        expect(document.documentElement.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
        expect(window.localStorage.getItem('accentColor')).toBe('#ff0000');
        expect(accentPicker.value).toBe('#ff0000');
        expect(screen.queryByRole('alert')).toBeNull();

        await fireEvent.blur(accentHex);
        expect(screen.getByRole('alert').textContent).toMatch(/6桁のHEXカラー|6-digit HEX/);

        await fireEvent.input(basePicker, { target: { value: '#0000ff' } });
        expect(document.documentElement.style.getPropertyValue('--base-color-user')).toBe('#0000ff');
        expect(window.localStorage.getItem('baseColor')).toBe('#0000ff');
        expect(baseHex.value).toBe('#0000ff');

        await fireEvent.input(baseHex, { target: { value: '#0000f' } });
        expect(document.documentElement.style.getPropertyValue('--base-color-user')).toBe('#0000ff');
        expect(window.localStorage.getItem('baseColor')).toBe('#0000ff');
        expect(basePicker.value).toBe('#0000ff');
        await fireEvent.blur(baseHex);
        expect(screen.getAllByRole('alert')).toHaveLength(2);
        expect(screen.getAllByRole('alert')[1].textContent).toMatch(/6桁のHEXカラー|6-digit HEX/);

        await fireEvent.input(accentHex, { target: { value: '' } });
        await fireEvent.blur(accentHex);
        expect(screen.getAllByRole('alert')).toHaveLength(2);
        expect(screen.getAllByRole('alert')[0].textContent).toMatch(/6桁のHEXカラー|6-digit HEX/);
        expect(document.documentElement.style.getPropertyValue('--accent-color-user')).toBe('#ff0000');
        expect(window.localStorage.getItem('accentColor')).toBe('#ff0000');
        expect(accentPicker.value).toBe('#ff0000');

        await fireEvent.click(screen.getByRole('button', { name: /標準に戻す|Reset to default/ }));
        expect(document.documentElement.style.getPropertyValue('--accent-color-user')).toBe('');
        expect(document.documentElement.style.getPropertyValue('--base-color-user')).toBe('');
        expect(window.localStorage.getItem('accentColor')).toBeNull();
        expect(window.localStorage.getItem('baseColor')).toBeNull();
        expect(baseHex.value).toBe('');
        expect(basePicker.value).toBe('#808080');
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

    it('DB blocked解除後は更新ボタンを復元し、状態ラベルを表示しない', async () => {
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

        const updateButton = document.body.querySelector('.sw-update-btn');
        expect(updateButton?.hasAttribute('disabled')).toBe(true);
        expect(document.body.querySelector('.sw-update-label')).toBeNull();
        expect(document.body.textContent).not.toContain('アプリの更新があります');
        expect(document.body.textContent).not.toContain('アプリの更新をインストール中です');

        dbUpgradeBlocked.set(false);
        await tick();

        expect(updateButton?.hasAttribute('disabled')).toBe(false);
        expect(document.body.textContent).not.toContain('A new update is available');

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

        const reloadButton = screen.getByRole('button', { name: 'Reload' });
        expect(document.body.querySelector('.sw-update-label')).toBeNull();
        await fireEvent.click(reloadButton);

        expect(staleAssetState.requestPrompt).toHaveBeenCalledOnce();
    });
});
