import type { UploadDestination } from "../types/upload";
import type { UploadMediaOperationParams } from "./mediaManagementTypes";
import { awaitUploadOperation, throwIfUploadAborted } from "./uploadOperation";

export interface UploadRegistrationTarget {
    domain: string;
    origin: string;
    registrationUrl: string;
    termsUrl: string;
}
export interface UploadRegistrationPolicy { minLength: number; maxLength: number }
export type UploadRegistrationErrorCode = "invalidUsername" | "usernameTaken" | "authentication"
    | "rateLimited" | "serverError" | "unknownRegistration";
export class UploadRegistrationError extends Error {
    constructor(readonly code: UploadRegistrationErrorCode) { super(code); }
}
export interface UploadRegistrationView {
    target: UploadRegistrationTarget;
    phase: "offer" | "loading" | "ready" | "submitting" | "external" | "unknown";
    policy: UploadRegistrationPolicy | null;
    error: UploadRegistrationErrorCode | null;
}

const targets = [
    { domain: "yabu.me", origin: "https://share.yabu.me",
        mediaUrls: ["https://share.yabu.me/api/v2/media", "https://yabu.me/api/v2/media"],
        discoveryUrls: ["https://share.yabu.me", "https://yabu.me"] },
    { domain: "nostrcheck.me", origin: "https://nostrcheck.me",
        mediaUrls: ["https://nostrcheck.me/api/v2/media", "https://cdn.nostrcheck.me"],
        discoveryUrls: ["https://nostrcheck.me", "https://cdn.nostrcheck.me"] },
] as const;

function normalizedUrl(raw: string): string | null {
    try {
        const url = new URL(raw);
        if (url.username || url.password || url.search || url.hash) return null;
        return url.toString().replace(/\/$/, "");
    } catch { return null; }
}
/** Registration is a service-specific contract, never inferred from a preset label or a discovery response. */
export function getUploadRegistrationTarget(destination: UploadDestination): UploadRegistrationTarget | null {
    if (destination.protocol !== "nip96") return null;
    const target = targets.find(candidate => (candidate.mediaUrls as readonly (string | null)[])
        .includes(normalizedUrl(destination.serverUrl))
        && (!destination.resolvedUploadUrl || (candidate.mediaUrls as readonly (string | null)[])
            .includes(normalizedUrl(destination.resolvedUploadUrl)))
        && (!destination.nip96ServerUrl || (candidate.discoveryUrls as readonly (string | null)[])
            .includes(normalizedUrl(destination.nip96ServerUrl))));
    return target ? { domain: target.domain, origin: target.origin,
        registrationUrl: `${target.origin}/register`, termsUrl: `${target.origin}/api/v2/tos` } : null;
}

function record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function targetFor(params: UploadMediaOperationParams): UploadRegistrationTarget {
    params.assertSession();
    throwIfUploadAborted(params.signal);
    const target = getUploadRegistrationTarget(params.destination);
    if (!target) throw new UploadRegistrationError("serverError");
    return target;
}

// Bound both the HTTP request and body read. No retries: POST may already have created an account.
async function request(params: UploadMediaOperationParams, url: string, init: RequestInit) {
    const abort = new AbortController();
    const cancel = () => abort.abort();
    params.signal?.addEventListener("abort", cancel, { once: true });
    if (params.signal?.aborted) abort.abort();
    const timeout = setTimeout(cancel, 20_000);
    try {
        params.assertSession();
        const response = await awaitUploadOperation(params.fetch(url, { ...init,
            signal: abort.signal, credentials: "omit", redirect: "error", cache: "no-store", referrerPolicy: "no-referrer",
        }), abort.signal);
        const data: unknown = await awaitUploadOperation(response.json(), abort.signal);
        params.assertSession();
        return { response, data };
    } finally {
        clearTimeout(timeout);
        params.signal?.removeEventListener("abort", cancel);
    }
}

export async function loadUploadRegistrationPolicy(params: UploadMediaOperationParams): Promise<UploadRegistrationPolicy | null> {
    const target = targetFor(params);
    const { response, data } = await request(params, `${target.origin}/api/v2/domains`, { method: "GET" });
    if (!response.ok || !record(data) || !record(data.availableDomains)) return null;
    const domain = data.availableDomains[target.domain];
    if (!record(domain) || domain.requireinvite !== false || domain.requirepayment !== false || domain.maxsatoshi !== 0) return null;
    const min = domain.minUsernameLength, max = domain.maxUsernameLength;
    if (typeof min !== "number" || typeof max !== "number" || !Number.isSafeInteger(min)
        || !Number.isSafeInteger(max) || min < 1 || max < min) return null;
    return { minLength: min, maxLength: max };
}

export function isUploadRegistrationUsernameValid(username: string, policy: UploadRegistrationPolicy): boolean {
    return /^[a-zA-Z0-9_-]+$/.test(username) && username.length >= policy.minLength && username.length <= policy.maxLength;
}

export async function registerUploadServer(params: UploadMediaOperationParams, username: string,
    policy: UploadRegistrationPolicy, onDispatched: () => void): Promise<"registered" | "alreadyRegistered" | "external"> {
    const target = targetFor(params);
    if (!isUploadRegistrationUsernameValid(username, policy)) throw new UploadRegistrationError("invalidUsername");
    const url = `${target.origin}/api/v2/register`;
    const payload = { pubkey: params.expectedPubkey, username, domain: target.domain };
    let authorization: string;
    try {
        authorization = await awaitUploadOperation(params.authService.buildAuthHeader(url, "POST", payload), params.signal);
        params.assertSession();
        if (!authorization) throw new Error();
    } catch {
        throwIfUploadAborted(params.signal);
        throw new UploadRegistrationError("authentication");
    }
    let result: Awaited<ReturnType<typeof request>>;
    try {
        params.assertSession();
        onDispatched();
        result = await request(params, url, { method: "POST", headers: {
            "Content-Type": "application/json", Authorization: authorization,
        }, body: JSON.stringify(payload) });
    } catch {
        throwIfUploadAborted(params.signal);
        throw new UploadRegistrationError("unknownRegistration");
    }
    const { response, data } = result;
    if ([400, 401, 422].includes(response.status) && record(data) && data.status === "error"
        && data.message === "Invalid username format") throw new UploadRegistrationError("invalidUsername");
    if (record(data) && data.status === "error" && response.status === 406) {
        if (data.message === "Username already registered") throw new UploadRegistrationError("usernameTaken");
        if (data.message === "Pubkey already registered") return "alreadyRegistered";
    }
    if (response.status === 429) throw new UploadRegistrationError("rateLimited");
    if (response.status === 401 || response.status === 403) return "external";
    if (!response.ok || !record(data) || data.status !== "success") throw new UploadRegistrationError("unknownRegistration");
    if (data.otc === true || (typeof data.payment_request === "string" && data.payment_request !== "")
        || (typeof data.satoshi === "number" && data.satoshi > 0)) return "external";
    if (data.otc !== false || data.payment_request !== "" || data.satoshi !== 0) {
        throw new UploadRegistrationError("unknownRegistration");
    }
    return "registered";
}
