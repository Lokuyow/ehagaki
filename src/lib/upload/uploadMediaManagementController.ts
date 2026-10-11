import { nip19 } from "nostr-tools";
import type { AuthService, UploadDestination, UploadProtocolAdapter } from "../types/upload";
import { authState } from "../../stores/authStore.svelte";
import { NostrAuthService } from "../nostrAuthService";
import { assertActiveSession, type AuthStateSource } from "../sessionLiveness";
import { getUploadAdapter } from "./uploadAdapterRegistry";
import { resolveUploadDestinationForUse } from "./uploadDestinationResolver";
import { normalizeMediaOperationError } from "./mediaManagementUtils";
import {
    UploadMediaError, type UploadedMediaItem, type UploadMediaContext,
    type UploadMediaPageCursor,
} from "./mediaManagementTypes";
import { createUploadAbortError } from "./uploadOperation";

export interface UploadMediaDestinationView {
    destination: UploadDestination;
    items: UploadedMediaItem[];
    loaded: boolean;
    loading: boolean;
    error: UploadMediaError | null;
    support: "unknown" | "supported" | "unavailable";
    excludedCount: number;
    invalidCount: number;
    nextPage: UploadMediaPageCursor | null;
    context: UploadMediaContext | null;
    needsRefresh: boolean;
    deletingId: string | null;
    notice: "deleted" | "cacheCleanupFailed" | null;
}
export interface UploadMediaManagementView {
    destinations: UploadDestination[];
    selectedId: string | null;
    current: UploadMediaDestinationView | null;
}
export const emptyUploadMediaManagementView = (): UploadMediaManagementView => ({ destinations: [], selectedId: null, current: null });

interface DestinationState extends UploadMediaDestinationView {
    generation: number;
    abort: AbortController | null;
    cursors: Set<string>;
    deleteDispatched: boolean;
}
interface Dependencies {
    auth?: AuthStateSource;
    fetch?: typeof fetch;
    getAdapter?: (protocol: UploadDestination["protocol"]) => UploadProtocolAdapter;
    createAuth?: (params: { signal: AbortSignal; expectedPubkey: string }) => AuthService;
    evictImages: (urls: string[]) => Promise<boolean>;
    onChange: (view: UploadMediaManagementView) => void;
}

function signature(destination: UploadDestination): string {
    return `${destination.protocol}\n${destination.serverUrl}`;
}
export class UploadMediaManagementController {
    private readonly states = new Map<string, DestinationState>();
    private destinations: UploadDestination[] = [];
    private pubkey: string | null = null;
    private epoch = 0;
    private selectedId: string | null = null;
    constructor(private readonly deps: Dependencies) {}

    private emit(): void {
        const current = this.selectedId ? this.states.get(this.selectedId) : undefined;
        // Do not expose cancellation/service references to reactive UI state.
        const view = current ? {
            destination: current.destination, items: [...current.items], loaded: current.loaded,
            loading: current.loading, error: current.error, support: current.support,
            excludedCount: current.excludedCount, invalidCount: current.invalidCount,
            nextPage: current.nextPage, context: current.context, needsRefresh: current.needsRefresh,
            deletingId: current.deletingId, notice: current.notice,
        } : null;
        this.deps.onChange({ destinations: [...this.destinations], selectedId: this.selectedId, current: view });
    }
    invalidate(): void {
        this.epoch++;
        for (const state of this.states.values()) state.abort?.abort();
        this.states.clear();
        this.destinations = [];
        this.selectedId = null;
        this.pubkey = null;
        this.emit();
    }
    configure(pubkey: string | null, destinations: UploadDestination[]): void {
        if (pubkey !== this.pubkey) this.invalidate();
        this.pubkey = pubkey;
        if (!pubkey) { this.emit(); return; }
        this.destinations = destinations.filter((item) => item.protocol !== "custom-http")
            .map((destination) => resolveUploadDestinationForUse(destination, {
                pubkeyHex: pubkey, npub: nip19.npubEncode(pubkey),
            }));
        const ids = new Set(this.destinations.map((item) => item.id));
        for (const [id, state] of this.states) {
            if (!ids.has(id)) { state.abort?.abort(); this.states.delete(id); }
        }
        for (const destination of this.destinations) {
            const old = this.states.get(destination.id);
            if (old && signature(old.destination) === signature(destination)) {
                old.destination = destination;
                continue;
            }
            old?.abort?.abort();
            this.states.set(destination.id, {
                destination, items: [], loaded: false, loading: false, error: null,
                support: "unknown", excludedCount: 0, invalidCount: 0, nextPage: null,
                context: null, needsRefresh: false, deletingId: null, notice: null,
                generation: 0, abort: null, cursors: new Set(),
                deleteDispatched: false,
            });
        }
        if (!this.selectedId || !ids.has(this.selectedId)) {
            this.selectedId = this.destinations.find((item) => item.isDefault)?.id ?? this.destinations[0]?.id ?? null;
        }
        this.emit();
        if (this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.loading) void this.load();
    }
    select(id: string): void {
        if (!this.states.has(id) || id === this.selectedId) return;
        if (this.selectedId) {
            const old = this.states.get(this.selectedId);
            old?.abort?.abort();
            if (old) {
                if (old.deletingId && old.deleteDispatched) {
                    old.error = new UploadMediaError("unknownDelete");
                    old.nextPage = null;
                    old.needsRefresh = true;
                }
                old.generation++; old.loading = false; old.deletingId = null; old.deleteDispatched = false;
            }
        }
        this.selectedId = id;
        this.emit();
        if (!this.states.get(id)?.loaded) void this.load();
    }
    private begin(state: DestinationState) {
        state.abort?.abort();
        const abort = new AbortController();
        state.abort = abort;
        const generation = ++state.generation;
        const epoch = this.epoch;
        const pubkey = this.pubkey!;
        // Snapshot the destination before any signer/discovery wait.
        const destination = { ...state.destination };
        const current = () => (this.deps.auth ?? authState).value.isAuthenticated
            && (this.deps.auth ?? authState).value.pubkey === pubkey
            && this.epoch === epoch && this.pubkey === pubkey
            && this.states.get(destination.id) === state && state.generation === generation
            && !abort.signal.aborted;
        const assertSession = () => {
            if (!current()) throw createUploadAbortError();
            assertActiveSession(this.deps.auth ?? authState, pubkey);
        };
        return {
            current, params: {
                destination, expectedPubkey: pubkey, assertSession, signal: abort.signal,
                fetch: this.deps.fetch ?? globalThis.fetch.bind(globalThis),
                authService: this.deps.createAuth?.({ signal: abort.signal, expectedPubkey: pubkey })
                    ?? new NostrAuthService({ signal: abort.signal, expectedPubkey: pubkey }),
                onDeleteDispatched: () => { assertSession(); state.deleteDispatched = true; },
            },
        };
    }
    async load(append = false): Promise<void> {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        if (!state || !this.pubkey || state.loading || state.deletingId) return;
        if (state.error?.retryAt && Date.now() < state.error.retryAt) return;
        append = append && !state.needsRefresh && Boolean(state.nextPage);
        const operation = this.begin(state);
        state.loading = true;
        state.error = null;
        state.notice = null;
        this.emit();
        try {
            const adapter = (this.deps.getAdapter ?? getUploadAdapter)(state.destination.protocol);
            if (!adapter.listMediaPage || !adapter.deleteMedia) throw new UploadMediaError("unavailable");
            const page = await adapter.listMediaPage({ ...operation.params,
                page: append ? state.nextPage : null, context: append ? state.context : null,
            });
            operation.params.assertSession();
            if (!operation.current()) return;
            const cursor = page.nextPage?.protocol === "blossom" ? page.nextPage.cursor : null;
            if (append && cursor && state.cursors.has(cursor)) throw new UploadMediaError("invalidResponse");
            if (!append) state.cursors.clear();
            if (cursor) state.cursors.add(cursor);
            const items = append ? [...state.items, ...page.items] : page.items;
            state.items = [...new Map(items.map((item) => [item.id, item])).values()];
            state.excludedCount = (append ? state.excludedCount : 0) + page.excludedCount;
            state.invalidCount = (append ? state.invalidCount : 0) + page.invalidCount;
            state.nextPage = page.nextPage;
            state.context = page.context;
            state.loaded = true;
            state.support = "supported";
            state.needsRefresh = false;
        } catch (error) {
            if (!operation.current()) return;
            state.error = normalizeMediaOperationError(error);
            if (state.error.code === "unavailable") state.support = "unavailable";
            if (state.error.code === "invalidResponse") {
                state.nextPage = null;
                state.needsRefresh = true;
            }
        } finally {
            if (operation.current()) { state.loading = false; this.emit(); }
        }
    }
    async delete(itemId: string): Promise<boolean> {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        const item = state?.items.find((entry) => entry.id === itemId);
        if (!state || !item?.deleteId || !state.context || state.loading || state.deletingId || !this.pubkey) return false;
        const operation = this.begin(state);
        const hash = item.deleteId.sha256;
        const urls = item.kind === "image" ? [...new Set(state.items.filter((entry) =>
            entry.kind === "image" && entry.deleteId?.sha256 === hash && entry.url,
        ).map((entry) => entry.url!))] : [];
        state.deletingId = item.id;
        state.deleteDispatched = false;
        state.error = null;
        state.notice = null;
        this.emit();
        try {
            const adapter = (this.deps.getAdapter ?? getUploadAdapter)(state.destination.protocol);
            if (!adapter.deleteMedia) throw new UploadMediaError("unavailable");
            await adapter.deleteMedia({ ...operation.params, item, context: state.context });
            // Remote success is committed. Cache maintenance must never replay DELETE.
            if (operation.current()) {
                state.deleteDispatched = false;
                state.items = state.items.filter((entry) => entry.deleteId?.sha256 !== hash);
                state.nextPage = null;
                state.needsRefresh = true;
                state.notice = "deleted";
                this.emit();
            }
            if (urls.length) {
                const evict = async () => { try { return await this.deps.evictImages(urls); } catch { return false; } };
                let clean = await evict();
                if (!clean && operation.current()) clean = await evict();
                if (!clean && operation.current()) state.notice = "cacheCleanupFailed";
            }
            return true;
        } catch (error) {
            if (operation.current()) {
                state.error = normalizeMediaOperationError(error);
                if (state.error.code === "unknownDelete") { state.nextPage = null; state.needsRefresh = true; }
            }
            return false;
        } finally {
            if (operation.current()) { state.deletingId = null; state.deleteDispatched = false; this.emit(); }
        }
    }
}
