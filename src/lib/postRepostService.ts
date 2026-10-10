import { seckeySigner } from "@rx-nostr/crypto";
import type { EventTemplate } from "nostr-tools";
import type { RxNostr } from "rx-nostr";
import { authState } from "../stores/authStore.svelte";
import { writeRelaysStore } from "../stores/relayStore.svelte";
import { settingsStore } from "../stores/settingsStore.svelte";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { PostEventSender } from "./postEventBuilder";
import { buildClientTag } from "./tags/clientTag";
import { buildRepostEvent, isRepostTargetKind, verifyRepostTarget } from "./postRepostUtils";
import { RelayConfigUtils } from "./relayConfigUtils";
import { assertActiveSession } from "./sessionLiveness";
import { createPlainNostrEventSnapshot } from "./postHistoryEventUtils";
import { prepareSignedEventTemplate, validateSignedEventResult } from "./signedEventResultValidator";
import { attestFullyVerifiedPostHistoryRawEvent } from "./postHistoryRawEventVerification";
import { postHistoryRepository, type PostHistorySaveInput } from "./storage/postHistoryRepository";
import { ehagakiDb } from "./storage/ehagakiDb";
import { getPostHistoryLocalRevision } from "./storage/postHistoryLocalWriteScope";
import type { PostHistoryRelatedTargetSnapshot } from "./postHistoryRelatedTargetResolver.svelte";
import type { AuthState, KeyManagerInterface, NostrEvent, PostResult } from "./types";

interface Signer { signEvent?: (event: EventTemplate) => Promise<unknown> }
export type PrepareRepostTarget = (target: NostrEvent, relayHints: string[]) => Promise<PostHistoryRelatedTargetSnapshot | null>;
export interface PostRepostResult extends PostResult {
    historySaved?: boolean;
    retryInput?: PostHistorySaveInput;
}
export interface PostRepostServiceDeps {
    authStateStore?: { value: AuthState };
    keyManager?: KeyManagerInterface;
    getNip07Signer?: () => Signer | null | undefined;
    getNip46Signer?: (pubkey: string) => Promise<Signer | null | undefined>;
    getParentClientSigner?: () => Signer | null | undefined;
    seckeySignerFn?: (key: string) => Signer;
    getWriteRelays?: () => string[];
    getClientTag?: () => string[] | null;
    getLocalRevision?: (pubkey: string) => Promise<number>;
    saveHistory?: (input: PostHistorySaveInput) => Promise<void>;
    createSender?: (rx: RxNostr) => Pick<PostEventSender, "sendEvent">;
    now?: () => number;
}

export class PostRepostService {
    private pending = false;
    private readonly deps;
    constructor(deps: PostRepostServiceDeps = {}) {
        this.deps = {
            authStateStore: deps.authStateStore ?? authState,
            keyManager: deps.keyManager ?? keyManager,
            getNip07Signer: deps.getNip07Signer ?? (() => typeof window !== "undefined" ? window.nostr : null),
            getNip46Signer: deps.getNip46Signer ?? ((pubkey: string) => nip46Service.getSignerForSession(pubkey)),
            getParentClientSigner: deps.getParentClientSigner ?? (() => parentClientAuthService.getSigner()),
            seckeySignerFn: deps.seckeySignerFn ?? seckeySigner,
            getWriteRelays: deps.getWriteRelays ?? (() => writeRelaysStore.value),
            getClientTag: deps.getClientTag ?? (() => buildClientTag(settingsStore.clientTagEnabled)),
            getLocalRevision: deps.getLocalRevision ?? ((pubkey: string) => getPostHistoryLocalRevision(ehagakiDb, pubkey)),
            saveHistory: deps.saveHistory ?? ((input: PostHistorySaveInput) => postHistoryRepository.putPostedEvent(input)),
            createSender: deps.createSender ?? ((rx: RxNostr) => new PostEventSender(rx, console)),
            now: deps.now ?? Date.now,
        };
    }

    async repost(params: { target: NostrEvent; relayHints: string[]; rxNostr?: RxNostr;
        isCurrent?: () => boolean; prepareTarget: PrepareRepostTarget }): Promise<PostRepostResult> {
        if (this.pending) return { success: false, error: "repost_busy" };
        this.pending = true;
        try {
            const auth = this.deps.authStateStore.value;
            const pubkey = auth.pubkey;
            if (!auth.isAuthenticated || !pubkey || !params.rxNostr) return { success: false, error: "nostr_not_ready" };
            const assertCurrent = () => {
                assertActiveSession(this.deps.authStateStore, pubkey);
                if (this.deps.authStateStore.value.type !== auth.type || params.isCurrent?.() === false) throw new Error("session_changed");
            };
            const target = verifyRepostTarget(params.target);
            if (!target || !isRepostTargetKind(target.event.kind)) return { success: false, error: "invalid_repost_target" };
            const expectedRevision = await this.deps.getLocalRevision(pubkey);
            assertCurrent();
            const preparedTarget = await params.prepareTarget(target.event, RelayConfigUtils.sanitizeExternalRelayUrls(params.relayHints));
            assertCurrent();
            if (preparedTarget?.status !== "resolved" || !verifyRepostTarget(preparedTarget.event, {
                eventId: target.event.id, authorHint: target.event.pubkey, relayHints: [],
            })) return { success: false, error: "invalid_repost_target" };
            const hints = RelayConfigUtils.sanitizeExternalRelayUrls(preparedTarget.relayHints);
            if (!hints.length) return { success: false, error: "repost_relay_missing" };
            const writeRelays = RelayConfigUtils.sanitizeExternalRelayUrls(this.deps.getWriteRelays());
            if (!writeRelays.length) return { success: false, error: "no_write_relays" };
            let signer: Signer | null | undefined;
            if (auth.type === "nip07") signer = this.deps.getNip07Signer();
            else if (auth.type === "nip46") signer = await this.deps.getNip46Signer(pubkey);
            else if (auth.type === "parentClient") signer = this.deps.getParentClientSigner();
            else {
                const key = this.deps.keyManager.getFromStore() || this.deps.keyManager.loadFromStorage(pubkey);
                if (key) signer = this.deps.seckeySignerFn(key);
            }
            assertCurrent();
            if (!signer?.signEvent) return { success: false, error: "nostr_sign_event_not_supported" };
            const template = buildRepostEvent(target.event, pubkey, hints[0]!, Math.floor(this.deps.now() / 1000), this.deps.getClientTag());
            const prepared = prepareSignedEventTemplate(template);
            const result = await signer.signEvent(prepared.signerTemplate);
            assertCurrent();
            const signed = validateSignedEventResult(prepared.expectedTemplate, result, pubkey);
            const verified = attestFullyVerifiedPostHistoryRawEvent(signed);
            if (!verified) return { success: false, error: "post_error" };
            assertCurrent();
            const published = await this.deps.createSender(params.rxNostr).sendEvent(verified.event, {
                targetRelays: writeRelays, includeDefaultWriteRelays: false,
            });
            if (!published.success) return published;
            const input: PostHistorySaveInput = { event: verified.event, attestation: verified.attestation,
                acceptedRelays: published.acceptedRelays, relayHints: [...(published.acceptedRelays ?? []), ...writeRelays],
                repostTarget: { event: createPlainNostrEventSnapshot(target.event), relayHints: hints },
                localWriteScope: { ownerPubkeyHex: pubkey, expectedRevision, isActive: () => true } };
            try {
                await this.deps.saveHistory(input);
                return { ...published, eventId: signed.id, event: signed, historySaved: true };
            } catch {
                return { ...published, eventId: signed.id, event: signed, historySaved: false, retryInput: input };
            }
        } catch {
            return { success: false, error: "post_error" };
        } finally { this.pending = false; }
    }

    async retrySave(input: PostHistorySaveInput): Promise<boolean> {
        try { await this.deps.saveHistory(input); return true; } catch { return false; }
    }
}

export const postRepostService = new PostRepostService();
