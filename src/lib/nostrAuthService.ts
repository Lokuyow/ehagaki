import { seckeySigner } from "@rx-nostr/crypto";
import type { Authenticator } from "rx-nostr";
import { makeAuthEvent } from "nostr-tools/nip42";
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
    async getEventSigner(expectedPubkey?: string): Promise<Signer> {
        if (expectedPubkey) {
            return this.getSessionEventSigner(expectedPubkey);
        }

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

    private async getSessionEventSigner(sessionPubkey: string): Promise<Signer> {
        const auth = authState.value;
        if (!auth.isAuthenticated || auth.pubkey !== sessionPubkey) {
            throw new Error('Authentication required');
        }

        if (auth.type === 'nsec') {
            const storedKey = keyManager.loadFromStorage(sessionPubkey);
            if (!storedKey || keyManager.derivePublicKey(storedKey).hex !== sessionPubkey) {
                throw new Error('Authentication required');
            }
            return {
                getPublicKey: async () => sessionPubkey,
                signEvent: async (event) => await seckeySigner(storedKey).signEvent(event) as any,
            };
        }

        if (auth.type === 'nip46') {
            if (await nip46Service.waitForPendingOperation()) {
                const signer = nip46Service.getSigner();
                if (signer) return signer;
            }
            throw new Error('Authentication required');
        }

        if (auth.type === 'parentClient') {
            const signer = parentClientAuthService.getSigner();
            if (signer) return signer;
            throw new Error('Authentication required');
        }

        if (auth.type === 'nip07') {
            const nostr = (window as any)?.nostr;
            if (!nostr?.signEvent) throw new Error('Authentication required');
            return {
                getPublicKey: async () => {
                    const pubkey = typeof nostr.getPublicKey === 'function'
                        ? await nostr.getPublicKey()
                        : sessionPubkey;
                    if (pubkey !== sessionPubkey) throw new Error('Authentication required');
                    return pubkey;
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

function assertCurrentSession(sessionPubkey: string): void {
    if (!authState.value.isAuthenticated || authState.value.pubkey !== sessionPubkey) {
        throw new Error('Authentication required');
    }
}

function getAuthTagValue(tags: unknown, name: string): string {
    if (!Array.isArray(tags)) throw new Error('Invalid NIP-42 authentication event');
    const tag = tags.find((candidate) => Array.isArray(candidate) && candidate[0] === name);
    if (!tag || typeof tag[1] !== 'string' || !tag[1]) {
        throw new Error('Invalid NIP-42 authentication event');
    }
    return tag[1];
}

function validateAuthEvent(
    event: any,
    relayUrl: string,
    challenge: string,
    sessionPubkey?: string,
): void {
    if (event?.kind !== 22242 || event?.content !== '') {
        throw new Error('Invalid NIP-42 authentication event');
    }
    if (getAuthTagValue(event.tags, 'relay') !== relayUrl
        || getAuthTagValue(event.tags, 'challenge') !== challenge) {
        throw new Error('Invalid NIP-42 authentication event');
    }
    if (sessionPubkey && event.pubkey !== sessionPubkey) {
        throw new Error('Authentication required');
    }
}

/**
 * rx-nostr owns AUTH transport and retry. This signer validates the relay-bound
 * challenge, supplies the canonical timestamped template required by NIP-07,
 * and resolves the active application signer lazily.
 */
export function createNip42Authenticator(sessionPubkey: string): (_relayUrl: string) => Authenticator {
    const authService = new NostrAuthService();
    return (_relayUrl) => ({
        signer: {
            getPublicKey: async () => {
                assertCurrentSession(sessionPubkey);
                return sessionPubkey;
            },
            signEvent: async (params: any) => {
                assertCurrentSession(sessionPubkey);
                const challenge = getAuthTagValue(params.tags, 'challenge');
                // rx-nostr creates this tag from RelayConnection.url. Its
                // authenticator factory, however, receives the pre-normalized URL.
                // Use the rx-nostr-created tag to avoid a trailing-slash mismatch.
                const relayUrl = getAuthTagValue(params.tags, 'relay');
                validateAuthEvent(params, relayUrl, challenge);
                const authEvent = makeAuthEvent(relayUrl, challenge);

                try {
                    console.debug('nip42_auth_sign_requested', { relay: relayUrl });
                    const signer = await authService.getEventSigner(sessionPubkey);
                    assertCurrentSession(sessionPubkey);
                    const signed = await signer.signEvent(authEvent);
                    assertCurrentSession(sessionPubkey);
                    validateAuthEvent(signed, relayUrl, challenge, sessionPubkey);
                    console.debug('nip42_auth_sign_succeeded', { relay: relayUrl });
                    return signed as any;
                } catch (error) {
                    console.warn('nip42_auth_sign_failed', {
                        relay: relayUrl,
                        message: error instanceof Error ? error.message : 'Unknown error',
                    });
                    throw error;
                }
            },
        },
    });
}
