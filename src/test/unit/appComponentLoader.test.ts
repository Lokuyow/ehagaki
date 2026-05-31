import { describe, expect, it, vi } from 'vitest';

import { createComponentLoader } from '../../lib/appComponentLoader';

describe('createComponentLoader', () => {
    it('lazy loader は最初の呼び出しで 1 回だけ importer を評価し、結果を再利用する', async () => {
        const importer = vi.fn(async () => ({
            default: { id: 'lazy-component' },
        }));

        const loadComponent = createComponentLoader(importer);

        await expect(loadComponent()).resolves.toEqual({ id: 'lazy-component' });
        await expect(loadComponent()).resolves.toEqual({ id: 'lazy-component' });

        expect(importer).toHaveBeenCalledTimes(1);
    });

    it('eager loader は作成時に importer を先読みし、以後は同じ結果を返す', async () => {
        const importer = vi.fn(async () => ({
            default: { id: 'eager-component' },
        }));

        const loadComponent = createComponentLoader(importer, { eager: true });

        expect(importer).toHaveBeenCalledTimes(1);
        await expect(loadComponent()).resolves.toEqual({ id: 'eager-component' });
        await expect(loadComponent()).resolves.toEqual({ id: 'eager-component' });

        expect(importer).toHaveBeenCalledTimes(1);
    });
});
