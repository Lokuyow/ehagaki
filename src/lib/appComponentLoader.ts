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

export type ComponentLoader<T, Key extends string> = (() =>
    Promise<ComponentLoadResult<T, Key>>) & {
    preload: () => Promise<ComponentLoadResult<T, Key>>;
};

export function createComponentLoader<T, Key extends string>(
    componentKey: Key,
    importer: ComponentImporter<T>,
    options: {
        eager?: boolean;
        isStale?: () => boolean;
    } = {},
): ComponentLoader<T, Key> {
    let loadedComponent: T | null = null;
    let modulePromise: Promise<ComponentLoadResult<T, Key>> | null = null;

    const failedResult = (
        failureKind: ComponentLoadFailureKind,
        error: unknown,
    ): ComponentLoadResult<T, Key> => ({
        status: "failed",
        componentKey,
        failureKind,
        error,
    });

    const startImport = (
        mode: "load" | "preload" = "load",
    ): Promise<ComponentLoadResult<T, Key>> => {
        if (mode === "preload" && options.isStale?.()) {
            return Promise.resolve(
                failedResult(
                    "stale",
                    new Error(`Cannot preload stale ${componentKey} component`),
                ),
            );
        }

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

                if (options.isStale?.()) {
                    return failedResult(
                        "stale",
                        new Error(`Loaded stale ${componentKey} component`),
                    );
                }

                loadedComponent = module.default;
                return { status: "loaded", component: module.default };
            })
            .catch((error): ComponentLoadResult<T, Key> =>
                failedResult(options.isStale?.() ? "stale" : "transient", error)
            )
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

    const loadComponent = (() => {
        if (loadedComponent !== null) {
            return Promise.resolve({
                status: "loaded",
                component: loadedComponent,
            });
        }
        return modulePromise ?? startImport();
    }) as ComponentLoader<T, Key>;

    loadComponent.preload = () => {
        if (loadedComponent !== null) {
            return Promise.resolve({
                status: "loaded",
                component: loadedComponent,
            });
        }
        return modulePromise ?? startImport("preload");
    };
    return loadComponent;
}
