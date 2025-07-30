// 画像URLの正規表現 - 前後に区切り文字がある場合のみマッチ
const IMAGE_URL_REGEX = /(?:^|[\s\n])(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))(?=[\s\n]|$)/gi;

export interface ContentPart {
    type: "image" | "text";
    value: string;
}

export class ImagePreviewManager {
    // コンテンツを画像とテキストに分割
    parseContentWithImages(content: string): ContentPart[] {
        const parts: ContentPart[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        IMAGE_URL_REGEX.lastIndex = 0;
        while ((match = IMAGE_URL_REGEX.exec(content)) !== null) {
            const fullMatch = match[0];
            const imageUrl = match[1]; // キャプチャグループからURL部分を取得
            const beforeUrl = fullMatch.substring(0, fullMatch.indexOf(imageUrl));

            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    value: content.slice(lastIndex, match.index),
                });
            }

            // 前の区切り文字があればテキストとして追加
            if (beforeUrl) {
                parts.push({ type: "text", value: beforeUrl });
            }

            parts.push({ type: "image", value: imageUrl });
            lastIndex = IMAGE_URL_REGEX.lastIndex;
        }

        if (lastIndex < content.length) {
            parts.push({ type: "text", value: content.slice(lastIndex) });
        }

        return parts;
    }

    cleanup(): void {
    }
}
