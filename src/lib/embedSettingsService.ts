import {
    embedMessageRequiresRequestId,
    getParentOriginFromSearch,
    isEmbedMessageEnvelope,
    isValidEmbedRequestId,
    type EmbedSettingsSetPayload,
} from "./embedProtocol";

type RemoteSettingsSetListener = (
    payload: EmbedSettingsSetPayload,
    requestId: string,
) => void;

type RemoteSettingsErrorListener = (
    error: { code: string; message?: string },
    requestId?: string,
) => void;

const COMPRESSION_LEVELS = new Set(["none", "low", "medium", "high"]);
const THEME_MODES = new Set(["system", "light", "dark"]);
const LOCALES = new Set(["ja", "en"]);

function isSettingsSetPayload(value: unknown): value is EmbedSettingsSetPayload {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return false;
    }

    const payload = value as Record<string, unknown>;
    if (payload.locale !== undefined && !LOCALES.has(String(payload.locale))) {
        return false;
    }

    if (payload.themeMode !== undefined && !THEME_MODES.has(String(payload.themeMode))) {
        return false;
    }

    if (payload.uploadEndpoint !== undefined && typeof payload.uploadEndpoint !== "string") {
        return false;
    }

    if (
        payload.imageCompressionLevel !== undefined
        && !COMPRESSION_LEVELS.has(String(payload.imageCompressionLevel))
    ) {
        return false;
    }

    if (
        payload.videoCompressionLevel !== undefined
        && !COMPRESSION_LEVELS.has(String(payload.videoCompressionLevel))
    ) {
        return false;
    }

    for (const key of [
        "clientTagEnabled",
        "quoteNotificationEnabled",
        "mediaFreePlacement",
        "showMascot",
        "showFlavorText",
    ]) {
        if (payload[key] !== undefined && typeof payload[key] !== "boolean") {
            return false;
        }
    }

    return true;
}

export class EmbedSettingsService {
    private trustedParentOrigin: string | null = null;
    private isListening = false;
    private remoteSetSettingsListeners = new Set<RemoteSettingsSetListener>();
    private remoteSettingsErrorListeners = new Set<RemoteSettingsErrorListener>();

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

    onRemoteSetSettings(listener: RemoteSettingsSetListener): () => void {
        this.remoteSetSettingsListeners.add(listener);
        return () => {
            this.remoteSetSettingsListeners.delete(listener);
        };
    }

    onRemoteSettingsError(listener: RemoteSettingsErrorListener): () => void {
        this.remoteSettingsErrorListeners.add(listener);
        return () => {
            this.remoteSettingsErrorListeners.delete(listener);
        };
    }

    private notifyError(
        error: { code: string; message?: string },
        requestId?: string,
    ): void {
        for (const listener of this.remoteSettingsErrorListeners) {
            listener(error, requestId);
        }
    }

    private handleMessage = (event: MessageEvent): void => {
        if (!this.windowObj) return;
        if (!isEmbedMessageEnvelope(event.data)) return;
        if (event.source !== this.windowObj.parent) return;
        if (this.trustedParentOrigin && event.origin !== this.trustedParentOrigin) {
            return;
        }

        const message = event.data;

        if (message.type !== "settings.set") {
            return;
        }

        if (
            embedMessageRequiresRequestId(message.type)
            && !isValidEmbedRequestId(message.requestId)
        ) {
            this.console.warn("requestId がない settings.set を無視:", message);
            this.notifyError({ code: "settings_request_id_required" });
            return;
        }

        if (!isSettingsSetPayload(message.payload)) {
            this.console.warn("不正な settings.set payload を拒否:", message.payload);
            this.notifyError(
                {
                    code: "settings_invalid_payload",
                    message: "settings.set payload is invalid",
                },
                message.requestId,
            );
            return;
        }

        if (!message.requestId) {
            return;
        }

        for (const listener of this.remoteSetSettingsListeners) {
            listener(message.payload, message.requestId);
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

export const embedSettingsService = new EmbedSettingsService();
