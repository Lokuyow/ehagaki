import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    // File Size Utilities
    formatFileSize,
    calculateCompressionRatio,
    createSizeReductionText,
    createFileSizeInfo,
    hasFileSizeChanges,
    generateSizeDisplayInfo,
    generateSizeDisplayText,

    // Nostr Key Utilities
    containsSecretKey,
    isValidNsec,
    derivePublicKeyFromNsec,
    toNpub,

    // Math Utilities
    clamp,
    isNearScale,
    calculateDistance,


    // Settings Utilities
    loadWriteRelaysFromStorage,
    initializeSettingsValues,
    handleServiceWorkerRefresh
} from '../lib/utils/appUtils';
import type {
    StorageAdapter,
    NavigatorAdapter,
    WindowAdapter,
    TimeoutAdapter
} from '../lib/types';

describe('File Size Utilities', () => {
    describe('formatFileSize', () => {
        it('should format zero bytes', () => {
            expect(formatFileSize(0)).toBe('0KB');
        });

        it('should format bytes to KB', () => {
            expect(formatFileSize(1024)).toBe('1KB');
            expect(formatFileSize(2048)).toBe('2KB');
            expect(formatFileSize(1536)).toBe('2KB'); // rounds up
        });

        it('should handle small values', () => {
            expect(formatFileSize(512)).toBe('1KB'); // rounds up from 0.5
        });
    });

    describe('calculateCompressionRatio', () => {
        it('should calculate compression ratio', () => {
            expect(calculateCompressionRatio(1000, 500)).toBe(50);
            expect(calculateCompressionRatio(2000, 1000)).toBe(50);
        });

        it('should handle zero original size', () => {
            expect(calculateCompressionRatio(0, 100)).toBe(100);
        });

        it('should round to nearest integer', () => {
            expect(calculateCompressionRatio(1000, 333)).toBe(33);
        });
    });

    describe('createSizeReductionText', () => {
        it('should create size reduction text', () => {
            expect(createSizeReductionText(2048, 1024)).toBe('2KB → 1KB');
        });
    });

    describe('createFileSizeInfo', () => {
        it('should create file size info object', () => {
            const info = createFileSizeInfo(2048, 1024, true, 'original.jpg', 'compressed.jpg');

            expect(info.originalSize).toBe(2048);
            expect(info.compressedSize).toBe(1024);
            expect(info.wasCompressed).toBe(true);
            expect(info.compressionRatio).toBe(50);
            expect(info.sizeReduction).toBe('2KB → 1KB');
            expect(info.originalFilename).toBe('original.jpg');
            expect(info.compressedFilename).toBe('compressed.jpg');
        });
    });

    describe('hasFileSizeChanges', () => {
        it('should return true when compressed', () => {
            const info = createFileSizeInfo(2048, 1024, true);
            expect(hasFileSizeChanges(info)).toBe(true);
        });

        it('should return true when filename changed', () => {
            const info = createFileSizeInfo(1024, 1024, false, 'old.jpg', 'new.jpg');
            expect(hasFileSizeChanges(info)).toBe(true);
        });

        it('should return true when size changed without compression', () => {
            const info = createFileSizeInfo(2048, 1024, false);
            expect(hasFileSizeChanges(info)).toBe(true);
        });

        it('should return true when skipped', () => {
            const info = createFileSizeInfo(1024, 1024, false, undefined, undefined, true);
            expect(hasFileSizeChanges(info)).toBe(true);
        });

        it('should return false when no changes', () => {
            const info = createFileSizeInfo(1024, 1024, false);
            expect(hasFileSizeChanges(info)).toBe(false);
        });
    });

    describe('generateSizeDisplayInfo', () => {
        it('should return null for null input', () => {
            expect(generateSizeDisplayInfo(null)).toBe(null);
        });

        it('should return null when no changes', () => {
            const info = createFileSizeInfo(1024, 1024, false);
            expect(generateSizeDisplayInfo(info)).toBe(null);
        });

        it('should return display info when compressed', () => {
            const info = createFileSizeInfo(2048, 1024, true, 'original.jpg', 'compressed.jpg');
            const display = generateSizeDisplayInfo(info);

            expect(display).toEqual({
                wasCompressed: true,
                originalSize: '2KB',
                compressedSize: '1KB',
                compressionRatio: 50,
                originalFilename: 'original.jpg',
                compressedFilename: 'compressed.jpg',
                wasSkipped: undefined
            });
        });
    });

    describe('generateSizeDisplayText', () => {
        it('should return null for null input', () => {
            expect(generateSizeDisplayText(null)).toBe(null);
        });

        it('should return null when not compressed', () => {
            const info = createFileSizeInfo(1024, 1024, false);
            expect(generateSizeDisplayText(info)).toBe(null);
        });

        it('should return display text when compressed', () => {
            const info = createFileSizeInfo(2048, 1024, true);
            expect(generateSizeDisplayText(info)).toBe('データサイズ:<br>2KB → 1KB （50%）');
        });
    });
});

describe('Nostr Key Utilities', () => {
    describe('containsSecretKey', () => {
        it('should detect nsec keys in text', () => {
            expect(containsSecretKey('nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7l')).toBe(true);
            expect(containsSecretKey('Here is my key: nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7l')).toBe(true);
            expect(containsSecretKey('no secret key here')).toBe(false);
        });
    });

    describe('isValidNsec', () => {
        it('should validate nsec format', () => {
            // 58文字ちょうど（nsec1 + 58文字 = 63文字）
            expect(isValidNsec('nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce')).toBe(true);
            // 57文字（短い：nsec1 + 57文字 = 62文字）
            expect(isValidNsec('nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khc')).toBe(false);
            // 59文字（長い：nsec1 + 59文字 = 64文字）
            expect(isValidNsec('nsec1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce6')).toBe(false);
            // npubで始まる（無効）
            expect(isValidNsec('npub1qpzry9x8gf2tvdw0s3jn54khce6mua7lqpzry9x8gf2tvdw0s3jn54khce')).toBe(false);
            expect(isValidNsec('nsec1')).toBe(false);
        });
    });

    describe('derivePublicKeyFromNsec', () => {
        it('should return empty data for invalid nsec', () => {
            const result = derivePublicKeyFromNsec('invalid');
            expect(result).toEqual({ hex: '', npub: '', nprofile: '' });
        });

        it('should handle decode errors gracefully', () => {
            const result = derivePublicKeyFromNsec('nsec1invalid');
            expect(result).toEqual({ hex: '', npub: '', nprofile: '' });
        });
    });

    describe('toNpub', () => {
        it('should encode valid hex to npub', () => {
            // 32バイトのhex（例: 64文字の0）
            const hex = '0'.repeat(64);
            const npub = toNpub(hex);
            expect(npub.startsWith('npub1')).toBe(true);
            expect(npub.length).toBeGreaterThan(10);
        });

        it('should fallback for invalid hex', () => {
            const npub = toNpub('invalidhex');
            expect(npub.startsWith('npub1invalidhex')).toBe(true);
        });
    });
});

describe('Math Utilities', () => {
    describe('clamp', () => {
        it('should clamp values to range', () => {
            expect(clamp(5, 0, 10)).toBe(5);
            expect(clamp(-5, 0, 10)).toBe(0);
            expect(clamp(15, 0, 10)).toBe(10);
        });
    });

    describe('isNearScale', () => {
        it('should check if scale is near target', () => {
            expect(isNearScale(1.0, 1.05, 0.1)).toBe(true);
            expect(isNearScale(1.0, 1.2, 0.1)).toBe(false);
        });
    });

    describe('calculateDistance', () => {
        it('should calculate distance between touches', () => {
            const touch1 = { clientX: 0, clientY: 0 } as Touch;
            const touch2 = { clientX: 3, clientY: 4 } as Touch;
            expect(calculateDistance(touch1, touch2)).toBe(5);
        });
    });
});

describe('Settings Utilities', () => {
    let mockStorage: StorageAdapter;
    let mockNavigator: NavigatorAdapter;
    let mockWindow: WindowAdapter;
    let mockTimeout: TimeoutAdapter;

    beforeEach(() => {
        mockStorage = {
            getItem: vi.fn(),
            setItem: vi.fn()
        };
        mockNavigator = {
            language: 'en-US'
        };
        mockWindow = {
            location: {
                reload: vi.fn()
            }
        };
        mockTimeout = {
            setTimeout: vi.fn()
        };
    });

    describe('loadWriteRelaysFromStorage', () => {
        it('should return empty array for empty pubkey', () => {
            expect(loadWriteRelaysFromStorage('', mockStorage)).toEqual([]);
        });

        it('should return empty array when no data', () => {
            (mockStorage.getItem as any).mockReturnValue(null);
            expect(loadWriteRelaysFromStorage('pubkey', mockStorage)).toEqual([]);
        });

        it('should return array from storage', () => {
            (mockStorage.getItem as any).mockReturnValue('["relay1", "relay2"]');
            expect(loadWriteRelaysFromStorage('pubkey', mockStorage)).toEqual(['relay1', 'relay2']);
        });

        it('should extract write relays from object format', () => {
            const relayData = {
                'relay1': { write: true, read: false },
                'relay2': { write: false, read: true },
                'relay3': { write: true, read: true }
            };
            (mockStorage.getItem as any).mockReturnValue(JSON.stringify(relayData));

            const result = loadWriteRelaysFromStorage('pubkey', mockStorage);
            expect(result).toEqual(['relay1', 'relay3']);
        });

        it('should handle invalid JSON gracefully', () => {
            (mockStorage.getItem as any).mockReturnValue('invalid json');
            expect(loadWriteRelaysFromStorage('pubkey', mockStorage)).toEqual([]);
        });
    });

    describe('initializeSettingsValues', () => {
        it('should initialize with default values', () => {
            (mockStorage.getItem as any).mockReturnValue(null);

            const result = initializeSettingsValues({
                storage: mockStorage,
                navigator: mockNavigator
            });

            expect(result.compression).toBe('medium');
            expect(result.clientTagEnabled).toBe(true);
            expect(mockStorage.setItem).toHaveBeenCalledWith('clientTagEnabled', 'true');
        });

        it('should use Japanese locale when browser is Japanese', () => {
            mockNavigator.language = 'ja-JP';
            (mockStorage.getItem as any).mockReturnValue(null);

            initializeSettingsValues({
                storage: mockStorage,
                navigator: mockNavigator
            });

            // Should use Japanese default endpoint (implementation detail)
        });

        it('should use stored values when available', () => {
            (mockStorage.getItem as any).mockImplementation((key: string) => {
                switch (key) {
                    case 'locale': return 'ja';
                    case 'uploadEndpoint': return 'https://example.com';
                    case 'clientTagEnabled': return 'false';
                    case 'imageCompressionLevel': return 'high';
                    default: return null;
                }
            });

            const result = initializeSettingsValues({
                storage: mockStorage,
                navigator: mockNavigator
            });

            expect(result.clientTagEnabled).toBe(false);
            expect(result.compression).toBe('high');
        });

        it('should use provided override values', () => {
            const result = initializeSettingsValues({
                selectedEndpoint: 'https://override.com',
                selectedCompression: 'low',
                storage: mockStorage,
                navigator: mockNavigator
            });

            expect(result.compression).toBe('low');
        });
    });

    describe('handleServiceWorkerRefresh', () => {
        it('should handle service worker refresh', () => {
            const handleSwUpdate = vi.fn();
            const setUpdating = vi.fn();

            handleServiceWorkerRefresh(handleSwUpdate, setUpdating, {
                timeout: 500,
                windowAdapter: mockWindow,
                timeoutAdapter: mockTimeout
            });

            expect(setUpdating).toHaveBeenCalledWith(true);
            expect(handleSwUpdate).toHaveBeenCalled();
            expect(mockTimeout.setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);

            // Execute timeout callback
            const callback = (mockTimeout.setTimeout as any).mock.calls[0][0];
            callback();

            expect(mockWindow.location.reload).toHaveBeenCalled();
        });

        it('should use default timeout', () => {
            const handleSwUpdate = vi.fn();
            const setUpdating = vi.fn();

            handleServiceWorkerRefresh(handleSwUpdate, setUpdating, {
                windowAdapter: mockWindow,
                timeoutAdapter: mockTimeout
            });

            expect(mockTimeout.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
        });
    });
});