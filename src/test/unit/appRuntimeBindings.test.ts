import { describe, expect, it, vi } from 'vitest';

import { setupAppRuntimeBindings } from '../../lib/appRuntimeBindings';

describe('setupAppRuntimeBindings', () => {
    it('各 runtime handler を登録して cleanup できる', async () => {
        let remoteLoginHandler: (pubkeyHex: string | null) => void = () => undefined;
        let remoteLogoutHandler: (pubkeyHex: string | null) => void = () => undefined;
        let remoteComposerHandler: (payload: unknown, requestId: string | undefined) => void = () => undefined;
        let remoteSettingsSetHandler: (payload: unknown, requestId: string | undefined) => void = () => undefined;
        let remoteSettingsErrorHandler: (error: unknown, requestId: string | undefined) => void = () => undefined;

        const cleanupParentLogin = vi.fn();
        const cleanupParentLogout = vi.fn();
        const cleanupComposer = vi.fn();
        const cleanupSettingsSet = vi.fn();
        const cleanupSettingsError = vi.fn();
        const cleanupReplyQuote = vi.fn();
        const cleanupChannel = vi.fn();

        const handleRemoteParentClientLogin = vi.fn();
        const handleRemoteParentClientLogout = vi.fn();
        const handleRemoteComposerSetContext = vi.fn();
        const handleRemoteSettingsSet = vi.fn();
        const notifySettingsError = vi.fn();
        const notifyComposerContextUpdatedIfChanged = vi.fn();

        const cleanup = setupAppRuntimeBindings({
            parentClientAvailable: true,
            parentClientAuthService: {
                onRemoteLogin: (handler) => {
                    remoteLoginHandler = handler;
                    return cleanupParentLogin;
                },
                onRemoteLogout: (handler) => {
                    remoteLogoutHandler = handler;
                    return cleanupParentLogout;
                },
                announceReady: vi.fn(),
            },
            embedComposerContextService: {
                onRemoteSetContext: (handler) => {
                    remoteComposerHandler = handler;
                    return cleanupComposer;
                },
            },
            embedSettingsService: {
                onRemoteSetSettings: (handler) => {
                    remoteSettingsSetHandler = handler;
                    return cleanupSettingsSet;
                },
                onRemoteSettingsError: (handler) => {
                    remoteSettingsErrorHandler = handler;
                    return cleanupSettingsError;
                },
            },
            onReplyQuoteChanged: () => cleanupReplyQuote,
            onChannelContextChanged: () => cleanupChannel,
            handleRemoteParentClientLogin,
            handleRemoteParentClientLogout,
            handleRemoteComposerSetContext,
            handleRemoteSettingsSet,
            notifySettingsError,
            notifyComposerContextUpdatedIfChanged,
        });

        remoteLoginHandler('ab'.repeat(32));
        remoteLogoutHandler('cd'.repeat(32));
        remoteComposerHandler({ content: 'hello' }, 'req-1');
        remoteSettingsSetHandler({ locale: 'ja' }, 'req-2');
        remoteSettingsErrorHandler({ code: 'bad_request' }, 'req-3');

        expect(handleRemoteParentClientLogin).toHaveBeenCalledWith('ab'.repeat(32));
        expect(handleRemoteParentClientLogout).toHaveBeenCalledWith('cd'.repeat(32));
        expect(handleRemoteComposerSetContext).toHaveBeenCalledWith({ content: 'hello' }, 'req-1');
        expect(handleRemoteSettingsSet).toHaveBeenCalledWith({ locale: 'ja' }, 'req-2');
        expect(notifySettingsError).toHaveBeenCalledWith({ code: 'bad_request' }, 'req-3');

        cleanup();

        expect(cleanupParentLogin).toHaveBeenCalledTimes(1);
        expect(cleanupParentLogout).toHaveBeenCalledTimes(1);
        expect(cleanupComposer).toHaveBeenCalledTimes(1);
        expect(cleanupSettingsSet).toHaveBeenCalledTimes(1);
        expect(cleanupSettingsError).toHaveBeenCalledTimes(1);
        expect(cleanupReplyQuote).toHaveBeenCalledTimes(1);
        expect(cleanupChannel).toHaveBeenCalledTimes(1);
    });

    it('settings error は requestId が無い場合 notify しない', () => {
        let remoteSettingsErrorHandler: (error: unknown, requestId: string | undefined) => void = () => undefined;
        const notifySettingsError = vi.fn();

        setupAppRuntimeBindings({
            parentClientAvailable: false,
            parentClientAuthService: {
                onRemoteLogin: () => () => undefined,
                onRemoteLogout: () => () => undefined,
                announceReady: vi.fn(),
            },
            embedComposerContextService: {
                onRemoteSetContext: () => () => undefined,
            },
            embedSettingsService: {
                onRemoteSetSettings: () => () => undefined,
                onRemoteSettingsError: (handler) => {
                    remoteSettingsErrorHandler = handler;
                    return () => undefined;
                },
            },
            onReplyQuoteChanged: () => () => undefined,
            onChannelContextChanged: () => () => undefined,
            handleRemoteParentClientLogin: vi.fn(),
            handleRemoteParentClientLogout: vi.fn(),
            handleRemoteComposerSetContext: vi.fn(),
            handleRemoteSettingsSet: vi.fn(),
            notifySettingsError,
            notifyComposerContextUpdatedIfChanged: vi.fn(),
        });

        remoteSettingsErrorHandler({ code: 'bad_request' }, undefined);

        expect(notifySettingsError).not.toHaveBeenCalled();
    });
});
