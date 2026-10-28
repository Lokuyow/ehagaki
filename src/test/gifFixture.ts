/** Deterministic GIFs with literal LZW pixels; no image encoder dependency is needed. */
export function createGifFixture({
    animated = true,
    large = true,
    version = '89a',
}: { animated?: boolean; large?: boolean; version?: '87a' | '89a' } = {}): Uint8Array<ArrayBuffer> {
    const width = large ? 256 : 16;
    const height = large ? 192 : 16;
    const bytes = [...new TextEncoder().encode(`GIF${version}`),
        width & 255, width >> 8, height & 255, height >> 8, 0x80, 0, 0,
        255, 64, 0, 0, 64, 255];
    if (animated) bytes.push(0x21, 0xff, 11, ...new TextEncoder().encode('NETSCAPE2.0'), 3, 1, 0, 0, 0);
    for (let frame = 0; frame < (animated ? 2 : 1); frame++) {
        if (version === '89a') bytes.push(0x21, 0xf9, 4, 0, 40, 0, 0, 0);
        bytes.push(0x2c, 0, 0, 0, 0, width & 255, width >> 8, height & 255, height >> 8, 0, 2);
        // A clear code before every pixel keeps the LZW code width fixed at 3 bits.
        const data: number[] = [];
        let bits = 0;
        let bitCount = 0;
        const writeCode = (code: number) => {
            bits |= code << bitCount;
            bitCount += 3;
            while (bitCount >= 8) { data.push(bits & 255); bits >>= 8; bitCount -= 8; }
        };
        for (let pixel = 0; pixel < width * height; pixel++) { writeCode(4); writeCode(frame); }
        writeCode(5);
        if (bitCount) data.push(bits & 255);
        for (let offset = 0; offset < data.length; offset += 255) {
            const block = data.slice(offset, offset + 255);
            bytes.push(block.length, ...block);
        }
        bytes.push(0);
    }
    bytes.push(0x3b);
    return Uint8Array.from(bytes);
}
