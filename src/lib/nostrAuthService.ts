import { seckeySigner } from "@rx-nostr/crypto";
import type { Signer } from "nostr-tools/signer";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { authState } from "../stores/authStore.svelte";
import type { AuthService } from "./types";

function base64Encode(value: string): string {
    const binary = encodeURIComponent(value).replace(
        /%([0-9A-F]{2})/g,
        (_match, hex) => String.fromCharCode(Number.parseInt(hex, 16)),
    );
    return btoa(binary);
}

// --- NIP-98認証サービス ---
export class NostrAuthService implements AuthService {
    async getEventSigner(): Promise<Signer> {
        const storedKey = keyManager.getFromStore() || keyManager.loadFromStorage();
        if (storedKey) {
            return {
                getPublicKey: async () => {
                    const derived = keyManager.derivePublicKey(storedKey);
                    if (!derived.hex) {
                        throw new Error('Authentication required');
                    }
                    return derived.hex;
                },
                signEvent: async (event) => await seckeySigner(storedKey).signEvent(event) as any,
            };
        }

        if (authState.value.type === 'nip46') {
            const initialSigner = nip46Service.getSigner();
            if (initialSigner) {
                return initialSigner;
            }

            const connected = await nip46Service.waitForPendingOperation();
            if (connected) {
                const signer = nip46Service.getSigner();
                if (signer) {
                    return signer;
                }
            }
            throw new Error('Authentication required');
        }

        if (authState.value.type === 'parentClient') {
            const signer = parentClientAuthService.getSigner();
            if (!signer) {
                throw new Error('Authentication required');
            }
            return signer;
        }

        // NIP-07の場合はwindow.nostrを即時利用
        const nostr = (window as any)?.nostr;
        if (nostr?.signEvent) {
            return {
                getPublicKey: async () => {
                    if (typeof nostr.getPublicKey === 'function') {
                        return await nostr.getPublicKey();
                    }
                    if (authState.value.pubkey) {
                        return authState.value.pubkey;
                    }
                    throw new Error('Authentication required');
                },
                signEvent: async (event) => await nostr.signEvent(event),
            };
        }

        throw new Error('Authentication required');
    }

    private async getSignFunction(): Promise<(event: any) => Promise<any>> {
        const signer = await this.getEventSigner();
        return async (event) => await signer.signEvent(event);
    }

    async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
        const signFunc = await this.getSignFunction();
        const { getToken } = await import("nostr-tools/nip98");
        return await getToken(url, method, signFunc, true);
    }

    async getBlossomSigner(): Promise<Signer> {
        return await this.getEventSigner();
    }

    async buildBlossomAuthorizationHeader(params: {
        serverUrl: string;
        method: string;
        sha256?: string;
        contentType?: string;
        contentLength?: number;
    }): Promise<string> {
        void params.serverUrl;
        void params.contentType;
        void params.contentLength;

        const signer = await this.getEventSigner();
        const now = Math.floor(Date.now() / 1000);
        const tags = [
            ["expiration", String(now + 60)],
            ["t", params.method],
        ];
        if (params.sha256) tags.push(["x", params.sha256]);

        const event = await signer.signEvent({
            kind: 24242,
            created_at: now,
            content: "blossom stuff",
            tags,
        });

        return `Nostr ${base64Encode(JSON.stringify(event))}`;
    }
}
