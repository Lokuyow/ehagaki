import { vi } from 'vitest';

// テスト環境の識別子を設定
(globalThis as any).__VITEST__ = true;

// Svelte runesのモック（テスト環境でのみ必要）
(globalThis as any).$state = vi.fn((initialValue: any) => {
    if (typeof initialValue === 'object' && initialValue !== null) {
        return { ...initialValue };
    }
    return initialValue;
});

(globalThis as any).$effect = vi.fn((fn: () => void) => {
    // テスト環境では即座に実行
    fn();
    return () => { }; // cleanup function
});

// DOM APIのモック - cryptoプロパティの安全な定義
if (!window.crypto) {
    Object.defineProperty(window, 'crypto', {
        value: {
            subtle: {
                digest: vi.fn()
            }
        },
        writable: true,
        configurable: true
    });
} else if (!window.crypto.subtle) {
    // cryptoは存在するがsubtleがない場合
    Object.defineProperty(window.crypto, 'subtle', {
        value: {
            digest: vi.fn()
        },
        writable: true,
        configurable: true
    });
} else if (!window.crypto.subtle.digest) {
    // subtleは存在するがdigestがない場合
    window.crypto.subtle.digest = vi.fn();
}

// DOM APIのモック - localStorageプロパティの安全な定義
if (!window.localStorage) {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            length: 0
        },
        writable: true,
        configurable: true
    });
} else {
    // localStorageが存在する場合は個別メソッドをモック
    window.localStorage.getItem = vi.fn();
    window.localStorage.setItem = vi.fn();
    window.localStorage.removeItem = vi.fn();
    window.localStorage.clear = vi.fn();
    if (!window.localStorage.key) {
        window.localStorage.key = vi.fn();
    }
    if (typeof window.localStorage.length === 'undefined') {
        Object.defineProperty(window.localStorage, 'length', {
            value: 0,
            writable: true,
            configurable: true
        });
    }
}

// DOM APIのモック - window.locationの完全なモック
if (!window.location || typeof window.location.port === 'undefined') {
    Object.defineProperty(window, 'location', {
        value: {
            href: 'http://localhost:3000/',
            origin: 'http://localhost:3000',
            protocol: 'http:',
            hostname: 'localhost',
            port: '3000',
            pathname: '/',
            search: '',
            hash: '',
            reload: vi.fn()
        },
        writable: true,
        configurable: true
    });
}

// DOM APIのモック - window.fetchの安全な定義
if (!window.fetch) {
    Object.defineProperty(window, 'fetch', {
        value: vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue(''),
            blob: vi.fn().mockResolvedValue(new Blob()),
        }),
        writable: true,
        configurable: true
    });
}

// DOM APIのモック - MessageChannelの安全な定義
if (!window.MessageChannel) {
    Object.defineProperty(window, 'MessageChannel', {
        value: class MessageChannel {
            port1: MessagePort;
            port2: MessagePort;

            constructor() {
                this.port1 = {
                    postMessage: vi.fn(),
                    onmessage: null,
                    onmessageerror: null,
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    start: vi.fn(),
                    close: vi.fn(),
                    dispatchEvent: vi.fn()
                } as any;

                this.port2 = {
                    postMessage: vi.fn(),
                    onmessage: null,
                    onmessageerror: null,
                    addEventListener: vi.fn(),
                    removeEventListener: vi.fn(),
                    start: vi.fn(),
                    close: vi.fn(),
                    dispatchEvent: vi.fn()
                } as any;
            }
        },
        writable: true,
        configurable: true
    });
}

// DOM APIのモック - navigator.serviceWorkerの安全な定義
if (!navigator.serviceWorker) {
    Object.defineProperty(navigator, 'serviceWorker', {
        value: {
            controller: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            register: vi.fn(),
            getRegistration: vi.fn(),
            getRegistrations: vi.fn(),
            ready: Promise.resolve({
                active: null,
                installing: null,
                waiting: null
            })
        },
        writable: true,
        configurable: true
    });
}

// DOM APIのモック - window.dispatchEventの安全な定義
if (!window.dispatchEvent) {
    window.dispatchEvent = function () { return true; };
}

// window.setTimeout/clearTimeout の安全な定義
if (!window.setTimeout) {
    window.setTimeout = setTimeout;
}
if (!window.clearTimeout) {
    window.clearTimeout = clearTimeout;
}

// DOM APIのモック - DOMParserの安全な定義
if (!window.DOMParser) {
    Object.defineProperty(window, 'DOMParser', {
        value: class DOMParser {
            parseFromString(str: string, contentType: string) {
                // シンプルなHTMLパーサーのモック
                const parser = new (globalThis as any).DOMParser();
                return parser.parseFromString(str, contentType);
            }
        },
        writable: true,
        configurable: true
    });
}

// DOM APIのモック - window.addEventListener/removeEventListenerの安全な定義
if (!window.addEventListener) {
    window.addEventListener = vi.fn();
}
if (!window.removeEventListener) {
    window.removeEventListener = vi.fn();
}
