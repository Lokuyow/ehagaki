import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'channelComposer.selected_label': 'チャンネル',
        'channelComposer.expand': 'チャンネル情報を展開',
        'channelComposer.collapse': 'チャンネル情報を折りたたむ',
        'channelComposer.clear': 'チャンネル選択を解除',
        'channelComposer.loading': 'チャンネル情報を読み込み中...',
        'channelComposer.unnamed': '名称未設定チャンネル',
        'channelComposer.relays_label': 'リレー',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

import ChannelContextPreview from '../../components/ChannelContextPreview.svelte';

function createChannel(overrides: Partial<{
    eventId: string;
    relayHints: string[];
    name: string | null;
    about: string | null;
    picture: string | null;
    isMetadataLoading: boolean;
}> = {}) {
    return {
        eventId: '11'.repeat(32),
        relayHints: ['wss://channel-relay.example.com'],
        name: 'General',
        about: 'General discussion',
        picture: 'https://example.com/channel.png',
        isMetadataLoading: false,
        ...overrides,
    };
}

describe('ChannelContextPreview', () => {
    it('channel 名を表示し、展開で metadata を見せる', async () => {
        render(ChannelContextPreview, {
            props: {
                channel: createChannel(),
                onClear: vi.fn(),
            },
        });

        expect(screen.getByText('General')).toBeTruthy();
        expect(screen.queryByText('General discussion')).toBeNull();

        await fireEvent.click(screen.getByRole('button', { name: 'チャンネル情報を展開' }));

        expect(screen.getByText('General discussion')).toBeTruthy();
        expect(screen.getByText('リレー')).toBeTruthy();
        expect(screen.getByText('wss://channel-relay.example.com')).toBeTruthy();
        expect(screen.queryByText('チャンネルイベント')).toBeNull();
    });

    it('clear ボタンで onClear を呼ぶ', async () => {
        const onClear = vi.fn();

        render(ChannelContextPreview, {
            props: {
                channel: createChannel(),
                onClear,
            },
        });

        await fireEvent.click(screen.getByRole('button', { name: 'チャンネル選択を解除' }));

        expect(onClear).toHaveBeenCalledOnce();
    });

    it('metadata 読み込み中は header を先に表示して loading を明記する', async () => {
        const { container } = render(ChannelContextPreview, {
            props: {
                channel: createChannel({
                    name: null,
                    about: null,
                    picture: null,
                    relayHints: [],
                    isMetadataLoading: true,
                }),
                onClear: vi.fn(),
            },
        });

        expect(screen.getByText('チャンネル情報を読み込み中...')).toBeTruthy();
        expect(container.querySelector('.channel-loading-inline')).toBeTruthy();

        await fireEvent.click(screen.getByRole('button', { name: 'チャンネル情報を展開' }));

        expect(container.querySelector('.channel-loading-block')).toBeTruthy();
    });
});