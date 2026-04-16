import DOMPurify from 'dompurify';
import { normalizeUrl, validateAndNormalizeUrl } from './utils/editorUrlUtils';

const ALLOWED_DRAFT_TAGS = ['a', 'img', 'p', 'video'];
const ALLOWED_DRAFT_ATTR = [
    'alt',
    'blurhash',
    'class',
    'controls',
    'dim',
    'href',
    'id',
    'isplaceholder',
    'src',
    'target',
];

function unwrapElement(element: Element): void {
    const parent = element.parentNode;
    if (!parent) {
        element.remove();
        return;
    }

    while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
    }

    element.remove();
}

function validateAndNormalizeDraftMediaUrl(url: string): string | null {
    const normalizedAbsoluteUrl = validateAndNormalizeUrl(url);
    if (normalizedAbsoluteUrl) {
        return normalizedAbsoluteUrl;
    }

    const normalizedRelativeUrl = normalizeUrl(url);
    if (!normalizedRelativeUrl || normalizedRelativeUrl.startsWith('//')) {
        return null;
    }
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalizedRelativeUrl)) {
        return null;
    }

    return normalizedRelativeUrl;
}

function buildSanitizedDraftContainer(
    htmlContent: string,
    documentObj: Document,
): HTMLDivElement {
    const sanitizedMarkup = DOMPurify.sanitize(htmlContent, {
        ALLOWED_TAGS: ALLOWED_DRAFT_TAGS,
        ALLOWED_ATTR: ALLOWED_DRAFT_ATTR,
    });
    const container = documentObj.createElement('div');
    container.innerHTML = sanitizedMarkup;

    container.querySelectorAll('a').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        const normalizedHref = href ? validateAndNormalizeUrl(href) : null;

        if (!normalizedHref) {
            unwrapElement(anchor);
            return;
        }

        anchor.setAttribute('href', normalizedHref);
        anchor.setAttribute('target', '_blank');
    });

    container.querySelectorAll('img').forEach((image) => {
        const src = image.getAttribute('src');
        const normalizedSrc = src ? validateAndNormalizeDraftMediaUrl(src) : null;

        if (!normalizedSrc) {
            image.remove();
            return;
        }

        image.setAttribute('src', normalizedSrc);
    });

    container.querySelectorAll('video').forEach((video) => {
        const src = video.getAttribute('src');
        const normalizedSrc = src ? validateAndNormalizeDraftMediaUrl(src) : null;

        if (!normalizedSrc) {
            video.remove();
            return;
        }

        video.setAttribute('src', normalizedSrc);
        video.setAttribute('controls', 'true');
    });

    return container;
}

export function createSanitizedDraftContainer(
    htmlContent: string,
    documentObj: Document = document,
): HTMLDivElement {
    return buildSanitizedDraftContainer(htmlContent, documentObj);
}

export function sanitizeDraftHtml(
    htmlContent: string,
    documentObj: Document = document,
): string {
    if (!htmlContent) {
        return htmlContent;
    }

    return buildSanitizedDraftContainer(htmlContent, documentObj).innerHTML;
}