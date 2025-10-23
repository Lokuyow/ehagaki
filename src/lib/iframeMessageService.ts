/**
 * iframeメッセージングサービス
 * 
 * このアプリがiframe内で動作している場合に、親ウィンドウへpostMessageを送信する機能を提供します。
 * - 投稿成功時: 'POST_SUCCESS'
 * - 投稿失敗時: 'POST_ERROR'
 * - 親ウィンドウのオリジンをチェックして安全に通信
 */

export interface IframeMessagePayload {
    type: 'POST_SUCCESS' | 'POST_ERROR';
    timestamp: number;
    error?: string;
}

export interface IframeMessageServiceConfig {
    allowedOrigins?: string[];
    console?: Console;
    window?: Window;
}

export class IframeMessageService {
    private allowedOrigins: string[];
    private console: Console;
    private windowObj: Window | undefined;

    constructor(config: IframeMessageServiceConfig = {}) {
        this.allowedOrigins = config.allowedOrigins || [];
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

    /**
     * 親ウィンドウのオリジンを取得
     * 取得できない場合（クロスオリジン）は null を返す
     */
    getParentOrigin(): string | null {
        if (!this.windowObj || !this.isInIframe()) return null;

        try {
            // 同一オリジンの場合は直接アクセス可能
            return this.windowObj.parent.location.origin;
        } catch (e) {
            // クロスオリジンの場合はアクセスできない
            // document.referrer から推測を試みる
            if (this.windowObj.document && this.windowObj.document.referrer) {
                try {
                    const url = new URL(this.windowObj.document.referrer);
                    return url.origin;
                } catch (err) {
                    this.console.warn('親ウィンドウのオリジンを取得できませんでした:', err);
                    return null;
                }
            }
            return null;
        }
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

    /**
     * 親ウィンドウにメッセージを送信
     */
    sendMessageToParent(payload: IframeMessagePayload): boolean {
        if (!this.windowObj || !this.isInIframe()) {
            return false;
        }

        const parentOrigin = this.getParentOrigin();

        // 親オリジンが取得できない場合、または許可されていない場合
        if (!parentOrigin) {
            this.console.warn('親ウィンドウのオリジンを特定できないため、postMessageを送信できません');
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

    /**
     * 投稿成功を通知
     */
    notifyPostSuccess(): boolean {
        return this.sendMessageToParent({
            type: 'POST_SUCCESS',
            timestamp: Date.now()
        });
    }

    /**
     * 投稿失敗を通知
     */
    notifyPostError(error?: string): boolean {
        return this.sendMessageToParent({
            type: 'POST_ERROR',
            timestamp: Date.now(),
            error
        });
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
