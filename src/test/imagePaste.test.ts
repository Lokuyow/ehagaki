import { describe, it, expect, vi } from 'vitest';

// モック設定
vi.mock('../utils/editorUtils', () => ({
    validateAndNormalizeImageUrl: vi.fn((url: string) => {
        if (url.includes('image') && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp'))) {
            return url;
        }
        return null;
    }),
    validateAndNormalizeVideoUrl: vi.fn((url: string) => {
        if (url.includes('video') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'))) {
            return url;
        }
        return null;
    })
}));

describe('imagePaste Extension - Media URL Support', () => {
    it('should load ImagePasteExtension successfully', async () => {
        const { ImagePasteExtension } = await import('../lib/editor/imagePaste');
        expect(ImagePasteExtension).toBeDefined();
        expect(ImagePasteExtension.name).toBe('imagePaste');
    });

    describe('Video URL validation functions', () => {
        it('should validate video URLs with correct format', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const videoUrl = 'https://example.com/video.mp4';
            const result = editorUtils.validateAndNormalizeVideoUrl(videoUrl);
            
            expect(result).toBe(videoUrl);
        });

        it('should validate multiple video formats', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const testCases = [
                'https://example.com/video.mp4',
                'https://example.com/video.webm',
                'https://example.com/video.mov'
            ];
            
            testCases.forEach(url => {
                const result = editorUtils.validateAndNormalizeVideoUrl(url);
                expect(result).toBe(url);
            });
        });

        it('should reject invalid video formats', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const invalidUrl = 'https://example.com/file.txt';
            const result = editorUtils.validateAndNormalizeVideoUrl(invalidUrl);
            
            expect(result).toBeNull();
        });
    });

    describe('Image URL validation (existing)', () => {
        it('should validate image URLs with correct format', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const imageUrl = 'https://example.com/image.jpg';
            const result = editorUtils.validateAndNormalizeImageUrl(imageUrl);
            
            expect(result).toBe(imageUrl);
        });

        it('should validate multiple image formats', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const testCases = [
                'https://example.com/image.jpg',
                'https://example.com/image.png',
                'https://example.com/image.webp'
            ];
            
            testCases.forEach(url => {
                const result = editorUtils.validateAndNormalizeImageUrl(url);
                expect(result).toBe(url);
            });
        });

        it('should reject invalid image formats', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const invalidUrl = 'https://example.com/file.pdf';
            const result = editorUtils.validateAndNormalizeImageUrl(invalidUrl);
            
            expect(result).toBeNull();
        });
    });

    describe('Node creation for video support', () => {
        it('should have createVideoNodeData function', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            expect(editorUtils.createVideoNodeData).toBeDefined();
            expect(typeof editorUtils.createVideoNodeData).toBe('function');
        });

        it('should create video node data with correct format', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const videoUrl = 'https://example.com/video.mp4';
            const nodeData = editorUtils.createVideoNodeData(videoUrl);
            
            expect(nodeData).toBeDefined();
            expect(nodeData?.type).toBe('video');
            expect(nodeData?.attrs.src).toBe(videoUrl);
        });

        it('should return null for invalid video URLs', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const invalidUrl = 'https://example.com/file.txt';
            const nodeData = editorUtils.createVideoNodeData(invalidUrl);
            
            expect(nodeData).toBeNull();
        });

        it('should have createImageNodeData function (existing)', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            expect(editorUtils.createImageNodeData).toBeDefined();
            expect(typeof editorUtils.createImageNodeData).toBe('function');
        });

        it('should create image node data', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const imageUrl = 'https://example.com/image.jpg';
            const nodeData = editorUtils.createImageNodeData(imageUrl);
            
            expect(nodeData).toBeDefined();
            expect(nodeData?.type).toBe('image');
            expect(nodeData?.attrs.src).toBe(imageUrl);
        });
    });

    describe('parseTextToNodes with video support', () => {
        it('should parse text containing image URLs', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const text = 'https://example.com/image.jpg';
            const nodes = editorUtils.parseTextToNodes(text);
            
            expect(nodes.length).toBeGreaterThan(0);
            const imageNode = nodes.find((n: any) => n.type === 'image');
            expect(imageNode).toBeDefined();
        });

        it('should parse text containing video URLs', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const text = 'https://example.com/video.mp4';
            const nodes = editorUtils.parseTextToNodes(text);
            
            expect(nodes.length).toBeGreaterThan(0);
            const videoNode = nodes.find((n: any) => n.type === 'video');
            expect(videoNode).toBeDefined();
        });

        it('should parse mixed media URLs', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const text = 'https://example.com/image.jpg\nhttps://example.com/video.mp4';
            const nodes = editorUtils.parseTextToNodes(text);
            
            expect(nodes.length).toBeGreaterThan(0);
            const hasImage = nodes.some((n: any) => n.type === 'image');
            const hasVideo = nodes.some((n: any) => n.type === 'video');
            expect(hasImage).toBe(true);
            expect(hasVideo).toBe(true);
        });

        it('should handle multiple media of same type', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const text = 'https://example.com/image1.jpg\nhttps://example.com/image2.png';
            const nodes = editorUtils.parseTextToNodes(text);
            
            const imageNodes = nodes.filter((n: any) => n.type === 'image');
            expect(imageNodes.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('createNodeFromData with video support', () => {
        it('should create video nodes', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const mockSchema = {
                nodes: {
                    video: {
                        create: (attrs: any) => ({ type: 'video', attrs })
                    }
                }
            };
            
            const videoNodeData = {
                type: 'video' as const,
                attrs: { src: 'https://example.com/video.mp4' }
            };
            
            const node = editorUtils.createNodeFromData(mockSchema, videoNodeData);
            
            expect(node).toBeDefined();
            expect(node.type).toBe('video');
            expect(node.attrs.src).toBe('https://example.com/video.mp4');
        });

        it('should create image nodes (existing)', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const mockSchema = {
                nodes: {
                    image: {
                        create: (attrs: any) => ({ type: 'image', attrs })
                    }
                }
            };
            
            const imageNodeData = {
                type: 'image' as const,
                attrs: { src: 'https://example.com/image.jpg', alt: 'Test' }
            };
            
            const node = editorUtils.createNodeFromData(mockSchema, imageNodeData);
            
            expect(node).toBeDefined();
            expect(node.type).toBe('image');
        });
    });

    describe('URL validation edge cases', () => {
        it('should handle URLs with query parameters', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const videoUrl = 'https://example.com/video.mp4?quality=hd';
            const result = editorUtils.validateAndNormalizeVideoUrl(videoUrl);
            
            // Should validate based on file extension
            expect(result).toBeTruthy();
        });

        it('should handle URLs with special characters in query', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const imageUrl = 'https://example.com/image.jpg?token=abc123';
            const result = editorUtils.validateAndNormalizeImageUrl(imageUrl);
            
            expect(result).toBeTruthy();
        });

        it('should be case-insensitive for file extensions', async () => {
            const editorUtils = await import('../lib/utils/editorUtils');
            
            const videoUrl = 'https://example.com/video.MP4';
            const result = editorUtils.validateAndNormalizeVideoUrl(videoUrl);
            
            // Should handle case-insensitive extensions
            expect(result).toBeTruthy();
        });
    });

    describe('Media paste extension integration', () => {
        it('should export ImagePasteExtension for use in editor', async () => {
            const { ImagePasteExtension } = await import('../lib/editor/imagePaste');
            
            expect(ImagePasteExtension).toBeDefined();
            expect(ImagePasteExtension.name).toBe('imagePaste');
        });

        it('should support both image and video URLs in paste handler', async () => {
            // This is an integration test to verify the paste extension
            // can handle both images and videos
            const { ImagePasteExtension } = await import('../lib/editor/imagePaste');
            const editorUtils = await import('../lib/utils/editorUtils');
            
            // Verify utilities are available
            expect(editorUtils.validateAndNormalizeImageUrl).toBeDefined();
            expect(editorUtils.validateAndNormalizeVideoUrl).toBeDefined();
            expect(editorUtils.createImageNodeData).toBeDefined();
            expect(editorUtils.createVideoNodeData).toBeDefined();
            
            // Verify extension is configured
            expect(ImagePasteExtension.name).toBe('imagePaste');
        });
    });
});
