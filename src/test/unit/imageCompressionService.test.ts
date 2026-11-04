import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateImageResizeDimensions as resize, ImageCompressionService } from '../../lib/imageCompressionService';
import { MockStorage } from '../helpers';
import { mockImageCompressionCanvas } from '../imageCompressionCanvasMock';
import { encode } from '@jsquash/webp';
vi.mock('@jsquash/webp', () => ({ encode: vi.fn() }));
vi.mock('../../lib/debug', () => ({ showCompressedImagePreview: vi.fn() }));

describe('short-edge resizing', () => {
    it.each([
        [4000, 3000, 1024, 1365, 1024], [2000, 7038, 1024, 1024, 3603],
        [7038, 2000, 1024, 3603, 1024], [2000, 40000, 2048, 409, 8192],
        [320, 1126, 800, 320, 1126], [45, 1784, 2048, 45, 1784],
        [4000, 4000, 2048, 2048, 2048], [2000, 7038, 2048, 1507, 5305],
        [1000, 3000, 800, 800, 2400], [1000, 2999, 800, 800, 2399],
    ])('%ix%i at %i', (w,h,s,x,y) => expect(resize(w,h,s)).toEqual({ width:x, height:y }));
    it('bounds every quality and orientation without upscaling', () => {
        for (const w of [1, 320, 1024, 2048, 8000, 40000]) for (const h of [1, 768, 8192, 40000]) for (const s of [800,1024,2048]) {
            const r=resize(w,h,s); const swapped=resize(h,w,s);
            expect(r).toEqual({ width:swapped.height,height:swapped.width });
            expect(r.width).toBeLessThanOrEqual(w); expect(r.height).toBeLessThanOrEqual(h);
            expect(r.width*r.height).toBeLessThanOrEqual(8_000_000);
            expect(Math.max(r.width,r.height)).toBeLessThanOrEqual(8192);
            expect(Math.min(r.width,r.height)).toBeLessThanOrEqual(s);
        }
    });
    it.each([0, -1, NaN, Infinity])('rejects invalid dimensions %s', value => expect(() => resize(value,100,800)).toThrow());
});

describe('ImageCompressionService', () => {
    let mock: ReturnType<typeof mockImageCompressionCanvas>;
    let storage: MockStorage;
    let service: ImageCompressionService;
    const mime = { canEncodeMimeType: vi.fn(() => true), canEncodeWebpWithQuality: vi.fn(async () => true) };
    const input = (type='image/jpeg', size=100000) => new File([new Uint8Array(size)],'photo.jpg',{type});
    beforeEach(() => {
        mock=mockImageCompressionCanvas(); storage=new MockStorage();
        mime.canEncodeMimeType.mockReturnValue(true);
        vi.mocked(encode).mockReset().mockResolvedValue(new Uint8Array(900).buffer);
        service=new ImageCompressionService(mime,storage,()=>false);
    });
    afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
    it.each([['low',800,2815,.5],['medium',1024,3603,.8],['high',1507,5305,.95]] as const)('encodes %s once at fixed quality on the target canvas', async (level,w,h,q) => {
        storage.setItem('imageQualityLevel',level);
        let drawn: number[]=[];
        const promise=service.compress(input());
        await vi.waitFor(() => expect(mock.canvases).toHaveLength(1));
        const c=mock.canvases[0]; drawn=c.context.drawImage.mock.calls[0].slice(1);
        expect(drawn).toEqual([0,0,w,h]);
        expect((await promise).wasCompressed).toBe(true);
        expect(c.toBlob).toHaveBeenCalledExactlyOnceWith(expect.any(Function),'image/webp',q);
        expect(c.width).toBe(0);expect(c.height).toBe(0);
        expect(URL.revokeObjectURL).toHaveBeenCalled();expect(mock.images[0].onload).toBeNull();
    });
    it.each([100000,110000])('returns original without quality retries at %i bytes', async size => {
        mock.state.outputSize=size;const file=input();expect((await service.compress(file)).file).toBe(file);
        expect(mock.canvases[0].toBlob).toHaveBeenCalledTimes(1);expect(encode).not.toHaveBeenCalled();
    });
    it('uses the same pixels for WASM when native MIME is wrong', async () => {
        mock.state.nativeMime='image/png';const result=await service.compress(input());
        expect(result.file.type).toBe('image/webp');expect(result.file.name).toBe('photo.webp');
        expect(encode).toHaveBeenCalledWith(expect.anything(),{quality:80});expect(mock.images).toHaveLength(1);
    });
    it.each(['image/png','image/jpeg'])('falls back to %s if both WebP encoders fail', async type => {
        mime.canEncodeMimeType.mockReturnValue(false);vi.mocked(encode).mockRejectedValue(new Error('WASM failed'));
        const result=await service.compress(input(type));expect(result.file.type).toBe(type);
        if(type==='image/jpeg') { expect(mock.canvases[0].context.fillStyle).toBe('#fff');expect(mock.canvases[0].context.globalCompositeOperation).toBe('destination-over'); }
    });
    it.each(['none','low','medium','high'])('preserves GIF at %s', async level => {
        storage.setItem('imageQualityLevel',level);const file=input('image/gif');expect((await service.compress(file)).file).toBe(file);expect(mock.images).toHaveLength(0);
    });
    it('skips small images, non-images and original quality', async () => {
        for(const file of [input('image/png',20480),input('text/plain')])expect((await service.compress(file)).file).toBe(file);
        storage.setItem('imageQualityLevel','none');expect(service.hasCompressionSettings()).toBe(false);
        expect((await service.compress(input())).wasSkipped).toBe(true);expect(mock.images).toHaveLength(0);
    });
    it('returns original and releases resources on decode failure', async () => {
        mock.state.failDecode=true;const file=input();expect(await service.compress(file)).toMatchObject({file,wasSkipped:true});expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
    it('aborts a pending decode and cleans listeners', async () => {
        mock.state.pendingDecode=true;const controller=new AbortController();const promise=service.compress(input(),{signal:controller.signal});controller.abort();
        expect((await promise).aborted).toBe(true);expect(mock.images[0].onload).toBeNull();expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
    it('keeps stage progress within 0..100', async () => {
        const progress:number[]=[];service.setProgressCallback(p=>progress.push(p));await service.compress(input());expect(progress).toEqual([5,40,100]);
    });
    it('returns original if all encoders fail', async () => {
        mock.state.failNative=true;vi.mocked(encode).mockRejectedValue(new Error('failed'));const file=input();expect(await service.compress(file)).toMatchObject({file,wasSkipped:true});
    });
});
