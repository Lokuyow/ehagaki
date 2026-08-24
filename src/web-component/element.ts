import { mount, unmount } from "svelte";
import type { AppEmbedAppliedSettingKey } from "../lib/appEmbedController";
import { configureAppRuntimeEnvironment } from "../lib/appRuntimeEnvironment";
import { createWebComponentStorage } from "../lib/appStorage";
import type {
    EmbedComposerSetContextPayload,
    EmbedSettingsSetPayload,
} from "../lib/embedProtocol";
import appCss from "../app.css?inline";
import photoSwipeCss from "photoswipe/style.css?inline";
import {
    EHAGAKI_COMPOSER_API_VERSION,
    type EHagakiComposerContext,
    type EHagakiComposerInitializationErrorDetail,
    type EHagakiComposerSettings,
} from "./types";
import { createWebComponentNotificationPort } from "./notificationPort";
import { applyWebComponentIconAssetUrls } from "./iconAssets";

type AppInstance = {
    setEmbedContext(payload: unknown): Promise<void>;
    setEmbedSettings(
        payload: EmbedSettingsSetPayload,
    ): Promise<ReadonlyArray<AppEmbedAppliedSettingKey>>;
};

let activeInstance: EHagakiComposerElement | null = null;

function createError(code: EHagakiComposerInitializationErrorDetail["code"], message: string): Error {
    const error = new Error(message);
    error.name = code;
    return error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateSettings(value: EHagakiComposerSettings): EmbedSettingsSetPayload {
    if (!isRecord(value)) {
        throw createError("initialization_failed", "Invalid settings payload.");
    }
    const validStrings = {
        locale: new Set(["ja", "en"]),
        themeMode: new Set(["system", "light", "dark"]),
        imageQualityLevel: new Set(["none", "low", "medium", "high"]),
        videoQualityLevel: new Set(["none", "low", "medium", "high"]),
        imageCompressionLevel: new Set(["none", "low", "medium", "high"]),
        videoCompressionLevel: new Set(["none", "low", "medium", "high"]),
    } as const;
    const validBooleanKeys = new Set([
        "clientTagEnabled",
        "quoteNotificationEnabled",
        "replyNotificationEnabled",
        "mediaFreePlacement",
        "showMascot",
        "showFlavorText",
    ]);
    const validKeys = new Set([
        ...Object.keys(validStrings),
        ...validBooleanKeys,
        "uploadEndpoint",
    ]);

    for (const [key, setting] of Object.entries(value)) {
        if (!validKeys.has(key)) {
            throw createError("initialization_failed", "Invalid settings payload.");
        }
        if (key in validStrings) {
            const choices = validStrings[key as keyof typeof validStrings];
            if (typeof setting !== "string" || !choices.has(setting as never)) {
                throw createError("initialization_failed", "Invalid settings payload.");
            }
        } else if (validBooleanKeys.has(key) && typeof setting !== "boolean") {
            throw createError("initialization_failed", "Invalid settings payload.");
        } else if (key === "uploadEndpoint" && typeof setting !== "string") {
            throw createError("initialization_failed", "Invalid settings payload.");
        }
    }
    return value;
}

function transformAppCss(css: string): string {
    // app.css is authored for the document root. In this build it is copied
    // into the component's open shadow tree instead of touching host styles.
    return css
        .replaceAll(/:root:is\(\s*\.light\s*,\s*\.dark\s*\)/g, ":host(:is(.light, .dark))")
        .replaceAll(":root", ":host")
        .replace("html,\nbody,\n#app", ":host,\n.ehagaki-web-component-shell")
        .replace("#app {", ".ehagaki-web-component-shell {")
        .replace("body {", ".ehagaki-web-component-shell {");
}

function getWebComponentThemeCss(): string {
    return `:host {
        display: block;
        --accent-color: var(--ehagaki-accent-color, var(--accent-color-default));
        --base-color: var(--ehagaki-base-color);
        --bg: var(--ehagaki-background, var(--surface-bg));
        --text: var(--ehagaki-text, var(--semantic-text));
        --border: var(--ehagaki-border, var(--surface-border));
        --link: var(--ehagaki-link, var(--semantic-link));
        --bg-input: var(--ehagaki-input-background, var(--surface-input));
        --bg-footer: var(--ehagaki-footer-background, var(--surface-footer));
        --dialog-bg: var(--ehagaki-dialog-background, var(--surface-dialog));
        font-family: var(--ehagaki-font-family, system-ui, sans-serif);
    }

    .ehagaki-web-component-shell {
        position: relative;
        container-type: inline-size;
        background: var(--bg);
    }

    .ehagaki-web-component-shell,
    .ehagaki-web-component-app {
        width: 100%;
        height: 100%;
        min-height: 0;
    }`;
}

export abstract class EHagakiComposerElement extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["asset-base"];
    }

    #app: AppInstance | null = null;
    #mountedApp: ReturnType<typeof mount> | null = null;
    #mountPromise: Promise<void> | null = null;
    #readyResolve: (() => void) | null = null;
    #readyReject: ((reason?: unknown) => void) | null = null;
    #readyPromise: Promise<void> = this.createReadyPromise();
    #readyState: "pending" | "resolved" | "rejected" = "pending";
    #operationQueue: Promise<void> = Promise.resolve();
    #connectionGeneration = 0;
    #assetStyleObserver: MutationObserver | null = null;

    get assetBase(): string | null {
        return this.getAttribute("asset-base");
    }

    set assetBase(value: string | null) {
        if (value === null || value === "") {
            this.removeAttribute("asset-base");
            return;
        }
        this.setAttribute("asset-base", value);
    }

    attributeChangedCallback(): void {
        // The delivery base must be configured before the stateful app graph
        // is imported. Changing it after connection applies on the next mount.
    }

    connectedCallback(): void {
        this.onConnectionAttempt();
        if (this.#mountPromise) return;
        const connectionError = this.getConnectionError();
        if (connectionError) {
            const error = createError(connectionError.code, connectionError.message);
            this.fail("initialization_failed", error.message, error);
            return;
        }
        if (activeInstance && activeInstance !== this) {
            const error = createError(
                "multiple_instances_unsupported",
                "Only one ehagaki-composer can be connected in a document.",
            );
            this.fail("multiple_instances_unsupported", error.message, error);
            return;
        }

        if (this.#readyState !== "pending") {
            this.#readyPromise = this.createReadyPromise();
            this.#readyState = "pending";
        }
        activeInstance = this;
        this.#mountPromise = this.mountApp();
    }

    disconnectedCallback(): void {
        this.#connectionGeneration += 1;
        this.onDisconnected();
        this.#assetStyleObserver?.disconnect();
        this.#assetStyleObserver = null;
        if (activeInstance === this) activeInstance = null;
        if (this.#mountedApp) {
            unmount(this.#mountedApp);
            this.#mountedApp = null;
        }
        this.#app = null;
        this.#mountPromise = null;
        if (this.#readyState === "pending") {
            this.#readyState = "rejected";
            this.#readyReject?.(createError("disconnected", "Component was disconnected before it became ready."));
        }
    }

    whenReady(): Promise<void> {
        return this.#readyPromise;
    }

    setContext(context: EHagakiComposerContext): Promise<void> {
        return this.enqueue(async () => {
            await this.requireApp().setEmbedContext(context as EmbedComposerSetContextPayload);
        });
    }

    setSettings(
        settings: EHagakiComposerSettings,
    ): Promise<ReadonlyArray<AppEmbedAppliedSettingKey>> {
        return this.enqueue(async () =>
            this.requireApp().setEmbedSettings(validateSettings(settings)));
    }

    dispatchSafeEvent(type: string, detail: Record<string, unknown>): boolean {
        return this.dispatchEvent(new CustomEvent(type, {
            bubbles: true,
            composed: true,
            detail,
        }));
    }

    private createReadyPromise(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.#readyResolve = resolve;
            this.#readyReject = reject;
        });
    }

    private async mountApp(): Promise<void> {
        const generation = ++this.#connectionGeneration;
        try {
            const shadowRoot = this.shadowRoot ?? this.attachShadow({ mode: "open" });
            shadowRoot.replaceChildren();
            const styles = document.createElement("style");
            styles.textContent = `${transformAppCss(appCss)}\n${photoSwipeCss}\n${getWebComponentThemeCss()}`;
            const shell = document.createElement("div");
            shell.className = "ehagaki-web-component-shell";
            const mountTarget = document.createElement("div");
            mountTarget.className = "ehagaki-web-component-app";
            const overlayTarget = document.createElement("div");
            overlayTarget.className = "ehagaki-web-component-overlays ehagaki-app-root";
            shell.append(mountTarget, overlayTarget);
            shadowRoot.append(styles, shell);

            const assetBase = new URL(
                this.assetBase ?? "./",
                import.meta.url,
            );
            this.#assetStyleObserver = new MutationObserver(() => {
                applyWebComponentIconAssetUrls(shadowRoot, shell, assetBase);
            });
            this.#assetStyleObserver.observe(shadowRoot, {
                childList: true,
                subtree: true,
            });
            configureAppRuntimeEnvironment({
                storage: createWebComponentStorage(window.localStorage),
                window,
                document,
                domRoot: shadowRoot,
                styleTarget: shell,
                layoutTarget: shell,
                overlayTarget,
                themeTarget: this,
                layoutMode: "container",
                runtimeKind: "web-component",
                assetBase,
                serviceWorkerEnabled: false,
                externalInputEnabled: false,
                historyEnabled: false,
                localNsecAuthEnabled: false,
            });

            const { default: App } = await this.loadApp();
            if (!this.isConnected || generation !== this.#connectionGeneration) return;
            this.#mountedApp = mount(App, {
                target: mountTarget,
                props: {
                    notificationPort: createWebComponentNotificationPort(this),
                    onInitialized: () => {
                        if (!this.isConnected || generation !== this.#connectionGeneration) return;
                        this.#readyState = "resolved";
                        this.#readyResolve?.();
                        this.dispatchSafeEvent("ehagaki-ready", { apiVersion: EHAGAKI_COMPOSER_API_VERSION });
                    },
                    ...this.getAdditionalMountProps(),
                },
            });
            applyWebComponentIconAssetUrls(shadowRoot, shell, assetBase);
            this.#app = this.#mountedApp as AppInstance;
            if (!this.isConnected || generation !== this.#connectionGeneration) return;
        } catch {
            this.fail("initialization_failed", "eHagaki Composer could not be initialized.");
        }
    }

    protected requireApp(): AppInstance {
        if (!this.#app) {
            throw createError("initialization_failed", "eHagaki Composer is not ready.");
        }
        return this.#app;
    }

    /** Each distribution provides its own build-time composition root. */
    protected abstract loadApp(): Promise<{ default: any }>;

    /** Distribution-specific validation runs before the active-instance check. */
    protected onConnectionAttempt(): void {}

    protected getConnectionError(): {
        code: EHagakiComposerInitializationErrorDetail["code"];
        message: string;
    } | null {
        return null;
    }

    protected onDisconnected(): void {}

    protected getAdditionalMountProps(): Record<string, unknown> {
        return {};
    }

    protected enqueue<T>(operation: () => Promise<T>): Promise<T> {
        const queued = this.#operationQueue.then(async () => {
            await this.whenReady();
            return operation();
        });
        this.#operationQueue = queued.then(() => undefined, () => undefined);
        return queued;
    }

    private fail(
        code: EHagakiComposerInitializationErrorDetail["code"],
        message: string,
        reason: unknown = createError(code, message),
    ): void {
        this.#readyState = "rejected";
        this.#readyReject?.(reason);
        this.dispatchSafeEvent("ehagaki-initialization-error", { code, message });
    }
}
