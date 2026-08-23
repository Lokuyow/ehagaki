import { describe, it, expect } from 'vitest';
import { VIDEO_COMPRESSION_OPTIONS_MAP } from '../../lib/constants';

/**
 * 動画圧縮設定のユニットテスト
 * 
 * 設定値の相対関係・妥当性を検証します。
 * 個別値の完全一致テストは定数変更時に壊れるだけで保護にならないため省略。
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

        it('各レベルに必要なプロパティが含まれている', () => {
            const levels = ['low', 'medium', 'high'] as const;
            levels.forEach(level => {
                const config = VIDEO_COMPRESSION_OPTIONS_MAP[level];
                expect(config).toHaveProperty('maxSize');
                expect(config).toHaveProperty('mediabunnyVideoQualityFactor');
                expect(config).toHaveProperty('mediabunnyAudioQualityFactor');
                expect(config).not.toHaveProperty('crf');
                expect(config).not.toHaveProperty('preset');
                expect(config).not.toHaveProperty('audioBitrate');
            });
        });
    });

    describe('設定値の相対関係', () => {
        it('maxSizeが高→中→低の順で小さくなる', () => {
            const lowSize = VIDEO_COMPRESSION_OPTIONS_MAP.low.maxSize!;
            const mediumSize = VIDEO_COMPRESSION_OPTIONS_MAP.medium.maxSize!;
            const highSize = VIDEO_COMPRESSION_OPTIONS_MAP.high.maxSize!;

            expect(highSize).toBeGreaterThan(mediumSize);
            expect(mediumSize).toBeGreaterThan(lowSize);
        });

        it('MediaBunny Quality factorがHigh→Medium→Lowの順で下がる', () => {
            const { high, medium, low } = VIDEO_COMPRESSION_OPTIONS_MAP;

            expect(high.mediabunnyAudioQualityFactor).toBeGreaterThan(medium.mediabunnyAudioQualityFactor);
            expect(medium.mediabunnyAudioQualityFactor).toBeGreaterThan(low.mediabunnyAudioQualityFactor);
            expect(high.mediabunnyVideoQualityFactor).toBe(high.mediabunnyAudioQualityFactor);
            expect(medium.mediabunnyVideoQualityFactor).toBe(medium.mediabunnyAudioQualityFactor);
            expect(low.mediabunnyVideoQualityFactor).toBe(low.mediabunnyAudioQualityFactor);
        });

        it('Lowの音声サンプルレートがAAC互換の44100Hzである', () => {
            const mediumSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.medium.audioSampleRate!;
            const lowSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.low.audioSampleRate!;

            expect(mediumSampleRate).toBe(44100);
            expect(lowSampleRate).toBe(44100);
        });
    });

    describe('設定値の妥当性', () => {
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
            const lowSampleRate = VIDEO_COMPRESSION_OPTIONS_MAP.low.audioSampleRate!;

            expect(mediumSampleRate).toBeGreaterThan(0);
            expect(lowSampleRate).toBeGreaterThan(0);
            expect(Number.isInteger(mediumSampleRate)).toBe(true);
            expect(Number.isInteger(lowSampleRate)).toBe(true);
        });

        it('音声チャンネル数が正の整数である', () => {
            const channels = VIDEO_COMPRESSION_OPTIONS_MAP.low.audioChannels!;

            expect(channels).toBeGreaterThan(0);
            expect(Number.isInteger(channels)).toBe(true);
        });
    });
});
