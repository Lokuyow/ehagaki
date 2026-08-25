import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EMBED_MESSAGE_NAMESPACE } from '../../lib/embedProtocol';
import { EmbedSettingsService } from '../../lib/embedSettingsService';
import { createMockConsole, type MockConsole } from '../helpers';
import { createMockWindow } from '../embedWindowTestUtils';

describe('EmbedSettingsService', () => {
    let mockConsole: MockConsole;

    beforeEach(() => {
        mockConsole = createMockConsole();
    });

    it('settings.set を受け取ると listener を呼ぶ', () => {
        const { windowObj, parent, listeners } = createMockWindow();
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

    it('カラーの runtime forced layer は null または6桁HEXだけ受け付ける', () => {
        const { windowObj, parent, listeners } = createMockWindow();
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
                requestId: 'settings-color-1',
                payload: { accentColor: '#ABCDEF', baseColor: null },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).toHaveBeenCalledWith(
            { accentColor: '#ABCDEF', baseColor: null },
            'settings-color-1',
        );

        listeners.get('message')?.({
            data: {
                namespace: EMBED_MESSAGE_NAMESPACE,
                version: 1,
                type: 'settings.set',
                requestId: 'settings-color-2',
                payload: { baseColor: '#12345' },
            },
            origin: 'https://parent.example.com',
            source: parent,
        } as unknown as MessageEvent);

        expect(onRemoteSettingsError).toHaveBeenLastCalledWith(
            {
                code: 'settings_invalid_payload',
                message: 'settings.set payload is invalid',
            },
            'settings-color-2',
        );
    });

    it('origin が一致しない settings.set は無視する', () => {
        const { windowObj, parent, listeners } = createMockWindow();
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

    it.each([
        ['source がparentではない', { namespace: EMBED_MESSAGE_NAMESPACE, version: 1, type: 'settings.set', requestId: 'settings-request-4' }, {}],
        ['envelopeが不正', { namespace: 'other.embed', version: 1, type: 'settings.set', requestId: 'settings-request-4' }, null],
        ['serviceと無関係なtype', { namespace: EMBED_MESSAGE_NAMESPACE, version: 1, type: 'composer.setContext', requestId: 'settings-request-4' }, null],
    ])('%s messageはroutingしない', (_description, data, source) => {
        const { windowObj, parent, listeners } = createMockWindow();
        const service = new EmbedSettingsService(windowObj, mockConsole);
        const onRemoteSetSettings = vi.fn();
        service.onRemoteSetSettings(onRemoteSetSettings);
        service.initialize();

        listeners.get('message')?.({
            data,
            origin: 'https://parent.example.com',
            source: source ?? parent,
        } as unknown as MessageEvent);

        expect(onRemoteSetSettings).not.toHaveBeenCalled();
    });

    it('requestId がない settings.set は拒否する', () => {
        const { windowObj, parent, listeners } = createMockWindow();
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
        const { windowObj, parent, listeners } = createMockWindow();
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
