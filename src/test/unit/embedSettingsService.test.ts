import { beforeEach, describe, expect, it } from 'vitest';
import { EMBED_MESSAGE_NAMESPACE } from '../../lib/embedProtocol';
import { EmbedSettingsService } from '../../lib/embedSettingsService';
import { createEmbedTestWindow, createMockConsole, type MockConsole } from '../helpers';

describe('EmbedSettingsService', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
    });

    it('settings.set を受け取ると listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedSettingsService(windowObj, mockConsole);
        const onRemoteSetSettings = vi.fn();
        service.onRemoteSetSettings(onRemoteSetSettings);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'settings.set',
                requestId: 'settings-request-1',
                payload: {
                    locale: 'en',
                    themeMode: 'dark',
                    showMascot: false,
                },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).toHaveBeenCalledWith(
            {
                locale: 'en',
                themeMode: 'dark',
                showMascot: false,
            },
            'settings-request-1',
        );
    });

    it('origin が一致しない settings.set は無視する', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedSettingsService(windowObj, mockConsole);
        const onRemoteSetSettings = vi.fn();
        service.onRemoteSetSettings(onRemoteSetSettings);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'settings.set',
                requestId: 'settings-request-2',
                payload: { themeMode: 'dark' },
            },
            origin: 'https://other.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).not.toHaveBeenCalled();
    });

    it('requestId がない settings.set は拒否する', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedSettingsService(windowObj, mockConsole);
        const onRemoteSetSettings = vi.fn();
        const onRemoteSettingsError = vi.fn();
        service.onRemoteSetSettings(onRemoteSetSettings);
        service.onRemoteSettingsError(onRemoteSettingsError);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'settings.set',
                payload: { themeMode: 'dark' },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).not.toHaveBeenCalled();
        expect(onRemoteSettingsError).toHaveBeenCalledWith(
            { code: 'settings_request_id_required' },
            undefined,
        );
        expect(mockConsole.warn).toHaveBeenCalled();
    });

    it('不正な payload は settings error listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createEmbedTestWindow();
        const service = new EmbedSettingsService(windowObj, mockConsole);
        const onRemoteSetSettings = vi.fn();
        const onRemoteSettingsError = vi.fn();
        service.onRemoteSetSettings(onRemoteSetSettings);
        service.onRemoteSettingsError(onRemoteSettingsError);
        service.initialize();

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'settings.set',
                requestId: 'settings-request-3',
                payload: { themeMode: 'sepia' },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).not.toHaveBeenCalled();
        expect(onRemoteSettingsError).toHaveBeenCalledWith(
            {
                code: 'settings_invalid_payload',
                message: 'settings.set payload is invalid',
            },
            'settings-request-3',
        );
    });
});
