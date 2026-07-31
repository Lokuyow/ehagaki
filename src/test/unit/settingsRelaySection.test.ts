import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import '../../i18n';
import { locale, waitLocale } from 'svelte-i18n';

const mockTryCopyToClipboard = vi.hoisted(() => vi.fn());

vi.mock('../../lib/utils/clipboardUtils', () => ({
    tryCopyToClipboard: mockTryCopyToClipboard,
}));

import SettingsRelaySection from '../../components/settings/SettingsRelaySection.svelte';

describe('SettingsRelaySection', () => {
    beforeEach(async () => {
        mockTryCopyToClipboard.mockReset();
        mockTryCopyToClipboard.mockResolvedValue(true);
        locale.set('ja');
        await waitLocale();
    });

    afterEach(() => {
        cleanup();
    });

    it('showRelays=falseでは一覧とコピーボタンが表示されない', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: false,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        expect(screen.queryByText('wss://relay.example.com/')).toBeNull();
        expect(
            screen.queryByRole('button', { name: /リレーURLをコピー/ }),
        ).toBeNull();
    });

    it('配列形式のrelayConfigが正規化されて表示される', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com', 'wss://relay2.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        expect(screen.getByText('wss://relay.example.com/')).toBeTruthy();
        expect(screen.getByText('wss://relay2.example.com/')).toBeTruthy();
    });

    it('オブジェクト形式のrelayConfigでRead／Write状態が維持される', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: {
                    'wss://relay.example.com': { read: true, write: false },
                    'wss://relay2.example.com': { read: false, write: true },
                },
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        const relayRow = screen
            .getByText('wss://relay.example.com/')
            .closest('li') as HTMLLIElement;

        expect(relayRow.querySelector('span[aria-label="Read有効"]')).toBeTruthy();
        expect(relayRow.querySelector('span[aria-label="Write無効"]')).toBeTruthy();
    });

    it('各リレー行にコピーボタンが1つずつ表示される', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com', 'wss://relay2.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        expect(
            screen.getAllByRole('button', { name: /リレーURLをコピー:/ }).length,
        ).toBe(2);
    });

    it('コピーボタンのアクセシブルネームに対象URLが含まれる', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        expect(
            screen.getByRole('button', {
                name: 'リレーURLをコピー: wss://relay.example.com/',
            }),
        ).toBeTruthy();
    });

    it('ボタン押下でtryCopyToClipboardへ正規化済みURLが渡される', async () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        await fireEvent.click(
            screen.getByRole('button', {
                name: 'リレーURLをコピー: wss://relay.example.com/',
            }),
        );

        expect(mockTryCopyToClipboard).toHaveBeenCalledWith(
            'wss://relay.example.com/',
            'URL',
            navigator,
            window,
        );
    });

    it('コピー成功時に成功メッセージが表示される', async () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        await fireEvent.click(
            screen.getByRole('button', {
                name: 'リレーURLをコピー: wss://relay.example.com/',
            }),
        );

        expect(screen.getByText('コピーしました')).toBeTruthy();
    });

    it('コピー失敗時に成功メッセージが表示されない', async () => {
        mockTryCopyToClipboard.mockResolvedValue(false);

        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        await fireEvent.click(
            screen.getByRole('button', {
                name: 'リレーURLをコピー: wss://relay.example.com/',
            }),
        );

        expect(screen.queryByText('コピーしました')).toBeNull();
    });

    it('一覧開閉ボタンがonToggleShowRelaysを呼ぶ', async () => {
        const onToggleShowRelays = vi.fn();

        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: false,
                onToggleShowRelays,
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        await fireEvent.click(
            screen.getByRole('button', { name: 'リレーリストの表示切替' }),
        );

        expect(onToggleShowRelays).toHaveBeenCalledTimes(1);
    });

    it('再取得ボタンがonRefreshRelaysAndProfileを呼ぶ', async () => {
        const onRefreshRelaysAndProfile = vi.fn();

        render(SettingsRelaySection, {
            props: {
                relayConfig: ['wss://relay.example.com'],
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile,
            },
        });

        await fireEvent.click(
            screen.getByRole('button', { name: /リレーリスト・プロフィール/ }),
        );

        expect(onRefreshRelaysAndProfile).toHaveBeenCalledTimes(1);
    });

    it('relayConfigがnullの場合に既存の空表示が維持される', () => {
        render(SettingsRelaySection, {
            props: {
                relayConfig: null,
                showRelays: true,
                onToggleShowRelays: vi.fn(),
                onRefreshRelaysAndProfile: vi.fn(),
            },
        });

        expect(screen.getByText('リレー情報なし')).toBeTruthy();
        expect(
            screen.queryByRole('button', { name: /リレーURLをコピー/ }),
        ).toBeNull();
    });
});
