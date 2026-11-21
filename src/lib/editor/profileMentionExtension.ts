import { Node, type Editor, type Range } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion, { type SuggestionMatch, type Trigger } from "@tiptap/suggestion";
import ProfileMentionSuggestionList from "../../components/ProfileMentionSuggestionList.svelte";
import {
    parseProfileMentionUri,
    profileMentionLabel,
    PROFILE_MENTION_ATTRIBUTE,
    PROFILE_MENTION_NODE,
    profileMentionUri,
    shortenProfileMentionLabel,
    type ProfileMentionCandidate,
} from "../profileMention";
import { createSuggestionRenderer } from "./suggestionRenderer";
import { isImeCompositionKeydown } from "./imeCompositionKey";

const pluginKey = new PluginKey("profileMentionSuggestion");

export function findProfileMentionSuggestionMatch({ $position }: Trigger): SuggestionMatch {
    const text = $position.nodeBefore?.text;
    if (!text) return null;
    const limit = Math.max(0, text.length - 256);
    for (let at = text.lastIndexOf("@"); at >= limit; at = text.lastIndexOf("@", at - 1)) {
        if (at === 0 || /[ \t\u3000]/.test(text[at - 1]!)) {
            const query = text.slice(at + 1);
            if (!query.trim()) return null;
            const from = $position.pos - text.length + at;
            return { range: { from, to: $position.pos }, query, text: text.slice(at) };
        }
    }
    return null;
}

export function insertProfileMention(
    editor: Editor,
    target: ProfileMentionCandidate,
    range: Range = editor.state.selection,
): boolean {
    if (!editor.isEditable || !editor.schema.nodes[PROFILE_MENTION_NODE]) return false;
    const before = editor.state.doc.resolve(range.from).nodeBefore;
    const after = editor.state.doc.resolve(range.to).nodeAfter;
    const needsLeadingSpace = before?.type.name === PROFILE_MENTION_NODE || /\S$/.test(before?.text ?? "");
    const trailingSpace = /^\s/.test(after?.text ?? "") ? [] : [{ type: "text", text: " " }];
    return editor.commands.insertContentAt(range, [
        ...(needsLeadingSpace ? [{ type: "text", text: " " }] : []),
        { type: PROFILE_MENTION_NODE, attrs: { uri: profileMentionUri(target), label: shortenProfileMentionLabel(target.label) } },
        ...trailingSpace,
    ]);
}

interface Options {
    getItems: (query: string) => ProfileMentionCandidate[];
    canSuggest: () => boolean;
}

export const ProfileMentionExtension = Node.create<Options>({
    name: PROFILE_MENTION_NODE,
    group: "inline",
    inline: true,
    atom: true,
    selectable: false,

    addOptions() {
        return { getItems: () => [], canSuggest: () => true };
    },

    addAttributes() {
        return {
            uri: { default: "", rendered: false },
            label: { default: "", rendered: false },
        };
    },

    parseHTML() {
        return [{
            tag: `span[${PROFILE_MENTION_ATTRIBUTE}]`,
            getAttrs: element => {
                const pointer = parseProfileMentionUri(element.getAttribute(PROFILE_MENTION_ATTRIBUTE));
                if (!pointer) return false;
                return {
                    uri: profileMentionUri(pointer),
                    label: shortenProfileMentionLabel(element.textContent?.replace(/^@/, "") ?? "")
                        || profileMentionLabel(pointer.pubkey),
                };
            },
        }];
    },

    renderHTML({ node }) {
        return ["span", { [PROFILE_MENTION_ATTRIBUTE]: node.attrs.uri, class: "editor-profile-mention" },
            `@${shortenProfileMentionLabel(node.attrs.label)}`];
    },

    renderText({ node }) {
        return node.attrs.uri;
    },

    addProseMirrorPlugins() {
        const render = createSuggestionRenderer<ProfileMentionCandidate>({
            component: ProfileMentionSuggestionList,
            className: "profile-mention-suggestion-popover",
        });
        return [Suggestion<ProfileMentionCandidate>({
            editor: this.editor,
            pluginKey,
            char: "@",
            findSuggestionMatch: findProfileMentionSuggestionMatch,
            allow: () => this.options.canSuggest(),
            items: ({ query }) => this.options.getItems(query),
            render: () => {
                const renderer = render();
                return {
                    ...renderer,
                    onKeyDown: props => !isImeCompositionKeydown(props.event, props.view)
                        && renderer.onKeyDown(props),
                };
            },
            command: ({ editor, range, props }) => {
                if (!this.options.canSuggest()) return;
                const selection = editor.state.selection;
                if (!selection.empty || selection.from !== range.to) return;
                const text = editor.state.doc.textBetween(range.from, range.to);
                if (!text.startsWith("@")) return;
                const current = this.options.getItems(text.slice(1)).find(item => item.pubkey === props.pubkey);
                if (current) insertProfileMention(editor, current, range);
            },
        })];
    },
});
