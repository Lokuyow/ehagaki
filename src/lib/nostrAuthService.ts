import { seckeySigner } from "@rx-nostr/crypto";
import type { Authenticator } from "rx-nostr";
import { makeAuthEvent } from "nostr-tools/nip42";
import type { Signer } from "nostr-tools/signer";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { authState } from "../stores/authStore.svelte";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { AuthService } from "./types";
import { assertActiveSession, captureActiveSessionPubkey } from "./sessionLiveness";
import {
    prepareSignedEventTemplate,
    validateSignedEventResult,
} from "./signedEventResultValidator";
import { encodeBlossomAuthorizationHeader } from "./upload/blossomAuthorization";

// --- NIP-98認証サービス ---
export class NostrAuthService implements AuthService {
    async getEventSigner(expectedPubkey?: string): Promise<Signer> {
        const sessionPubkey = expectedPubkey ?? captureActiveSessionPubkey(authState);
        assertCurrentSession(sessionPubkey);
        const signer = await this.getSessionEventSigner(sessionPubkey);
        assertCurrentSession(sessionPubkey);
        return this.createSessionBoundSigner(signer, sessionPubkey);
    }

    private async getSessionEventSigner(sessionPubkey: string): Promise<Signer> {
        const auth = authState.value;
        if (!auth.isAuthenticated || auth.pubkey !== sessionPubkey) {
            throw new Error('Authentication required');
        }

        if (auth.type === 'nsec') {
            const currentStoredKey = keyManager.getFromStore();
            const storedKey = currentStoredKey
                && keyManager.derivePublicKey(currentStoredKey).hex === sessionPubkey
                ? currentStoredKey
                : keyManager.loadFromStorage(sessionPubkey);
            if (!storedKey || keyManager.derivePublicKey(storedKey).hex !== sessionPubkey) {
                throw new Error('Authentication required');
            }
            return {
                getPublicKey: async () => sessionPubkey,
                signEvent: async (event) => await seckeySigner(storedKey).signEvent(event) as any,
            };
        }

        if (auth.type === 'nip46') {
            return await this.getCurrentNip46Signer(sessionPubkey);
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

    private createSessionBoundSigner(signer: Signer, sessionPubkey: string): Signer {
        return {
            getPublicKey: async () => {
                assertCurrentSession(sessionPubkey);
                const pubkey = await signer.getPublicKey();
                assertCurrentSession(sessionPubkey);
                if (pubkey !== sessionPubkey) {
                    throw new Error('Authentication required');
                }
                return pubkey;
            },
            signEvent: async (template) => {
                assertCurrentSession(sessionPubkey);
                const prepared = prepareSignedEventTemplate(template);
                const signedEvent = await signer.signEvent(prepared.signerTemplate);
                assertCurrentSession(sessionPubkey);
                const validated = validateSignedEventResult(
                    prepared.expectedTemplate,
                    signedEvent,
                    sessionPubkey,
                );
                assertCurrentSession(sessionPubkey);
                return validated as any;
            },
        };
    }

    private async getCurrentNip46Signer(expectedPubkey: string): Promise<Signer> {
        const authBefore = authState.value;
        if (
            !authBefore.isAuthenticated
            || authBefore.type !== 'nip46'
            || authBefore.pubkey !== expectedPubkey
        ) {
            throw new Error('Authentication required');
        }

        const signer = await nip46Service.getSignerForSession(expectedPubkey);
        const authAfter = authState.value;
        if (
            !signer
            || !authAfter.isAuthenticated
            || authAfter.type !== 'nip46'
            || authAfter.pubkey !== expectedPubkey
        ) {
            throw new Error('Authentication required');
        }

        return signer;
    }

    async buildAuthHeader(url: string, method: string = "POST"): Promise<string> {
        const sessionPubkey = captureActiveSessionPubkey(authState);
        const signer = await this.getEventSigner(sessionPubkey);
        assertCurrentSession(sessionPubkey);
        const { getToken } = await import("nostr-tools/nip98");
        assertCurrentSession(sessionPubkey);
        const token = await getToken(
            url,
            method,
            async (template) => await signer.signEvent(template),
            true,
        );
        assertCurrentSession(sessionPubkey);
        return token;
    }

    async getBlossomSigner(): Promise<Signer> {
        const sessionPubkey = captureActiveSessionPubkey(authState);
        return await this.getEventSigner(sessionPubkey);
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

        const sessionPubkey = captureActiveSessionPubkey(authState);
        const signer = await this.getEventSigner(sessionPubkey);
        assertCurrentSession(sessionPubkey);
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

        assertCurrentSession(sessionPubkey);
        return encodeBlossomAuthorizationHeader(JSON.stringify(event));
    }
}

function assertCurrentSession(sessionPubkey: string): void {
    assertActiveSession(authState, sessionPubkey);
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
export function createNip42Authenticator(sessionPubkey: string): (boundRelayUrl: string) => Authenticator {
    const authService = new NostrAuthService();
    return (boundRelayUrl) => ({
        signer: {
            getPublicKey: async () => {
                assertCurrentSession(sessionPubkey);
                return sessionPubkey;
            },
            signEvent: async (params: any) => {
                assertCurrentSession(sessionPubkey);
                const challenge = getAuthTagValue(params.tags, 'challenge');
                const relayUrl = getAuthTagValue(params.tags, 'relay');
                // rx-nostr passes the pre-normalized URL to its authenticator
                // factory but constructs this tag from RelayConnection.url.
                // Normalize both values so a trailing-slash difference remains
                // valid, while keeping the AUTH event bound to this connection.
                const normalizedBoundRelayUrl = RelayConfigUtils.normalizeExternalRelayUrl(boundRelayUrl);
                const normalizedTaggedRelayUrl = RelayConfigUtils.normalizeExternalRelayUrl(relayUrl);
                if (!normalizedBoundRelayUrl || normalizedTaggedRelayUrl !== normalizedBoundRelayUrl) {
                    throw new Error('Invalid NIP-42 authentication event');
                }
                validateAuthEvent(params, relayUrl, challenge);
                const authEvent = makeAuthEvent(relayUrl, challenge);

                try {
                    console.debug('nip42_auth_sign_requested', {
                        method: 'sign_event:22242',
                        stage: 'start',
                    });
                    const signer = await authService.getEventSigner(sessionPubkey);
                    assertCurrentSession(sessionPubkey);
                    const signed = await signer.signEvent(authEvent);
                    assertCurrentSession(sessionPubkey);
                    validateAuthEvent(signed, relayUrl, challenge, sessionPubkey);
                    console.debug('nip42_auth_sign_succeeded', {
                        method: 'sign_event:22242',
                        stage: 'success',
                    });
                    return signed as any;
                } catch (error) {
                    console.warn('nip42_auth_sign_failed', {
                        method: 'sign_event:22242',
                        stage: 'failure',
                        reason: 'unexpected',
                    });
                    throw error;
                }
            },
        },
    });
}
