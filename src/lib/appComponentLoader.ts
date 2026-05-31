export type ComponentImporter<T> = () => Promise<{ default: T }>;

export function createComponentLoader<T>(
    importer: ComponentImporter<T>,
    options: { eager?: boolean } = {},
): () => Promise<T> {
    let modulePromise: Promise<T> | null = options.eager
        ? importer().then((module) => module.default)
        : null;

    return async () => {
        modulePromise ??= importer().then((module) => module.default);
        return modulePromise;
    };
}
