import { seckeySigner } from "@rx-nostr/crypto";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import type { AuthService } from "./types";

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
}
