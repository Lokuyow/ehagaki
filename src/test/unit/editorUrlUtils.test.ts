import { describe, it, expect } from 'vitest';
import {
    cleanUrlEnd,
    extractTrailingPunctuation,
    isValidImageExtension,
    isValidProtocol,
    isValidVideoExtension,
    isWordBoundary,
    normalizeUrl,
    validateAndNormalizeImageUrl,
    validateAndNormalizeUrl,
    validateAndNormalizeVideoUrl,
} from '../../lib/utils/editorUrlUtils';

describe('editorUrlUtils', () => {
    describe('URL検証・正規化', () => {
        it('should trim and encode URL', () => {
            expect(normalizeUrl('  https://example.com  ')).toBe('https://example.com');
            expect(normalizeUrl('https://example.com/パス')).toBe('https://example.com/%E3%83%91%E3%82%B9');
        });

        it('should validate allowed protocols', () => {
            expect(isValidProtocol('https:')).toBe(true);
            expect(isValidProtocol('http:')).toBe(true);
            expect(isValidProtocol('ftp:')).toBe(false);
            expect(isValidProtocol('javascript:')).toBe(false);
        });

        it('should validate image extensions', () => {
            expect(isValidImageExtension('/image.jpg')).toBe(true);
            expect(isValidImageExtension('/image.PNG')).toBe(true);
            expect(isValidImageExtension('/image.webp')).toBe(true);
            expect(isValidImageExtension('/document.pdf')).toBe(false);
        });

        it('should validate video extensions', () => {
            expect(isValidVideoExtension('/video.mp4')).toBe(true);
            expect(isValidVideoExtension('/video.MKV')).toBe(true);
            expect(isValidVideoExtension('/document.pdf')).toBe(false);
        });

        it('should validate and normalize valid URLs', () => {
            expect(validateAndNormalizeUrl('https://example.com')).toBe('https://example.com/');
            expect(validateAndNormalizeUrl('http://example.com/path')).toBe('http://example.com/path');
        });

        it('should return null for invalid URLs', () => {
            expect(validateAndNormalizeUrl('ftp://example.com')).toBe(null);
            expect(validateAndNormalizeUrl('invalid-url')).toBe(null);
            expect(validateAndNormalizeUrl('')).toBe(null);
        });

        it('should validate image URLs', () => {
            expect(validateAndNormalizeImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
            expect(validateAndNormalizeImageUrl('https://example.com/image.PNG')).toBe('https://example.com/image.PNG');
        });

        it('should preserve query strings for image URLs', () => {
            expect(
                validateAndNormalizeImageUrl(' https://example.com/フォルダ/image.PNG?token=abc '),
            ).toBe('https://example.com/%E3%83%95%E3%82%A9%E3%83%AB%E3%83%80/image.PNG?token=abc');
        });

        it('should validate video URLs', () => {
            expect(validateAndNormalizeVideoUrl('https://example.com/video.mp4')).toBe('https://example.com/video.mp4');
            expect(validateAndNormalizeVideoUrl('https://example.com/video.MKV')).toBe('https://example.com/video.MKV');
        });

        it('should preserve query strings for video URLs', () => {
            expect(validateAndNormalizeVideoUrl('https://example.com/video.webm?quality=hd')).toBe(
                'https://example.com/video.webm?quality=hd',
            );
        });

        it('should return null for non-image URLs', () => {
            expect(validateAndNormalizeImageUrl('https://example.com/document.pdf')).toBe(null);
            expect(validateAndNormalizeImageUrl('https://example.com')).toBe(null);
        });

        it('should return null for non-video URLs', () => {
            expect(validateAndNormalizeVideoUrl('https://example.com/image.jpg')).toBe(null);
            expect(validateAndNormalizeVideoUrl('ftp://example.com/video.mp4')).toBe(null);
        });
    });

    describe('文字列処理', () => {
        it('should detect word boundaries', () => {
            expect(isWordBoundary(' ')).toBe(true);
            expect(isWordBoundary('\n')).toBe(true);
            expect(isWordBoundary('\u3000')).toBe(true);
            expect(isWordBoundary(undefined)).toBe(true);
            expect(isWordBoundary('a')).toBe(false);
        });

        it('should extract trailing punctuation', () => {
            expect(extractTrailingPunctuation('https://example.com...')).toEqual({
                cleanUrl: 'https://example.com',
                trailingChars: '...',
            });
            expect(extractTrailingPunctuation('https://example.com')).toEqual({
                cleanUrl: 'https://example.com',
                trailingChars: '',
            });
        });

        it('should clean URL end and return length', () => {
            const result = cleanUrlEnd('https://example.com...');
            expect(result.cleanUrl).toBe('https://example.com');
            expect(result.actualLength).toBe('https://example.com'.length);
        });
    });
});