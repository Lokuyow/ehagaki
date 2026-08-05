import { expect } from 'vitest';

type ConsoleSpy = {
    mock: {
        calls: unknown[][];
    };
};

function collectValueStrings(
    value: unknown,
    seen: WeakSet<object>,
    result: string[],
): void {
    if (typeof value === 'string') {
        result.push(value);
        return;
    }

    if (
        value === null
        || typeof value === 'number'
        || typeof value === 'boolean'
        || typeof value === 'bigint'
    ) {
        result.push(String(value));
        return;
    }

    if (typeof value !== 'object' || seen.has(value)) {
        return;
    }
    seen.add(value);

    for (const key of Reflect.ownKeys(value)) {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (descriptor && 'value' in descriptor) {
            collectValueStrings(descriptor.value, seen, result);
        }
    }
}

export function expectConsoleCallsNotToContain(
    spies: readonly ConsoleSpy[],
    forbiddenValues: readonly string[],
): void {
    const values: string[] = [];
    const seen = new WeakSet<object>();
    for (const spy of spies) {
        for (const call of spy.mock.calls) {
            for (const argument of call) {
                collectValueStrings(argument, seen, values);
            }
        }
    }

    for (const forbiddenValue of forbiddenValues) {
        expect(values.some((value) => value.includes(forbiddenValue))).toBe(false);
    }
}
