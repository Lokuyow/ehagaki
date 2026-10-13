import { seckeySigner } from '@rx-nostr/crypto';
import type { EventTemplate } from 'nostr-tools';
import { authState } from '../stores/authStore.svelte';
import { settingsStore } from '../stores/settingsStore.svelte';
import { keyManager } from './keyManager.svelte';
import { nip46Service } from './nip46Service';
import { parentClientAuthService } from './parentClientAuthService';
import { buildClientTag } from './tags/clientTag';
import { buildReactionEvent } from './postReactionUtils';
import type { ReactionValue } from './reactionValue';
import { prepareSignedEventTemplate, validateSignedEventResult } from './signedEventResultValidator';
import { verifyRelatedEvent } from './relatedEventVerification';
import { RelayConfigUtils } from './relayConfigUtils';
import { postHistoryChildInteractionsRepository, type UpsertPostHistoryChildInteractionsInput } from './storage/postHistoryChildInteractionsRepository';
import { ehagakiDb } from './storage/ehagakiDb';
import { getPostHistoryChildWriteGeneration } from './storage/postHistoryLocalWriteScope';
import type { AuthState, KeyManagerInterface, NostrEvent, PostResult } from './types';
import type { PostManager } from './postManager';

interface Signer { signEvent?: (event: EventTemplate) => Promise<unknown> }
export interface PostReactionResult extends PostResult {
    targetEventId?: string;
    cacheSaved?: boolean;
    retryInput?: UpsertPostHistoryChildInteractionsInput;
}
interface Deps {
    authStateStore?: { value: AuthState };
    keyManager?: KeyManagerInterface;
    getNip07Signer?: () => Signer | null | undefined;
    getNip46Signer?: (pubkey: string) => Promise<Signer | null | undefined>;
    getParentClientSigner?: () => Signer | null | undefined;
    seckeySignerFn?: (key: string) => Signer;
    getClientTag?: () => string[] | null;
    saveCache?: (input: UpsertPostHistoryChildInteractionsInput) => Promise<unknown>;
    now?: () => number;
}
export class PostReactionService {
    private pending: symbol | null = null;
    private failedSaves = new Map<string, PostReactionResult>();
    private readonly deps;
    constructor(deps: Deps = {}) {
        this.deps = { authStateStore: deps.authStateStore ?? authState, keyManager: deps.keyManager ?? keyManager,
            getNip07Signer: deps.getNip07Signer ?? (() => typeof window !== 'undefined' ? window.nostr : null),
            getNip46Signer: deps.getNip46Signer ?? ((pubkey: string) => nip46Service.getSignerForSession(pubkey)),
            getParentClientSigner: deps.getParentClientSigner ?? (() => parentClientAuthService.getSigner()),
            seckeySignerFn: deps.seckeySignerFn ?? seckeySigner,
            getClientTag: deps.getClientTag ?? (() => buildClientTag(settingsStore.clientTagEnabled)),
            saveCache: deps.saveCache ?? ((input: UpsertPostHistoryChildInteractionsInput) => postHistoryChildInteractionsRepository.upsertChildInteractions(input)),
            now: deps.now ?? Date.now };
    }
    async react(params: { target: NostrEvent; relayHints: string[]; value: ReactionValue;
        publisher: Pick<PostManager, 'captureAuthorWriteRelays' | 'publishSignedEvent'>; isCurrent: () => boolean }): Promise<PostReactionResult> {
        if (this.pending) return { success: false, error: 'reaction_busy' };
        const operation = Symbol('reaction-submit');
        this.pending = operation;
        const generationReady = getPostHistoryChildWriteGeneration(ehagakiDb);
        try {
            const auth = this.deps.authStateStore.value;
            const pubkey = auth.pubkey;
            if (!auth.isAuthenticated || !pubkey) return { success: false, error: 'nostr_not_ready' };
            const isCurrent = () => this.deps.authStateStore.value === auth && auth.isAuthenticated
                && auth.pubkey === pubkey && params.isCurrent();
            const assertCurrent = () => { if (!isCurrent()) throw new Error('reaction_stale'); };
            assertCurrent();
            const target = verifyRelatedEvent(params.target);
            if (!target) throw new Error('invalid_reaction_target');
            const hints = RelayConfigUtils.sanitizeExternalRelayUrls(params.relayHints);
            const authorWriteRelaySnapshot = Object.freeze([...params.publisher.captureAuthorWriteRelays()]);
            const template = buildReactionEvent(target.event, pubkey, params.value, hints, Math.floor(this.deps.now() / 1000), this.deps.getClientTag());
            let signer: Signer | null | undefined;
            if (auth.type === 'nip07') signer = this.deps.getNip07Signer();
            else if (auth.type === 'nip46') signer = await this.deps.getNip46Signer(pubkey);
            else if (auth.type === 'parentClient') signer = this.deps.getParentClientSigner();
            else {
                const key = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(pubkey);
                if (key) signer = this.deps.seckeySignerFn(key);
            }
            assertCurrent();
            if (!signer?.signEvent) throw new Error('nostr_sign_event_not_supported');
            const prepared = prepareSignedEventTemplate(template);
            const signed = await signer.signEvent(prepared.signerTemplate);
            assertCurrent();
            const event = validateSignedEventResult(prepared.expectedTemplate, signed, pubkey);
            assertCurrent();
            const published = await params.publisher.publishSignedEvent({ event, sessionPubkey: pubkey,
                authorWriteRelaySnapshot, discoveryRelaysByRecipient: { [target.event.pubkey]: hints }, isCurrent });
            if (!published.success) return published;
            // Local writes can outlive the Composer and must not hold the next signing/publishing operation.
            if (this.pending === operation) this.pending = null;
            // ACK commits delivery. Persistence belongs to this immutable event, independent of UI/session liveness.
            const input: UpsertPostHistoryChildInteractionsInput = { parentEventId: target.event.id,
                reactionTarget: { eventId: target.event.id, targetAuthorPubkey: target.event.pubkey, targetKind: target.event.kind },
                expectedChildGeneration: await generationReady,
                events: [{ event, relayUrls: published.acceptedRelays ?? [] }] };
            const result: PostReactionResult = { ...published, eventId: event.id, event, targetEventId: target.event.id };
            try { await this.deps.saveCache(input); result.cacheSaved = true; }
            catch { result.cacheSaved = false; result.retryInput = input; this.failedSaves.set(event.id, result); }
            return result;
        } catch (error) {
            return { success: false, error: error instanceof Error && ['reaction_stale', 'invalid_reaction_target', 'invalid_reaction_value', 'nostr_sign_event_not_supported'].includes(error.message) ? error.message : 'post_error' };
        } finally { if (this.pending === operation) this.pending = null; }
    }
    getFailedSave(owner: string, targetId?: string): PostReactionResult | null {
        return [...this.failedSaves.values()].find(result => result.event?.pubkey === owner && (!targetId || result.targetEventId === targetId)) ?? null;
    }
    async retrySave(result: PostReactionResult): Promise<boolean> {
        if (!result.retryInput || result.event?.pubkey !== this.deps.authStateStore.value.pubkey) return false;
        try { await this.deps.saveCache(result.retryInput); this.failedSaves.delete(result.event!.id); return true; } catch { return false; }
    }
}
export const postReactionService = new PostReactionService();
