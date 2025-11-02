import {
    Conversion,
    BlobSource,
    BufferTarget,
    Input,
    Output,
    Mp4OutputFormat,
    ALL_FORMATS,
    getEncodableAudioCodecs,
    type ConversionOptions,
    type ConversionAudioOptions,
    type ConversionVideoOptions,
    type Quality
} from 'mediabunny';
import type { VideoCompressionResult } from '../types';
import { BaseCompression } from './baseCompression';
import { createCompressedFile, devLog, devWarn } from './compressionUtils';

/**
 * WebCodecs APIとMediaBunnyのサポートをチェック
 * ビデオエンコードができればtrueを返す（オーディオはコピーで対応可能）
 */
export async function isMediaBunnySupported(): Promise<boolean> {
    // WebCodecs APIの存在確認（ビデオエンコード/デコードが必須）
    const hasWebCodecs = typeof VideoEncoder !== 'undefined' &&
        typeof VideoDecoder !== 'undefined';

    if (!hasWebCodecs) {
        devLog('MediaBunnyCompression', 'WebCodecs API not available (VideoEncoder/VideoDecoder missing)');
        return false;
    }

    // Android版Firefoxの検出（WebCodecsサポートが不完全）
    const isAndroidFirefox = /Android.*Firefox/.test(navigator.userAgent);
    if (isAndroidFirefox) {
        devLog('MediaBunnyCompression', 'Android Firefox detected, will use FFmpeg fallback');
        return false;
    }

    // MediaBunnyのコーデックサポート確認（推奨パターン）
    // オーディオエンコードができなくてもビデオエンコードができればOK
    try {
        const supportedCodecs = await getEncodableAudioCodecs();
        const hasOpus = supportedCodecs.includes('opus');
        devLog('MediaBunnyCompression', 'MediaBunny supported - Video encoding available, Opus codec available:', hasOpus);
        return true; // ビデオエンコードができればOK（オーディオはコピーで対応）
    } catch (error) {
        devWarn('MediaBunnyCompression', 'Failed to check MediaBunny codec support:', error);
        // エラーが発生してもビデオエンコードはできる可能性が高いのでtrueを返す
        return true;
    }
}

/**
 * AudioEncoderがOpusをサポートしているかチェック
 */
export async function isOpusEncodingSupported(): Promise<boolean> {
    if (typeof AudioEncoder === 'undefined') {
        return false;
    }

    try {
        const config = {
            codec: 'opus',
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 128000
        };
        const support = await AudioEncoder.isConfigSupported(config);
        return support.supported || false;
    } catch (error) {
        return false;
    }
}

export async function isOpusEncodingConfigSupported(sampleRate: number, numberOfChannels: number, bitrate: number): Promise<boolean> {
    if (typeof AudioEncoder === 'undefined') {
        return false;
    }

    try {
        const config = { codec: 'opus', sampleRate, numberOfChannels, bitrate };
        const support = await AudioEncoder.isConfigSupported(config);
        return support.supported || false;
    } catch {
        return false;
    }
}

/**
 * Mediabunnyのクリーンアップヘルパー
 */
export function cleanupMediabunny(input: Input | null, output: Output | null, finalizeOutput = false): void {
    if (input) {
        try {
            input.dispose();
        } catch {
            // 無視
        }
    }
    if (output && finalizeOutput) {
        try {
            output.finalize();
        } catch {
            // 無視
        }
    }
}

/**
 * MediaBunnyを使用した動画圧縮クラス
 */
export class MediaBunnyCompression extends BaseCompression {
    private abortController: AbortController | null = null;

    constructor(
        private parseAudioBitrate: (audioBitrate: any) => number | null,
        private mergeVideoAndAudioWithFFmpeg: (videoBlob: Blob, originalFile: File) => Promise<Blob | null>,
        private compressWithFFmpeg: (file: File, options: any) => Promise<VideoCompressionResult>
    ) {
        super('MediaBunnyCompression');
    }

    /**
     * 圧縮処理を中止
     */
    public abort(): void {
        this.log('Abort requested');
        this.resetProgress();

        // Mediabunnyの場合はAbortControllerで中止
        if (this.abortController) {
            this.log('Aborting Mediabunny conversion');
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * リソースのクリーンアップ
     */
    public async cleanup(): Promise<void> {
        // MediaBunnyは特にクリーンアップ不要
        this.abortController = null;
    }

    /**
     * Opus対応設定を検索
     */
    private async findSupportedOpusConfig(
        track: any,
        targetChannels: number,
        preferredSampleRate: number,
        preferredBitrate: number
    ): Promise<{ sampleRate: number; bitrate: number } | null> {
        const fallbackBitrate = Math.max(preferredBitrate, 64000);
        const fallbackSampleRates = Array.from(new Set([
            preferredSampleRate,
            48000,
            24000,
            track.sampleRate,
        ])).filter(sr => Number.isFinite(sr) && sr > 0);

        const candidates = [
            { sampleRate: preferredSampleRate, bitrate: preferredBitrate },
            ...fallbackSampleRates.map(sampleRate => ({ sampleRate, bitrate: fallbackBitrate })),
        ];

        for (const { sampleRate, bitrate } of candidates) {
            if (!Number.isFinite(sampleRate) || sampleRate <= 0) continue;
            if (!Number.isFinite(bitrate) || bitrate <= 0) continue;

            const roundedSampleRate = Math.round(sampleRate);
            const roundedBitrate = Math.round(bitrate);
            const supported = await isOpusEncodingConfigSupported(roundedSampleRate, targetChannels, roundedBitrate);

            this.log('Opus encoding support probe:', {
                trackId: track.id,
                codec: track.codec,
                targetChannels,
                sampleRate: roundedSampleRate,
                bitrate: roundedBitrate,
                supported,
            });

            if (supported) {
                return { sampleRate: roundedSampleRate, bitrate: roundedBitrate };
            }
        }

        return null;
    }

    /**
     * Mediabunny用オーディオ設定を検証
     */
    private async validateMediabunnyAudioConfig(
        audioTracks: any[],
        options: any,
        useQualityPreset: boolean
    ): Promise<{ canEncodeOpus: boolean; audioConfigByTrack: Map<number, any>; desiredAudioSampleRate: number | null; desiredAudioBitrate: number | null }> {
        const audioConfigByTrack = new Map<number, { sampleRate?: number; bitrate?: number; channels?: number }>();
        let canEncodeOpus = await isOpusEncodingSupported();
        let desiredAudioBitrate = useQualityPreset ? null : this.parseAudioBitrate(options?.audioBitrate);
        let desiredAudioSampleRate = useQualityPreset ? null : (typeof options?.audioSampleRate === 'number' ? options.audioSampleRate : null);

        this.log('Opus encoding supported (global check):', canEncodeOpus);

        if (canEncodeOpus && audioTracks.length > 0) {
            for (const track of audioTracks) {
                const targetChannels = options.audioChannels ?? track.numberOfChannels;
                const preferredSampleRate = options.audioSampleRate ?? track.sampleRate;
                const preferredBitrate = useQualityPreset ? 64000 : (this.parseAudioBitrate(options.audioBitrate) ?? 128000);

                const resolvedConfig = await this.findSupportedOpusConfig(
                    track,
                    targetChannels,
                    preferredSampleRate,
                    preferredBitrate
                );

                if (!resolvedConfig) {
                    canEncodeOpus = false;
                    this.log('Opus encoder does not support requested settings; will copy audio track as-is via Mediabunny.', {
                        trackId: track.id,
                        preferredSampleRate,
                        preferredBitrate,
                        targetChannels,
                    });
                    break;
                }

                audioConfigByTrack.set(track.id, {
                    sampleRate: resolvedConfig.sampleRate,
                    bitrate: resolvedConfig.bitrate,
                    channels: targetChannels,
                });

                if (resolvedConfig.sampleRate !== preferredSampleRate || resolvedConfig.bitrate !== preferredBitrate) {
                    this.log('Adjusted Mediabunny audio target due to encoder support limitations.', {
                        trackId: track.id,
                        preferredSampleRate,
                        preferredBitrate,
                        resolvedSampleRate: resolvedConfig.sampleRate,
                        resolvedBitrate: resolvedConfig.bitrate,
                    });
                }

                if (!useQualityPreset) {
                    desiredAudioSampleRate = resolvedConfig.sampleRate;
                    desiredAudioBitrate = resolvedConfig.bitrate;
                }
            }
        }

        return { canEncodeOpus, audioConfigByTrack, desiredAudioSampleRate, desiredAudioBitrate };
    }

    /**
     * MediaBunny Conversion APIのオプションを構築
     * MediaBunnyの推奨パターンに従い、Quality定数を優先的に使用
     */
    private buildConversionOptions(
        input: Input,
        output: Output,
        options: any,
        useQualityPreset: boolean,
        audioQualityPreset: Quality | undefined,
        videoQualityPreset: Quality | undefined,
        canEncodeOpus: boolean,
        audioConfigByTrack: Map<number, any>
    ): ConversionOptions {
        const conversionOptions: ConversionOptions = {
            input,
            output,
            // 動画設定: MediaBunnyの推奨パターン（Quality定数を優先）
            // maxSizeは常に適用する
            video: (videoTrack) => {
                const videoOptions: ConversionVideoOptions = {
                    codec: 'avc',
                    // Quality定数が設定されている場合はそれを使用
                    ...(videoQualityPreset ? { bitrate: videoQualityPreset } : {}),
                };

                const maxSize = options.maxSize;
                if (typeof maxSize === 'number' && Number.isFinite(maxSize)) {
                    // アスペクト比を維持しながらリサイズ（MediaBunnyが自動計算）
                    if (videoTrack.displayWidth > videoTrack.displayHeight) {
                        videoOptions.width = Math.min(videoTrack.displayWidth, maxSize);
                    } else {
                        videoOptions.height = Math.min(videoTrack.displayHeight, maxSize);
                    }

                    this.log('Applying video resize:', {
                        originalWidth: videoTrack.displayWidth,
                        originalHeight: videoTrack.displayHeight,
                        maxSize,
                        targetWidth: videoOptions.width,
                        targetHeight: videoOptions.height,
                        bitrate: videoQualityPreset || 'custom'
                    });
                }

                return videoOptions;
            },
            // 音声設定: MediaBunnyの推奨パターン
            // Opusエンコードができない場合はオーディオトラックをそのままコピー
            audio: canEncodeOpus
                ? (useQualityPreset && audioQualityPreset
                    ? { codec: 'opus', bitrate: audioQualityPreset, forceTranscode: true }
                    : (audioTrack) => {
                        const configOverride = audioConfigByTrack.get(audioTrack.id);
                        const targetChannels = configOverride?.channels ?? options.audioChannels ?? audioTrack.numberOfChannels;
                        const targetSampleRate = configOverride?.sampleRate ?? options.audioSampleRate ?? audioTrack.sampleRate;

                        this.log('Configuring audio track for compression:', {
                            inputCodec: audioTrack.codec,
                            inputChannels: audioTrack.numberOfChannels,
                            inputSampleRate: audioTrack.sampleRate,
                            targetChannels,
                            targetSampleRate,
                        });

                        const fallbackBitrate = configOverride?.bitrate ?? this.parseAudioBitrate(options.audioBitrate) ?? 128000;

                        return {
                            codec: 'opus',
                            forceTranscode: true,
                            ...(typeof targetChannels === 'number' ? { numberOfChannels: targetChannels } : {}),
                            ...(typeof targetSampleRate === 'number' ? { sampleRate: targetSampleRate } : {}),
                            bitrate: fallbackBitrate,
                        } as ConversionAudioOptions;
                    })
                : (audioTrack) => {
                    this.log('Copying audio track as-is (Opus encoding not supported):', {
                        trackId: audioTrack.id,
                        codec: audioTrack.codec,
                        channels: audioTrack.numberOfChannels,
                        sampleRate: audioTrack.sampleRate,
                    });
                    // undefinedを返すとMediaBunnyはトラックをそのままコピーする
                    return undefined;
                },
            // 字幕トラック等の破棄は正常動作のため警告を抑制
            showWarnings: false,
        };

        return conversionOptions;
    }

    /**
     * Conversionの妥当性とトラック破棄を検証
     */
    private validateConversion(conversion: Conversion, input: Input, output: Output, canEncodeOpus: boolean): VideoCompressionResult | null {
        // 破棄されたトラックがある場合は詳細を確認
        if (conversion.discardedTracks.length > 0) {
            this.log('Discarded tracks:', conversion.discardedTracks.map(dt => ({ type: dt.track.type, reason: dt.reason })));

            const importantDiscards = conversion.discardedTracks.filter(
                t => t.track.type === 'video' || t.track.type === 'audio'
            );

            if (importantDiscards.length > 0) {
                console.warn('[MediaBunnyCompression] Important tracks discarded:', importantDiscards.map(dt => ({
                    type: dt.track.type,
                    reason: dt.reason,
                    codec: dt.track.type === 'audio' ? (dt.track as any).codec : undefined
                })));

                const audioCodecUnsupported = importantDiscards.some(dt =>
                    dt.track.type === 'audio' && dt.reason === 'no_encodable_target_codec'
                );

                // オーディオエンコードができない場合で、オーディオトラックがコピーされない場合のみエラー
                // （canEncodeOpusがfalseの場合、オーディオはコピーされるべき）
                if (audioCodecUnsupported && canEncodeOpus) {
                    devWarn(this.context, 'Mediabunny cannot encode audio for this environment, falling back to FFmpeg.');
                    cleanupMediabunny(input, output, true);
                    throw new Error('mediabunny-unsupported-audio-codec');
                }
            }
        }

        // 妥当性チェック
        if (!conversion.isValid) {
            devWarn(this.context, 'Conversion is not valid:', conversion.discardedTracks);
            cleanupMediabunny(input, output, true);
            return { file: new File([], ''), wasCompressed: false, wasSkipped: true };
        }

        return null;
    }

    /**
     * Conversionを実行（中止処理を含む）
     */
    private async executeConversion(conversion: Conversion, file: File): Promise<VideoCompressionResult | null> {
        // 中止シグナルの処理
        const abortPromise = new Promise<void>((resolve) => {
            this.abortController!.signal.addEventListener('abort', () => {
                this.log('Mediabunny conversion aborted');
                conversion.cancel().then(resolve);
            });
        });

        // 変換を実行
        await Promise.race([conversion.execute(), abortPromise]);

        // 中止チェック
        return this.checkAbort(file);
    }

    /**
     * Mediabunnyを使用して動画を圧縮
     */
    public async compressWithMediabunny(file: File, options: any): Promise<VideoCompressionResult> {
        let input: Input | null = null;
        let output: Output | null = null;
        let outputTarget: BufferTarget | null = null;
        const useQualityPreset = typeof options?.mediabunnyAudioQuality !== 'undefined';
        const audioQualityPreset = options?.mediabunnyAudioQuality as Quality | undefined;
        const videoQualityPreset = (options?.mediabunnyVideoQuality ?? options?.mediabunnyAudioQuality) as Quality | undefined;

        try {
            this.log('Starting Mediabunny compression');

            // AbortControllerを作成
            this.abortController = new AbortController();

            // 入力を作成
            input = new Input({
                source: new BlobSource(file),
                formats: ALL_FORMATS
            });

            // 出力を作成（MediaBunnyの推奨パターン）
            outputTarget = new BufferTarget();
            output = new Output({
                target: outputTarget,
                format: new Mp4OutputFormat({ fastStart: 'in-memory' }) // ストリーミング最適化
            });

            // 入力ファイルのトラック情報を確認
            const audioTracks = await input.getAudioTracks();
            const hadInputAudio = audioTracks.length > 0;

            this.log('Input audio tracks:', audioTracks.length);
            if (audioTracks.length > 0) {
                this.log('First audio track codec:', audioTracks[0].codec);
            }

            // オーディオ設定の検証
            const audioConfig = await this.validateMediabunnyAudioConfig(audioTracks, options, useQualityPreset);
            let { canEncodeOpus, audioConfigByTrack, desiredAudioSampleRate, desiredAudioBitrate } = audioConfig;

            // 変換オプションを構築
            const conversionOptions = this.buildConversionOptions(
                input,
                output,
                options,
                useQualityPreset,
                audioQualityPreset,
                videoQualityPreset,
                canEncodeOpus,
                audioConfigByTrack
            );

            // 変換を初期化
            const conversion = await Conversion.init(conversionOptions);

            // 変換の妥当性とトラック破棄の確認
            const validationResult = this.validateConversion(conversion, input, output, canEncodeOpus);
            if (validationResult) {
                this.abortController = null;
                return validationResult;
            }

            // 進捗コールバック設定
            conversion.onProgress = (progress: number) => {
                if (this.onProgress) {
                    this.onProgress(Math.round(progress * 100));
                }
            };

            // 変換実行（中止処理を含む）
            const executeResult = await this.executeConversion(conversion, file);
            if (executeResult) {
                cleanupMediabunny(input, null);
                this.abortController = null;
                return executeResult;
            }

            // 出力を取得
            const outputBuffer = outputTarget.buffer;
            if (!outputBuffer) {
                throw new Error('Output buffer is null');
            }

            let finalBlob: Blob = new Blob([outputBuffer], { type: 'video/mp4' });
            cleanupMediabunny(input, null);

            // オーディオをコピーする必要がある場合はFFmpegでマージ
            if (!canEncodeOpus && hadInputAudio) {
                this.log('Attempting to mux original audio track via FFmpeg copy');
                const mergedBlob = await this.mergeVideoAndAudioWithFFmpeg(finalBlob, file);

                const abortAfterMux = this.checkAbort(file);
                if (abortAfterMux) {
                    this.abortController = null;
                    return abortAfterMux;
                }

                if (!mergedBlob) {
                    devWarn(this.context, 'Audio mux failed; falling back to FFmpeg compression.');
                    this.abortController = null;
                    return await this.compressWithFFmpeg(file, options);
                }

                finalBlob = mergedBlob;
                this.log('Successfully muxed original audio track.');
            }

            // ファイルを生成
            const result = createCompressedFile(finalBlob, file, this.context);
            if (!result.wasCompressed) {
                this.abortController = null;
                return result;
            }

            // 音声検証: オーディオがエンコードされた場合のみ検証する
            if (canEncodeOpus && hadInputAudio && (desiredAudioBitrate || desiredAudioSampleRate)) {
                const verificationResult = await this.verifyMediabunnyAudio(
                    result.file,
                    desiredAudioSampleRate,
                    desiredAudioBitrate
                );

                if (!verificationResult.passed) {
                    this.abortController = null;
                    return await this.compressWithFFmpeg(file, options);
                }
            } else if (!canEncodeOpus && hadInputAudio) {
                this.log('Audio was copied as-is, skipping audio verification');
            }

            if (this.onProgress) {
                this.onProgress(100);
            }

            this.abortController = null;
            return result;

        } catch (error) {
            cleanupMediabunny(input, null);

            // 中止による終了の場合
            const abortResult = this.checkAbort(file);
            if (abortResult) {
                this.abortController = null;
                return abortResult;
            }

            console.error('[MediaBunnyCompression] Mediabunny compression failed:', error);
            this.abortController = null;
            return { file, wasCompressed: false, wasSkipped: true };
        }
    }

    /**
     * Mediabunny圧縮後の音声品質を検証
     */
    private async verifyMediabunnyAudio(
        outputFile: File,
        desiredSampleRate: number | null,
        desiredBitrate: number | null
    ): Promise<{ passed: boolean }> {
        const shouldVerifyBitrate = typeof desiredBitrate === 'number' && Number.isFinite(desiredBitrate);
        const shouldVerifySampleRate = typeof desiredSampleRate === 'number' && Number.isFinite(desiredSampleRate);

        if (!shouldVerifyBitrate && !shouldVerifySampleRate) {
            return { passed: true };
        }

        let verificationInput: Input | null = null;
        try {
            verificationInput = new Input({
                source: new BlobSource(outputFile),
                formats: ALL_FORMATS,
            });

            const outputAudioTracks = await verificationInput.getAudioTracks();

            if (outputAudioTracks.length === 0) {
                devWarn(this.context, 'Mediabunny output lost audio track; falling back to FFmpeg');
                return { passed: false };
            }

            const verificationTrack = outputAudioTracks[0];
            const stats = await verificationTrack.computePacketStats(120);
            const actualSampleRate = verificationTrack.sampleRate;
            const actualBitrate = stats.averageBitrate;

            this.log('Mediabunny audio verification:', {
                expectedBitrate: desiredBitrate,
                actualBitrate,
                expectedSampleRate: desiredSampleRate,
                actualSampleRate,
            });

            if (shouldVerifySampleRate && Math.abs(actualSampleRate - desiredSampleRate!) > 1) {
                devWarn(this.context, 'Audio sample rate mismatch detected, falling back to FFmpeg');
                return { passed: false };
            }

            if (shouldVerifyBitrate) {
                const allowedUpperBitrate = desiredBitrate! * 1.25;
                if (!Number.isFinite(actualBitrate) || actualBitrate > allowedUpperBitrate) {
                    devWarn(this.context, 'Audio bitrate exceeds expected range, falling back to FFmpeg', {
                        actualBitrate,
                        allowedUpperBitrate,
                    });
                    return { passed: false };
                }
            }

            return { passed: true };
        } catch (verificationError) {
            devWarn(this.context, 'Audio verification error, falling back to FFmpeg:', verificationError);
            return { passed: false };
        } finally {
            verificationInput?.dispose();
        }
    }
}