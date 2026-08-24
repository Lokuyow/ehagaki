// @ts-nocheck -- Rollup's plugin context is supplied dynamically at build time.
import { normalize, relative } from "node:path";

const forbiddenPatterns = [
    /[\\/]node_modules[\\/]rx-nostr[\\/]/,
    /[\\/]src[\\/]App\.svelte$/,
    /[\\/]src[\\/]lib[\\/](authService|accountManager|nip46Service|parentClientAuthService|postManager|postHistoryMediaPersistence)[\\/\.]/,
    /[\\/]src[\\/]lib[\\/]storage[\\/](postHistoryRepository|draftsRepository)[\\/\.]/,
    /[\\/]src[\\/]lib[\\/](draftManager|draftComposerController|iframeMessageService|parentClient)[\\/\.]/,
    /[\\/]src[\\/]lib[\\/](normalUploadHelper|fileUploadManager|nostrAuthService)[\\/\.]/,
    /[\\/]src[\\/]lib[\\/]upload[\\/](uploadDestinationResolver|nostr)[\\/]/,
];

const fullSelfPublishForbiddenPatterns = [
    /[\\/]src[\\/]host-owned-composer-lite[\\/]/,
    /[\\/]src[\\/]lib[\\/](hostOwnedComposer|hostOwnedUpload)\\.ts$/,
    /[\\/]src[\\/]web-component[\\/]hostOwnedLiteElement\\.ts$/,
];

/** Exported separately so its static/dynamic traversal can be unit tested. */
export function collectReachableModuleIds(entryId, getInfo) {
    const pending = [entryId];
    const visited = new Set();
    while (pending.length > 0) {
        const id = pending.pop();
        if (!id || visited.has(id)) continue;
        visited.add(id);
        const info = getInfo(id);
        if (!info) continue;
        pending.push(...info.importedIds, ...info.dynamicallyImportedIds);
    }
    return visited;
}

function findModulePath(entryId, targetId, getInfo) {
    const pending = [entryId];
    const parents = new Map([[entryId, null]]);
    while (pending.length > 0) {
        const id = pending.shift();
        if (id === targetId) break;
        const info = getInfo(id);
        for (const next of [...(info?.importedIds ?? []), ...(info?.dynamicallyImportedIds ?? [])]) {
            if (!parents.has(next)) {
                parents.set(next, id);
                pending.push(next);
            }
        }
    }
    if (!parents.has(targetId)) return [];
    const path = [];
    for (let current = targetId; current; current = parents.get(current)) path.push(current);
    return path.reverse();
}

export function createHostOwnedLiteGraphGate(repositoryRoot) {
    const normalizedRoot = normalize(repositoryRoot);
    return {
        name: "ehagaki-host-owned-lite-graph-gate",
        generateBundle() {
            const entryId = [...this.getModuleIds()].find((id) =>
                normalize(id).endsWith(normalize("src/web-component/host-owned-entry.ts")),
            );
            if (!entryId) {
                this.error("Host-owned Lite entry module was not found for graph validation.");
            }
            const reachable = collectReachableModuleIds(entryId, (id) => this.getModuleInfo(id));
            const violations = [...reachable]
                .filter((id) => forbiddenPatterns.some((pattern) => pattern.test(normalize(id))))
                .map((id) => findModulePath(entryId, id, (moduleId) => this.getModuleInfo(moduleId))
                    .map((moduleId) => relative(normalizedRoot, moduleId)).join(" -> "));
            if (violations.length > 0) {
                this.error(
                    `Host-owned Composer Lite reaches forbidden modules:\n${violations.sort().join("\n")}`,
                );
            }
        },
    };
}

export function createFullSelfPublishGraphGate(repositoryRoot) {
    const normalizedRoot = normalize(repositoryRoot);
    return {
        name: "ehagaki-full-self-publish-graph-gate",
        generateBundle() {
            const entryId = [...this.getModuleIds()].find((id) =>
                normalize(id).endsWith(normalize("src/web-component/entry.ts")),
            );
            if (!entryId) {
                this.error("Full Web Component entry module was not found for graph validation.");
            }
            const reachable = collectReachableModuleIds(entryId, (id) => this.getModuleInfo(id));
            const violations = [...reachable]
                .filter((id) => fullSelfPublishForbiddenPatterns.some((pattern) => pattern.test(normalize(id))))
                .map((id) => findModulePath(entryId, id, (moduleId) => this.getModuleInfo(moduleId))
                    .map((moduleId) => relative(normalizedRoot, moduleId)).join(" -> "));
            if (violations.length > 0) {
                this.error(
                    `Full Web Component reaches Host-owned-only modules:\n${violations.sort().join("\n")}`,
                );
            }
        },
    };
}
