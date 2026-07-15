import type { SharedMediaData } from './types';

export function getSharedFormDataString(formData: FormData, name: string): string {
    const value = formData.get(name);
    return typeof value === 'string' ? value.trim() : '';
}

export function composeSharedText({ title = '', text = '', url = '' }: Pick<SharedMediaData, 'title' | 'text' | 'url'>): string {
    if (text) {
        return url && !text.includes(url) ? `${text}\n\n${url}` : text;
    }

    return url || title;
}

export function hasSharedContent(data: Pick<SharedMediaData, 'images' | 'title' | 'text' | 'url'>): boolean {
    return data.images.length > 0 || !!data.title || !!data.text || !!data.url;
}
