import { appModalBarrier } from "../stores/appModalBarrier.svelte";
import type { EventTemplate } from "nostr-tools";
import type { NosskeyIframeClient } from "nosskey-iframe";
import type { AuthStateSource } from "./sessionLiveness";
import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";
import { validateSignedEventResult } from "./signedEventResultValidator";
import { isLowerHex64 } from "./utils/nostrHexUtils";

type Client = Pick<NosskeyIframeClient, "iframe" | "ready" | "getPublicKey" | "signEvent" | "destroy">;
type Theme = "neutral-dark" | "neutral-light";
type ClientFactory = (container: HTMLElement, theme: Theme) => Promise<Client>;
type IsCurrent = () => boolean;

const FRAME_URL = "https://nosskey.app/#/iframe";
const READY_TIMEOUT = 15_000;
const REQUEST_TIMEOUT = "Nosskey iframe request timed out";

type NosskeyErrorCode = "unavailable" | "ready_timeout" | "timeout" | "no_key" | "declined"
    | "rate_limited" | "identity_mismatch" | "invalid_result" | "connection" | "cancelled"
    | "account_conflict" | "storage";

export class NosskeyError extends Error {
    constructor(readonly code: NosskeyErrorCode) {
        super(`nosskey.${code}`);
    }
}

function normalizeError(error: unknown): NosskeyError {
    if (error instanceof NosskeyError) return error;
    const codes = { NO_KEY: "no_key", USER_REJECTED: "declined", RATE_LIMITED: "rate_limited" } as const;
    if (error instanceof Error && "code" in error) {
        const code = error.code;
        if (typeof code === "string" && Object.hasOwn(codes, code)) {
            return new NosskeyError(codes[code as keyof typeof codes]);
        }
        return new NosskeyError("connection");
    }
    if (error instanceof Error && error.message.startsWith(REQUEST_TIMEOUT)) {
        return new NosskeyError("timeout");
    }
    return new NosskeyError("connection");
}

export function canUseNosskey(): boolean {
    return getAppRuntimeEnvironment().runtimeKind === "standalone";
}

async function createHostedClient(container: HTMLElement, theme: Theme): Promise<Client> {
    if (!canUseNosskey() || !window.isSecureContext || typeof PublicKeyCredential === "undefined" || !navigator.credentials) {
        throw new NosskeyError("unavailable");
    }
    const { NosskeyIframeClient } = await import("nosskey-iframe");
    return new NosskeyIframeClient({ container, theme, iframeUrl: FRAME_URL });
}

export function createNosskeyService(
    createClient: ClientFactory = createHostedClient,
    onVisibilityChange?: (visible: boolean) => void,
) {
    const state = $state({ visible: false, pending: 0, notice: null as NosskeyErrorCode | null, theme: "neutral-light" as Theme });
    let container: HTMLElement | undefined;
    let loading: Promise<Client> | undefined;
    let client: Client | undefined;
    let observer: MutationObserver | undefined;
    let queue = Promise.resolve();
    let notifyHidden: (() => void) | undefined;

    function setVisible(visible: boolean): void {
        state.visible = visible;
        onVisibilityChange?.(visible);
    }

    function attach(target: HTMLElement): () => void {
        container = target;
        return () => {
            if (container !== target) return;
            container = undefined;
            observer?.disconnect();
            client?.destroy();
            client = undefined;
            loading = undefined;
            setVisible(false);
            notifyHidden?.();
        };
    }

    async function initialize(): Promise<Client> {
        const target = container;
        if (!target) throw new NosskeyError("unavailable");
        const theme = target.ownerDocument.documentElement.classList.contains("dark") ? "neutral-dark" : "neutral-light";
        state.theme = theme;
        const instance = await createClient(target, theme);
        if (container !== target) {
            instance.destroy();
            throw new NosskeyError("cancelled");
        }
        client = instance;
        const syncVisibility = () => {
            setVisible(instance.iframe.style.display !== "none");
            if (!state.visible) notifyHidden?.();
        };
        const visibilityObserver = new MutationObserver(syncVisibility);
        observer = visibilityObserver;
        visibilityObserver.observe(instance.iframe, { attributes: true, attributeFilter: ["style"] });
        syncVisibility();
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            await Promise.race([
                instance.ready(),
                new Promise<never>((_, reject) => {
                    timer = setTimeout(() => reject(new NosskeyError("ready_timeout")), READY_TIMEOUT);
                }),
            ]);
            return instance;
        } catch (error) {
            visibilityObserver.disconnect();
            instance.destroy();
            if (client === instance) {
                client = undefined;
                setVisible(false);
            }
            throw error;
        } finally {
            clearTimeout(timer);
        }
    }

    function getClient(): Promise<Client> {
        loading ??= initialize().catch((error: unknown) => {
            loading = undefined;
            throw error;
        });
        return loading;
    }

    function report(error: unknown): NosskeyError {
        const normalized = normalizeError(error);
        if (normalized.code !== "cancelled") state.notice = normalized.code;
        return normalized;
    }

    function request<T>(isCurrent: IsCurrent, run: (instance: Client) => Promise<T>): Promise<T> {
        state.pending++;
        const assertCurrent = () => {
            if (!isCurrent()) throw new NosskeyError("cancelled");
        };
        const result = queue.then(async () => {
            assertCurrent();
            state.notice = null;
            const instance = await getClient();
            assertCurrent();
            const value = await run(instance);
            assertCurrent();
            return value;
        }).catch((error: unknown) => {
            if (!isCurrent()) throw new NosskeyError("cancelled");
            throw report(error);
        }).finally(() => { state.pending--; });
        const waitForHidden = () => {
            if (client?.iframe.style.display === "none" || !client) return;
            return new Promise<void>((resolve) => {
                notifyHidden = () => { notifyHidden = undefined; resolve(); };
            });
        };
        // Deliver the result to the caller while an old host dialog can still be dismissed.
        queue = result.then(waitForHidden, waitForHidden);
        return result;
    }

    function readPublicKey(isCurrent: IsCurrent, expected?: string): Promise<string> {
        return request(isCurrent, async (instance) => {
            const pubkey = await instance.getPublicKey();
            if (!isLowerHex64(pubkey)) throw new NosskeyError("invalid_result");
            if (expected && pubkey !== expected) throw new NosskeyError("identity_mismatch");
            return pubkey;
        });
    }

    function signer(pubkey: string, isCurrent: IsCurrent) {
        return {
            getPublicKey: async () => pubkey,
            signEvent: (event: EventTemplate) => request(isCurrent, async (instance) => {
                if (event.kind === 22242) throw new NosskeyError("unavailable");
                const template = {
                    kind: event.kind,
                    created_at: event.created_at,
                    content: event.content,
                    tags: event.tags.map((tag) => [...tag]),
                };
                const result = await instance.signEvent(template);
                let validated;
                try {
                    if (!isLowerHex64(result?.pubkey)) throw new NosskeyError("invalid_result");
                    validated = validateSignedEventResult(template, result, result.pubkey);
                } catch {
                    throw new NosskeyError("invalid_result");
                }
                if (validated.pubkey !== pubkey) throw new NosskeyError("identity_mismatch");
                return validated;
            }),
        };
    }

    return {
        state,
        attach,
        readPublicKey,
        signer,
        report,
        clearNotice: () => { state.notice = null; },
    };
}

export const nosskey = createNosskeyService(undefined, (visible) => {
    appModalBarrier.active = visible;
});

export function nosskeyErrorMessage(error: unknown): string | undefined {
    return error instanceof NosskeyError ? error.message : undefined;
}

export function nosskeySignerForSession(
    source: AuthStateSource,
    snapshot = source.value,
    isActive: IsCurrent = () => true,
) {
    if (!canUseNosskey() || snapshot.type !== "nosskey" || !snapshot.isAuthenticated) return null;
    return nosskey.signer(snapshot.pubkey, () => source.value === snapshot && isActive());
}
