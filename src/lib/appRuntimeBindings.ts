type Cleanup = () => void;

export interface AppRuntimeBindingsDependencies {
    parentClientAvailable: boolean;
    parentClientAuthService: {
        onRemoteLogin(handler: (pubkeyHex: string | null) => void): Cleanup;
        onRemoteLogout(handler: (pubkeyHex: string | null) => void): Cleanup;
        announceReady(): void;
    };
    nip46Service: {
        subscribeOperationState(handler: (state: unknown) => void): Cleanup;
    };
    embedComposerContextService: {
        onRemoteSetContext(
            handler: (payload: unknown, requestId: string | undefined) => void,
        ): Cleanup;
    };
    embedSettingsService: {
        onRemoteSetSettings(
            handler: (payload: unknown, requestId: string | undefined) => void,
        ): Cleanup;
        onRemoteSettingsError(
            handler: (error: unknown, requestId: string | undefined) => void,
        ): Cleanup;
    };
    onReplyQuoteChanged(handler: () => void): Cleanup;
    onChannelContextChanged(handler: () => void): Cleanup;
    handleRemoteParentClientLogin(pubkeyHex: string | null): Promise<void> | void;
    handleRemoteParentClientLogout(pubkeyHex: string | null): Promise<void> | void;
    setNip46OperationState(state: unknown): void;
    handleRemoteComposerSetContext(
        payload: unknown,
        requestId: string | undefined,
    ): Promise<void> | void;
    handleRemoteSettingsSet(
        payload: unknown,
        requestId: string | undefined,
    ): Promise<void> | void;
    notifySettingsError(error: unknown, requestId: string): void;
    notifyComposerContextUpdatedIfChanged(): void;
}

export function setupAppRuntimeBindings(
    deps: AppRuntimeBindingsDependencies,
): Cleanup {
    const cleanupParentClientLoginHandler =
        deps.parentClientAuthService.onRemoteLogin((pubkeyHex) => {
            void deps.handleRemoteParentClientLogin(pubkeyHex);
        });

    const cleanupParentClientLogoutHandler =
        deps.parentClientAuthService.onRemoteLogout((pubkeyHex) => {
            void deps.handleRemoteParentClientLogout(pubkeyHex);
        });

    const cleanupNip46OperationHandler = deps.nip46Service.subscribeOperationState(
        (state) => {
            deps.setNip46OperationState(state);
        },
    );

    const cleanupRemoteComposerSetContextHandler =
        deps.embedComposerContextService.onRemoteSetContext((payload, requestId) => {
            void deps.handleRemoteComposerSetContext(payload, requestId);
        });

    const cleanupRemoteSettingsSetHandler =
        deps.embedSettingsService.onRemoteSetSettings((payload, requestId) => {
            void deps.handleRemoteSettingsSet(payload, requestId);
        });

    const cleanupRemoteSettingsErrorHandler =
        deps.embedSettingsService.onRemoteSettingsError((error, requestId) => {
            if (!requestId) {
                return;
            }

            deps.notifySettingsError(error, requestId);
        });

    const cleanupReplyQuoteChangeHandler = deps.onReplyQuoteChanged(() => {
        deps.notifyComposerContextUpdatedIfChanged();
    });

    const cleanupChannelContextChangeHandler = deps.onChannelContextChanged(() => {
        deps.notifyComposerContextUpdatedIfChanged();
    });

    if (deps.parentClientAvailable) {
        deps.parentClientAuthService.announceReady();
    }

    return () => {
        cleanupNip46OperationHandler();
        cleanupParentClientLoginHandler();
        cleanupParentClientLogoutHandler();
        cleanupRemoteComposerSetContextHandler();
        cleanupRemoteSettingsSetHandler();
        cleanupRemoteSettingsErrorHandler();
        cleanupReplyQuoteChangeHandler();
        cleanupChannelContextChangeHandler();
    };
}
