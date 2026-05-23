import { seckeySigner } from "@rx-nostr/crypto";
import type { RxNostr } from "rx-nostr";
import { authState } from "../stores/authStore.svelte";
import { writeRelaysStore } from "../stores/relayStore.svelte";
import { keyManager } from "./keyManager.svelte";
import { nip46Service } from "./nip46Service";
import { parentClientAuthService } from "./parentClientAuthService";
import { PostEventSender } from "./postEventBuilder";
import { RelayConfigUtils } from "./relayConfigUtils";
import type { PostHistoryRecord } from "./storage/ehagakiDb";
import {
    postHistoryRepository,
    type PostHistoryRepository,
} from "./storage/postHistoryRepository";
import type { PostResult, AuthState, KeyManagerInterface, NostrEvent } from "./types";

export const POST_DELETION_SUPPORTED_KINDS = [1, 42] as const;

export interface DeletionRequestResult extends PostResult {
    deletedAt?: number;
    deletionEventId?: string;
    deletionEvent?: NostrEvent;
}

export interface DeletionSigner {
    signEvent?: (event: any) => Promise<any>;
}

export interface PostDeletionServiceDeps {
    authStateStore?: {
        value: AuthState;
    };
    keyManager?: KeyManagerInterface;
    window?: {
        nostr?: {
            signEvent?: (event: any) => Promise<any>;
        };
    };
    console?: Console;
    seckeySignerFn?: (key: string) => DeletionSigner;
    getNip46SignerFn?: () => DeletionSigner | null | undefined;
    waitForNip46ReadyFn?: () => Promise<boolean>;
    getParentClientSignerFn?: () => DeletionSigner | null | undefined;
    writeRelaysStore?: {
        value: string[];
    };
    postHistoryRepository?: Pick<PostHistoryRepository, "markDeleted">;
    eventSenderFactory?: (
        rxNostr: RxNostr,
        console: Console,
    ) => Pick<PostEventSender, "sendEvent">;
    now?: () => number;
}

type SupportedPostKind = (typeof POST_DELETION_SUPPORTED_KINDS)[number];

type DeletionRequestTemplate = {
    kind: 5;
    pubkey: string;
    content: "";
    tags: [["e", string], ["k", string]];
    created_at: number;
};

function createFallbackConsole(): Console {
    return {
        log: () => undefined,
        warn: () => undefined,
        error: () => undefined,
    } as Console;
}

export function canRequestPostDeletion(
    post: Pick<PostHistoryRecord, "eventId" | "kind" | "pubkeyHex" | "deletedAt">,
    currentPubkey: string | null | undefined,
): boolean {
    if (!currentPubkey || post.pubkeyHex !== currentPubkey) {
        return false;
    }

    if (typeof post.deletedAt === "number") {
        return false;
    }

    return POST_DELETION_SUPPORTED_KINDS.includes(post.kind as SupportedPostKind)
        && typeof post.eventId === "string"
        && post.eventId.length > 0;
}

export function buildDeletionRequestEvent(
    post: Pick<PostHistoryRecord, "eventId" | "kind" | "pubkeyHex">,
    createdAt: number = Math.floor(Date.now() / 1000),
): DeletionRequestTemplate {
    return {
        kind: 5,
        pubkey: post.pubkeyHex,
        content: "",
        tags: [["e", post.eventId], ["k", String(post.kind)]],
        created_at: createdAt,
    };
}

export function buildDeletionRelayUrls(
    post: Pick<
        PostHistoryRecord,
        | "kind"
        | "acceptedRelays"
        | "fetchedRelays"
        | "relayHints"
        | "channelRelayHints"
    >,
    writeRelays: string[],
): string[] {
    return RelayConfigUtils.sanitizeExternalRelayUrls([
        ...(post.acceptedRelays ?? []),
        ...(post.fetchedRelays ?? []),
        ...(post.relayHints ?? []),
        ...(post.kind === 42 ? post.channelRelayHints ?? [] : []),
        ...writeRelays,
    ]);
}

export class PostDeletionService {
    private readonly deps: Required<
        Omit<
            PostDeletionServiceDeps,
            "eventSenderFactory" | "postHistoryRepository"
        >
    > & {
        eventSenderFactory?: PostDeletionServiceDeps["eventSenderFactory"];
        postHistoryRepository: Pick<PostHistoryRepository, "markDeleted">;
    };

    constructor(deps: PostDeletionServiceDeps = {}) {
        this.deps = {
            authStateStore: deps.authStateStore ?? authState,
            keyManager: deps.keyManager ?? keyManager,
            window: deps.window ?? (typeof window !== "undefined" ? window : {}),
            console:
                deps.console
                ?? (typeof globalThis.console !== "undefined"
                    ? globalThis.console
                    : createFallbackConsole()),
            seckeySignerFn: deps.seckeySignerFn ?? seckeySigner,
            getNip46SignerFn: deps.getNip46SignerFn ?? (() => nip46Service.getSigner()),
            waitForNip46ReadyFn:
                deps.waitForNip46ReadyFn
                ?? (() => nip46Service.waitForPendingOperation()),
            getParentClientSignerFn:
                deps.getParentClientSignerFn
                ?? (() => parentClientAuthService.getSigner()),
            writeRelaysStore: deps.writeRelaysStore ?? writeRelaysStore,
            postHistoryRepository: deps.postHistoryRepository ?? postHistoryRepository,
            eventSenderFactory: deps.eventSenderFactory,
            now: deps.now ?? Date.now,
        };
    }

    async requestDeletion(params: {
        post: PostHistoryRecord;
        rxNostr?: RxNostr;
    }): Promise<DeletionRequestResult> {
        const auth = this.deps.authStateStore.value;
        const currentPubkey = auth.pubkey || null;

        if (!params.rxNostr) {
            return { success: false, error: "nostr_not_ready" };
        }

        if (!currentPubkey) {
            return { success: false, error: "pubkey_not_found" };
        }

        if (!canRequestPostDeletion(params.post, currentPubkey)) {
            return { success: false, error: "deletion_request_not_allowed" };
        }

        if (auth.type === "nip46") {
            try {
                const nip46Ready = await this.deps.waitForNip46ReadyFn();
                if (!nip46Ready) {
                    return { success: false, error: "nip46_signer_not_available" };
                }
            } catch (error) {
                this.deps.console.error("post_deletion_nip46_wait_failed", error);
                return { success: false, error: "post_error" };
            }
        }

        const signerResolution = this.resolveSigner(auth);
        if (signerResolution.error) {
            return { success: false, error: signerResolution.error };
        }

        const deletionEvent = buildDeletionRequestEvent(
            params.post,
            Math.floor(this.deps.now() / 1000),
        );

        let signedEvent: any;
        try {
            signedEvent = await signerResolution.signEvent!(deletionEvent);
        } catch (error) {
            this.deps.console.error("post_deletion_sign_failed", error);
            return { success: false, error: "post_error" };
        }

        const additionalWriteRelays = buildDeletionRelayUrls(
            params.post,
            this.deps.writeRelaysStore.value,
        );

        let result: PostResult;
        try {
            result = await this.createEventSender(params.rxNostr).sendEvent(
                signedEvent,
                { additionalWriteRelays },
            );
        } catch (error) {
            this.deps.console.error("post_deletion_send_failed", error);
            return { success: false, error: "post_error" };
        }

        if (!result.success) {
            return result;
        }

        const deletionEventId = signedEvent.id ?? result.eventId;
        if (!deletionEventId) {
            return { success: false, error: "post_error" };
        }

        const deletedAt = this.deps.now();

        try {
            await this.deps.postHistoryRepository.markDeleted(
                params.post.eventId,
                deletionEventId,
                deletedAt,
            );
        } catch (error) {
            this.deps.console.warn("post_history_mark_deleted_failed", error);
        }

        return {
            ...result,
            eventId: deletionEventId,
            deletionEventId,
            deletionEvent: signedEvent as NostrEvent,
            deletedAt,
        };
    }

    private createEventSender(rxNostr: RxNostr): Pick<PostEventSender, "sendEvent"> {
        return this.deps.eventSenderFactory
            ? this.deps.eventSenderFactory(rxNostr, this.deps.console)
            : new PostEventSender(rxNostr, this.deps.console);
    }

    private resolveSigner(auth: AuthState): {
        signEvent?: (event: any) => Promise<any>;
        error?: string;
    } {
        if (auth.type === "nip07") {
            const signEvent = this.deps.window.nostr?.signEvent;
            return typeof signEvent === "function"
                ? { signEvent: signEvent.bind(this.deps.window.nostr) }
                : { error: "nostr_sign_event_not_supported" };
        }

        if (auth.type === "nip46") {
            return this.resolveExternalSigner(
                this.deps.getNip46SignerFn(),
                "nip46_signer_not_available",
            );
        }

        if (auth.type === "parentClient") {
            return this.resolveExternalSigner(
                this.deps.getParentClientSignerFn(),
                "parent_client_signer_not_available",
            );
        }

        const storedKey = this.deps.keyManager.getFromStore()
            || this.deps.keyManager.loadFromStorage(auth.pubkey);

        if (!storedKey) {
            return { error: "key_not_found" };
        }

        return this.resolveExternalSigner(
            this.deps.seckeySignerFn(storedKey),
            "nostr_sign_event_not_supported",
        );
    }

    private resolveExternalSigner(
        signer: DeletionSigner | null | undefined,
        missingSignerError: string,
    ): { signEvent?: (event: any) => Promise<any>; error?: string } {
        if (!signer) {
            return { error: missingSignerError };
        }

        return typeof signer.signEvent === "function"
            ? { signEvent: signer.signEvent.bind(signer) }
            : { error: "nostr_sign_event_not_supported" };
    }
}

export const postDeletionService = new PostDeletionService();
