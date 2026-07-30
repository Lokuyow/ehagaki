export type ComponentImporter<T> = () => Promise<{ default: T }>;

export type ComponentLoadFailureKind = "stale" | "transient";

export type ComponentLoadResult<T, Key extends string> =
    | { status: "loaded"; component: T }
    | {
          status: "failed";
          componentKey: Key;
          failureKind: ComponentLoadFailureKind;
          error: unknown;
      };

export function createComponentLoader<T, Key extends string>(
    componentKey: Key,
    importer: ComponentImporter<T>,
    options: {
        eager?: boolean;
        isStale?: () => boolean;
    } = {},
): () => Promise<ComponentLoadResult<T, Key>> {
    let loadedComponent: T | null = null;
    let modulePromise: Promise<ComponentLoadResult<T, Key>> | null = null;

    const startImport = (): Promise<ComponentLoadResult<T, Key>> => {
        let importedModule: Promise<{ default: T }>;
        try {
            importedModule = importer();
        } catch (error) {
            importedModule = Promise.reject(error);
        }

        const currentPromise = importedModule
            .then((module): ComponentLoadResult<T, Key> => {
                if (module.default === undefined) {
                    throw new Error(
                        `Dynamic import for ${componentKey} returned no default component`,
                    );
                }
                loadedComponent = module.default;
                return { status: "loaded", component: module.default };
            })
            .catch((error): ComponentLoadResult<T, Key> => ({
                status: "failed",
                componentKey,
                failureKind: options.isStale?.() ? "stale" : "transient",
                error,
            }))
            .then((result) => {
                if (result.status === "failed" && modulePromise === currentPromise) {
                    modulePromise = null;
                }
                return result;
            });

        modulePromise = currentPromise;
        return currentPromise;
    };

    if (options.eager) {
        startImport();
    }

    return () => {
        if (loadedComponent !== null) {
            return Promise.resolve({
                status: "loaded",
                component: loadedComponent,
            });
        }
        return modulePromise ?? startImport();
    };
}
