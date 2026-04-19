import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { readable } from 'svelte/store';
import type { NostrEvent, ReplyQuoteState } from '../../lib/types';

const mockTranslate = vi.hoisted(() => (key: string) => {
    const translations: Record<string, string> = {
        'replyQuote.reply_label': 'リプライ',
        'replyQuote.quote_label': '引用',
        'replyQuote.expand': '展開する',
        'replyQuote.collapse': '折りたたむ',
        'replyQuote.cancel': 'リプライ/引用を取り消す',
        'replyQuote.loading': '読み込み中...',
        'replyQuote.fetch_error': '取得に失敗しました',
    };

    return translations[key] || key;
});

vi.mock('svelte-i18n', () => ({
    _: readable(mockTranslate),
}));

import ReplyQuotePreview from '../../components/ReplyQuotePreview.svelte';

function createReferencedEvent(content: string): NostrEvent {
    return {
        id: '11'.repeat(32),
        pubkey: '22'.repeat(32),
        created_at: 1,
        kind: 1,
        tags: [],
        content,
        sig: '33'.repeat(32),
    };
}

function createReference(overrides: Partial<ReplyQuoteState> = {}): ReplyQuoteState {
    return {
        mode: 'quote',
        eventId: '44'.repeat(32),
        relayHints: ['wss://relay.example.com'],
        authorPubkey: '55'.repeat(32),
        authorDisplayName: null,
        referencedEvent: null,
        rootEventId: null,
        rootRelayHint: null,
        rootPubkey: null,
        loading: false,
        error: null,
        ...overrides,
    };
}

describe('ReplyQuotePreview', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('loading は少し遅れて header 内に表示する', async () => {
        vi.useFakeTimers();

        const { container } = render(ReplyQuotePreview, {
            props: {
                reference: createReference({ loading: true }),
                mode: 'quote',
                onClear: vi.fn(),
            },
        });

        expect(container.querySelector('.preview-header .preview-status')).toBeNull();

        await vi.advanceTimersByTimeAsync(149);
        expect(container.querySelector('.preview-header .preview-status')).toBeNull();

        await vi.advanceTimersByTimeAsync(1);

        expect(container.querySelector('.preview-header .loading-status')).toBeTruthy();
        expect(screen.getByText('読み込み中...')).toBeTruthy();
    });

    it('error は header 内に即時表示する', () => {
        const { container } = render(ReplyQuotePreview, {
            props: {
                reference: createReference({
                    loading: false,
                    error: 'Event not found',
                }),
                mode: 'quote',
                onClear: vi.fn(),
            },
        });

        expect(container.querySelector('.preview-header .error-status')).toBeTruthy();
        expect(screen.getByText('取得に失敗しました')).toBeTruthy();
    });

    it('本文は展開後にだけ表示する', async () => {
        render(ReplyQuotePreview, {
            props: {
                reference: createReference({
                    authorDisplayName: 'Alice',
                    referencedEvent: createReferencedEvent('hello <b>nostr</b> world'),
                }),
                mode: 'quote',
                onClear: vi.fn(),
            },
        });

        expect(screen.queryByText('hello nostr world')).toBeNull();

        await fireEvent.click(screen.getByRole('button', { name: '展開する' }));

        expect(screen.getByText('hello nostr world')).toBeTruthy();
    });
});
