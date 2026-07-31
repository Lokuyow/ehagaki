export function areStringArraysEqual(
    left: ReadonlyArray<string> | null | undefined,
    right: ReadonlyArray<string> | null | undefined,
): boolean {
    const leftValues = left ?? [];
    const rightValues = right ?? [];

    if (leftValues.length !== rightValues.length) {
        return false;
    }

    return leftValues.every((value, index) => value === rightValues[index]);
}
