import { describe, expect, it } from 'vitest';

import { buildUploadFailureMessage } from '../../lib/uploadResultUtils';

describe('buildUploadFailureMessage', () => {
    it('失敗結果がない場合は空文字を返す', () => {
        expect(buildUploadFailureMessage([], 'fallback')).toBe('');
    });

    it('単一失敗では error を優先し、なければ fallback を返す', () => {
        expect(buildUploadFailureMessage([
            { success: false, error: 'custom error' },
        ], 'fallback')).toBe('custom error');

        expect(buildUploadFailureMessage([
            { success: false },
        ], 'fallback')).toBe('fallback');
    });

    it('複数失敗では件数ベースのメッセージを返す', () => {
        expect(buildUploadFailureMessage([
            { success: false, error: 'a' },
            { success: false, error: 'b' },
        ], 'fallback')).toBe('2個のファイルのアップロードに失敗しました');
    });
});