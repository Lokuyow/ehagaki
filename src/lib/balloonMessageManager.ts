import { BALLOON_MESSAGE_INFO_KEYS, BALLOON_MESSAGE_SUCCESS_KEYS, BALLOON_MESSAGE_ERROR_KEY } from "./constants";

export type BalloonMessageType = "success" | "error" | "info";

export interface BalloonMessage {
    type: BalloonMessageType;
    message: string;
}

export interface I18nFunction {
    (key: string): string | undefined;
}

/**
 * バルーンメッセージの管理を行うクラス
 */
export class BalloonMessageManager {
    private showTimeout: ReturnType<typeof setTimeout> | null = null;
    private lastMessageTime = 0; // デバウンス用タイムスタンプ
    private readonly debounceDelay = 500; // デバウンス間隔（ミリ秒）

    constructor(private $_: I18nFunction) { }

    /**
     * ランダムなinfoメッセージを取得
     */
    getRandomInfoMessage(): string {
        const keys = BALLOON_MESSAGE_INFO_KEYS;
        const randomIndex = Math.floor(Math.random() * keys.length);
        return this.$_(keys[randomIndex]) ?? "";
    }

    /**
     * ランダムなsuccessメッセージを取得
     */
    getRandomSuccessMessage(): string {
        const keys = BALLOON_MESSAGE_SUCCESS_KEYS;
        const randomIndex = Math.floor(Math.random() * keys.length);
        return this.$_(keys[randomIndex]) ?? "";
    }

    /**
     * エラーメッセージを取得
     */
    getErrorMessage(): string {
        return this.$_(BALLOON_MESSAGE_ERROR_KEY) ?? "";
    }

    /**
     * バルーンメッセージオブジェクトを作成（デバウンス機能付き）
     */
    createMessage(type: BalloonMessageType, message?: string, skipDebounce = false): BalloonMessage {
        const now = Date.now();
        
        // デバウンス: 前回から一定時間以内の場合はスキップ（skipDebounceがfalseの場合）
        if (!skipDebounce && now - this.lastMessageTime < this.debounceDelay) {
            return { type, message: "" }; // 空メッセージを返す
        }

        this.lastMessageTime = now;
        let finalMessage = message;

        if (!finalMessage) {
            switch (type) {
                case "info":
                    finalMessage = this.getRandomInfoMessage();
                    break;
                case "success":
                    finalMessage = this.getRandomSuccessMessage();
                    break;
                case "error":
                    finalMessage = this.getErrorMessage();
                    break;
                default:
                    finalMessage = "";
            }
        }

        return { type, message: finalMessage };
    }

    /**
     * タイムアウト付きでバルーンメッセージを表示するためのヘルパー
     */
    scheduleHide(callback: () => void, delay: number = 3000): void {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
        }
        this.showTimeout = setTimeout(callback, delay);
    }

    /**
     * タイムアウトをクリア
     */
    cancelScheduledHide(): void {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    /**
     * 強制的にメッセージを作成（デバウンスをスキップ）
     */
    createMessageImmediate(type: BalloonMessageType, message?: string): BalloonMessage {
        return this.createMessage(type, message, true);
    }

    /**
     * クリーンアップ
     */
    dispose(): void {
        this.cancelScheduledHide();
        this.lastMessageTime = 0;
    }
}
