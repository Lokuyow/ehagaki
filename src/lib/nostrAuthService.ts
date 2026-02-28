import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager.svelte";
import type { AuthService } from "./types";

// --- NIP-98認証サービス ---
export class NostrAuthService implements AuthService {
    /**
     * window.nostrが利用可能になるまで待機する（nostr-login初期化用）
     * @param maxWaitMs 最大待機時間（ミリ秒）
     * @param pollIntervalMs ポーリング間隔（ミリ秒）
     * @returns window.nostrオブジェクト（利用可能な場合）またはnull
     */
    private async waitForWindowNostr(maxWaitMs: number = 3000, pollIntervalMs: number = 100): Promise<any | null> {
        const startTime = Date.now();

        while (Date.now() - startTime < maxWaitMs) {
            const nostr = (window as any)?.nostr;
            if (nostr?.signEvent) {
                return nostr;
            }
            await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
        }

        return null;
    }

    async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
        const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
        let signFunc: (event: any) => Promise<any>;
        if (storedKey) {
            signFunc = (event) => seckeySigner(storedKey).signEvent(event);
        } else {
            // まずwindow.nostrを即時チェック
            let nostr = (window as any)?.nostr;

            // window.nostrがない場合、nostr-loginの初期化を待機
            if (!nostr?.signEvent) {
                nostr = await this.waitForWindowNostr();
            }

            if (nostr?.signEvent) {
                signFunc = (event) => nostr.signEvent(event);
            } else {
                throw new Error('Authentication required');
            }
        }
        const { getToken } = await import("nostr-tools/nip98");
        return await getToken(url, method, signFunc, true);
    }
}
