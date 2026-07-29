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

    it('設定スイッチが表示ラベルをアクセシブルネームとして持つ', async () => {
        const { container } = render(SettingsDialog, {
            props: {
                show: true,
                onClose: () => {},
            },
        });

        await tick();

        expect(document.body.querySelector('#media-free-placement-label')).not.toBeNull();
        expect(document.body.querySelector('#hide-mascot-label')).not.toBeNull();
        expect(document.body.querySelector('#hide-flavor-text-label')).not.toBeNull();
        expect(document.body.querySelector('#quote-notification-label')).not.toBeNull();
        expect(document.body.querySelector('#reply-notification-label')).not.toBeNull();
        expect(document.body.querySelector('#client-tag-label')).not.toBeNull();

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
        const { container } = render(SettingsDialog, {
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
