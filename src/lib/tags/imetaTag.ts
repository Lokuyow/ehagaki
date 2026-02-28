// imeta.ts
// NIP-92 imetaタグ生成ユーティリティ
import { generateEventTemplate } from "nostr-tools/nip94";
import type { FileMetadataObject } from "nostr-tools/nip94";
import { encode } from "blurhash";
import { uploadAbortFlagStore } from '../../stores/appStore.svelte';

export interface ImetaField extends Partial<FileMetadataObject> {
    url: string;
    x?: string; // アップロード後画像のSHA-256ハッシュ
    [key: string]: any;
}

/**
 * NIP-94のgenerateEventTemplateを利用してimetaタグを生成（dimがなければ画像から取得して必ず含める）
 * @param fields imetaタグに含めるフィールド
 * @returns Promise<string[]> imetaタグ配列
 */
export async function createImetaTag(fields: ImetaField): Promise<string[]> {
    if (!fields.url) throw new Error("url is required for imeta tag");
    if (!fields.m) throw new Error("m (MIME type) is required for imeta tag");
    let dim = fields.dim;
    if (!dim && fields.url) {
        try {
            dim = await new Promise<string | undefined>((resolve) => {
                const img = new window.Image();
                img.onload = () => {
                    resolve(`${img.naturalWidth}x${img.naturalHeight}`);
                };
                img.onerror = () => resolve(undefined);
                img.src = fields.url;
            });
        } catch {
            dim = undefined;
        }
    }
    // NIP-94イベントテンプレートを生成（xとoxは値がある場合のみ追加）
    const nip94Params: Record<string, any> = {
        content: fields.content || "",
        url: fields.url,
        m: fields.m,
        size: fields.size,
        dim: dim,
        blurhash: fields.blurhash,
        thumb: fields.thumb,
        image: fields.image,
        summary: fields.summary,
        alt: fields.alt,
        fallback: fields.fallback,
    };
    if (fields.x) nip94Params.x = fields.x;
    if (fields.ox) nip94Params.ox = fields.ox;
    const nip94Event = generateEventTemplate(nip94Params as any);
    // imetaタグはNIP-94のタグをスペース区切りのkey value形式に変換
    const imeta: string[] = [
        `url ${fields.url}`
    ];
    for (const tag of nip94Event.tags) {
        const [key, ...rest] = tag;
        if (key === "url") continue;
        // 値が空のタグはスキップ
        const value = rest.join(" ").trim();
        if (!value) continue;
        imeta.push(`${key} ${value}`);
    }
    return ["imeta", ...imeta];
}

// 既にblurhash生成・プレースホルダーURL生成の関数はこのファイルに実装済み
/**
 * 画像ファイルからblurhashを生成
 * @param file 画像ファイル
 * @returns blurhash文字列 or null
 */
export async function generateBlurhash(file: File): Promise<string | null> {
    try {
        // 中止フラグをチェック
        if (uploadAbortFlagStore.value) {
            return null;
        }

        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const url = URL.createObjectURL(file);
            const image = new window.Image();
            image.onload = () => {
                URL.revokeObjectURL(url);
                resolve(image);
            };
            image.onerror = (e) => {
                URL.revokeObjectURL(url);
                reject(e);
            };
            image.src = url;
        });

        // 画像読み込み後に中止チェック
        if (uploadAbortFlagStore.value) {
            return null;
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.min(img.width, 64); // blurhash推奨:小さめ
        canvas.height = Math.min(img.height, 64);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return null;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // component数は4x4固定
        const hash = encode(imageData.data, imageData.width, imageData.height, 4, 4);
        return hash;
    } catch (e) {
        return null;
    }
}

/**
 * 画像ファイルからプレースホルダーURLを生成
 * @param file 画像ファイル
 * @returns プレースホルダーURL or null
 */
export async function createPlaceholderUrl(file: File): Promise<string | null> {
    try {
        return URL.createObjectURL(file);
    } catch {
        return null;
    }
}

/**
 * 画像ファイルからblurhashを生成（別名エクスポート用）
 * @param file 画像ファイル
 * @returns blurhash文字列 or null
 */
export async function generateBlurhashForFile(file: File): Promise<string | null> {
    const devMode = import.meta.env?.MODE === "development";
    const hash = await generateBlurhash(file);
    return hash;
}

/**
 * エディター内の画像ノードからblurhashマッピングを抽出
 * @param editor Tiptapエディターインスタンス
 * @returns 画像URLとblurhashのマッピング
 */
export function extractImageBlurhashMap(editor: any): Record<string, string> {
    const imageBlurhashMap: Record<string, string> = {};

    if (editor && editor.state && editor.state.doc) {
        editor.state.doc.descendants((node: any) => {
            if (
                node.type?.name === "image" &&
                node.attrs?.src &&
                node.attrs?.blurhash &&
                !node.attrs?.isPlaceholder && // プレースホルダーを除外
                !node.attrs?.src?.startsWith('placeholder-') // プレースホルダーIDを除外
            ) {
                imageBlurhashMap[node.attrs.src] = node.attrs.blurhash;
            }
        });
    }

    return imageBlurhashMap;
}

/**
 * URLの拡張子からMIME typeを判定
 * @param url 画像URL
 * @returns MIME type文字列
 */
export function getMimeTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'avif': 'image/avif',
        'bmp': 'image/bmp',
        'svg': 'image/svg+xml'
    };
    return mimeMap[extension || ''] || 'image/jpeg'; // デフォルトはjpeg
}

/**
 * アップロード後の画像URLからSHA-256ハッシュ(x)を計算
 * @param url 画像URL
 * @returns SHA-256ハッシュ文字列 or null
 */
export async function calculateImageHash(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;

        const arrayBuffer = await response.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    } catch (error) {
        console.warn("Failed to calculate image hash:", error);
        return null;
    }
}
