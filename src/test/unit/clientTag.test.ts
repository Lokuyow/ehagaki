import { describe, expect, it } from 'vitest';

import { buildClientTag, DEFAULT_CLIENT_TAG } from '../../lib/tags/clientTag';

describe('clientTag', () => {
    it('有効な場合はデフォルト client tag のコピーを返す', () => {
        const tag = buildClientTag(true);

        expect(tag).toEqual(DEFAULT_CLIENT_TAG);
        expect(tag).not.toBe(DEFAULT_CLIENT_TAG);
    });

    it('無効な場合は null を返す', () => {
        expect(buildClientTag(false)).toBeNull();
    });
});
