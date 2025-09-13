// tags専用のSvelteランストア
export const hashtagDataStore = $state<{ content: string; hashtags: string[]; tags: [string, string][] }>({
    content: '',
    hashtags: [],
    tags: []
});
