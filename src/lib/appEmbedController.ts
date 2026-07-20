import type { RxNostr } from "rx-nostr";
import type {
    ChannelContextQueryTarget,
    ChannelContextState,
    RelayConfig,
    ReplyQuoteComposerState,
    ReplyQuoteQueryResult,
    ReplyQuoteQueryTarget,
} from "./types";
import type { ChannelContextProvenance } from "./channelContextRuntime";
import type {
    EmbedChannelContextPayload,
    EmbedComposerSetContextPayload,
    EmbedSettingsSetPayload,
} from "./embedProtocol";
import {
    applyEmbedComposerContent,
    buildEmbedComposerContextPatch,
} from "./embedComposerContextApply";
import {
    buildComposerContextSignature,
    buildComposerContextUpdatedPayload,
} from "./embedComposerContextNotification";

export interface AppEmbedComposerInputPort {
    resetContent(): void;
    insertText(content: string): void;
}

export interface AppEmbedComposerContextApplyPort {
    applyReplyQuoteSelection(query: ReplyQuoteQueryResult): ReplyQuoteQueryTarget[];
    hydrateReplyQuoteReferences(
        references: ReplyQuoteQueryTarget[],
        runtime: AppEmbedRuntimeSnapshot,
    ): Promise<void>;
    clearReplyQuote(): void;
    applyChannelContextQuery(
        query: ChannelContextQueryTarget,
        runtime: AppEmbedRuntimeSnapshot,
    ): void;
    clearChannelContext(): void;
}

export type AppEmbedAppliedSettingKey =
    | "locale"
    | "themeMode"
    | "imageQualityLevel"
    | "videoQualityLevel"
    | "clientTagEnabled"
    | "quoteNotificationEnabled"
    | "replyNotificationEnabled"
    | "mediaFreePlacement"
    | "showMascot"
    | "showFlavorText"
    | "uploadEndpoint";

export interface AppEmbedSettingsApplyPort {
    applySettings(
        payload: EmbedSettingsSetPayload,
    ): Promise<ReadonlyArray<AppEmbedAppliedSettingKey>>;
}

export type AppEmbedComposerErrorCode = "composer_context_apply_failed";

export interface AppEmbedComposerError {
    code: AppEmbedComposerErrorCode;
    message?: string;
    cause?: unknown;
}

export type AppEmbedSettingsErrorCode =
    | "settings_apply_failed"
    | "settings_invalid_payload"
    | "settings_request_id_required";

export interface AppEmbedSettingsError {
    code: AppEmbedSettingsErrorCode;
    message?: string;
    cause?: unknown;
}

export interface AppEmbedComposerContextUpdatedNotification {
    reply: string | null;
    quotes: string[];
    channel: EmbedChannelContextPayload | null;
}

export interface AppEmbedParentFramePort {
    notifyComposerContextApplied(requestId: string): void;
    notifyComposerContextError(
        error: AppEmbedComposerError,
        requestId: string,
    ): void;
    notifyComposerContextUpdated(
        payload: AppEmbedComposerContextUpdatedNotification,
    ): void;
    notifySettingsApplied(
        applied: ReadonlyArray<AppEmbedAppliedSettingKey>,
        requestId: string,
    ): void;
    notifySettingsError(error: AppEmbedSettingsError, requestId: string): void;
}

export interface AppEmbedRuntimeSnapshot {
    rxNostr: RxNostr | undefined;
    relayConfig: RelayConfig | null | undefined;
}

export interface AppEmbedRuntimeStateGetters {
    isBootstrappingApp(): boolean;
    hasPendingParentAuth(): boolean;
    getReplyQuoteState(): ReplyQuoteComposerState;
    getChannelContextState(): ChannelContextState | null;
    getChannelContextProvenance(): ChannelContextProvenance | null;
    getRuntimeSnapshot(): AppEmbedRuntimeSnapshot;
}

export interface AppEmbedStoragePort {
    getEmbedStorageSnapshot(): Promise<Record<string, string | null>>;
    applyEmbedStorageSnapshot(values: Record<string, string | null>): {
        appliedKeys: string[];
    };
    applyStoredSettingsSnapshot(): void;
    persistEmbedStorageKeys(): void;
}

export interface AppEmbedControllerLogger {
    warn(message: string, meta?: unknown): void;
    error(message: string, meta?: unknown): void;
}

export interface AppEmbedControllerDependencies {
    composerInput: {
        get(): AppEmbedComposerInputPort | null;
    };
    sharedContent: {
        clearUrlQueryContentStore(): void;
        updateUrlQueryContentStore(content: string): void;
    };
    composerContextApply: AppEmbedComposerContextApplyPort;
    settingsApply: AppEmbedSettingsApplyPort;
    parentFrame: AppEmbedParentFramePort;
    runtime: AppEmbedRuntimeStateGetters;
    storage: AppEmbedStoragePort;
    logger: AppEmbedControllerLogger;
}

export type AppEmbedPendingComposerAction = Readonly<{
    type: "set";
    payload: EmbedComposerSetContextPayload;
    requestId: string;
}>;

interface AppEmbedControllerState {
    pendingComposerAction?: AppEmbedPendingComposerAction;
    lastNotifiedComposerContextSignature: string | null;
    applyingComposerContext: boolean;
}

export interface AppEmbedController {
    handleRemoteComposerSetContext(
        payload: EmbedComposerSetContextPayload,
        requestId: string,
    ): Promise<void>;
    handleRemoteSettingsSet(
        payload: EmbedSettingsSetPayload,
        requestId: string,
    ): Promise<void>;
    queueRemoteComposerAction(
        payload: EmbedComposerSetContextPayload,
        requestId: string,
    ): void;
    flushPendingComposerAction(): Promise<void>;
    notifyComposerContextUpdatedIfChanged(): void;
    initializeEmbedStorageSync(): Promise<void>;
    resetNotifiedComposerContextSignature(): void;
}

function shouldQueueAction(getters: AppEmbedRuntimeStateGetters): boolean {
    return getters.isBootstrappingApp() || getters.hasPendingParentAuth();
}

export function createAppEmbedController(
    deps: AppEmbedControllerDependencies,
): AppEmbedController {
    const state: AppEmbedControllerState = {
        pendingComposerAction: undefined,
        lastNotifiedComposerContextSignature: null,
        applyingComposerContext: false,
    };

    function buildCurrentComposerContextPayload() {
        return buildComposerContextUpdatedPayload(
            deps.runtime.getReplyQuoteState(),
            deps.runtime.getChannelContextState(),
            deps.runtime.getChannelContextProvenance(),
        );
    }

    function applyRemoteComposerSetContext(
        payload: EmbedComposerSetContextPayload,
    ): Array<() => Promise<void>> {
        // Decode and validate every reference before mutating any composer state.
        const { channelContext, replyQuoteQuery } = buildEmbedComposerContextPatch(
            payload,
            deps.runtime.getReplyQuoteState(),
        );
        const composerInput = deps.composerInput.get();

        applyEmbedComposerContent(payload.content, {
            clearUrlQueryContentStore: deps.sharedContent.clearUrlQueryContentStore,
            updateUrlQueryContentStore: deps.sharedContent.updateUrlQueryContentStore,
            resetPostContent: composerInput
                ? () => {
                    composerInput.resetContent();
                }
                : undefined,
            insertTextContent: composerInput
                ? (content: string) => {
                    composerInput.insertText(content);
                }
                : undefined,
        });

        const runtimeSnapshot = deps.runtime.getRuntimeSnapshot();

        if (channelContext !== undefined) {
            if (channelContext === null) {
                deps.composerContextApply.clearChannelContext();
            } else {
                deps.composerContextApply.applyChannelContextQuery(
                    channelContext,
                    runtimeSnapshot,
                );
            }
        }

        if (replyQuoteQuery === undefined) {
            return [];
        }

        if (replyQuoteQuery === null) {
            deps.composerContextApply.clearReplyQuote();
            return [];
        }

        const references = deps.composerContextApply.applyReplyQuoteSelection(
            replyQuoteQuery,
        );
        return references.length > 0
            ? [() => deps.composerContextApply.hydrateReplyQuoteReferences(
                references,
                runtimeSnapshot,
            )]
            : [];
    }

    function runBackgroundComposerTasks(tasks: Array<() => Promise<void>>): void {
        for (const task of tasks) {
            void task().catch((error) => {
                deps.logger.warn("composer context の非同期補完をスキップ:", error);
            });
        }
    }

    function applyAndAcknowledgeComposerContext(
        payload: EmbedComposerSetContextPayload,
        requestId: string,
    ): void {
        state.applyingComposerContext = true;
        try {
            const backgroundTasks = applyRemoteComposerSetContext(payload);
            deps.parentFrame.notifyComposerContextApplied(requestId);
            state.lastNotifiedComposerContextSignature = buildComposerContextSignature(
                buildCurrentComposerContextPayload(),
            );
            runBackgroundComposerTasks(backgroundTasks);
        } finally {
            state.applyingComposerContext = false;
        }
    }

    function notifyComposerError(
        error: unknown,
        requestId: string,
        logPrefix: string,
    ): void {
        deps.logger.error(logPrefix, error);
        deps.parentFrame.notifyComposerContextError(
            {
                code: "composer_context_apply_failed",
                message: error instanceof Error ? error.message : String(error),
                cause: error,
            },
            requestId,
        );
    }

    return {
        async handleRemoteComposerSetContext(
            payload: EmbedComposerSetContextPayload,
            requestId: string,
        ): Promise<void> {
            if (shouldQueueAction(deps.runtime)) {
                state.pendingComposerAction = {
                    type: "set",
                    payload,
                    requestId,
                };
                return;
            }

            try {
                applyAndAcknowledgeComposerContext(payload, requestId);
            } catch (error) {
                notifyComposerError(error, requestId, "composer.setContext の適用に失敗:");
            }
        },

        async handleRemoteSettingsSet(
            payload: EmbedSettingsSetPayload,
            requestId: string,
        ): Promise<void> {
            try {
                const applied = await deps.settingsApply.applySettings(payload);
                deps.parentFrame.notifySettingsApplied(applied, requestId);
            } catch (error) {
                deps.logger.error("settings.set の適用に失敗:", error);
                deps.parentFrame.notifySettingsError(
                    {
                        code: "settings_apply_failed",
                        message: error instanceof Error ? error.message : String(error),
                        cause: error,
                    },
                    requestId,
                );
            }
        },

        queueRemoteComposerAction(
            payload: EmbedComposerSetContextPayload,
            requestId: string,
        ): void {
            state.pendingComposerAction = {
                type: "set",
                payload,
                requestId,
            };
        },

        async flushPendingComposerAction(): Promise<void> {
            if (shouldQueueAction(deps.runtime)) {
                return;
            }

            const pendingAction = state.pendingComposerAction;
            state.pendingComposerAction = undefined;
            if (!pendingAction) {
                return;
            }

            try {
                applyAndAcknowledgeComposerContext(
                    pendingAction.payload,
                    pendingAction.requestId,
                );
            } catch (error) {
                notifyComposerError(
                    error,
                    pendingAction.requestId,
                    "保留中の composer.setContext の適用に失敗:",
                );
            }
        },

        notifyComposerContextUpdatedIfChanged(): void {
            if (deps.runtime.isBootstrappingApp() || state.applyingComposerContext) {
                return;
            }

            const payload = buildCurrentComposerContextPayload();
            const signature = buildComposerContextSignature(payload);

            if (signature === state.lastNotifiedComposerContextSignature) {
                return;
            }

            state.lastNotifiedComposerContextSignature = signature;
            deps.parentFrame.notifyComposerContextUpdated({
                reply: payload.reply,
                quotes: payload.quotes,
                channel: payload.channel ?? null,
            });
        },

        async initializeEmbedStorageSync(): Promise<void> {
            try {
                const values = await deps.storage.getEmbedStorageSnapshot();
                const applied = deps.storage.applyEmbedStorageSnapshot(values);
                if (applied.appliedKeys.length > 0) {
                    deps.storage.applyStoredSettingsSnapshot();
                }
                deps.storage.persistEmbedStorageKeys();
            } catch (error) {
                deps.logger.warn("親 storage の初期同期をスキップ:", error);
            }
        },

        resetNotifiedComposerContextSignature(): void {
            state.lastNotifiedComposerContextSignature = null;
        },
    };
}
