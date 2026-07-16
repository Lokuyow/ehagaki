import { noopSigner, type EventSigner, type RxNostr } from "rx-nostr";
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type {
    ChannelContextState,
    PostResult,
    RelayRejection,
    RelayRejectionCategory,
} from "./types";

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
        contentWarningReason?: string,
        replyQuoteTags?: string[][],
        channelContext?: ChannelContextState | null,
        emojiTags?: string[][],
    ): Promise<any> {
        // リプライ/引用タグを先頭に配置
        const eventTags: string[][] = [];

        if (channelContext) {
            eventTags.push([
                'e',
                channelContext.eventId,
                channelContext.channelRelays?.[0] || channelContext.relayHints[0] || '',
                'root',
            ]);
        }

        if (replyQuoteTags) {
            eventTags.push(...replyQuoteTags);
        }

        // 既にストアに tags が作られていればそれをコピー、なければ hashtags から小文字化して作成
        if (Array.isArray(tags) && tags.length) {
            eventTags.push(...tags);
        } else if (Array.isArray(hashtags)) {
            eventTags.push(...hashtags.map((hashtag: string) => ['t', hashtag.toLowerCase()]));
        }

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

        if (Array.isArray(emojiTags) && emojiTags.length) {
            eventTags.push(...emojiTags);
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
            kind: channelContext ? 42 : 1,
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
    static readonly DEFAULT_SETTLE_TIMEOUTS = {
        initialMs: 12_000,
        successMs: 1_500,
        authMs: 30_000,
    } as const;

    constructor(
        private rxNostr: RxNostr,
        private console: Console,
        private settleTimeouts: PostEventSenderSettleTimeouts = PostEventSender.DEFAULT_SETTLE_TIMEOUTS,
    ) { }

    sendEvent(
        event: any,
        signerOrOptions?: any | SendEventOptions,
    ): Promise<PostResult> {
        return new Promise((resolve) => {
            let resolved = false;
            let subscription: any = null;
            let settleTimer: ReturnType<typeof setTimeout> | undefined;
            let resultEventId = event.id;
            let successSettleScheduled = false;
            const acceptedRelays = new Set<string>();
            const rejectedByRelay = new Map<string, RelayRejection>();
            const authRequiredRelays = new Set<string>();
            const pendingAuthRelays = new Set<string>();

            const options = normalizeSendEventOptions(signerOrOptions);
            const targetRelays = resolveTargetRelays(this.rxNostr, options);

            const safeUnsubscribe = () => {
                try {
                    subscription?.unsubscribe();
                } catch (e) {
                    // ignore
                }
            };

            const clearSettleTimer = () => {
                if (settleTimer) {
                    clearTimeout(settleTimer);
                    settleTimer = undefined;
                }
            };

            const getResult = (): PostResult => {
                const accepted = [...acceptedRelays];
                const rejected = [...rejectedByRelay.values()];
                const finalRelays = new Set([
                    ...acceptedRelays,
                    ...rejectedByRelay.keys(),
                ]);
                const timedOutRelays = targetRelays.filter(
                    (relay) => !finalRelays.has(relay),
                );
                const success = accepted.length > 0;

                const hasUnresolvedRelays = timedOutRelays.length > 0
                    || (!success && rejected.length === 0);

                return {
                    success,
                    ...(success ? { eventId: resultEventId } : {
                        error: hasUnresolvedRelays
                            ? "post_timeout"
                            : "post_rejected",
                    }),
                    acceptedRelays: accepted,
                    ...(rejected.length ? { rejectedRelays: rejected } : {}),
                    ...(timedOutRelays.length ? { timedOutRelays } : {}),
                    ...(authRequiredRelays.size
                        ? { authRequiredRelays: [...authRequiredRelays] }
                        : {}),
                };
            };

            const scheduleSettle = (delayMs: number) => {
                clearSettleTimer();
                settleTimer = setTimeout(() => safeResolve(getResult()), delayMs);
            };

            const safeResolve = (result: PostResult) => {
                if (!resolved) {
                    resolved = true;
                    clearSettleTimer();
                    safeUnsubscribe();
                    resolve(result);
                }
            };

            const observer = {
                next: (packet: any) => {
                    this.console.log(`リレー ${packet.from} への送信結果:`, packet.ok ? "成功" : "失敗", packet.notice ? `(${packet.notice})` : "");
                    const relay = typeof packet.from === "string" ? packet.from : "";
                    if (!relay) return;
                    resultEventId = packet.event?.id || packet.eventId || resultEventId;

                    if (!packet.done) {
                        if (!packet.ok && getRejectionCategory(packet.notice) === "auth-required") {
                            authRequiredRelays.add(relay);
                            pendingAuthRelays.add(relay);
                            successSettleScheduled = false;
                            scheduleSettle(this.settleTimeouts.authMs);
                        }
                        return;
                    }

                    if (packet.ok) {
                        acceptedRelays.add(relay);
                        rejectedByRelay.delete(relay);
                        pendingAuthRelays.delete(relay);
                        if (pendingAuthRelays.size === 0 && !successSettleScheduled) {
                            successSettleScheduled = true;
                            scheduleSettle(this.settleTimeouts.successMs);
                        }
                    } else {
                        pendingAuthRelays.delete(relay);
                        rejectedByRelay.set(relay, {
                            relay,
                            ...(packet.notice ? { reason: packet.notice } : {}),
                            category: getRejectionCategory(packet.notice),
                        });
                        if (acceptedRelays.size > 0 && pendingAuthRelays.size === 0 && !successSettleScheduled) {
                            successSettleScheduled = true;
                            scheduleSettle(this.settleTimeouts.successMs);
                        }
                    }
                },
                error: (error: any) => {
                    this.console.error("送信エラー:", error);
                    safeResolve({ success: false, error: "post_network_error" });
                },
                complete: () => {
                    if (!resolved) {
                        safeResolve(getResult());
                    }
                }
            };

            const sendOptions: any = { completeOn: "all-ok" as const };
            sendOptions.signer = options.signer ?? noopSigner();
            if ((options.targetRelays?.length ?? 0) > 0 || options.includeDefaultWriteRelays) {
                sendOptions.on = {
                    ...((options.targetRelays?.length ?? 0) > 0
                        ? { relays: options.targetRelays }
                        : {}),
                    ...(options.includeDefaultWriteRelays
                        ? { defaultWriteRelays: true }
                        : {}),
                };
            }

            scheduleSettle(this.settleTimeouts.initialMs);
            subscription = this.rxNostr.send(event, sendOptions).subscribe(observer);
        });
    }
}

export interface SendEventOptions {
    signer?: EventSigner;
    targetRelays?: string[];
    includeDefaultWriteRelays?: boolean;
}

export interface PostEventSenderSettleTimeouts {
    initialMs: number;
    successMs: number;
    authMs: number;
}

function normalizeSendEventOptions(
    signerOrOptions?: any | SendEventOptions,
): Required<Pick<SendEventOptions, "includeDefaultWriteRelays">> & SendEventOptions {
    if (signerOrOptions && typeof signerOrOptions === "object" && (
        "signer" in signerOrOptions
        || "targetRelays" in signerOrOptions
        || "includeDefaultWriteRelays" in signerOrOptions
    )) {
        return {
            ...signerOrOptions,
            targetRelays: RelayConfigUtils.sanitizeExternalRelayUrls(signerOrOptions.targetRelays),
            includeDefaultWriteRelays: signerOrOptions.includeDefaultWriteRelays ?? true,
        };
    }

    return {
        signer: signerOrOptions as EventSigner | undefined,
        targetRelays: [],
        includeDefaultWriteRelays: true,
    };
}

function resolveTargetRelays(rxNostr: RxNostr, options: SendEventOptions): string[] {
    const defaultRelays = options.includeDefaultWriteRelays
        && typeof rxNostr.getDefaultRelays === "function"
        ? Object.values(rxNostr.getDefaultRelays()).filter((relay) => relay.write).map((relay) => relay.url)
        : [];
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...defaultRelays,
        ...(options.targetRelays ?? []),
    ]);
}

function getRejectionCategory(notice: unknown): RelayRejectionCategory {
    const prefix = typeof notice === "string"
        ? notice.split(":", 1)[0].trim().toLowerCase()
        : "";
    switch (prefix) {
        case "auth-required":
        case "restricted":
        case "blocked":
        case "rate-limited":
        case "duplicate":
        case "invalid":
        case "pow":
        case "error":
        case "mute":
        case "unsupported":
            return prefix;
        default:
            return "unknown";
    }
}
