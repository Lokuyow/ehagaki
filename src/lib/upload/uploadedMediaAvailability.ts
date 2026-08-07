import { UPLOADED_MEDIA_AVAILABILITY_CONFIG } from "../constants";

const MEDIA_UNAVAILABLE_REASON_PATTERNS = [
    /file not found/i,
    /not found/i,
    /cannot get/i,
    /processing/i,
];

type AvailabilityProbeResult = "available" | "unavailable" | "inconclusive";

export class UploadedMediaAvailabilityError extends Error {
    constructor(readonly reason: Exclude<AvailabilityProbeResult, "available">) {
        super(
            reason === "unavailable"
                ? UPLOADED_MEDIA_AVAILABILITY_CONFIG.TIMEOUT_MESSAGE
                : "Uploaded media availability could not be verified",
        );
        this.name = "UploadedMediaAvailabilityError";
    }
}

function matchesExpectedMimeType(response: Response, mimeType?: string): boolean {
    if (!mimeType) {
        return response.ok;
    }

    const contentType = response.headers.get("content-type");
    if (!contentType) {
        return response.ok;
    }

    const expectedFamily = mimeType.split("/")[0];
    return contentType.startsWith(mimeType) || contentType.startsWith(`${expectedFamily}/`);
}

function hasUnavailableReasonHeader(response: Response): boolean {
    const reason = response.headers.get("X-Reason")?.trim();
    if (!reason) {
        return false;
    }

    return MEDIA_UNAVAILABLE_REASON_PATTERNS.some((pattern) => pattern.test(reason));
}

function responseMayContainAvailabilityErrorBody(response: Response): boolean {
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    return (
        contentType.startsWith("text/")
        || contentType.includes("json")
        || contentType.includes("xml")
        || contentType.includes("svg")
    );
}

async function hasUnavailableResponseBody(response: Response): Promise<boolean> {
    if (!responseMayContainAvailabilityErrorBody(response)) {
        return false;
    }

    const bodyText = await response.text().catch(() => "");
    return MEDIA_UNAVAILABLE_REASON_PATTERNS.some((pattern) => pattern.test(bodyText));
}

function probeImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.referrerPolicy = "no-referrer";
        image.src = url;
    });
}

async function probeUrlWithFetch(params: {
    url: string;
    mimeType?: string;
    fetch: typeof fetch;
}): Promise<AvailabilityProbeResult> {
    try {
        const response = await params.fetch(params.url, {
            method: "HEAD",
            cache: "no-store",
            credentials: "omit",
            referrerPolicy: "no-referrer",
        });

        if (response.ok && !hasUnavailableReasonHeader(response)) {
            return matchesExpectedMimeType(response, params.mimeType) ? "available" : "unavailable";
        }

        if (response.ok) {
            return "unavailable";
        }

        if (response.status !== 405 && response.status !== 501) {
            return "unavailable";
        }
    } catch {
        return "inconclusive";
    }

    try {
        const response = await params.fetch(params.url, {
            method: "GET",
            cache: "no-store",
            credentials: "omit",
            referrerPolicy: "no-referrer",
        });
        if (!response.ok || hasUnavailableReasonHeader(response)) {
            return "unavailable";
        }

        if (!matchesExpectedMimeType(response, params.mimeType)) {
            return "unavailable";
        }

        if (await hasUnavailableResponseBody(response.clone())) {
            return "unavailable";
        }

        return "available";
    } catch {
        return "inconclusive";
    }
}

async function isUploadedMediaAvailable(params: {
    url: string;
    mimeType?: string;
    fetch: typeof fetch;
}): Promise<AvailabilityProbeResult> {
    const fetchProbeResult = await probeUrlWithFetch(params);
    if (fetchProbeResult === "available") {
        return "available";
    }

    if (fetchProbeResult === "unavailable") {
        return "unavailable";
    }

    if (params.mimeType?.startsWith("image/") && typeof Image !== "undefined") {
        return await probeImageUrl(params.url) ? "available" : "inconclusive";
    }

    return "inconclusive";
}

export async function waitForUploadedMediaAvailability(params: {
    url: string;
    mimeType?: string;
    fetch: typeof fetch;
    maxWaitTime?: number;
    retryInterval?: number;
}): Promise<void> {
    const maxWaitTime = params.maxWaitTime ?? UPLOADED_MEDIA_AVAILABILITY_CONFIG.MAX_WAIT_TIME;
    const retryInterval = params.retryInterval ?? UPLOADED_MEDIA_AVAILABILITY_CONFIG.RETRY_INTERVAL;
    const deadline = Date.now() + maxWaitTime;
    let lastProbeResult: Exclude<AvailabilityProbeResult, "available"> = "inconclusive";

    while (true) {
        const probeResult = await isUploadedMediaAvailable(params);
        if (probeResult === "available") {
            return;
        }
        lastProbeResult = probeResult;

        if (Date.now() >= deadline) {
            throw new UploadedMediaAvailabilityError(lastProbeResult);
        }

        await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
}
