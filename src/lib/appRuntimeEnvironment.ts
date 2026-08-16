import {
    configureAppStorage,
    getAppStorage,
} from "./appStorage";

export type AppLayoutMode = "viewport" | "container";

export interface AppRuntimeEnvironment {
    storage: Storage;
    window: Window | undefined;
    document: Document | undefined;
    domRoot: Document | ShadowRoot | undefined;
    styleTarget: HTMLElement;
    layoutTarget: HTMLElement;
    overlayTarget: HTMLElement;
    themeTarget: HTMLElement;
    layoutMode: AppLayoutMode;
    assetBase: URL | undefined;
    serviceWorkerEnabled: boolean;
    externalInputEnabled: boolean;
    historyEnabled: boolean;
    localNsecAuthEnabled: boolean;
}

function createFallbackElement(): HTMLElement {
    return {
        style: {
            setProperty: () => undefined,
            removeProperty: () => "",
            getPropertyValue: () => "",
        } as unknown as CSSStyleDeclaration,
    } as HTMLElement;
}

function createDefaultEnvironment(): AppRuntimeEnvironment {
    const windowObj = typeof window !== "undefined" ? window : undefined;
    const documentObj = windowObj?.document;
    const documentElement = documentObj?.documentElement ?? createFallbackElement();
    const body = documentObj?.body ?? documentElement;

    return {
        storage: getAppStorage(),
        window: windowObj,
        document: documentObj,
        domRoot: documentObj,
        styleTarget: documentElement,
        layoutTarget: body,
        overlayTarget: body,
        themeTarget: documentElement,
        layoutMode: "viewport",
        assetBase: windowObj?.location?.href
            ? new URL(".", windowObj.location.href)
            : undefined,
        // The implicit browser runtime retains the historic PWA behavior.
        // The Web Component entry explicitly opts out before importing App.
        serviceWorkerEnabled: true,
        externalInputEnabled: true,
        historyEnabled: true,
        localNsecAuthEnabled: true,
    };
}

let runtimeEnvironment = createDefaultEnvironment();

export type AppRuntimeEnvironmentOverrides = Partial<AppRuntimeEnvironment>;

export function configureAppRuntimeEnvironment(
    overrides: AppRuntimeEnvironmentOverrides,
): AppRuntimeEnvironment {
    runtimeEnvironment = {
        ...runtimeEnvironment,
        ...overrides,
    };
    configureAppStorage(runtimeEnvironment.storage);
    return runtimeEnvironment;
}

export function getAppRuntimeEnvironment(): AppRuntimeEnvironment {
    return runtimeEnvironment;
}
