import type { AuthResult } from "./types";
import type { PendingNip46AuthSession } from "./authService";
import { PendingNip46OperationTracker } from "./nip46PendingOperationUtils";

export interface Nip46AuthFlowStatePort {
  setPendingAuthSession(session: PendingNip46AuthSession | null): void;
  setHasPendingAuthSession(hasPendingSession: boolean): void;
  setConnectionUri(connectionUri: string | null): void;
  setHandshakeStarted(isHandshakeStarted: boolean): void;
  setLoading(isLoading: boolean): void;
  setErrorMessage(message: string): void;
}

export interface Nip46AuthFlowDependencies {
  startNip46NostrConnect(relayCandidates: string[]): Promise<PendingNip46AuthSession>;
  finalizeNip46Authentication(pubkeyHex: string): Promise<AuthResult>;
  onAuthenticated(pubkeyHex: string): Promise<void>;
  saveLastUsedRelayCandidates(relayCandidates: string[]): void;
  console: Pick<Console, "error">;
  state: Nip46AuthFlowStatePort;
}

export interface Nip46AuthFlowController {
  resetPendingState(options?: { preserveError?: boolean }): void;
  cancelPendingAuth(
    session?: PendingNip46AuthSession | null,
    options?: { preserveError?: boolean },
  ): Promise<void>;
  isCurrentOperation(requestGeneration: number): boolean;
  handleNostrConnectStart(relayCandidates: string[]): Promise<string | undefined>;
}

export function createNip46AuthFlowController(
  deps: Nip46AuthFlowDependencies,
): Nip46AuthFlowController {
  const tracker = new PendingNip46OperationTracker();

  function syncState(): void {
    deps.state.setPendingAuthSession(tracker.currentSession);
    deps.state.setHasPendingAuthSession(tracker.hasPendingSession);
  }

  function resetPendingState(
    options: { preserveError?: boolean } = {},
  ): void {
    tracker.clearPendingSession();
    syncState();
    deps.state.setConnectionUri(null);
    deps.state.setHandshakeStarted(false);
    if (!options.preserveError) {
      deps.state.setErrorMessage("");
    }
  }

  async function cancelPendingAuth(
    session: PendingNip46AuthSession | null = tracker.currentSession,
    options: { preserveError?: boolean } = {},
  ): Promise<void> {
    const pendingSession = tracker.cancelPending(session);
    syncState();
    deps.state.setLoading(false);

    if (!pendingSession) {
      resetPendingState(options);
      return;
    }

    resetPendingState(options);
    await pendingSession.cancel();
  }

  function isCurrentOperation(requestGeneration: number): boolean {
    return tracker.isCurrentOperation(requestGeneration);
  }

  async function waitForPendingNip46Ready(
    session: PendingNip46AuthSession,
    requestGeneration: number,
  ): Promise<void> {
    try {
      await session.ready;
    } catch {
      return;
    }

    if (!isCurrentOperation(requestGeneration)) {
      return;
    }

    deps.state.setConnectionUri(session.connectionUri);
    deps.state.setLoading(false);
  }

  async function waitForPendingNip46HandshakeStarted(
    session: PendingNip46AuthSession,
    requestGeneration: number,
  ): Promise<void> {
    try {
      await session.handshakeStarted;
    } catch {
      return;
    }

    if (!isCurrentOperation(requestGeneration)) {
      return;
    }

    deps.state.setHandshakeStarted(true);
  }

  async function waitForPendingNip46Auth(
    session: PendingNip46AuthSession,
    requestGeneration: number,
  ): Promise<void> {
    const result = await session.completion;
    if (!isCurrentOperation(requestGeneration)) {
      return;
    }

    deps.state.setLoading(false);

    if (!result.success) {
      resetPendingState({ preserveError: true });
      deps.state.setErrorMessage(result.error ?? "nip46_connection_failed");
      return;
    }

    if (!result.pubkeyHex) {
      resetPendingState({ preserveError: true });
      deps.state.setErrorMessage("nip46_connection_failed");
      return;
    }

    const authResult = await deps.finalizeNip46Authentication(result.pubkeyHex);
    if (!isCurrentOperation(requestGeneration)) {
      return;
    }

    resetPendingState();
    if (authResult.success && authResult.pubkeyHex) {
      await deps.onAuthenticated(authResult.pubkeyHex);
    }
  }

  async function handleNostrConnectStart(
    relayCandidates: string[],
  ): Promise<string | undefined> {
    const { requestGeneration, previousSession } = tracker.beginOperation();
    syncState();

    deps.state.setLoading(true);
    deps.state.setErrorMessage("");
    deps.state.setConnectionUri(null);
    deps.state.setHandshakeStarted(false);

    if (previousSession) {
      await previousSession.cancel();
    }

    try {
      const pending = await deps.startNip46NostrConnect(relayCandidates);

      if (!isCurrentOperation(requestGeneration)) {
        await pending.cancel();
        return undefined;
      }

      tracker.attachPendingSession(pending);
      syncState();
      deps.saveLastUsedRelayCandidates(relayCandidates);
      void waitForPendingNip46HandshakeStarted(pending, requestGeneration);
      void waitForPendingNip46Ready(pending, requestGeneration);
      void waitForPendingNip46Auth(pending, requestGeneration);
      return undefined;
    } catch (error) {
      if (!isCurrentOperation(requestGeneration)) {
        return undefined;
      }

      deps.console.error("NIP-46 nostrconnectログインでエラー:", error);
      resetPendingState({ preserveError: true });
      const message = error instanceof Error ? error.message : "NIP-46 login failed";
      deps.state.setErrorMessage(message);
      return message;
    } finally {
      if (isCurrentOperation(requestGeneration) && tracker.currentSession === null) {
        deps.state.setLoading(false);
      }
    }
  }

  return {
    resetPendingState,
    cancelPendingAuth,
    isCurrentOperation,
    handleNostrConnectStart,
  };
}