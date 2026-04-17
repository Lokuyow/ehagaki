import { describe, expect, it } from 'vitest';
import { selectCompactBalloonMessage } from '../../lib/hooks/useBalloonMessage.svelte';

describe('selectCompactBalloonMessage', () => {
    it('flavor のフレーバーテキストは compact 表示から除外する', () => {
        const result = selectCompactBalloonMessage({
            serviceWorkerErrorMessage: null,
            debugMessage: null,
            currentMessage: {
                type: 'flavor',
                message: 'hello',
            },
            errorMessage: null,
            successMessage: null,
        });

        expect(result).toBeNull();
    });

    it('tips は compact 表示に残す', () => {
        const result = selectCompactBalloonMessage({
            serviceWorkerErrorMessage: null,
            debugMessage: null,
            currentMessage: {
                type: 'tips',
                message: 'tip',
            },
            errorMessage: null,
            successMessage: null,
        });

        expect(result).toEqual({
            type: 'tips',
            message: 'tip',
        });
    });

    it('隠れた flavor より error を優先して compact 表示する', () => {
        const result = selectCompactBalloonMessage({
            serviceWorkerErrorMessage: null,
            debugMessage: null,
            currentMessage: {
                type: 'flavor',
                message: 'hello',
            },
            errorMessage: {
                type: 'error',
                message: 'failed',
            },
            successMessage: null,
        });

        expect(result).toEqual({
            type: 'error',
            message: 'failed',
        });
    });
});