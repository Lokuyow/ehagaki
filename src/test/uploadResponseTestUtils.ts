export type JsonResponseInit = Omit<ResponseInit, "body" | "headers"> & {
    headers?: HeadersInit;
};

export function createJsonResponse(body: unknown, init: JsonResponseInit = {}): Response {
    const headers = new Headers(init.headers);

    if (!headers.has("content-type")) {
        headers.set("content-type", "application/json");
    }

    return new Response(JSON.stringify(body), {
        ...init,
        headers,
    });
}
