import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, waitFor } from '@testing-library/svelte';

import ImageFullscreen from '../../components/ImageFullscreen.svelte';

describe('ImageFullscreen', () => {
    afterEach(() => {
        cleanup();
        document.body.innerHTML = '';
        document.body.style.overflow = '';
    });

    it('show=true のとき fullscreen overlay を document.body へ移動する', async () => {
        const { container } = render(ImageFullscreen, {
            props: {
                show: true,
                src: 'https://example.com/test.jpg',
                alt: 'test image',
            },
        });

        await waitFor(() => {
            const overlay = document.body.querySelector('.fullscreen-overlay');
            expect(overlay).toBeTruthy();
            expect(overlay?.parentElement).toBe(document.body);
        });

        expect(document.body.style.overflow).toBe('hidden');
        expect(container.querySelector('.fullscreen-overlay')).toBeNull();
    });

    it('show=false に切り替えると fullscreen overlay を body から除去する', async () => {
        const { rerender } = render(ImageFullscreen, {
            props: {
                show: true,
                src: 'https://example.com/test.jpg',
                alt: 'test image',
            },
        });

        await waitFor(() => {
            expect(document.body.querySelector('.fullscreen-overlay')).toBeTruthy();
        });

        await rerender({
            show: false,
            src: 'https://example.com/test.jpg',
            alt: 'test image',
        });

        await waitFor(() => {
            expect(document.body.querySelector('.fullscreen-overlay')).toBeNull();
        });

        expect(document.body.style.overflow).toBe('');
    });
});