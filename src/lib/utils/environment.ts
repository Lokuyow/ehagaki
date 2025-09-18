export const isTestEnvironment = (): boolean => {
    return typeof globalThis !== 'undefined' &&
        (globalThis as any).__VITEST__ ||
        typeof globalThis !== 'undefined' &&
        (globalThis as any).process?.env?.NODE_ENV === 'test' ||
        typeof global !== 'undefined' &&
        (global as any).process?.env?.NODE_ENV === 'test' ||
        typeof window === 'undefined';
};

export const isDevEnvironment = (): boolean => {
    return typeof import.meta !== 'undefined' && 
        (import.meta as any).env && 
        (import.meta as any).env.DEV;
};
