export type VideoCompressionLevel = 'none' | 'low' | 'medium' | 'high';

export type VideoCompressionQualityPreset = 'high' | 'medium' | 'low';

export interface EnabledVideoCompressionOptions {
    maxSize: number;
    qualityPreset: VideoCompressionQualityPreset;
    audioSampleRate?: number;
    audioChannels?: number;
}

export interface DisabledVideoCompressionOptions {
    skip: true;
}

export type VideoCompressionOptions =
    | EnabledVideoCompressionOptions
    | DisabledVideoCompressionOptions;

export function isEnabledVideoCompressionOptions(
    options: VideoCompressionOptions,
): options is EnabledVideoCompressionOptions {
    return !('skip' in options);
}

export const MIN_VIDEO_COMPRESSION_FILE_SIZE_BYTES = 200 * 1024;

export const VIDEO_COMPRESSION_OPTIONS_MAP = {
    none: { skip: true },
    high: {
        maxSize: 1280,
        qualityPreset: 'high',
    },
    medium: {
        maxSize: 640,
        audioSampleRate: 44100,
        qualityPreset: 'medium',
    },
    low: {
        maxSize: 320,
        audioSampleRate: 44100,
        audioChannels: 1,
        qualityPreset: 'low',
    },
} as const satisfies Record<VideoCompressionLevel, VideoCompressionOptions>;
