const HEX_64_PATTERN = /^[0-9a-f]{64}$/i;
const LOWER_HEX_64_PATTERN = /^[0-9a-f]{64}$/;

/** 64 hex characters in either case (lenient input such as user-entered pubkeys). */
export function isHex64(value: unknown): value is string {
    return typeof value === "string" && HEX_64_PATTERN.test(value);
}

/** 64 lowercase hex characters, the canonical NIP-01 id/pubkey encoding. */
export function isLowerHex64(value: unknown): value is string {
    return typeof value === "string" && LOWER_HEX_64_PATTERN.test(value);
}
