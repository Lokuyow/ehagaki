import type { RxNostr } from "rx-nostr";
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS } from "./constants";
import type { PostResult } from "./types";

// --- 純粋関数（依存性なし） ---

/**
 * コンテンツ末尾のメディアURL直後の改行を削除する
 * メディアURLの後に改行のみがある場合に末尾の改行を削除
 */
export function trimTrailingNewlineAfterMedia(content: string): string {
    // 末尾が改行で終わっていない場合はそのまま返す
    if (!content.endsWith('\n')) return content;

    // メディア拡張子のパターンを作成
    const mediaExtensions = [...ALLOWED_IMAGE_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];
    const escapedExtensions = mediaExtensions.map(ext => ext.replace('.', '\\.'));
    const extensionPattern = escapedExtensions.join('|');

    // URLの後に改行が続くパターン: URL(メディア拡張子)\n で終わる
    // URLパターン: https?://で始まり、空白や改行以外の文字が続く
    const mediaUrlTrailingNewlinePattern = new RegExp(
        `(https?://[^\\s\\n]+(?:${extensionPattern}))\\n$`,
        'i'
    );

    // マッチした場合、末尾の改行を削除
    if (mediaUrlTrailingNewlinePattern.test(content)) {
        return content.slice(0, -1);
    }

    return content;
}

export class PostValidator {
    static validatePost(content: string, isAuthenticated: boolean, hasRxNostr: boolean): { valid: boolean; error?: string } {
        if (!content.trim()) return { valid: false, error: "empty_content" };
        if (!hasRxNostr) return { valid: false, error: "nostr_not_ready" };
        if (!isAuthenticated) return { valid: false, error: "login_required" };
        return { valid: true };
    }
}

export class PostEventBuilder {
    static async buildEvent(
        content: string,
        hashtags: string[],
        tags: string[][],
        pubkey?: string,
        imageImetaMap?: Record<string, { m: string; blurhash?: string; dim?: string; alt?: string;[key: string]: any }>,
        createImetaTagFn?: (meta: any) => Promise<string[]>,
        getClientTagFn?: () => string[] | null,
        contentWarningEnabled?: boolean,
        contentWarningReason?: string
    ): Promise<any> {
        // 既にストアに tags が作られていればそれをコピー、なければ hashtags から小文字化して作成
        const eventTags: string[][] = Array.isArray(tags) && tags.length
            ? [...tags]
            : (Array.isArray(hashtags) ? hashtags.map((hashtag: string) => ['t', hashtag.toLowerCase()]) : []);

        // Content Warning タグ追加 (NIP-36)
        // nsfw ハッシュタグがある場合も自動的に content-warning タグを追加
        const hasNsfwTag = eventTags.some(tag => tag[0] === 't' && tag[1] === 'nsfw');
        if (contentWarningEnabled || hasNsfwTag) {
            if (contentWarningReason && contentWarningReason.trim()) {
                eventTags.push(['content-warning', contentWarningReason.trim()]);
            } else {
                eventTags.push(['content-warning']);
            }
            // Content Warning有効時は 'nsfw' ハッシュタグも自動追加（重複チェック）
            if (contentWarningEnabled && !hasNsfwTag) {
                eventTags.push(['t', 'nsfw']);
            }
        }

        // Client tag 追加
        if (getClientTagFn) {
            const clientTag = getClientTagFn();
            if (clientTag) {
                eventTags.push(clientTag);
            }
        }

        // 画像imetaタグ追加
        if (imageImetaMap && createImetaTagFn) {
            for (const [url, meta] of Object.entries(imageImetaMap)) {
                if (url && meta && meta.m) {
                    const imetaTag = await createImetaTagFn({ url, ...meta });
                    eventTags.push(imetaTag);
                }
            }
        }

        const event: any = {
            kind: 1,
            content,
            tags: eventTags,
            created_at: Math.floor(Date.now() / 1000)
        };

        if (pubkey) event.pubkey = pubkey;
        return event;
    }
}

// --- RxNostr送信処理の分離 ---
export class PostEventSender {
    constructor(
        private rxNostr: RxNostr,
        private console: Console
    ) { }

    sendEvent(event: any, signer?: any): Promise<PostResult> {
        return new Promise((resolve) => {
            let resolved = false;
            let rejectedCount = 0;
            let totalCount = 0;
            let subscription: any = null;

            const safeUnsubscribe = () => {
                try {
                    subscription?.unsubscribe();
                } catch (e) {
                    // ignore
                }
            };

            const safeResolve = (result: PostResult) => {
                if (!resolved) {
                    resolved = true;
                    safeUnsubscribe();
                    resolve(result);
                }
            };

            const observer = {
                next: (packet: any) => {
                    this.console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗", packet.notice ? `(${packet.notice})` : "");
                    totalCount++;
                    if (packet.ok) {
                        // completeOn: "all-ok" でも、ok:true を受信した時点で
                        // next 内で即座に成功として resolve する
                        safeResolve({ success: true });
                    } else {
                        rejectedCount++;
                    }
                },
                error: (error: any) => {
                    this.console.error("送信エラー:", error);
                    safeResolve({ success: false, error: "post_network_error" });
                },
                complete: () => {
                    if (!resolved) {
                        // completeOn: "all-ok" で ok:true がなく complete した場合
                        // → 全リレーが ok:false を返したか、rx-nostr の okTimeout が経過した
                        if (totalCount > 0 && rejectedCount === totalCount) {
                            // すべてのリレーが明示的に拒否した
                            safeResolve({ success: false, error: "post_rejected" });
                        } else {
                            // 応答なしでタイムアウト（投稿が届いた可能性あり）
                            safeResolve({ success: false, error: "post_timeout" });
                        }
                    }
                }
            };

            const sendOptions: any = { completeOn: "all-ok" as const };
            if (signer) sendOptions.signer = signer;
            subscription = this.rxNostr.send(event, sendOptions).subscribe(observer);
        });
    }
}
