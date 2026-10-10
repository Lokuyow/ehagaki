import { noopSigner, type EventSigner, type RxNostr } from "rx-nostr";
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_VIDEO_EXTENSIONS } from "./constants";
import { RelayConfigUtils } from "./relayConfigUtils";
import type {
    ChannelContextState,
    ImetaField,
    PostResult,
    RelayRejection,
    RelayRejectionCategory,
} from "./types";
import type { ImageImetaMetadataMap } from "./types";

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

type RxNostrEventParameters = Parameters<RxNostr["send"]>[0];
export type PostEventTemplate = Omit<RxNostrEventParameters, "tags" | "created_at"> & {
    tags: string[][];
    created_at: number;
};

export class PostEventBuilder {
    static async buildEvent(
        content: string,
        hashtags: string[],
        tags: string[][],
        pubkey?: string,
        imageImetaMap?: ImageImetaMetadataMap,
        createImetaTagFn?: (meta: ImetaField) => Promise<string[]>,
        getClientTagFn?: () => string[] | null,
        contentWarningEnabled?: boolean,
        contentWarningReason?: string,
        replyQuoteTags?: string[][],
        channelContext?: ChannelContextState | null,
        emojiTags?: string[][],
        failClosedContentWarning?: boolean,
        publicationKind?: number,
    ): Promise<PostEventTemplate> {
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

        // Content Warning形式が実験的fail-closed opt-inなら、CWとNSFWを独立させる。
        if (failClosedContentWarning) {
            if (contentWarningEnabled) {
                const reason = contentWarningReason?.trim() ?? "";
                eventTags.push(reason
                    ? ["content-warning", reason]
                    : ["content-warning"]);
            }
        } else {
            // 現行NIP-36形式と既存のCW/NSFW自動連動を維持する。
            const hasNsfwTag = eventTags.some(tag => tag[0] === 't' && tag[1] === 'nsfw');
            if (contentWarningEnabled || hasNsfwTag) {
                if (contentWarningReason && contentWarningReason.trim()) {
                    eventTags.push(['content-warning', contentWarningReason.trim()]);
                } else {
                    eventTags.push(['content-warning']);
                }
                if (contentWarningEnabled && !hasNsfwTag) {
                    eventTags.push(['t', 'nsfw']);
                }
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

        const event: PostEventTemplate = {
            kind: publicationKind ?? (channelContext ? 42 : 1),
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

    getDefaultWriteRelays(): string[] {
        return typeof this.rxNostr.getDefaultRelays === "function"
            ? RelayConfigUtils.sanitizeExternalRelayUrls(
                Object.values(this.rxNostr.getDefaultRelays())
                    .filter((relay) => relay.write)
                    .map((relay) => relay.url),
            )
            : [];
    }

    sendEvent(
        event: RxNostrEventParameters,
        signerOrOptions?: unknown,
    ): Promise<PostResult> {
        const options = normalizeSendEventOptions(signerOrOptions);
        if (
            hasExplicitTargetRelays(signerOrOptions)
            && !options.includeDefaultWriteRelays
            && (options.targetRelays?.length ?? 0) === 0
        ) {
            return Promise.resolve({ success: false, error: "no_write_relays" });
        }
        const targetRelays = resolveTargetRelays(this.rxNostr, options);
        if (
            targetRelays.length === 0
            && typeof this.rxNostr.getDefaultRelays === "function"
        ) {
            return Promise.resolve({ success: false, error: "no_write_relays" });
        }

        return new Promise((resolve) => {
            let resolved = false;
            let subscription: { unsubscribe(): void } | null = null;
            let settleTimer: ReturnType<typeof setTimeout> | undefined;
            let resultEventId = event.id;
            let successSettleScheduled = false;
            const acceptedRelays = new Set<string>();
            const rejectedByRelay = new Map<string, RelayRejection>();
            const authRequiredRelays = new Set<string>();
            const pendingAuthRelays = new Set<string>();

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

            const getResult = (final = true): PostResult => {
                const accepted = [...acceptedRelays];
                const rejected = [...rejectedByRelay.values()];
                const finalRelays = new Set([
                    ...acceptedRelays,
                    ...rejectedByRelay.keys(),
                ]);
                const timedOutRelays = final ? targetRelays.filter(
                    (relay) => !finalRelays.has(relay),
                ) : [];
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
                settleTimer = setTimeout(() => {
                    if (
                        options.waitForAllRelays
                        && pendingAuthRelays.size > 0
                        && typeof options.authDeadlineAt === "number"
                        && Date.now() < options.authDeadlineAt
                    ) {
                        scheduleSettle(options.authDeadlineAt - Date.now());
                        return;
                    }
                    safeResolve(getResult());
                }, delayMs);
            };

            const maybeResolveAll = () => {
                if (!options.waitForAllRelays) return;
                const terminalRelays = new Set([
                    ...acceptedRelays,
                    ...rejectedByRelay.keys(),
                ]);
                if (
                    pendingAuthRelays.size === 0
                    && targetRelays.every((relay) => terminalRelays.has(relay))
                ) {
                    safeResolve(getResult());
                }
            };

            const safeResolve = (result: PostResult) => {
                if (!resolved) {
                    resolved = true;
                    clearSettleTimer();
                    safeUnsubscribe();
                    options.settleSignal?.removeEventListener("abort", settleFromSignal);
                    resolve(result);
                }
            };

            const observer: import("rxjs").Observer<import("rx-nostr").OkPacketAgainstEvent> = {
                next: (packet) => {
                    if (resolved) return;
                    this.console.log('リレー送信結果', {
                        stage: 'publish',
                        outcome: packet.ok ? 'success' : 'failure',
                    });
                    const relay = RelayConfigUtils.normalizeExternalRelayUrl(packet.from) ?? packet.from;
                    if (!relay) return;
                    if (targetRelays.length > 0 && !targetRelays.includes(relay)) return;
                    const packetEventId = "event" in packet
                        && packet.event !== null
                        && typeof packet.event === "object"
                        && "id" in packet.event
                        && typeof packet.event.id === "string"
                        ? packet.event.id
                        : undefined;
                    resultEventId = packetEventId || packet.eventId || resultEventId;

                    if (!packet.done) {
                        if (!packet.ok && getRejectionCategory(packet.notice) === "auth-required") {
                            authRequiredRelays.add(relay);
                            pendingAuthRelays.add(relay);
                            successSettleScheduled = false;
                            scheduleSettle(options.waitForAllRelays
                                ? Math.max(1, (options.authDeadlineAt ?? Date.now()) - Date.now())
                                : this.settleTimeouts.authMs);
                            options.onProgress?.(getResult(false));
                        }
                        return;
                    }

                    if (packet.ok) {
                        acceptedRelays.add(relay);
                        rejectedByRelay.delete(relay);
                        pendingAuthRelays.delete(relay);
                        options.onProgress?.(getResult(false));
                        if (options.waitForAllRelays) {
                            maybeResolveAll();
                        } else if (pendingAuthRelays.size === 0 && !successSettleScheduled) {
                            successSettleScheduled = true;
                            scheduleSettle(this.settleTimeouts.successMs);
                        }
                    } else {
                        if (acceptedRelays.has(relay)) return;
                        pendingAuthRelays.delete(relay);
                        rejectedByRelay.set(relay, {
                            relay,
                            ...(packet.notice ? { reason: packet.notice } : {}),
                            category: getRejectionCategory(packet.notice),
                        });
                        options.onProgress?.(getResult(false));
                        if (options.waitForAllRelays) {
                            maybeResolveAll();
                        } else if (acceptedRelays.size > 0 && pendingAuthRelays.size === 0 && !successSettleScheduled) {
                            successSettleScheduled = true;
                            scheduleSettle(this.settleTimeouts.successMs);
                        }
                    }
                },
                error: () => {
                    if (resolved) return;
                    this.console.error("送信エラー", {
                        stage: 'publish',
                        reason: 'unexpected',
                    });
                    if (options.waitForAllRelays) {
                        const result = getResult();
                        safeResolve(result.success
                            ? result
                            : { ...result, error: "post_network_error" });
                    } else {
                        const result = getResult();
                        if (result.success) {
                            if (!successSettleScheduled) {
                                successSettleScheduled = true;
                                scheduleSettle(this.settleTimeouts.successMs);
                            }
                        } else {
                            safeResolve({ success: false, error: "post_network_error" });
                        }
                    }
                },
                complete: () => {
                    if (!resolved) {
                        safeResolve(getResult());
                    }
                }
            };

            const sendOptions: NonNullable<Parameters<RxNostr["send"]>[1]> = { completeOn: "all-ok", signer: options.signer ?? noopSigner() };
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

            const defaultDeadline = Date.now() + this.settleTimeouts.initialMs;
            const deadlineAt = options.deadlineAt ?? defaultDeadline;
            const settleFromSignal = () => safeResolve(getResult());
            options.settleSignal?.addEventListener("abort", settleFromSignal, { once: true });
            if (options.settleSignal?.aborted) {
                settleFromSignal();
                return;
            }
            scheduleSettle(Math.max(1, deadlineAt - Date.now()));
            subscription = this.rxNostr.send(event, sendOptions).subscribe(observer);
            if (resolved) safeUnsubscribe();
        });
    }
}

function hasExplicitTargetRelays(signerOrOptions?: unknown): boolean {
    return !!signerOrOptions
        && typeof signerOrOptions === "object"
        && "targetRelays" in signerOrOptions;
}

export interface SendEventOptions {
    signer?: EventSigner;
    targetRelays?: string[];
    includeDefaultWriteRelays?: boolean;
    /** NIP-65 batches use a shared operation deadline and await terminal ACKs. */
    waitForAllRelays?: boolean;
    deadlineAt?: number;
    authDeadlineAt?: number;
    /** Internal staged-publish progress; contains confirmed results, not provisional timeouts. */
    onProgress?: (result: PostResult) => void;
    /** The operation owner closes remaining waves after successful class settlement. */
    settleSignal?: AbortSignal;
}

export interface PostEventSenderSettleTimeouts {
    initialMs: number;
    successMs: number;
    authMs: number;
}

function normalizeSendEventOptions(
    signerOrOptions?: unknown,
): Required<Pick<SendEventOptions, "includeDefaultWriteRelays">> & SendEventOptions {
    if (isSendEventOptions(signerOrOptions)) {
        return {
            ...signerOrOptions,
            targetRelays: RelayConfigUtils.sanitizeExternalRelayUrls(signerOrOptions.targetRelays),
            includeDefaultWriteRelays: signerOrOptions.includeDefaultWriteRelays ?? true,
        };
    }

    return {
        ...(isEventSigner(signerOrOptions) ? { signer: signerOrOptions } : {}),
        targetRelays: [],
        includeDefaultWriteRelays: true,
    };
}

function isSendEventOptions(
    value: unknown,
): value is SendEventOptions {
    return value !== null
        && typeof value === "object"
        && ("signer" in value
            || "targetRelays" in value
            || "includeDefaultWriteRelays" in value);
}

function isEventSigner(value: unknown): value is EventSigner {
    return value !== null
        && typeof value === "object"
        && "signEvent" in value
        && typeof value.signEvent === "function";
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
