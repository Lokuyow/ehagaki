import { BALLOON_MESSAGE_SUCCESS_KEYS, BALLOON_MESSAGE_TIPS_KEYS, BALLOON_MESSAGE_ERROR_KEY, BALLOON_MESSAGE_REJECTED_KEY, BALLOON_MESSAGE_TIMEOUT_KEY, BALLOON_MESSAGE_NETWORK_ERROR_KEY } from "./constants";
import type { BalloonMessageType, BalloonMessage, I18nFunction } from "./types";
import { json } from "svelte-i18n";
import { get } from "svelte/store";

export class BalloonMessageManager {
    private showTimeout: ReturnType<typeof setTimeout> | null = null;
    private lastMessageTime = 0; // デバウンス用タイムスタンプ
    private readonly debounceDelay = 500; // デバウンス間隔（ミリ秒）
    private lastInfoMessage: string | null = null;
    /** 時間帯メッセージが選ばれる確率（0〜1） */
    private readonly timeBasedMessageProbability = 0.3;

    constructor(private $_: I18nFunction) { }

    /**
     * 現在のローカル時刻から時間帯を返す
     */
    getTimePeriod(): "morning" | "afternoon" | "evening" | "night" | "midnight" {
        const hour = new Date().getHours();
        // 新しい時間帯定義:
        // morning: 5:00 - 10:59
        // afternoon: 11:00 - 15:59
        // evening: 16:00 - 19:59
        // night: 20:00 - 23:59
        // midnight: 0:00 - 4:59
        if (hour >= 5 && hour <= 10) return "morning";
        if (hour >= 11 && hour <= 15) return "afternoon";
        if (hour >= 16 && hour <= 19) return "evening";
        if (hour >= 20 && hour <= 23) return "night";
        return "midnight";
    }

    /**
     * ランダムなinfoメッセージを取得
     * 30%の確率で現在の時間帯メッセージプールから、70%の確率で通常infoから選択。
     * 時間帯メッセージが空の場合は通常infoにフォールバック。
     * 直前のメッセージと重複しないよう選択。
     */
    getRandomInfoMessage(): string {
        const infoMessages = get(json)("balloonMessage.info") as string[];
        const timePeriod = this.getTimePeriod();
        const timeMessages = (get(json)(`balloonMessage.infoByTime.${timePeriod}`) ?? []) as string[];

        const useTimeBased = timeMessages.length > 0 && Math.random() < this.timeBasedMessageProbability;
        const pool = useTimeBased ? timeMessages : infoMessages;

        if (pool.length === 0) return "";
        if (pool.length === 1) {
            this.lastInfoMessage = pool[0] ?? null;
            return pool[0] ?? "";
        }

        const filtered = pool.filter((message) => message !== this.lastInfoMessage);
        const candidates = filtered.length > 0 ? filtered : pool;
        const selectedMessage = candidates[Math.floor(Math.random() * candidates.length)] ?? "";
        this.lastInfoMessage = selectedMessage;
        return selectedMessage;
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
     * ランダムなtipsメッセージを取得
     */
    getRandomTipsMessage(): string {
        const keys = BALLOON_MESSAGE_TIPS_KEYS;
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
                case "tips":
                    finalMessage = this.getRandomTipsMessage();
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
     * 投稿エラー種別に応じたメッセージを作成（デバウンスをスキップ）
     * @param errorType エラー種別 ("post_rejected" | "post_timeout" | "post_network_error" | "post_error")
     */
    createErrorMessage(errorType: string): BalloonMessage {
        switch (errorType) {
            case "post_timeout":
                return { type: "warning", message: this.$_(BALLOON_MESSAGE_TIMEOUT_KEY) ?? "" };
            case "post_rejected":
                return { type: "error", message: this.$_(BALLOON_MESSAGE_REJECTED_KEY) ?? "" };
            case "post_network_error":
                return { type: "error", message: this.$_(BALLOON_MESSAGE_NETWORK_ERROR_KEY) ?? "" };
            default:
                return { type: "error", message: this.getErrorMessage() };
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
        this.lastInfoMessage = null;
    }
}
