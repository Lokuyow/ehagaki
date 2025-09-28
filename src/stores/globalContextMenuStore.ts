import { writable } from "svelte/store";
const globalContextMenuStore = writable<{ open: boolean; nodeId?: string }>({ open: false, nodeId: undefined });
export default globalContextMenuStore;
