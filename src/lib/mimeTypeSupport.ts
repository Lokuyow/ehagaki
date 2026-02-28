import type { MimeTypeSupportInterface } from './types';

// --- MIMEタイプサポート検出クラス ---
export class MimeTypeSupport implements MimeTypeSupportInterface {
    private mimeSupportCache: Record<string, boolean> = {};
    private webpQualitySupport?: boolean;

    constructor(private document?: Document) { }

    async canEncodeWebpWithQuality(): Promise<boolean> {
        if (this.webpQualitySupport !== undefined) return this.webpQualitySupport;
        try {
            if (!this.document) return (this.webpQualitySupport = false);
            const canvas = this.document.createElement("canvas");
            canvas.width = 2; canvas.height = 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) return (this.webpQualitySupport = false);
            ctx.fillStyle = "#f00"; ctx.fillRect(0, 0, 2, 2);
            const qLow = canvas.toDataURL("image/webp", 0.2);
            const qHigh = canvas.toDataURL("image/webp", 0.9);
            const ok = qLow.startsWith("data:image/webp") && qHigh.startsWith("data:image/webp") && qLow.length !== qHigh.length;
            this.webpQualitySupport = ok;
            return ok;
        } catch {
            this.webpQualitySupport = false;
            return false;
        }
    }

    canEncodeMimeType(mime: string): boolean {
        if (!mime) return false;
        if (mime in this.mimeSupportCache) return this.mimeSupportCache[mime];
        try {
            if (!this.document) return (this.mimeSupportCache[mime] = false);
            const canvas = this.document.createElement("canvas");
            canvas.width = 2; canvas.height = 2;
            const ctx = canvas.getContext("2d");
            if (!ctx) return (this.mimeSupportCache[mime] = false);
            ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 2, 2);
            const url = canvas.toDataURL(mime);
            const ok = typeof url === "string" && url.startsWith(`data:${mime}`);
            this.mimeSupportCache[mime] = ok;
            return ok;
        } catch {
            this.mimeSupportCache[mime] = false;
            return false;
        }
    }
}
