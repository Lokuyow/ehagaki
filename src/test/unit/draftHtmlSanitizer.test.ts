import { describe, expect, it } from 'vitest';

import {
    createSanitizedDraftContainer,
    sanitizeDraftHtml,
} from '../../lib/draftHtmlSanitizer';

describe('draftHtmlSanitizer', () => {
    it('script と unsafe href/src を除去し valid URL のみ残す', () => {
        const sanitized = sanitizeDraftHtml([
            '<p>Hello</p>',
            '<script>alert(1)</script>',
            '<a href="javascript:alert(1)">bad-link</a>',
            '<a href="https://example.com/path">good-link</a>',
            '<img src="javascript:alert(2)">',
            '<img src="https://example.com/media">',
            '<video src="data:text/html,<svg></svg>"></video>',
            '<video src="https://example.com/video"></video>',
        ].join(''));

        expect(sanitized).toContain('<p>Hello</p>');
        expect(sanitized).toContain('bad-link');
        expect(sanitized).toContain('href="https://example.com/path"');
        expect(sanitized).toContain('src="https://example.com/media"');
        expect(sanitized).toContain('src="https://example.com/video"');
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('data:text/html');
    });

    it('container では invalid media node が除去される', () => {
        const container = createSanitizedDraftContainer([
            '<img src="javascript:alert(1)">',
            '<img src="https://example.com/image">',
            '<video src="data:text/html,<svg></svg>"></video>',
            '<video src="https://example.com/video"></video>',
        ].join(''));

        expect(container.querySelectorAll('img')).toHaveLength(1);
        expect(container.querySelectorAll('video')).toHaveLength(1);
        expect(container.querySelector('img')?.getAttribute('src')).toBe('https://example.com/image');
        expect(container.querySelector('video')?.getAttribute('src')).toBe('https://example.com/video');
    });

    it('カスタム絵文字の復元に必要な属性を保持する', () => {
        const sanitized = sanitizeDraftHtml([
            '<p>',
            '<img src="https://example.com/emoji.webp" data-custom-emoji="true" data-shortcode="blobcat" data-set-address="30023:pubkey:set" alt=":blobcat:" class="custom-emoji-inline">',
            '</p>',
        ].join(''));

        expect(sanitized).toContain('data-custom-emoji="true"');
        expect(sanitized).toContain('data-shortcode="blobcat"');
        expect(sanitized).toContain('data-set-address="30023:pubkey:set"');
        expect(sanitized).toContain('class="custom-emoji-inline"');
        expect(sanitized).toContain('alt=":blobcat:"');
    });
});
