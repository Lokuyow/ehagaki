import { EHagakiComposerElement } from "./element";
import {
    type EHagakiCustomEmojiCatalogItem,
    type EHagakiHostOwnedComposerOptions,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpUrl(value: unknown): value is string {
    if (typeof value !== "string") return false;
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

function validateHostOwnedOptions(
    value: EHagakiHostOwnedComposerOptions,
): EHagakiHostOwnedComposerOptions {
    if (!isRecord(value) || typeof value.submit !== "function") {
        throw new TypeError("Host-owned Composer requires a submit handler.");
    }
    if (value.uploadMedia !== undefined && typeof value.uploadMedia !== "function") {
        throw new TypeError("uploadMedia must be a function when provided.");
    }
    return {
        submit: value.submit,
        ...(value.uploadMedia ? { uploadMedia: value.uploadMedia } : {}),
    };
}

function validateCustomEmojiCatalog(
    catalog: readonly EHagakiCustomEmojiCatalogItem[],
): EHagakiCustomEmojiCatalogItem[] {
    if (!Array.isArray(catalog)) {
        throw new TypeError("Custom emoji catalog must be an array.");
    }
    const seen = new Set<string>();
    const next: EHagakiCustomEmojiCatalogItem[] = [];
    for (const item of catalog) {
        if (!isRecord(item) || typeof item.shortcode !== "string" || !isHttpUrl(item.url)) {
            throw new TypeError("Custom emoji catalog contains an invalid item.");
        }
        const shortcode = item.shortcode.replace(/^:+|:+$/g, "").trim();
        if (!/^[\p{L}\p{N}_+-]{1,64}$/u.test(shortcode)) {
            throw new TypeError("Custom emoji catalog contains an invalid shortcode.");
        }
        const setAddress = typeof item.setAddress === "string" && item.setAddress.trim()
            ? item.setAddress.trim()
            : null;
        const key = `${shortcode.toLowerCase()}\u0000${item.url}\u0000${setAddress ?? ""}`;
        if (seen.has(key)) continue;
        seen.add(key);
        next.push({ shortcode, url: item.url, ...(setAddress ? { setAddress } : {}) });
    }
    return next;
}

type HostOwnedAppInstance = {
    setHostCustomEmojis(catalog: EHagakiCustomEmojiCatalogItem[]): Promise<void>;
};

/**
 * The Lite entry keeps the public Custom Element API but uses the Host-owned
 * composition root. This is intentionally a build-time root, not a runtime
 * branch in the full application graph.
 */
export class EHagakiHostOwnedLiteComposerElement extends EHagakiComposerElement {
    #hostOwnedOptions: EHagakiHostOwnedComposerOptions | null = null;
    #hostCustomEmojiCatalog: EHagakiCustomEmojiCatalogItem[] = [];
    #hostOperationAbortController: AbortController | null = null;
    #hasEverConnected = false;

    /**
     * Selects Host-owned publication exactly once before this element's first
     * connection. Reconnection intentionally reuses this immutable choice.
     */
    configureHostOwned(options: EHagakiHostOwnedComposerOptions): void {
        if (this.#hasEverConnected || this.#hostOwnedOptions) {
            throw new DOMException(
                "Host-owned Composer configuration is immutable after it is set or connected.",
                "InvalidStateError",
            );
        }
        // Validate before committing so a malformed pre-connection call does
        // not consume the one permitted configuration attempt.
        this.#hostOwnedOptions = validateHostOwnedOptions(options);
    }

    setCustomEmojis(catalog: readonly EHagakiCustomEmojiCatalogItem[]): Promise<void> {
        if (!this.#hostOwnedOptions) {
            return Promise.reject(new DOMException(
                "Custom emoji catalogs are available only in Host-owned mode.",
                "InvalidStateError",
            ));
        }
        const validated = validateCustomEmojiCatalog(catalog);
        this.#hostCustomEmojiCatalog = validated;
        return this.enqueue(async () => {
            const app = this.requireApp() as unknown as HostOwnedAppInstance;
            await app.setHostCustomEmojis(validated.map((item) => ({ ...item })));
        });
    }

    protected override loadApp(): Promise<{ default: any }> {
        return import("../host-owned-composer-lite/HostOwnedComposerLiteApp.svelte");
    }

    protected override onConnectionAttempt(): void {
        this.#hasEverConnected = true;
    }

    protected override getConnectionError() {
        if (this.#hostOwnedOptions) return null;
        return {
            code: "initialization_failed" as const,
            message: "Host-owned Composer Lite requires configureHostOwned() before connection.",
        };
    }

    protected override onDisconnected(): void {
        this.#hostOperationAbortController?.abort();
        this.#hostOperationAbortController = null;
    }

    protected override isAutoLoginNip07Enabled(): boolean {
        return false;
    }

    protected override getAdditionalMountProps(): Record<string, unknown> {
        if (!this.#hostOwnedOptions) {
            throw new Error("Host-owned Composer Lite configuration is missing.");
        }
        this.#hostOperationAbortController = new AbortController();
        return {
            hostOwnedConfig: {
                ...this.#hostOwnedOptions,
                customEmojis: this.#hostCustomEmojiCatalog.map((item) => ({ ...item })),
                signal: this.#hostOperationAbortController.signal,
            },
        };
    }
}
