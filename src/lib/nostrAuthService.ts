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
    private async getSignFunction(): Promise<(event: any) => Promise<any>> {
        const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
        if (storedKey) {
            return (event) => seckeySigner(storedKey).signEvent(event);
        } else if (nip46Service.isConnected()) {
            const signer = nip46Service.getSigner()!;
            return (event) => signer.signEvent(event);
        } else if (parentClientAuthService.isConnected()) {
            const signer = parentClientAuthService.getSigner()!;
            return (event) => signer.signEvent(event);
        } else if (authState.value.type === 'nip46') {
            // NIP-46認証だが接続が未完了（再接続中など）→ 接続完了を待つ
            const connected = await this.waitForNip46Connection();
            if (connected) {
                const signer = nip46Service.getSigner()!;
                return (event) => signer.signEvent(event);
            }
            throw new Error('Authentication required');
        } else if (authState.value.type === 'parentClient') {
            const signer = parentClientAuthService.getSigner();
            if (!signer) {
                throw new Error('Authentication required');
            }
            return (event) => signer.signEvent(event);
        } else {
            // NIP-07の場合はwindow.nostrを即時利用
            const nostr = (window as any)?.nostr;

            if (nostr?.signEvent) {
                return (event) => nostr.signEvent(event);
            }
            throw new Error('Authentication required');
        }
    }

    async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
        const signFunc = await this.getSignFunction();
        const { getToken } = await import("nostr-tools/nip98");
        return await getToken(url, method, signFunc, true);
    }

    async buildBlossomAuthorizationHeader(params: {
        serverUrl: string;
        method: string;
        sha256?: string;
        contentType?: string;
        contentLength?: number;
    }): Promise<string> {
        const signFunc = await this.getSignFunction();
        const expiration = Math.floor(Date.now() / 1000) + 60 * 5;
        const tags = [
            ["t", params.method],
            ["expiration", String(expiration)],
            ["server", params.serverUrl],
        ];
        if (params.sha256) tags.push(["x", params.sha256]);
        if (params.contentType) tags.push(["m", params.contentType]);
        if (params.contentLength !== undefined) tags.push(["size", String(params.contentLength)]);

        const event = await signFunc({
            kind: 24242,
            created_at: Math.floor(Date.now() / 1000),
            content: "",
            tags,
        });
        return `Nostr ${btoa(JSON.stringify(event))}`;
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
