import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { authState } from "../stores/authStore.svelte";
import type { AuthService } from "./types";

/** NIP-46再接続の完了を待つ最大時間(ms) */
const NIP46_RECONNECT_WAIT_MS = 10000;
/** NIP-46再接続のポーリング間隔(ms) */
const NIP46_RECONNECT_POLL_MS = 200;

// --- NIP-98認証サービス ---
export class NostrAuthService implements AuthService {
    async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
        const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
        let signFunc: (event: any) => Promise<any>;
        if (storedKey) {
            signFunc = (event) => seckeySigner(storedKey).signEvent(event);
        } else if (nip46Service.isConnected()) {
            const signer = nip46Service.getSigner()!;
            signFunc = (event) => signer.signEvent(event);
        } else if (parentClientAuthService.isConnected()) {
            const signer = parentClientAuthService.getSigner()!;
            signFunc = (event) => signer.signEvent(event);
        } else if (authState.value.type === 'nip46') {
            // NIP-46認証だが接続が未完了（再接続中など）→ 接続完了を待つ
            const connected = await this.waitForNip46Connection();
            if (connected) {
                const signer = nip46Service.getSigner()!;
                signFunc = (event) => signer.signEvent(event);
            } else {
                throw new Error('Authentication required');
            }
        } else if (authState.value.type === 'parentClient') {
            const signer = parentClientAuthService.getSigner();
            if (!signer) {
                throw new Error('Authentication required');
            }
            signFunc = (event) => signer.signEvent(event);
        } else {
            // NIP-07の場合はwindow.nostrを即時利用
            const nostr = (window as any)?.nostr;

            if (nostr?.signEvent) {
                signFunc = (event) => nostr.signEvent(event);
            } else {
                throw new Error('Authentication required');
            }
        }
        const { getToken } = await import("nostr-tools/nip98");
        return await getToken(url, method, signFunc, true);
    }

    /**
     * NIP-46の接続が確立されるまでポーリングで待機する。
     * visibilitychange後の再接続やアプリ起動時の初期化完了待ちに使用。
     */
    private async waitForNip46Connection(): Promise<boolean> {
        const start = Date.now();
        while (Date.now() - start < NIP46_RECONNECT_WAIT_MS) {
            if (nip46Service.isConnected()) return true;
            await new Promise(r => setTimeout(r, NIP46_RECONNECT_POLL_MS));
        }
        return false;
    }
}
