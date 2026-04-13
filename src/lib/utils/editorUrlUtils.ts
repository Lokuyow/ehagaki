import type { CleanUrlResult } from '../types';
import {
    ALLOWED_PROTOCOLS,
    ALLOWED_IMAGE_EXTENSIONS,
    ALLOWED_VIDEO_EXTENSIONS,
} from '../constants';

export function normalizeUrl(url: string): string {
    return encodeURI(url.trim());
}

export function isValidProtocol(protocol: string): boolean {
    return ALLOWED_PROTOCOLS.includes(protocol);
}

export function isValidImageExtension(pathname: string): boolean {
    const lower = pathname.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
}

export function isValidVideoExtension(pathname: string): boolean {
    const lower = pathname.toLowerCase();
    return ALLOWED_VIDEO_EXTENSIONS.some(ext => lower.endsWith(ext));
}

export function validateAndNormalizeUrl(url: string): string | null {
    try {
        const normalized = normalizeUrl(url);
        const u = new URL(normalized);
        if (!isValidProtocol(u.protocol)) return null;
        return u.href;
    } catch {
        return null;
    }
}

export function validateAndNormalizeImageUrl(url: string): string | null {
    const baseUrl = validateAndNormalizeUrl(url);
    if (!baseUrl) return null;

    try {
        const u = new URL(baseUrl);
        if (!isValidImageExtension(u.pathname)) return null;
        return baseUrl;
    } catch {
        return null;
    }
}

export function validateAndNormalizeVideoUrl(url: string): string | null {
    const baseUrl = validateAndNormalizeUrl(url);
    if (!baseUrl) return null;

    try {
        const u = new URL(baseUrl);
        if (!isValidVideoExtension(u.pathname)) return null;
        return baseUrl;
    } catch {
        return null;
    }
}

export function normalizeLineBreaks(text: string): string {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

export function isWordBoundary(char: string | undefined): boolean {
    return !char || /[\s\n\u3000]/.test(char);
}

export function extractTrailingPunctuation(url: string): {
    cleanUrl: string;
    trailingChars: string;
} {
    const trailingPattern = /([.,;:!?）】」』〉》】\]}>）]){2,}$/;
    const trailingMatch = url.match(trailingPattern);

    if (trailingMatch) {
        const trailingChars = trailingMatch[0];
        const cleanUrl = url.slice(0, -trailingChars.length);
        return { cleanUrl, trailingChars };
    }

    return { cleanUrl: url, trailingChars: '' };
}

export function cleanUrlEnd(url: string): CleanUrlResult {
    const { cleanUrl } = extractTrailingPunctuation(url);
    return { cleanUrl, actualLength: cleanUrl.length };
}