import { createRxBackwardReq } from "rx-nostr";
import type { RxNostr } from "rx-nostr";
import { nip19 } from "nostr-tools";
import type { NostrEvent, ReplyQuoteState, RelayConfig } from "./types";
import { RelayConfigUtils } from "./relayConfigUtils";
import { BOOTSTRAP_RELAYS } from "./constants";

export interface ReplyQuoteServiceDeps {
    console?: Console;
    setTimeoutFn?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimeoutFn?: (id: ReturnType<typeof setTimeout>) => void;
}

export class ReplyQuoteService {
    private console: Console;
    private setTimeoutFn: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    private clearTimeoutFn: (id: ReturnType<typeof setTimeout>) => void;

    constructor(deps: ReplyQuoteServiceDeps = {}) {
        this.console = deps.console || (typeof console !== 'undefined' ? console : { log: () => { }, warn: () => { }, error: () => { } } as Console);
        this.setTimeoutFn = deps.setTimeoutFn || ((fn: () => void, ms: number) => setTimeout(fn, ms));
        this.clearTimeoutFn = deps.clearTimeoutFn || ((id: ReturnType<typeof setTimeout>) => clearTimeout(id));
    }

    /**
     * イベントIDからイベントを取得する
     */
    fetchReferencedEvent(
        eventId: string,
        relayHints: string[],
        rxNostr: RxNostr,
        relayConfig?: RelayConfig | null,
        timeoutMs: number = 5000
    ): Promise<NostrEvent | null> {
        return new Promise((resolve) => {
            const rxReq = createRxBackwardReq();
            let resolved = false;
            let subscription: any = undefined;
            let timeoutId: ReturnType<typeof setTimeout> | undefined;

            const cleanup = () => {
                if (timeoutId !== undefined) {
                    this.clearTimeoutFn(timeoutId);
                    timeoutId = undefined;
                }
                if (subscription && typeof subscription.unsubscribe === 'function') {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
            };

            const safeResolve = (result: NostrEvent | null) => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    resolve(result);
                }
            };

            // リレーリスト構築: relayHints → readリレー → BOOTSTRAP_RELAYS
            const relaySet = new Set<string>();
            relayHints.forEach(r => relaySet.add(RelayConfigUtils.normalizeRelayUrl(r)));
            if (relayConfig) {
                RelayConfigUtils.extractReadRelays(relayConfig).forEach(r => relaySet.add(r));
            }
            BOOTSTRAP_RELAYS.forEach(r => relaySet.add(RelayConfigUtils.normalizeRelayUrl(r)));
            const relays = Array.from(relaySet);

            try {
                subscription = rxNostr.use(rxReq, { on: { relays } }).subscribe({
                    next: (packet: any) => {
                        if (resolved) return;
                        if (packet.event?.id === eventId) {
                            this.console.log('参照イベントを取得:', packet.event.id);
                            safeResolve(packet.event as NostrEvent);
                        }
                    },
                    complete: () => {
                        if (!resolved) {
                            this.console.log('参照イベント取得: EOSE受信、イベントなし');
                            safeResolve(null);
                        }
                    },
                    error: (error: any) => {
                        this.console.error('参照イベント取得エラー:', error);
                        safeResolve(null);
                    }
                });

                rxReq.emit({ ids: [eventId] });
                rxReq.over();

                timeoutId = this.setTimeoutFn(() => {
                    if (!resolved) {
                        this.console.warn('参照イベント取得タイムアウト');
                        safeResolve(null);
                    }
                }, timeoutMs);

            } catch (error) {
                this.console.error('参照イベントリクエスト作成エラー:', error);
                safeResolve(null);
            }
        });
    }

    /**
     * 参照イベントからスレッド情報（root/reply）を抽出する（NIP-10）
     */
    extractThreadInfo(event: NostrEvent): {
        rootEventId: string | null;
        rootRelayHint: string | null;
        rootPubkey: string | null;
    } {
        const eTags = event.tags.filter(tag => tag[0] === 'e');

        // marked e-tags: "root" マーカーを探す
        const rootTag = eTags.find(tag => tag[3] === 'root');
        if (rootTag) {
            return {
                rootEventId: rootTag[1],
                rootRelayHint: rootTag[2] || null,
                rootPubkey: rootTag[4] || null,
            };
        }

        // マーカーなしのe-tagsの場合はpositional: 最初のeタグがroot
        if (eTags.length > 0) {
            const firstETag = eTags[0];
            return {
                rootEventId: firstETag[1],
                rootRelayHint: firstETag[2] || null,
                rootPubkey: null,
            };
        }

        // eタグなし: このイベント自体がroot（スレッドではない）
        return {
            rootEventId: null,
            rootRelayHint: null,
            rootPubkey: null,
        };
    }

    /**
     * リプライ用のe/pタグを構築する（NIP-10）
     */
    buildReplyTags(state: ReplyQuoteState): string[][] {
        const tags: string[][] = [];
        const referencedEvent = state.referencedEvent;
        const relayHint = state.relayHints[0] || '';

        // root eタグの決定
        if (state.rootEventId && state.rootEventId !== state.eventId) {
            // 参照イベントがスレッド内のリプライ: 元のrootを引き継ぎ
            tags.push(['e', state.rootEventId, state.rootRelayHint || '', 'root', ...(state.rootPubkey ? [state.rootPubkey] : [])]);
            // 参照イベントへのreplyタグ
            tags.push(['e', state.eventId, relayHint, 'reply', ...(state.authorPubkey ? [state.authorPubkey] : [])]);
        } else {
            // 参照イベントがスレッドのroot、または単独ノート
            tags.push(['e', state.eventId, relayHint, 'root', ...(state.authorPubkey ? [state.authorPubkey] : [])]);
        }

        // pタグの構築: 参照イベントの著者 + 参照イベント内の既存pタグ（重複排除）
        const pubkeys = new Set<string>();
        if (state.authorPubkey) {
            pubkeys.add(state.authorPubkey);
        }
        if (referencedEvent) {
            referencedEvent.tags
                .filter(tag => tag[0] === 'p' && tag[1])
                .forEach(tag => pubkeys.add(tag[1]));
        }
        pubkeys.forEach(pk => tags.push(['p', pk]));

        return tags;
    }

    /**
     * 引用用のq/pタグを構築する（NIP-18, NIP-21）
     */
    buildQuoteTags(state: ReplyQuoteState): string[][] {
        const tags: string[][] = [];
        const relayHint = state.relayHints[0] || '';

        // qタグ
        tags.push(['q', state.eventId, relayHint, ...(state.authorPubkey ? [state.authorPubkey] : [])]);

        // pタグ
        if (state.authorPubkey) {
            tags.push(['p', state.authorPubkey]);
        }

        return tags;
    }

    /**
     * nostr: URI を生成する（NIP-21）
     */
    generateNostrUri(eventId: string, relayHints: string[], authorPubkey?: string | null): string {
        const nevent = nip19.neventEncode({
            id: eventId,
            relays: relayHints.length > 0 ? relayHints.slice(0, 3) : undefined,
            author: authorPubkey || undefined,
        });
        return `nostr:${nevent}`;
    }

    /**
     * コンテンツ内のnostr:nevent1.../nostr:note1... URIを検出し、引用用のq/pタグを構築する
     * 複数URIがある場合は出現順に処理する
     */
    extractInlineQuoteTags(content: string): string[][] {
        const regex = /nostr:(nevent1[a-z0-9]+|note1[a-z0-9]+)/gi;
        const tags: string[][] = [];
        const seenEventIds = new Set<string>();
        const pPubkeys = new Set<string>();
        let match;

        while ((match = regex.exec(content)) !== null) {
            try {
                const decoded = nip19.decode(match[1]);
                let eventId: string;
                let relayHint = '';
                let authorPubkey: string | undefined;

                if (decoded.type === 'nevent') {
                    eventId = decoded.data.id;
                    relayHint = decoded.data.relays?.[0] || '';
                    authorPubkey = decoded.data.author;
                } else if (decoded.type === 'note') {
                    eventId = decoded.data as string;
                } else {
                    continue;
                }

                // 同一イベントIDの重複qタグを防ぐ
                if (seenEventIds.has(eventId)) continue;
                seenEventIds.add(eventId);

                tags.push(['q', eventId, relayHint, ...(authorPubkey ? [authorPubkey] : [])]);
                if (authorPubkey) {
                    pPubkeys.add(authorPubkey);
                }
            } catch {
                continue;
            }
        }

        // pタグを末尾にまとめて追加（重複排除済み）
        pPubkeys.forEach(pk => tags.push(['p', pk]));

        return tags;
    }
}
