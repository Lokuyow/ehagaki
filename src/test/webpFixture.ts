/** Two lossless frames (red/blue), 400ms each, encoded with libwebp via Pillow. */
export function createWebpFixture(): Uint8Array<ArrayBuffer> {
    const raw = Uint8Array.from(atob('UklGRoQAAABXRUJQVlA4WAoAAAACAAAA/wAAvwAAQU5JTQYAAAAAAAAAAABBTk1GKAAAAAAAAAAAAP8AAL8AAJABAAJWUDhMDwAAAC//wC8ABxD9j/4HIqL/AQBBTk1GKAAAAAAAAAAAAP8AAL8AAJABAABWUDhMDwAAAC//wC8ABxDR//4HIqL/AQA='), c => c.charCodeAt(0));
    // Valid unknown chunk puts this above the ordinary 20KiB compression threshold.
    const bytes = new Uint8Array(raw.length + 8 + 24000);
    bytes.set(raw); bytes.set(new TextEncoder().encode('JUNK'), raw.length);
    const view = new DataView(bytes.buffer);
    view.setUint32(raw.length + 4, 24000, true); view.setUint32(4, bytes.length - 8, true);
    return bytes;
}

export function createStaticWebpFixture(): Uint8Array<ArrayBuffer> {
    const animated = createWebpFixture();
    const source = new DataView(animated.buffer);
    let offset = 12;
    while (String.fromCharCode(...animated.subarray(offset, offset + 4)) !== 'ANMF') offset += 8 + source.getUint32(offset + 4, true) + source.getUint32(offset + 4, true) % 2;
    const frame = animated.slice(offset + 24, offset + 8 + source.getUint32(offset + 4, true));
    const bytes = new Uint8Array(12 + frame.length + 8 + 24000);
    bytes.set(new TextEncoder().encode('RIFF'), 0); bytes.set(new TextEncoder().encode('WEBP'), 8); bytes.set(frame, 12);
    bytes.set(new TextEncoder().encode('JUNK'), 12 + frame.length);
    const view = new DataView(bytes.buffer); view.setUint32(4, bytes.length - 8, true); view.setUint32(16 + frame.length, 24000, true);
    return bytes;
}
