import { awaitUploadOperation, throwIfUploadAborted } from '../upload/uploadOperation';

export const AVIF_MIME_TYPE = 'image/avif';

export function isUntypedAvifFile(file: File): boolean {
    return (!file.type || file.type === 'application/octet-stream') && /\.avif$/i.test(file.name);
}

function isAvifBrand(view: DataView, offset: number): boolean {
    const brand = view.getUint32(offset);
    return brand === 0x61766966 || brand === 0x61766973; // avif, avis
}

/** Check the file type box without reading image payloads. */
export async function hasAvifBrand(file: Blob, signal?: AbortSignal): Promise<boolean> {
    throwIfUploadAborted(signal);
    const header = new DataView(await awaitUploadOperation(file.slice(0, 24).arrayBuffer(), signal));
    if (header.byteLength < 16 || header.getUint32(4) !== 0x66747970) return false; // ftyp

    const size = header.getUint32(0);
    const extended = size === 1;
    if (extended && header.byteLength < 24) return false;
    const brandOffset = extended ? 16 : 8;
    const boxLength = extended ? Number(header.getBigUint64(8)) : size;
    const compatibleOffset = brandOffset + 8; // major_brand and minor_version
    if (!Number.isSafeInteger(boxLength) || boxLength < compatibleOffset || boxLength > file.size || boxLength % 4 !== 0) return false;
    if (isAvifBrand(header, brandOffset)) return true;

    const sniffLength = Math.min(boxLength, 4096);
    if (sniffLength > compatibleOffset) {
        throwIfUploadAborted(signal);
        const chunk = new DataView(await awaitUploadOperation(
            file.slice(compatibleOffset, sniffLength).arrayBuffer(), signal,
        ));
        for (let index = 0; index < chunk.byteLength; index += 4) {
            if (isAvifBrand(chunk, index)) return true;
        }
    }
    return false;
}

export async function normalizeAvifFile(file: File, signal?: AbortSignal): Promise<File> {
    if (!isUntypedAvifFile(file) || !(await hasAvifBrand(file, signal))) return file;
    return new File([file], file.name, { type: AVIF_MIME_TYPE, lastModified: file.lastModified });
}
