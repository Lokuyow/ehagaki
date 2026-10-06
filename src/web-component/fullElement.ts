import { EHagakiComposerElement as ComposerElementBase } from "./element";
import {
    HostRelayConfigError,
    parseHostRelayConfig,
    toHostRelayConfig,
    type HostRelayConfig,
} from "../lib/hostRelayConfig";
import type { RelayConfig } from "../lib/types";
import type { EHagakiUploadOptions, EHagakiUploadResult } from "./types";
import { createUploadAbortError, throwIfUploadAborted } from "../lib/upload/uploadOperation";

type FullUploadApp = {
    uploadFileForHost(file: File, options: { signal: AbortSignal }): Promise<EHagakiUploadResult>;
};

type ActiveUpload = {
    controller: AbortController;
    generation: number;
    disconnected: boolean;
};

function createUploadApiError(name: string, message: string): Error {
    const error = new Error(message);
    error.name = name;
    return error;
}

/** The existing full distribution keeps the regular application root. */
export class EHagakiComposerElement extends ComposerElementBase {
    #hostRelayConfig: RelayConfig | undefined;
    #hostRelayConfigError: string | null = null;
    #activeUpload: ActiveUpload | null = null;

    /** Full-only upload that returns a URL without touching Composer content or UI. */
    uploadFile(file: File, options?: EHagakiUploadOptions): Promise<EHagakiUploadResult> {
        let snapshot: ReturnType<typeof this.requireCurrentReadyApp>;
        try {
            snapshot = this.requireCurrentReadyApp();
        } catch (error) {
            return Promise.reject(error);
        }
        if (options?.signal?.aborted) return Promise.reject(createUploadAbortError());
        if (this.#activeUpload) {
            return Promise.reject(createUploadApiError("upload_in_progress", "A file upload is already in progress."));
        }

        const controller = new AbortController();
        const operation: ActiveUpload = {
            controller,
            generation: snapshot.generation,
            disconnected: false,
        };
        const abortFromCaller = () => controller.abort();
        options?.signal?.addEventListener("abort", abortFromCaller, { once: true });
        if (options?.signal?.aborted) abortFromCaller();
        this.#activeUpload = operation;

        return (async () => {
            try {
                throwIfUploadAborted(controller.signal);
                const app = snapshot.app as typeof snapshot.app & FullUploadApp;
                const result = await app.uploadFileForHost(file, { signal: controller.signal });
                if (!this.isCurrentConnection(operation.generation)) {
                    throw createUploadApiError("disconnected", "Component was disconnected during upload.");
                }
                return result;
            } catch (error) {
                if (operation.disconnected || !this.isCurrentConnection(operation.generation)) {
                    throw createUploadApiError("disconnected", "Component was disconnected during upload.");
                }
                throw error;
            } finally {
                options?.signal?.removeEventListener("abort", abortFromCaller);
                if (this.#activeUpload === operation) this.#activeUpload = null;
            }
        })();
    }

    protected override onDisconnected(): void {
        if (!this.#activeUpload) return;
        this.#activeUpload.disconnected = true;
        this.#activeUpload.controller.abort();
        this.#activeUpload = null;
    }

    /**
     * A mount-scoped, nonpersistent default Relay Config for the Full embed.
     * Assign before connection; later assignments are retained for a recreated
     * element and never mutate an active Nostr session.
     */
    get relays(): HostRelayConfig | undefined {
        return this.#hostRelayConfig
            ? toHostRelayConfig(this.#hostRelayConfig)
            : undefined;
    }

    set relays(value: HostRelayConfig | undefined) {
        if (value === undefined) {
            this.#hostRelayConfig = undefined;
            this.#hostRelayConfigError = null;
            return;
        }

        try {
            this.#hostRelayConfig = parseHostRelayConfig(value);
            this.#hostRelayConfigError = null;
        } catch (error) {
            this.#hostRelayConfig = undefined;
            this.#hostRelayConfigError = error instanceof HostRelayConfigError
                ? error.message
                : "Invalid relays property.";
        }
    }

    protected override loadApp(): Promise<{ default: any }> {
        return import("../App.svelte");
    }

    protected override getConnectionError() {
        if (this.#hostRelayConfigError) {
            return {
                code: "initialization_failed" as const,
                message: this.#hostRelayConfigError,
            };
        }
        return super.getConnectionError();
    }

    protected override getAdditionalMountProps(generation: number): Record<string, unknown> {
        return {
            ...(this.#hostRelayConfig ? { hostRelayConfig: this.#hostRelayConfig } : {}),
            onPostComponentLoadFailure: () => this.notifyPostComponentLoadFailure(generation),
        };
    }
}
