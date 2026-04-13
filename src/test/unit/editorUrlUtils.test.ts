import { describe, it, expect, vi } from 'vitest';
import {
    cleanUrlEnd,
    extractTrailingPunctuation,
    isValidImageExtension,
    isValidProtocol,
    isWordBoundary,
    normalizeUrl,
    validateAndNormalizeImageUrl,
    validateAndNormalizeUrl,
} from '../../lib/utils/editorUrlUtils';

vi.mock('../../constants', () => ({
    ALLOWED_PROTOCOLS: ['http:', 'https:'],
    ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    ALLOWED_VIDEO_EXTENSIONS: ['.mp4', '.webm', '.mov'],
}));

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

        it('should return null for non-image URLs', () => {
            expect(validateAndNormalizeImageUrl('https://example.com/document.pdf')).toBe(null);
            expect(validateAndNormalizeImageUrl('https://example.com')).toBe(null);
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