const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;

export function isHex64(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}
