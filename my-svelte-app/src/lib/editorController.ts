import DOMPurify from "dompurify";
import { updateHashtagData } from "./stores";

// ハッシュタグ共通正規表現（他ファイルでimport用にexport）
// #に続く全ての文字を認識し、改行・半角スペース・全角スペースで終了
export const HASHTAG_REGEX = /(?:^|[\s\n\u3000])#([^\s\n\u3000#]+)/g;

export interface CursorPosition {
    container: Node;
    offset: number;
}

export class EditorController {
    private editorElement: HTMLDivElement | null = null;
    private formatTimeout: ReturnType<typeof setTimeout> | null = null;
    private isComposing: boolean = false;

    // ハッシュタグを検出する正規表現（末尾を明確に区切る）
    private readonly HASHTAG_REGEX = HASHTAG_REGEX;
    // URLを検出する正規表現
    // private readonly URL_REGEX = /(?<![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])(https?:\/\/[^\s<>"{}|\\^`[\]]+)(?![\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF])/gi;
    private readonly URL_REGEX = /https?:\/\/[\w!?/+\-_~;.,*&@#$%()'[\]]+/gi;

    constructor(editorElement?: HTMLDivElement) {
        if (editorElement) {
            this.setEditorElement(editorElement);
        }
    }

    setEditorElement(element: HTMLDivElement) {
        this.editorElement = element;

        // IME入力監視イベント追加
        element.addEventListener("compositionstart", () => {
            this.isComposing = true;
            element.addEventListener("beforeinput", this.preventBeforeInput, true);
        });
        element.addEventListener("compositionend", () => {
            this.isComposing = false;
            element.removeEventListener("beforeinput", this.preventBeforeInput, true);
        });

        // ペースト時に強制的にプレーンテキストとして挿入
        element.addEventListener("paste", (event: ClipboardEvent) => {
            event.preventDefault();
            const text = event.clipboardData?.getData("text/plain");
            if (text) {
                document.execCommand("insertText", false, text);
            }
        });
    }

    // IME未確定文字の重複挿入防止用
    private preventBeforeInput = (event: InputEvent) => {
        if (this.isComposing && event.inputType === "insertCompositionText") {
            event.stopImmediatePropagation();
        }
    }

    /**
     * エディタからプレーンテキストを抽出
     */
    getPlainText(): string {
        if (!this.editorElement) return "";

        let text = "";
        const walker = document.createTreeWalker(
            this.editorElement,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null,
        );

        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeName === "IMG") {
                const img = node as HTMLImageElement;
                text += (text && !text.endsWith("\n") ? "\n" : "") + img.src + "\n";
            } else if (node.nodeName === "BR" || (node.nodeName === "DIV" && node.previousSibling)) {
                text += "\n";
            }
        }

        return text.trim();
    }

    /**
     * プレーンテキストをエディタに設定
     */
    setContent(text: string) {
        if (!this.editorElement) return;

        const lines = text.split("\n");
        this.editorElement.innerHTML = "";

        lines.forEach((line, index) => {
            if (line.trim()) {
                const imageUrlMatch = line.match(
                    /^https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg)$/i,
                );
                if (imageUrlMatch) {
                    this.insertImageElement(line);
                } else {
                    this.insertFormattedText(line);
                }
            }

            if (index < lines.length - 1) {
                this.editorElement!.appendChild(document.createElement("br"));
            }
        });
    }

    /**
     * 画像URLをエディタに挿入
     */
    insertImages(urls: string) {
        if (!this.editorElement) return;

        const urlList = urls.split("\n").filter(Boolean);
        urlList.forEach((url) => {
            this.insertImageElement(url);
            // 画像間に改行を入れない
        });

        this.focusEditor();
    }

    /**
     * エディタの内容をクリア
     */
    clear() {
        if (this.editorElement) {
            this.editorElement.innerHTML = "";
        }
    }

    /**
     * エディタにフォーカス
     */
    focusEditor() {
        if (this.editorElement) {
            this.editorElement.focus();
        }
    }

    /**
     * テキスト入力時のリアルタイムフォーマット（デバウンス付き）
     */
    formatContentDebounced(callback?: () => void, delay = 300) {
        if (this.formatTimeout) {
            clearTimeout(this.formatTimeout);
        }

        this.formatTimeout = setTimeout(() => {
            // IME入力中はスキップ
            if (this.isComposing) return;

            this.formatContent();

            // ハッシュタグデータをストアに更新
            const plainText = this.getPlainText();
            updateHashtagData(plainText);

            callback?.();
        }, delay);
    }

    /**
     * エディタ内容のフォーマット処理
     */
    private formatContent() {
        // IME入力中はスキップ
        if (this.isComposing) return;
        if (!this.editorElement) return;

        const cursorPos = this.saveCursorPosition();
        const textNodes = this.getTextNodes();

        textNodes.forEach((textNode) => {
            const text = textNode.textContent || "";
            if (text && (text.includes("#") || text.includes("http"))) {
                const formattedHTML = this.formatTextWithHashtagsAndLinks(text);
                if (formattedHTML !== text) {
                    this.replaceTextNodeWithFormatted(textNode, formattedHTML);
                }
            }
        });

        // 既存のリンクの直後に続くURL許容文字を取り込んでリンクを伸長
        this.extendPreviewLinks();

        // 既存の.hashtag内に後続の文字（空白/改行/不許可文字）が入ったらスパン外へ出す
        this.normalizeHashtagSpans();

        this.restoreCursorPosition(cursorPos);
    }

    /**
     * カーソル位置を保存
     */
    private saveCursorPosition(): CursorPosition | null {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (range.startContainer.nodeType === Node.TEXT_NODE) {
                return {
                    container: range.startContainer,
                    offset: range.startOffset,
                };
            }
        }
        return null;
    }

    /**
     * カーソル位置を復元
     */
    private restoreCursorPosition(cursorPos: CursorPosition | null) {
        if (!cursorPos || !this.editorElement) {
            this.focusAtEnd();
            return;
        }

        // containerがまだeditorElement内に存在するか確認
        let node: Node | null = cursorPos.container;
        while (node && node !== this.editorElement) {
            node = node.parentNode;
        }
        if (node !== this.editorElement) {
            this.focusAtEnd();
            return;
        }

        try {
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.setStart(cursorPos.container, cursorPos.offset);
                newRange.collapse(true);
                selection.addRange(newRange);
            }
        } catch {
            this.focusAtEnd();
        }
    }

    /**
     * エディタの末尾にフォーカス
     */
    private focusAtEnd() {
        if (!this.editorElement) return;

        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            this.editorElement.focus();
            const newRange = document.createRange();
            newRange.selectNodeContents(this.editorElement);
            newRange.collapse(false);
            selection.addRange(newRange);
        }
    }

    /**
     * 画像要素を作成して挿入
     */
    private insertImageElement(url: string) {
        if (!this.editorElement) return;

        const img = document.createElement("img");
        img.src = url;
        Object.assign(img.style, {
            maxWidth: "100%",
            maxHeight: "200px",
            display: "block",
            margin: "8px 0",
            borderRadius: "6px",
            border: "1px solid var(--border)"
        });
        this.editorElement.appendChild(img);
    }

    /**
     * フォーマット済みテキストを挿入
     */
    private insertFormattedText(text: string) {
        if (!this.editorElement) return;

        const formattedHTML = this.formatTextWithHashtagsAndLinks(text);
        const div = document.createElement("div");
        div.innerHTML = DOMPurify.sanitize(formattedHTML);

        while (div.firstChild) {
            this.editorElement.appendChild(div.firstChild);
        }
    }

    /**
     * テキスト内のURLを検出し、HTMLリンクに変換する
     */
    private formatTextWithLinks(text: string): string {
        if (!text) return "";

        return text.replace(this.URL_REGEX, url =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="preview-link">${url}</a>`
        );
    }

    /**
     * テキスト内のハッシュタグをHTMLスパンタグでラップする
     */
    private formatTextWithHashtags(text: string): string {
        this.HASHTAG_REGEX.lastIndex = 0;
        return text.replace(this.HASHTAG_REGEX, (match, hashtag) => {
            const prefix = match.charAt(0) === '#' ? '' : match.charAt(0);
            return `${prefix}<span class="hashtag">${hashtag}</span>`;
        });
    }

    /**
     * テキスト内のハッシュタグとURLを同時に処理する
     * - 先にURLをリンク化
     * - 生成された<a>...</a>の外側のみハッシュタグ化
     * - ハッシュタグは半角スペース/全角スペース/改行で終了
     */
    private formatTextWithHashtagsAndLinks(text: string): string {
        if (!text) return "";

        // 先にURLをリンクに変換
        const linked = this.formatTextWithLinks(text);

        // <a>...</a> で分割して、アンカー外のみハッシュタグ処理
        const parts = linked.split(/(<a\b[^>]*>.*?<\/a>)/gis);
        return parts.map((part) => {
            if (/^<a\b/i.test(part)) return part;
            HASHTAG_REGEX.lastIndex = 0;
            return part.replace(
                HASHTAG_REGEX,
                (match: string, word: string) => {
                    const prefix = match.startsWith("#") ? "" : match.charAt(0);
                    return `${prefix}<span class="hashtag">#${word}</span>`;
                }
            );
        }).join("");
    }

    /**
     * テキストノードのみを取得（画像・リンク要素内は除外）
     */
    private getTextNodes(): Text[] {
        if (!this.editorElement) return [];

        const walker = document.createTreeWalker(
            this.editorElement,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 画像要素内を除外
                    if (node.parentElement?.tagName === "IMG") return NodeFilter.FILTER_REJECT;
                    // リンク内を除外（安全のためタグ名で除外）
                    if (node.parentElement?.tagName === "A") return NodeFilter.FILTER_REJECT;
                    // 既にフォーマット済みの要素内を除外
                    if (node.parentElement?.classList.contains("hashtag") ||
                        node.parentElement?.classList.contains("preview-link")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                },
            },
        );

        const textNodes: Text[] = [];
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node as Text);
            }
        }
        return textNodes;
    }

    /**
     * テキストノードをフォーマット済み要素で置換
     */
    private replaceTextNodeWithFormatted(textNode: Text, formattedHTML: string) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = DOMPurify.sanitize(formattedHTML);

        const parent = textNode.parentNode;
        if (parent) {
            while (tempDiv.firstChild) {
                parent.insertBefore(tempDiv.firstChild, textNode);
            }
            parent.removeChild(textNode);
        }
    }

    /**
     * .hashtag スパン内を正規化
     * - 先頭 # に続く全ての文字をスパン内に残し、
     *   それ以降（空白/改行/全角スペース）はスパンの外へ移動する
     */
    private normalizeHashtagSpans() {
        if (!this.editorElement) return;
        const spans = this.editorElement.querySelectorAll("span.hashtag");
        const isAllowed = (ch: string) =>
            ch !== " " && ch !== "\n" && ch !== "\u3000";

        spans.forEach((span) => {
            const children = Array.from(span.childNodes);
            if (children.length === 0) return;

            // テキストノードの内容を結合
            const concatText = children
                .map(node => node.nodeType === Node.TEXT_NODE ? (node as Text).data ?? "" : "")
                .join("");
            if (!concatText.startsWith("#")) return;

            // スパン内に残す長さを計算
            let keepLen = 1;
            while (
                keepLen < concatText.length &&
                isAllowed(concatText[keepLen])
            ) keepLen++;

            let acc = 0;
            for (let idx = 0; idx < children.length; idx++) {
                const node = children[idx];
                if (node.nodeType === Node.TEXT_NODE) {
                    const data = (node as Text).data ?? "";
                    if (acc + data.length <= keepLen) {
                        acc += data.length;
                        continue;
                    }
                    // 分割が必要な場合
                    const cut = Math.max(keepLen - acc, 0);
                    (node as Text).data = data.slice(0, cut);
                    const right = data.slice(cut);
                    if (right) {
                        span.parentNode?.insertBefore(document.createTextNode(right), span.nextSibling);
                    }
                    // 残りの兄弟ノードを外へ
                    for (let j = idx + 1; j < children.length; j++) {
                        span.parentNode?.insertBefore(children[j], span.nextSibling);
                    }
                    break;
                } else {
                    // 非テキストノードは境界として以降を外へ
                    span.parentNode?.insertBefore(node, span.nextSibling);
                    for (let j = idx + 1; j < children.length; j++) {
                        span.parentNode?.insertBefore(children[j], span.nextSibling);
                    }
                    break;
                }
            }
        });
    }

    /**
     * URL許容文字判定（https?://[\w!?/+\-_~;.,*&@#$%()'[\]]+ と同じ文字集合）
     */
    private isUrlChar(ch: string): boolean {
        return /[\w!?/+\-_~;.,*&@#$%()'\[\]]/.test(ch);
    }

    // 既に生成された <a.preview-link> の直後に続くURL許容文字を取り込み、hrefと表示テキストを伸長
    private extendPreviewLinks() {
        if (!this.editorElement) return;
        const anchors = this.editorElement.querySelectorAll("a.preview-link");
        anchors.forEach((aEl) => {
            const anchor = aEl as HTMLAnchorElement;

            let next: ChildNode | null = anchor.nextSibling;
            while (next && next.nodeType === Node.TEXT_NODE) {
                const textNode = next as Text;
                const data = textNode.data ?? "";
                if (!data) {
                    // 空ノードは削除して次へ
                    const toRemove = next;
                    next = next.nextSibling;
                    toRemove.parentNode?.removeChild(toRemove);
                    continue;
                }

                // 先頭からURL許容文字のみを切り出す
                let i = 0;
                while (i < data.length && this.isUrlChar(data[i])) i++;

                if (i === 0) {
                    // 直後が非許容文字なら伸長終了
                    break;
                }

                const take = data.slice(0, i);
                const rest = data.slice(i);

                // テキスト/リンク先を伸長
                anchor.textContent = (anchor.textContent || "") + take;
                anchor.setAttribute("href", anchor.textContent || "");

                // 残りをノードに戻す or ノード削除
                if (rest.length > 0) {
                    textNode.data = rest;
                    // 先頭が非許容文字になったのでここで終了
                    break;
                } else {
                    // 全て取り込んだのでノード削除して次の兄弟を確認（連続Text対応）
                    const toRemove = next;
                    next = next.nextSibling;
                    toRemove.parentNode?.removeChild(toRemove);
                }
            }
        });
    }

    /**
     * クリーンアップ
     */
    destroy() {
        if (this.formatTimeout) {
            clearTimeout(this.formatTimeout);
            this.formatTimeout = null;
        }
    }
}

