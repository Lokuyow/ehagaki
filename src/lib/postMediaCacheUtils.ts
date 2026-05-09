export type PostMediaKind = 'image' | 'video' | 'audio' | 'unknown';

export function normalizePostMediaUrl(url: string): string {
    const normalized = String(url ?? '').trim();
    if (!normalized) {
        return '';
    }

    try {
        const parsed = new URL(normalized);
        parsed.hash = '';
        return parsed.toString();
    } catch {
        return normalized.replace(/#.*$/, '');
    }
}

export function inferPostMediaKind(params: {
    url: string;
    mimeType?: string;
}): PostMediaKind {
    const mimeType = params.mimeType?.toLowerCase();
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType?.startsWith('video/')) return 'video';
    if (mimeType?.startsWith('audio/')) return 'audio';

    const pathname = (() => {
        try {
            return new URL(params.url).pathname.toLowerCase();
        } catch {
            return params.url.toLowerCase();
        }
    })();

    if (/\.(jpe?g|png|webp|gif|bmp|svg|avif)(?:$|[?#])/i.test(pathname)) {
        return 'image';
    }

    if (/\.(mp4|webm|mov|m4v|ogv)(?:$|[?#])/i.test(pathname)) {
        return 'video';
    }

    if (/\.(mp3|m4a|aac|ogg|oga|wav|flac)(?:$|[?#])/i.test(pathname)) {
        return 'audio';
    }

    return 'unknown';
}