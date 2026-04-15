import {
    getParentOriginFromSearch,
    isEmbedMessageEnvelope,
    type EmbedComposerSetContextPayload,
} from "./embedProtocol";

type RemoteComposerSetContextListener = (
    payload: EmbedComposerSetContextPayload,
    requestId?: string,
) => void;
type RemoteComposerClearContextListener = (requestId?: string) => void;

function isComposerSetContextPayload(
    value: unknown,
): value is EmbedComposerSetContextPayload {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    if (
        payload.reply !== undefined
        && payload.reply !== null
        && typeof payload.reply !== "string"
    ) {
        return false;
    }

    if (
        payload.quotes !== undefined
        && (!Array.isArray(payload.quotes)
            || payload.quotes.some((quote) => typeof quote !== "string"))
    ) {
        return false;
    }

    if (
        payload.content !== undefined
        && payload.content !== null
        && typeof payload.content !== "string"
    ) {
        return false;
    }

    return true;
}

export class EmbedComposerContextService {
    private trustedParentOrigin: string | null = null;
    private isListening = false;
    private remoteSetContextListeners = new Set<RemoteComposerSetContextListener>();
    private remoteClearContextListeners = new Set<RemoteComposerClearContextListener>();

    constructor(
        private windowObj: Window = typeof window !== "undefined" ? window : ({} as Window),
        private console: Console = typeof window !== "undefined" ? window.console : ({} as Console),
    ) { }

    initialize(options: {
        parentOrigin?: string;
        locationSearch?: string;
    } = {}): boolean {
        if (!this.isInIframe()) return false;

        const parentOrigin =
            options.parentOrigin
            ?? getParentOriginFromSearch(options.locationSearch ?? this.windowObj.location?.search);
        if (!parentOrigin) return false;

        this.trustedParentOrigin = parentOrigin;
        this.ensureMessageListener();
        return true;
    }

    onRemoteSetContext(listener: RemoteComposerSetContextListener): () => void {
        this.remoteSetContextListeners.add(listener);
        return () => {
            this.remoteSetContextListeners.delete(listener);
        };
    }

    onRemoteClearContext(listener: RemoteComposerClearContextListener): () => void {
        this.remoteClearContextListeners.add(listener);
        return () => {
            this.remoteClearContextListeners.delete(listener);
        };
    }

    private handleMessage = (event: MessageEvent): void => {
        if (!this.windowObj) return;
        if (!isEmbedMessageEnvelope(event.data)) return;
        if (event.source !== this.windowObj.parent) return;
        if (this.trustedParentOrigin && event.origin !== this.trustedParentOrigin) {
            return;
        }

        const message = event.data;

        if (message.type === "composer.setContext") {
            if (!isComposerSetContextPayload(message.payload)) {
                this.console.warn(
                    "不正な composer.setContext payload を無視:",
                    message.payload,
                );
                return;
            }

            for (const listener of this.remoteSetContextListeners) {
                listener(message.payload, message.requestId);
            }
            return;
        }

        if (message.type === "composer.clearContext") {
            for (const listener of this.remoteClearContextListeners) {
                listener(message.requestId);
            }
        }
    };

    private ensureMessageListener(): void {
        if (this.isListening) return;
        this.windowObj?.addEventListener?.("message", this.handleMessage);
        this.isListening = true;
    }

    private isInIframe(): boolean {
        try {
            return this.windowObj?.self !== this.windowObj?.top;
        } catch {
            return true;
        }
    }
}

export const embedComposerContextService = new EmbedComposerContextService();
