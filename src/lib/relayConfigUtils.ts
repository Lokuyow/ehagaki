import { utils as nostrToolsUtils } from 'nostr-tools';
import type { RelayConfig } from "./types";

const ALLOWED_EXTERNAL_RELAY_PROTOCOLS = new Set(['ws:', 'wss:']);

// --- 純粋関数（依存性なし） ---
export class RelayConfigParser {
    static parseKind10002Tags(tags: any[]): RelayConfig {
        const relayConfigs: { [url: string]: { read: boolean; write: boolean } } = {};

        tags
            .filter((tag) => Array.isArray(tag) && tag.length >= 2 && tag[0] === "r")
            .forEach((tag) => {
                const url = tag[1];
                if (!url || typeof url !== 'string') return;

                let read = true;
                let write = true;

                if (tag.length > 2) {
                    if (tag.length === 3) {
                        if (tag[2] === "read") write = false;
                        else if (tag[2] === "write") read = false;
                    } else {
                        read = tag.includes("read");
                        write = tag.includes("write");
                    }
                }
                relayConfigs[url] = { read, write };
            });

        return relayConfigs;
    }

    static parseKind3Content(content: string): RelayConfig | null {
        try {
            const relayObj = JSON.parse(content);
            if (relayObj && typeof relayObj === "object" && !Array.isArray(relayObj)) {
                return relayObj;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    static isValidRelayConfig(config: any): config is RelayConfig {
        if (!config) return false;

        if (Array.isArray(config)) {
            return config.every(item => typeof item === 'string');
        }

        if (typeof config === 'object') {
            return Object.entries(config).every(([url, conf]) =>
                typeof url === 'string' &&
                conf &&
                typeof conf === 'object' &&
                'read' in conf &&
                'write' in conf &&
                typeof conf.read === 'boolean' &&
                typeof conf.write === 'boolean'
            );
        }

        return false;
    }
}

// --- リレー設定操作ユーティリティ（純粋関数） ---
export class RelayConfigUtils {
    static readonly EXTERNAL_INPUT_RELAY_LIMIT = 3;

    /**
     * リレーURLに末尾スラッシュを追加
     */
    static normalizeRelayUrl(url: string): string {
        return url.endsWith('/') ? url : url + '/';
    }

    static normalizeExternalRelayUrl(url: string): string | null {
        if (typeof url !== 'string') {
            return null;
        }

        const trimmed = url.trim();
        if (!trimmed) {
            return null;
        }

        try {
            if (trimmed.includes('://')) {
                const explicitUrl = new URL(trimmed);
                if (!ALLOWED_EXTERNAL_RELAY_PROTOCOLS.has(explicitUrl.protocol)) {
                    return null;
                }
                if (explicitUrl.username || explicitUrl.password) {
                    return null;
                }
            }

            const normalized = nostrToolsUtils.normalizeURL(trimmed);
            const normalizedUrl = new URL(normalized);
            if (!ALLOWED_EXTERNAL_RELAY_PROTOCOLS.has(normalizedUrl.protocol)) {
                return null;
            }
            if (!normalizedUrl.hostname) {
                return null;
            }
            if (normalizedUrl.username || normalizedUrl.password) {
                return null;
            }

            return normalized;
        } catch {
            return null;
        }
    }

    static sanitizeExternalRelayUrls(
        urls: string[] | undefined,
        options: { limit?: number } = {},
    ): string[] {
        if (!urls?.length) {
            return [];
        }

        const sanitized: string[] = [];
        const seen = new Set<string>();

        for (const url of urls) {
            const normalized = this.normalizeExternalRelayUrl(url);
            if (!normalized || seen.has(normalized)) {
                continue;
            }

            seen.add(normalized);
            sanitized.push(normalized);

            if (
                typeof options.limit === 'number'
                && sanitized.length >= options.limit
            ) {
                break;
            }
        }

        return sanitized;
    }

    /**
     * 複数のリレー設定をマージして正規化されたURL配列を返す
     */
    static mergeRelayConfigs(...configs: (RelayConfig | string[])[]): string[] {
        const relaySet = new Set<string>();

        configs.forEach(config => {
            if (Array.isArray(config)) {
                config.forEach(url => relaySet.add(this.normalizeRelayUrl(url)));
            } else if (typeof config === 'object') {
                Object.keys(config).forEach(url => {
                    relaySet.add(this.normalizeRelayUrl(url));
                });
            }
        });

        return Array.from(relaySet);
    }

    /**
     * リレー設定からreadリレーのみを抽出
     */
    static extractReadRelays(config: RelayConfig): string[] {
        if (Array.isArray(config)) {
            return config.map(url => this.normalizeRelayUrl(url));
        } else if (typeof config === 'object') {
            return Object.keys(config)
                .filter(url => config[url]?.read !== false)
                .map(url => this.normalizeRelayUrl(url));
        }
        return [];
    }

    /**
     * リレー設定からwriteリレーのみを抽出
     */
    static extractWriteRelays(config: RelayConfig): string[] {
        if (Array.isArray(config)) {
            return config.map(url => this.normalizeRelayUrl(url));
        } else if (typeof config === 'object') {
            return Object.keys(config)
                .filter(url => config[url]?.write !== false)
                .map(url => this.normalizeRelayUrl(url));
        }
        return [];
    }

    /**
     * リレー設定から全リレーを抽出
     */
    static extractAllRelays(config: RelayConfig): string[] {
        if (Array.isArray(config)) {
            return config.map(url => this.normalizeRelayUrl(url));
        } else if (typeof config === 'object') {
            return Object.keys(config).map(url => this.normalizeRelayUrl(url));
        }
        return [];
    }
}
