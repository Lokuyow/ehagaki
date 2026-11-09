/** Plain object check for untrusted input (arrays and null are rejected). */
export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
