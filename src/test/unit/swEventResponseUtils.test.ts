import { describe, expect, it, vi } from 'vitest';

import {
    createPingTestResponse,
    createVersionResponse,
    postMessageEventResponse,
    postPortEventResponse,
} from '../../lib/swEventResponseUtils';

describe('swEventResponseUtils', () => {
    it('createVersionResponse は version payload を返す', () => {
        expect(createVersionResponse('1.2.3')).toEqual({ version: '1.2.3' });
    });

    it('createPingTestResponse は PONG payload を返す', () => {
        expect(createPingTestResponse('1.2.3', 123)).toEqual({
            type: 'PONG',
            timestamp: 123,
            version: '1.2.3',
        });
    });

    it('postMessageEventResponse は port を優先する', () => {
        const portPostMessage = vi.fn();
        const sourcePostMessage = vi.fn();

        const result = postMessageEventResponse(
            {
                ports: [{ postMessage: portPostMessage }],
                source: { postMessage: sourcePostMessage },
            },
            { ok: true },
        );

        expect(result).toBe('port');
        expect(portPostMessage).toHaveBeenCalledWith({ ok: true });
        expect(sourcePostMessage).not.toHaveBeenCalled();
    });

    it('postPortEventResponse は port がない時に false を返す', () => {
        expect(postPortEventResponse({}, { ok: true })).toBe(false);
    });
});