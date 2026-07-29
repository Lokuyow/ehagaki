import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { locale, waitLocale } from 'svelte-i18n';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../../i18n';
import SettingsDialog from '../../components/SettingsDialog.svelte';
import SettingsCompressionSection from '../../components/settings/SettingsCompressionSection.svelte';

describe('SettingsDialog accessibility', () => {
    beforeEach(async () => {
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
        const clientTagLabel = document.body.querySelector('#client-tag-label')
            ?.textContent?.trim();

        expect(
            screen.getByRole('radiogroup', {
                name: 'カラーテーマ',
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
});
