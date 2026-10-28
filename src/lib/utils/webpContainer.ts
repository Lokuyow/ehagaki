import { awaitUploadOperation, throwIfUploadAborted } from '../upload/uploadOperation';

export type WebpKind = 'static' | 'animated' | 'invalid';

/** Inspect container headers without reading compressed frame payloads into memory. */
export async function inspectWebp(file: Blob, signal?: AbortSignal): Promise<WebpKind> {
    const read = async (start: number, length: number) => {
        throwIfUploadAborted(signal);
        return new Uint8Array(await awaitUploadOperation(file.slice(start, start + length).arrayBuffer(), signal));
    };
    const ascii = (bytes: Uint8Array) => String.fromCharCode(...bytes);
    if (file.size < 20) return 'invalid';
    const header = await read(0, 12);
    if (ascii(header.subarray(0, 4)) !== 'RIFF' || ascii(header.subarray(8)) !== 'WEBP'
        || new DataView(header.buffer).getUint32(4, true) + 8 !== file.size) return 'invalid';
    let position = 12;
    let animated = false;
    let control = false;
    let frames = 0;
    let image = false;
    while (position + 8 <= file.size) {
        const chunk = await read(position, 8);
        const type = ascii(chunk.subarray(0, 4));
        const size = new DataView(chunk.buffer).getUint32(4, true);
        const end = position + 8 + size + size % 2;
        if (end > file.size) return 'invalid';
        if (type === 'VP8X') {
            if (position !== 12 || size !== 10) return 'invalid';
            animated = ((await read(position + 8, 1))[0] & 2) !== 0;
        } else if (type === 'ANIM') {
            if (!animated || control || frames || size !== 6) return 'invalid';
            control = true;
        } else if (type === 'ANMF') {
            if (!animated || !control || size < 24) return 'invalid';
            frames++;
        } else if (type === 'VP8 ' || type === 'VP8L') {
            if (animated || !size) return 'invalid';
            image = true;
        }
        position = end;
    }
    if (position !== file.size) return 'invalid';
    return animated ? control && frames > 0 ? 'animated' : 'invalid' : image ? 'static' : 'invalid';
}
