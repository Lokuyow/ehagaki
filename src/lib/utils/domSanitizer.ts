import DOMPurify from "dompurify";

export function sanitizePlainText(value: string): string {
    return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}
