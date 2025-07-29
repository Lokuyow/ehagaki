// 画像URLの正規表現
const IMAGE_URL_REGEX = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi;

export interface ContentPart {
    type: "image" | "text";
    value: string;
}

export class ImagePreviewManager {
    private delayedImages: Record<string, boolean> = {};
    private delayedTimeouts: Record<string, any> = {};

    // コンテンツを画像とテキストに分割
    parseContentWithImages(content: string): ContentPart[] {
        const parts: ContentPart[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        IMAGE_URL_REGEX.lastIndex = 0;
        while ((match = IMAGE_URL_REGEX.exec(content)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    value: content.slice(lastIndex, match.index),
                });
            }
            parts.push({ type: "image", value: match[0] });
            lastIndex = IMAGE_URL_REGEX.lastIndex;
        }

        if (lastIndex < content.length) {
            parts.push({ type: "text", value: content.slice(lastIndex) });
        }

        return parts;
    }

    // 画像の遅延表示を管理
    manageDelayedImages(parts: ContentPart[], callback: (delayedImages: Record<string, boolean>) => void): void {
        // 新しい画像URLの遅延状態を設定
        for (const part of parts) {
            if (part.type === "image" && !this.delayedImages[part.value]) {
                this.delayedImages[part.value] = false;

                // 既存のタイマーをクリア
                if (this.delayedTimeouts[part.value]) {
                    clearTimeout(this.delayedTimeouts[part.value]);
                }

                // 1秒後に表示
                this.delayedTimeouts[part.value] = setTimeout(() => {
                    this.delayedImages = { ...this.delayedImages, [part.value]: true };
                    callback(this.delayedImages);
                }, 1000);
            }
        }

        // 不要なタイムアウトをクリア
        for (const key in this.delayedImages) {
            if (!parts.some((p) => p.type === "image" && p.value === key)) {
                if (this.delayedTimeouts[key]) {
                    clearTimeout(this.delayedTimeouts[key]);
                }
                delete this.delayedImages[key];
                delete this.delayedTimeouts[key];
            }
        }
    }

    // 遅延表示状態を取得
    getDelayedImages(): Record<string, boolean> {
        return this.delayedImages;
    }

    // クリーンアップ
    cleanup(): void {
        for (const key in this.delayedTimeouts) {
            clearTimeout(this.delayedTimeouts[key]);
        }
        this.delayedImages = {};
        this.delayedTimeouts = {};
    }
}
