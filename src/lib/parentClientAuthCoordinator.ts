import type { AuthResult } from "./types";

export interface ParentClientAuthRequestOptions {
    silent?: boolean;
    timeoutMs?: number;
}

export interface ParentClientAuthCoordinatorDependencies {
    authenticateWithParentClient(
        options?: ParentClientAuthRequestOptions,
    ): Promise<AuthResult>;
    syncParentClientAccount(pubkeyHex: string): void;
    setLoading(isLoading: boolean): void;
    onRequestSettled(): void;
}

export interface ParentClientAuthCoordinator {
    requestParentClientAuth(
        options?: ParentClientAuthRequestOptions,
    ): Promise<AuthResult>;
    synchronizeParentClientAuth(
        options?: ParentClientAuthRequestOptions,
    ): Promise<AuthResult>;
    hasPendingRequest(): boolean;
}

export function createParentClientAuthCoordinator(
    deps: ParentClientAuthCoordinatorDependencies,
): ParentClientAuthCoordinator {
    let parentClientAuthPromise: Promise<AuthResult> | null = null;

    async function requestParentClientAuth(
        options: ParentClientAuthRequestOptions = {},
    ): Promise<AuthResult> {
        if (parentClientAuthPromise) {
            return parentClientAuthPromise;
        }

        deps.setLoading(true);
        parentClientAuthPromise = deps.authenticateWithParentClient(options).finally(
            () => {
                deps.setLoading(false);
                parentClientAuthPromise = null;
                deps.onRequestSettled();
            },
        );

        return parentClientAuthPromise;
    }

    async function synchronizeParentClientAuth(
        options: ParentClientAuthRequestOptions = {},
    ): Promise<AuthResult> {
        const result = await requestParentClientAuth(options);
        if (result.success && result.pubkeyHex) {
            deps.syncParentClientAccount(result.pubkeyHex);
        }

        return result;
    }

    function hasPendingRequest(): boolean {
        return parentClientAuthPromise !== null;
    }

    return {
        requestParentClientAuth,
        synchronizeParentClientAuth,
        hasPendingRequest,
    };
}