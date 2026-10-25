import { nip19 } from "nostr-tools";
import type { AuthService, UploadDestination, UploadProtocolAdapter } from "../types/upload";
import { authState } from "../../stores/authStore.svelte";
import { NostrAuthService } from "../nostrAuthService";
import { assertActiveSession, type AuthStateSource } from "../sessionLiveness";
import { getUploadAdapter } from "./uploadAdapterRegistry";
import { resolveUploadDestinationForUse } from "./uploadDestinationResolver";
import { normalizeMediaOperationError, UPLOAD_MEDIA_PAGE_SIZE } from "./mediaManagementUtils";
import {
    UploadMediaError, type UploadedMediaItem, type UploadMediaContext,
    type UploadMediaPageCursor,
} from "./mediaManagementTypes";
import { createUploadAbortError } from "./uploadOperation";
import {
    getUploadRegistrationTarget, loadUploadRegistrationPolicy, registerUploadServer,
    UploadRegistrationError, type UploadRegistrationView,
} from "./uploadServerRegistration";

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
    hasMore: boolean;
    context: UploadMediaContext | null;
    needsRefresh: boolean;
    deletingId: string | null;
    notice: "deleted" | "cacheCleanupFailed" | null;
    registration?: UploadRegistrationView | null;
}
export interface UploadMediaManagementView {
    destinations: UploadDestination[];
    selectedId: string | null;
    current: UploadMediaDestinationView | null;
    configuring?: boolean;
    configurationError?: UploadMediaError | null;
}
export const emptyUploadMediaManagementView = (): UploadMediaManagementView => ({ destinations: [], selectedId: null, current: null });

interface DestinationState extends Omit<UploadMediaDestinationView, "hasMore"> {
    // null means remote paging; an empty array is an exhausted local snapshot.
    localSnapshot: UploadedMediaItem[] | null;
    generation: number;
    abort: AbortController | null;
    cursors: Set<string>;
    deleteDispatched: boolean;
    registrationDispatched: boolean;
}
interface Dependencies {
    loadDestinations?: (pubkey: string) => Promise<UploadDestination[]>;
    auth?: AuthStateSource;
    fetch?: typeof fetch;
    getAdapter?: (protocol: UploadDestination["protocol"]) => UploadProtocolAdapter;
    createAuth?: (params: { signal: AbortSignal; expectedPubkey: string }) => AuthService;
    evictImages: (urls: string[]) => Promise<boolean>;
    onChange: (view: UploadMediaManagementView) => void;
}

function signature(destination: UploadDestination): string {
    return [destination.protocol, destination.serverUrl, destination.resolvedUploadUrl,
        destination.nip96ServerUrl, destination.nip96UrlMode].join("\n");
}
function requireRefresh(state: DestinationState): void {
    state.localSnapshot = null;
    state.nextPage = null;
    state.needsRefresh = true;
}
export class UploadMediaManagementController {
    private readonly states = new Map<string, DestinationState>();
    private destinations: UploadDestination[] = [];
    private pubkey: string | null = null;
    private epoch = 0;
    private selectedId: string | null = null;
    private configuring = false;
    private configurationError: UploadMediaError | null = null;
    private configurationGeneration = 0;
    private savedDestinationsRead = false;
    private active = true;
    get busy(): boolean { return [...this.states.values()].some(state => !!state.deletingId || state.registration?.phase === "submitting"); }
    activate(): void { this.active = true; }
    suspend(): void {
        this.active = false;
        this.epoch++;
        this.configuring = false;
        for (const state of this.states.values()) {
            state.abort?.abort();
            state.generation++;
            if (state.deletingId && state.deleteDispatched) { state.error = new UploadMediaError("unknownDelete"); requireRefresh(state); }
            state.loading = false; state.deletingId = null; state.deleteDispatched = false;
            this.stopRegistration(state);
        }
        this.emit();
    }
    constructor(private readonly deps: Dependencies) {}

    private emit(): void {
        const current = this.selectedId ? this.states.get(this.selectedId) : undefined;
        // Do not expose cancellation/service references to reactive UI state.
        const view = current ? {
            destination: current.destination, items: [...current.items], loaded: current.loaded,
            loading: current.loading, error: current.error, support: current.support,
            excludedCount: current.excludedCount, invalidCount: current.invalidCount,
            nextPage: current.nextPage, context: current.context, needsRefresh: current.needsRefresh,
            hasMore: !current.needsRefresh && (!!current.nextPage || !!current.localSnapshot?.length),
            deletingId: current.deletingId, notice: current.notice,
            registration: current.registration ? { ...current.registration } : null,
        } : null;
        this.deps.onChange({ destinations: [...this.destinations], selectedId: this.selectedId, current: view,
            configuring: this.configuring, configurationError: this.configurationError });
    }
    invalidate(): void {
        this.epoch++;
        this.configurationGeneration++;
        this.configuring = false;
        this.configurationError = null;
        this.savedDestinationsRead = false;
        for (const state of this.states.values()) state.abort?.abort();
        this.states.clear();
        this.destinations = [];
        this.selectedId = null;
        this.pubkey = null;
        this.emit();
    }
    async configureSaved(pubkey: string | null): Promise<void> {
        if (!this.active) return;
        const auth = (this.deps.auth ?? authState).value;
        if (pubkey && (!auth.isAuthenticated || auth.pubkey !== pubkey)) return;
        if (pubkey !== this.pubkey) { this.invalidate(); this.pubkey = pubkey; }
        if (!pubkey) { this.emit(); return; }
        if (this.savedDestinationsRead) {
            if (this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.registration) void this.load();
            return;
        }
        if (this.configuring) return;
        const epoch = this.epoch, generation = ++this.configurationGeneration;
        const current = () => this.active && epoch === this.epoch && generation === this.configurationGeneration
            && this.pubkey === pubkey && (this.deps.auth ?? authState).value.isAuthenticated
            && (this.deps.auth ?? authState).value.pubkey === pubkey;
        this.configuring = true; this.configurationError = null; this.emit();
        try {
            const destinations = await this.deps.loadDestinations?.(pubkey) ?? [];
            if (current()) this.configure(pubkey, destinations);
        } catch {
            if (current()) this.configurationError = new UploadMediaError("invalidDestination");
        } finally {
            if (current()) { this.configuring = false; this.emit(); }
        }
    }
    configure(pubkey: string | null, destinations: UploadDestination[]): void {
        if (pubkey !== this.pubkey) this.invalidate();
        this.pubkey = pubkey;
        this.configurationGeneration++;
        this.configuring = false;
        this.configurationError = null;
        this.savedDestinationsRead = true;
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
                registrationDispatched: false,
                localSnapshot: null,
            });
        }
        if (!this.selectedId || !ids.has(this.selectedId)) {
            this.selectedId = this.destinations.find((item) => item.isDefault)?.id ?? this.destinations[0]?.id ?? null;
        }
        this.emit();
        if (this.selectedId && !this.states.get(this.selectedId)?.loaded && !this.states.get(this.selectedId)?.loading
            && !this.states.get(this.selectedId)?.registration) void this.load();
    }
    select(id: string): void {
        if (this.busy || !this.states.has(id) || id === this.selectedId) return;
        if (this.selectedId) {
            const old = this.states.get(this.selectedId);
            old?.abort?.abort();
            if (old) {
                if (old.deletingId && old.deleteDispatched) {
                    old.error = new UploadMediaError("unknownDelete");
                    requireRefresh(old);
                }
                old.generation++; old.loading = false; old.deletingId = null; old.deleteDispatched = false;
                this.stopRegistration(old);
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
        const current = () => this.active && (this.deps.auth ?? authState).value.isAuthenticated
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
        if (!this.active || !state || !this.pubkey || state.loading || state.deletingId || state.registration?.phase === "submitting") return;
        if (state.error?.retryAt && Date.now() < state.error.retryAt) return;
        if (append && !state.needsRefresh && state.localSnapshot !== null) {
            const auth = (this.deps.auth ?? authState).value;
            if (!auth.isAuthenticated || auth.pubkey !== this.pubkey || !state.localSnapshot.length) return;
            state.error = null;
            state.notice = null;
            state.items.push(...state.localSnapshot.splice(0, UPLOAD_MEDIA_PAGE_SIZE));
            this.emit();
            return;
        }
        if (append && state.loaded && !state.needsRefresh && !state.nextPage) return;
        append = append && !state.needsRefresh && Boolean(state.nextPage);
        if (!append && state.localSnapshot !== null) requireRefresh(state);
        state.notice = null;
        state.registration = null;
        await this.loadPage(state, append);
    }
    private async loadPage(state: DestinationState, append: boolean, operation = this.begin(state)): Promise<void> {
        state.loading = true;
        state.error = null;
        this.emit();
        try {
            const adapter = (this.deps.getAdapter ?? getUploadAdapter)(state.destination.protocol);
            if (!adapter.listMediaPage || !adapter.deleteMedia) throw new UploadMediaError("unavailable");
            const page = await adapter.listMediaPage({ ...operation.params,
                page: append ? state.nextPage : null, context: append ? state.context : null,
            });
            operation.params.assertSession();
            if (!operation.current()) return;
            if (page.localSnapshot && (state.destination.protocol !== "blossom" || page.nextPage)) {
                throw new UploadMediaError("invalidResponse");
            }
            const cursor = page.nextPage?.protocol === "blossom" ? page.nextPage.cursor : null;
            if (append && cursor && state.cursors.has(cursor)) throw new UploadMediaError("invalidResponse");
            if (!append) state.cursors.clear();
            if (cursor) state.cursors.add(cursor);
            if (page.localSnapshot) {
                const shown = new Set(append ? state.items.map((item) => item.id) : []);
                state.localSnapshot = [...new Map(page.items.map((item) => [item.id, item])).values()]
                    .filter((item) => !shown.has(item.id));
                state.items = [...(append ? state.items : []), ...state.localSnapshot.splice(0, UPLOAD_MEDIA_PAGE_SIZE)];
            } else {
                const items = append ? [...state.items, ...page.items] : page.items;
                state.items = [...new Map(items.map((item) => [item.id, item])).values()];
                state.localSnapshot = null;
            }
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
            const target = getUploadRegistrationTarget(state.destination);
            if (target && [401, 403].includes(state.error.status ?? 0)) {
                state.registration = { target, phase: "offer", policy: null, error: null };
            }
            if (state.error.code === "unavailable") state.support = "unavailable";
            if (state.error.code === "invalidResponse") {
                requireRefresh(state);
            }
        } finally {
            if (operation.current()) { state.loading = false; this.emit(); }
        }
    }
    private stopRegistration(state: DestinationState): void {
        if (!state.registration) return;
        if (state.registration.phase === "submitting" && state.registrationDispatched) {
            state.registration = { ...state.registration, phase: "unknown", error: "unknownRegistration" };
        } else if (["loading", "ready", "submitting"].includes(state.registration.phase)) {
            state.registration = { ...state.registration, phase: "offer", policy: null, error: null };
        }
        state.registrationDispatched = false;
    }
    async openRegistration(): Promise<void> {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        if (!this.active || !state || state.loading || this.busy || !this.pubkey || state.registration?.phase !== "offer") return;
        const operation = this.begin(state);
        state.registration = { ...state.registration, phase: "loading", error: null };
        this.emit();
        try {
            const policy = await loadUploadRegistrationPolicy(operation.params);
            if (!operation.current()) return;
            state.registration = { ...state.registration, policy, phase: policy ? "ready" : "external" };
        } catch {
            if (!operation.current()) return;
            state.registration = { ...state.registration, phase: "external" };
        } finally {
            if (operation.current()) this.emit();
        }
    }
    cancelRegistration(): void {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        if (!state?.registration) return;
        state.abort?.abort(); state.generation++;
        this.stopRegistration(state);
        this.emit();
    }
    async register(username: string): Promise<void> {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        if (!this.active || !state || !this.pubkey || this.busy || state.loading
            || state.registration?.phase !== "ready" || !state.registration.policy) return;
        const operation = this.begin(state);
        const policy = state.registration.policy;
        state.registration = { ...state.registration, phase: "submitting", error: null };
        state.registrationDispatched = false;
        state.error = null;
        this.emit();
        try {
            const result = await registerUploadServer(operation.params, username, policy, () => {
                operation.params.assertSession(); state.registrationDispatched = true;
            });
            if (!operation.current()) return;
            state.registrationDispatched = false;
            if (result === "external") {
                state.registration = { ...state.registration, phase: "external" };
            } else {
                const target = state.registration.target;
                state.registration = null;
                requireRefresh(state);
                await this.loadPage(state, false, operation);
                if (operation.current() && state.registration) {
                    // A registered but inactive/banned account needs the service's help, not another POST.
                    state.registration = { target, phase: "external", policy: null, error: null };
                }
            }
        } catch (error) {
            if (!operation.current()) return;
            const code = error instanceof UploadRegistrationError ? error.code : "serverError";
            state.registration = { ...state.registration!, phase: code === "unknownRegistration" ? "unknown" : "ready", error: code };
        } finally {
            if (operation.current()) { state.registrationDispatched = false; this.emit(); }
        }
    }
    async delete(itemId: string): Promise<boolean> {
        const state = this.selectedId ? this.states.get(this.selectedId) : undefined;
        const item = state?.items.find((entry) => entry.id === itemId);
        if (!this.active || !state || !item?.deleteId || !state.context || state.loading || this.busy || !this.pubkey) return false;
        const operation = this.begin(state);
        const hash = item.deleteId.sha256;
        const urls = item.kind === "image" ? [...new Set(state.items.filter((entry) =>
            entry.kind === "image" && entry.deleteId?.sha256 === hash && entry.url,
        ).map((entry) => entry.url!))] : [];
        state.deletingId = item.id;
        state.deleteDispatched = false;
        state.error = null;
        state.notice = null;
        state.registration = null;
        this.emit();
        try {
            const adapter = (this.deps.getAdapter ?? getUploadAdapter)(state.destination.protocol);
            if (!adapter.deleteMedia) throw new UploadMediaError("unavailable");
            await adapter.deleteMedia({ ...operation.params, item, context: state.context });
            // Remote success is committed. Cache maintenance must never replay DELETE.
            if (operation.current()) {
                state.deleteDispatched = false;
                state.items = state.items.filter((entry) => entry.deleteId?.sha256 !== hash);
                requireRefresh(state);
                state.notice = "deleted";
                this.emit();
            }
            if (urls.length) {
                const evict = async () => { try { return await this.deps.evictImages(urls); } catch { return false; } };
                let clean = await evict();
                if (!clean && operation.current()) clean = await evict();
                if (!clean && operation.current()) state.notice = "cacheCleanupFailed";
            }
            if (operation.current()) await this.loadPage(state, false, operation);
            return true;
        } catch (error) {
            if (operation.current()) {
                state.error = normalizeMediaOperationError(error);
                if (state.error.code === "unknownDelete") requireRefresh(state);
            }
            return false;
        } finally {
            if (operation.current()) { state.deletingId = null; state.deleteDispatched = false; this.emit(); }
        }
    }
}
