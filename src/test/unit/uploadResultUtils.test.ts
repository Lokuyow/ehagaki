import { describe, expect, it } from 'vitest';

import en from '../../lib/i18n/en.json';
import ja from '../../lib/i18n/ja.json';
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

    it('単一のNIP-96 policy error は呼び出し元の翻訳を使う', () => {
        expect(buildUploadFailureMessage([
            {
                success: false,
                error: 'The media URL is invalid',
                errorCode: 'nip96InvalidMediaUrl',
            },
        ], 'fallback', (errorCode) => `translated:${errorCode}`)).toBe(
            'translated:nip96InvalidMediaUrl',
        );
    });

    it('NIP-96初回requestの安全停止errorも呼び出し元の翻訳を使う', () => {
        expect(buildUploadFailureMessage([
            {
                success: false,
                error: 'The upload request could not be completed safely',
                errorCode: 'nip96UploadRequestBlocked',
            },
        ], 'fallback', (errorCode) => `translated:${errorCode}`)).toBe(
            'translated:nip96UploadRequestBlocked',
        );
    });

    it('NIP-96初回requestの安全停止errorを日本語と英語で定義する', () => {
        expect(ja.postComponent.nip96UploadRequestBlocked).toContain('アップロード完了は確認できません');
        expect(en.postComponent.nip96UploadRequestBlocked).toContain('Completion could not be confirmed');
    });

    it('複数失敗では件数ベースのメッセージを返す', () => {
        expect(buildUploadFailureMessage([
            { success: false, error: 'a' },
            { success: false, error: 'b' },
        ], 'fallback')).toBe('2個のファイルのアップロードに失敗しました');
    });
});
