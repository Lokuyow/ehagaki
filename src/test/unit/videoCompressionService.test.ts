import { describe, it, expect } from 'vitest';
import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../../lib/constants';

/**
 * 動画圧縮サービスのユニットテスト
 * 
 * このテストは設定値の検証とロジックのテストのみを行います。
 * 実際の圧縮フローは integration/video-compression.integration.test.ts で検証します。
 */

describe('VIDEO_COMPRESSION_OPTIONS_MAP', () => {
    describe('構造の検証', () => {
        it('すべての圧縮レベルが定義されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('none');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('low');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('medium');
            expect(VIDEO_COMPRESSION_OPTIONS_MAP).toHaveProperty('high');
        });

        it('noneレベルにskipフラグが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.none).toEqual({ skip: true });
        });
    });

    describe('lowレベルの設定値', () => {
        it('CRF値が正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.crf).toBe(20);
        });

        it('プリセットが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.preset).toBe('superfast');
        });

        it('最大画素サイズが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.maxSize).toBe(1280);
        });

        it('音声ビットレートが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.audioBitrate).toBe('128k');
        });

        it('MediaBunny動画品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.mediabunnyVideoQuality).toBeDefined();
        });

        it('MediaBunny音声品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.low.mediabunnyAudioQuality).toBeDefined();
        });
    });

    describe('mediumレベルの設定値', () => {
        it('CRF値が正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.crf).toBe(26);
        });

        it('プリセットが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.preset).toBe('superfast');
        });

        it('最大画素サイズが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize).toBe(640);
        });

        it('音声ビットレートが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioBitrate).toBe('64k');
        });

        it('音声サンプルレートが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioSampleRate).toBe(44100);
        });

        it('MediaBunny動画品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.mediabunnyVideoQuality).toBeDefined();
        });

        it('MediaBunny音声品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.medium.mediabunnyAudioQuality).toBeDefined();
        });
    });

    describe('highレベルの設定値', () => {
        it('CRF値が正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.crf).toBe(28);
        });

        it('プリセットが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.preset).toBe('medium');
        });

        it('最大画素サイズが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.maxSize).toBe(320);
        });

        it('音声ビットレートが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.audioBitrate).toBe('32k');
        });

        it('音声サンプルレートが正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.audioSampleRate).toBe(16000);
        });

        it('音声チャンネル数が正しく設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.audioChannels).toBe(1);
        });

        it('MediaBunny動画品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.mediabunnyVideoQuality).toBeDefined();
        });

        it('MediaBunny音声品質プリセットが設定されている', () => {
            expect(VIDEO_COMPRESSION_OPTIONS_MAP.high.mediabunnyAudioQuality).toBeDefined();
        });
    });

    describe('設定値の相対関係', () => {
        it('CRF値が低→中→高の順で大きくなる（圧縮率が高くなる）', () => {
            const lowCrf = VIDEO_COMPRESSION_OPTIONS_MAP.low.crf!;
            const mediumCrf = VIDEO_COMPRESSION_OPTIONS_MAP.medium.crf!;
            const highCrf = VIDEO_COMPRESSION_OPTIONS_MAP.high.crf!;

            expect(lowCrf).toBeLessThan(mediumCrf);
            expect(mediumCrf).toBeLessThan(highCrf);
        });

        it('maxSizeが低→中→高の順で小さくなる', () => {
            const lowSize = VIDEO_COMPRESSION_OPTIONS_MAP.low.maxSize!;
            const mediumSize = VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize!;
            const highSize = VIDEO_COMPRESSION_OPTIONS_MAP.high.maxSize!;

            expect(lowSize).toBeGreaterThan(mediumSize);
            expect(mediumSize).toBeGreaterThan(highSize);
        });

        it('音声ビットレートが低→中→高の順で小さくなる', () => {
            // ビットレートは文字列なので数値に変換して比較
            const parseBitrate = (br: string) => parseInt(br.replace('k', ''), 10);
            
            const lowBitrate = parseBitrate(VIDEO_COMPRESSION_OPTIONS_MAP.low.audioBitrate!);
            const mediumBitrate = parseBitrate(VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioBitrate!);
            const highBitrate = parseBitrate(VIDEO_COMPRESSION_OPTIONS_MAP.high.audioBitrate!);

            expect(lowBitrate).toBeGreaterThan(mediumBitrate);
            expect(mediumBitrate).toBeGreaterThan(highBitrate);
        });

        it('音声サンプルレートがmedium→highで小さくなる', () => {
            const mediumSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioSampleRate!;
            const highSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.high.audioSampleRate!;

            expect(mediumSampleRate).toBeGreaterThan(highSampleRate);
        });
    });

    describe('設定値の妥当性', () => {
        it('CRF値が有効範囲内（0-51）である', () => {
            const levels = ['low', 'medium', 'high'] as const;
            
            levels.forEach(level => {
                const crf = VIDEO_COMPRESSION_OPTIONS_MAP[level].crf!;
                expect(crf).toBeGreaterThanOrEqual(0);
                expect(crf).toBeLessThanOrEqual(51);
            });
        });

        it('maxSizeが正の整数である', () => {
            const levels = ['low', 'medium', 'high'] as const;
            
            levels.forEach(level => {
                const maxSize = VIDEO_COMPRESSION_OPTIONS_MAP[level].maxSize!;
                expect(maxSize).toBeGreaterThan(0);
                expect(Number.isInteger(maxSize)).toBe(true);
            });
        });

        it('音声サンプルレートが正の整数である', () => {
            const mediumSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioSampleRate!;
            const highSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.high.audioSampleRate!;

            expect(mediumSampleRate).toBeGreaterThan(0);
            expect(highSampleRate).toBeGreaterThan(0);
            expect(Number.isInteger(mediumSampleRate)).toBe(true);
            expect(Number.isInteger(highSampleRate)).toBe(true);
        });

        it('音声チャンネル数が正の整数である', () => {
            const channels = VIDEO_COMPRESSION_OPTIONS_MAP.high.audioChannels!;
            
            expect(channels).toBeGreaterThan(0);
            expect(Number.isInteger(channels)).toBe(true);
        });
    });
});
