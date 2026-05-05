export function sanitizeHtmlAllowingWbr(text: string): string {
    return text
        .split("<wbr>")
        .map((part) =>
            part
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;"),
        )
        .join("<wbr>");
}
