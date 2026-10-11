import { getAppRuntimeEnvironment } from "./appRuntimeEnvironment";

// Temporary, memory-only diagnostics for debug/citrine-direct-write-trace.
// No reactive writes, timers or console I/O occur on the transport hot path.
export type LocalRelayDiagnosticSource = "post-direct" | "sensitive-direct" | "repost-direct" | "deletion-direct" | "history-archive";
export type LocalRelayDiagnosticTerminal = "accepted" | "rejected" | "timeout" | "aborted" | "exception" | "skipped-session" | "skipped-inactive" | "filtered";
const reasons = ["no-configured-session", "runtime-not-standalone", "owner-mismatch", "session-aborted", "app-inactive",
    "session-stale", "caller-inactive", "unsupported-kind", "attestation-invalid", "in-flight-duplicate", "no-candidates",
    "attestation-changed", "hook-unwired", "session-reconfigure", "app-session-cleanup", "account-transition", "url-change",
    "runtime-change", "identity-change", "service-cancel", "transport-local-abort", "abort-unknown", "timeout-abort",
    "revision-changed", "not-adopted", "deleted", "archive-duplicate", "no-adopted-events", "send-completed-without-ok",
    "auth-required", "restricted", "rate-limited", "pow", "invalid", "blocked", "duplicate", "error", "relay-notice-redacted",
    "exception-redacted"] as const;
export type LocalRelayDiagnosticReason = typeof reasons[number];
const stages = ["hook-invoked", "hook-forwarded", "service-entered", "session-check", "batch-entered", "batch-check", "candidate-accepted",
    "candidate-filtered", "batch-microtask", "microtask-check", "attestation-recheck", "transport-call", "transport-entered",
    "relay-target", "client-creation-started", "client-created", "websocket-state", "websocket-error", "event-send-attempt",
    "event-submitted-rx-nostr", "event-socket-send-boundary", "relay-response", "transport-disposed", "archive-entered",
    "archive-scope", "archive-filtered", "db-verification-passed", "archive-adopted", "archive-candidates", "terminal"] as const;
type Stage = typeof stages[number];
interface Details {
    count?: number; kind?: number; eventId?: string; target?: string;
    ownerMatches?: boolean; callerActive?: boolean; serviceCurrent?: boolean; sessionFound?: boolean;
    appActive?: boolean; aborted?: boolean; hookWired?: boolean; ok?: boolean; noticePresent?: boolean;
    reason?: LocalRelayDiagnosticReason; errorType?: string; state?: string;
}
interface Entry { timestamp: number; elapsedMs: number; stage: Stage; details: Details }
export interface LocalRelayDiagnosticOperation {
    id: number; source: LocalRelayDiagnosticSource; startedAt: number;
    terminal: LocalRelayDiagnosticTerminal | null; entries: Entry[]; truncated: boolean;
}
export interface LocalRelayDiagnosticTrace {
    record(stage: Stage, details?: Details): void;
    finish(terminal: LocalRelayDiagnosticTerminal, details?: Details): void;
}
const operations: LocalRelayDiagnosticOperation[] = [];
const abortReasons = new WeakMap<AbortSignal, LocalRelayDiagnosticReason>();
let sequence = 0;
let revision = 0;
let cachedSearch: string | undefined;
let queryEnabled = false;

export function isLocalRelayDebugEnabled(): boolean {
    const runtime = getAppRuntimeEnvironment();
    if (runtime.runtimeKind !== "standalone") return false;
    const search = runtime.window?.location.search ?? "";
    if (search !== cachedSearch) {
        cachedSearch = search;
        queryEnabled = new URLSearchParams(search).get("localRelayDebug") === "1";
    }
    return queryEnabled;
}

export function diagnosticErrorType(error: unknown): string {
    // Exception messages can contain event bodies or secrets. Never retain them.
    const name = error instanceof Error ? error.name : "unknown";
    return ["Error", "TypeError", "SecurityError", "DOMException", "TimeoutError", "RxNostrWebSocketError", "RxNostrInvalidUsageError"].includes(name)
        ? name : "unknown";
}

export function diagnosticRelayReason(notice: unknown): LocalRelayDiagnosticReason | undefined {
    if (typeof notice !== "string" || !notice) return undefined;
    // Keep only known NIP-20 prefixes. A relay may echo private content in its tail.
    const prefix = notice.split(":", 1)[0];
    return ["auth-required", "restricted", "rate-limited", "pow", "invalid", "blocked", "duplicate", "error"].includes(prefix)
        ? prefix as LocalRelayDiagnosticReason : "relay-notice-redacted";
}

function safeDetails(input: Details): Details {
    const output: Details = {};
    for (const key of ["count", "kind"] as const) if (typeof input[key] === "number" && Number.isFinite(input[key])) output[key] = input[key];
    for (const key of ["ownerMatches", "callerActive", "serviceCurrent", "sessionFound", "appActive", "aborted", "hookWired", "ok", "noticePresent"] as const)
        if (typeof input[key] === "boolean") output[key] = input[key];
    if (input.eventId && /^[0-9a-f]{64}$/i.test(input.eventId)) output.eventId = input.eventId.slice(0, 12);
    if (input.reason && reasons.includes(input.reason)) output.reason = input.reason;
    if (input.errorType && ["Error", "TypeError", "SecurityError", "DOMException", "TimeoutError", "RxNostrWebSocketError", "RxNostrInvalidUsageError", "unknown"].includes(input.errorType)) output.errorType = input.errorType;
    if (input.state && ["initialized", "connecting", "connected", "waiting-for-retrying", "retrying", "dormant", "error", "rejected", "terminated"].includes(input.state)) output.state = input.state;
    if (input.target) {
        try {
            const url = new URL(input.target);
            if (["ws:", "wss:"].includes(url.protocol)) output.target = `${url.protocol}//${url.host}/`;
        } catch { /* Never retain raw URLs, credentials, paths or query tokens. */ }
    }
    return output;
}

export function beginLocalRelayDiagnostic(source: LocalRelayDiagnosticSource): LocalRelayDiagnosticTrace | undefined {
    if (!isLocalRelayDebugEnabled()) return undefined;
    const operation: LocalRelayDiagnosticOperation = { id: ++sequence, source, startedAt: Date.now(), terminal: null, entries: [], truncated: false };
    const start = performance.now();
    operations.unshift(operation);
    if (operations.length > 30) operations.pop();
    revision++;
    const record = (stage: Stage, details: Details = {}) => {
        if (!stages.includes(stage)) return;
        if (operation.entries.length >= 512 && stage !== "terminal") { operation.truncated = true; return; }
        operation.entries.push({ timestamp: Date.now(), elapsedMs: Math.round(performance.now() - start), stage, details: safeDetails(details) });
        revision++;
    };
    return { record, finish(terminal, details) {
        if (operation.terminal !== null) return;
        operation.terminal = terminal;
        record("terminal", details);
    } };
}

export function noteLocalRelayDiagnosticAbort(signal: AbortSignal, reason: LocalRelayDiagnosticReason): void {
    if (isLocalRelayDebugEnabled()) abortReasons.set(signal, reason);
}
export function getLocalRelayDiagnosticAbortReason(signal: AbortSignal): LocalRelayDiagnosticReason {
    return abortReasons.get(signal) ?? "abort-unknown";
}
export function clearLocalRelayDiagnostics(): void { operations.length = 0; revision++; }
export function getLocalRelayDiagnosticRevision(): number { return revision; }
export function getLocalRelayDiagnostics(): LocalRelayDiagnosticOperation[] {
    return operations.map(operation => ({ ...operation, entries: operation.entries.map(entry => ({ ...entry, details: { ...entry.details } })) }));
}
export function formatLocalRelayDiagnostics(): string {
    return ["Citrine direct-write diagnostic build; base aff49e24; timestamps UTC; memory only", ...getLocalRelayDiagnostics().map(operation =>
        `[${operation.source} #${operation.id}] ${new Date(operation.startedAt).toISOString()} ${operation.terminal ?? "observing"}${operation.truncated ? " (truncated)" : ""}\n`
        + operation.entries.map(entry => `+${entry.elapsedMs}ms ${entry.stage} ${JSON.stringify(entry.details)}`).join("\n"))].join("\n\n");
}
