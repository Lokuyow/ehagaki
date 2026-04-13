import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

vi.mock('../../lib/utils/appDomUtils', () => ({
    blurEditorAndBody: vi.fn(),
    domUtils: {
        querySelectorAll: vi.fn(() => []),
    },
    isTouchDevice: vi.fn(() => false),
}));

import { requestImageFullscreen } from '../../lib/utils/mediaNodeUtils';

describe('mediaNodeUtils', () => {
    let dispatchEventSpy: MockInstance;

    beforeEach(() => {
        dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');
    });

    afterEach(() => {
        dispatchEventSpy.mockRestore();
    });

    it('should dispatch fullscreen event', () => {
        requestImageFullscreen('test.jpg', 'Test image');

        expect(dispatchEventSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'image-fullscreen-request',
                detail: { src: 'test.jpg', alt: 'Test image' },
            }),
        );
    });
});