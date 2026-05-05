import type { Editor as TipTapEditor } from '@tiptap/core';

export interface DevImetaDependencies {
    extractImageBlurhashMap: (editor: TipTapEditor) => Record<string, string>;
    calculateImageHash: (url: string) => Promise<string | null>;
    getMimeTypeFromUrl: (url: string) => string;
    createImetaTag: (params: {
        url: string;
        m: string;
        blurhash?: string;
        ox?: string;
        x?: string;
    }) => Promise<string[]>;
}

export interface GenerateDevImetaTagsParams {
    editor: TipTapEditor;
    imageServerBlurhashMap: Record<string, string>;
    imageOxMap: Record<string, string>;
    imageXMap: Record<string, string>;
    dependencies: DevImetaDependencies;
}

export async function generateDevImetaTags({
    editor,
    imageServerBlurhashMap,
    imageOxMap,
    imageXMap,
    dependencies,
}: GenerateDevImetaTagsParams): Promise<string[]> {
    const rawImageBlurhashMap = dependencies.extractImageBlurhashMap(editor);
    const urls = new Set<string>([
        ...Object.keys(rawImageBlurhashMap),
        ...Object.keys(imageServerBlurhashMap),
    ]);

    await Promise.all(
        Array.from(urls).map(async (url) => {
            if (!imageXMap[url]) {
                const x = await dependencies.calculateImageHash(url);
                if (x) {
                    imageXMap[url] = x;
                }
            }
        }),
    );

    const imetaTags = await Promise.all(
        Array.from(urls).map(async (url) => {
            const blurhash = imageServerBlurhashMap[url] ?? rawImageBlurhashMap[url];
            const m = dependencies.getMimeTypeFromUrl(url);
            const ox = imageOxMap[url];
            const x = imageXMap[url];
            const tag = await dependencies.createImetaTag({ url, m, blurhash, ox, x });
            return tag.join(' ');
        }),
    );

    return imetaTags;
}