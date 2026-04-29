import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import HashtagSuggestionList from '../../components/HashtagSuggestionList.svelte';
import { getSuggestions } from '../utils/hashtagHistory';
import { createSuggestionRenderer } from './suggestionRenderer';

/**
 * ハッシュタグサジェスト拡張
 *
 * '#' を入力するとローカルストレージの履歴からサジェスト候補をドロップダウン表示する。
 * 候補選択で入力中の '#<query>' を '#<selected> ' に置換する。
 */
export const HashtagSuggestion = Extension.create({
    name: 'hashtagSuggestion',

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                char: '#',
                allowSpaces: false,
                allowedPrefixes: [' ', '\n', '\t', '\u3000'],
                items: ({ query }: { query: string }) => getSuggestions(query),

                render: createSuggestionRenderer<string>({
                    component: HashtagSuggestionList,
                }),

                command: ({ editor, range, props }: { editor: any; range: any; props: string }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent('#' + props + ' ')
                        .run();
                },
            }),
        ];
    },
});
