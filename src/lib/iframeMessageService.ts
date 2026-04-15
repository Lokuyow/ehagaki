import {
    EMBED_MESSAGE_NAMESPACE,
    EMBED_MESSAGE_VERSION,
    getParentOriginFromSearch,
    type EmbedComposerContextAppliedPayload,
    type EmbedComposerContextErrorPayload,
    type EmbedComposerContextUpdatedPayload,
    type EmbedMessageEnvelope,
    type EmbedPostErrorPayload,
    type EmbedPostSuccessPayload,
} from './embedProtocol';

export interface IframeMessagePayload extends EmbedMessageEnvelope {
    type:
        | 'post.success'
        | 'post.error'
        | 'composer.contextApplied'
        | 'composer.contextError'
        | 'composer.contextUpdated';
}

export interface IframeMessageServiceConfig {
    allowedOrigins?: string[];
    parentOrigin?: string;
    locationSearch?: string;
    console?: Console;
    window?: Window;
}

export class IframeMessageService {
    private allowedOrigins: string[];
    private parentOrigin: string | null;
    private console: Console;
    private windowObj: Window | undefined;

    constructor(config: IframeMessageServiceConfig = {}) {
        this.allowedOrigins = config.allowedOrigins || [];
        this.parentOrigin =
            config.parentOrigin
            ?? getParentOriginFromSearch(
                config.locationSearch
                ?? (config.window || (typeof window !== 'undefined' ? window : undefined))?.location?.search,
            );
        // consoleが提供されていない場合はグローバルconsoleを使用、それも無ければno-opを使用
        this.console = config.console || (typeof console !== 'undefined' ? console : {
            log: () => { },
            warn: () => { },
            error: () => { }
        } as Console);
        this.windowObj = config.window || (typeof window !== 'undefined' ? window : undefined);
    }

    /**
     * 現在のウィンドウがiframe内で動作しているかをチェック
     */
    isInIframe(): boolean {
        if (!this.windowObj) return false;
        try {
            return this.windowObj.self !== this.windowObj.top;
        } catch (e) {
            // クロスオリジンの場合、アクセスできないのでiframe内と判断
            return true;
        }
    }

    getParentOrigin(): string | null {
        if (!this.windowObj || !this.isInIframe()) return null;

        if (this.parentOrigin) {
            return this.parentOrigin;
        }

        this.parentOrigin = getParentOriginFromSearch(this.windowObj.location?.search);
        return this.parentOrigin;
    }

    /**
     * オリジンが許可リストに含まれているかチェック
     * 許可リストが空の場合は全て許可
     */
    isOriginAllowed(origin: string | null): boolean {
        if (!origin) return false;
        if (this.allowedOrigins.length === 0) return true;
        return this.allowedOrigins.includes(origin);
    }

    sendMessageToParent(payload: IframeMessagePayload): boolean {
        if (!this.windowObj || !this.isInIframe()) {
            return false;
        }

        const parentOrigin = this.getParentOrigin();

        if (!parentOrigin) {
            this.console.warn('parentOrigin が未指定のため、iframe postMessage を送信できません');
            return false;
        }

        if (!this.isOriginAllowed(parentOrigin)) {
            this.console.warn(`親ウィンドウのオリジン ${parentOrigin} は許可されていません`);
            return false;
        }

        try {
            this.windowObj.parent.postMessage(payload, parentOrigin);
            this.console.log(`親ウィンドウ (${parentOrigin}) にメッセージを送信しました:`, payload);
            return true;
        } catch (error) {
            this.console.error('postMessageの送信に失敗しました:', error);
            return false;
        }
    }

    notifyPostSuccess(options: {
        eventId?: string;
        replyToEventId?: string;
        quotedEventIds?: string[];
    } = {}): boolean {
        const payload: EmbedPostSuccessPayload = {
            timestamp: Date.now(),
            ...(options.eventId ? { eventId: options.eventId } : {}),
            ...(options.replyToEventId ? { replyToEventId: options.replyToEventId } : {}),
            ...(options.quotedEventIds?.length ? { quotedEventIds: options.quotedEventIds } : {}),
        };

        return this.sendMessageToParent({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'post.success',
            payload,
        });
    }

    notifyPostError(error?: string | { code: string; message?: string }): boolean {
        const payload: EmbedPostErrorPayload = {
            timestamp: Date.now(),
            code: typeof error === 'string' ? error : error?.code ?? 'post_error',
            ...(typeof error === 'object' && error?.message ? { message: error.message } : {}),
        };

        return this.sendMessageToParent({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'post.error',
            payload,
        });
    }

    notifyComposerContextApplied(requestId?: string): boolean {
        const payload: EmbedComposerContextAppliedPayload = {
            timestamp: Date.now(),
        };

        return this.sendMessageToParent({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'composer.contextApplied',
            ...(requestId ? { requestId } : {}),
            payload,
        });
    }

    notifyComposerContextError(
        error?: string | { code: string; message?: string },
        requestId?: string,
    ): boolean {
        const payload: EmbedComposerContextErrorPayload = {
            timestamp: Date.now(),
            code: typeof error === 'string' ? error : error?.code ?? 'composer_context_error',
            ...(typeof error === 'object' && error?.message ? { message: error.message } : {}),
        };

        return this.sendMessageToParent({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'composer.contextError',
            ...(requestId ? { requestId } : {}),
            payload,
        });
    }

    notifyComposerContextUpdated(options: {
        reply: string | null;
        quotes: string[];
    }): boolean {
        const payload: EmbedComposerContextUpdatedPayload = {
            timestamp: Date.now(),
            reply: options.reply,
            quotes: options.quotes,
        };

        return this.sendMessageToParent({
            namespace: EMBED_MESSAGE_NAMESPACE,
            version: EMBED_MESSAGE_VERSION,
            type: 'composer.contextUpdated',
            payload,
        });
    }

    setParentOrigin(origin: string | null): void {
        this.parentOrigin = origin;
    }

    /**
     * 許可オリジンを設定
     */
    setAllowedOrigins(origins: string[]): void {
        this.allowedOrigins = origins;
    }

    /**
     * 許可オリジンを追加
     */
    addAllowedOrigin(origin: string): void {
        if (!this.allowedOrigins.includes(origin)) {
            this.allowedOrigins.push(origin);
        }
    }
}

// シングルトンインスタンス
export const iframeMessageService = new IframeMessageService();
