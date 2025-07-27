
/**
 * 共有された画像データの型
 */
export interface SharedImageData {
    image: File;
    metadata?: {
        name?: string;
        type?: string;
        size?: number;
        timestamp?: string;
    };
}

/**
 * 外部アプリからの画像共有を処理するクラス
 */
export class ShareHandler {
    // 共有画像のプロパティ
    private sharedImage: File | null = null;
    private processingSharedImage: boolean = false;

    /**
     * インスタンスを初期化
     */
    constructor() {
        this.setupServiceWorkerListeners();
    }

    /**
     * 現在処理中かどうかのステータス
     */
    public isProcessing(): boolean {
        return this.processingSharedImage;
    }

    /**
     * Service Workerからのメッセージリスナーを設定
     */
    private setupServiceWorkerListeners(): void {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", async (event) => {
                console.log("メッセージを受信:", event.data);
                if (event.data && event.data.image) {
                    // Service Workerから画像を受信
                    this.sharedImage = event.data.image;
                    if (this.sharedImage) {
                        await this.processSharedImage(this.sharedImage);
                    }
                }
            });
        }
    }

    /**
     * アプリ起動時に共有からの起動かどうかを確認し、
     * 共有画像があれば処理する
     */
    public async checkForSharedImageOnLaunch(): Promise<void> {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        if (this.checkIfOpenedFromShare()) {
            console.log("共有から開かれました、画像データを取得中...");
            this.processingSharedImage = true;

            try {
                // Service Workerからキャッシュされた画像を取得
                const sharedImageData = await this.getSharedImageFromServiceWorker();
                if (sharedImageData && sharedImageData.image) {
                    console.log(
                        "共有された画像を取得しました:",
                        sharedImageData.metadata
                    );
                    this.sharedImage = sharedImageData.image;
                    // null チェックを追加
                    if (this.sharedImage) {
                        await this.processSharedImage(this.sharedImage);
                    }
                } else {
                    console.log("共有された画像が見つかりませんでした");
                }
            } catch (error) {
                console.error("共有画像の取得中にエラーが発生しました:", error);
            } finally {
                this.processingSharedImage = false;
            }

            // URLからクエリパラメータを削除
            const url = new URL(window.location.href);
            url.search = "";
            window.history.replaceState({}, document.title, url.toString());
        }
    }

    /**
     * 共有された画像を処理する関数
     * @param image 処理する画像ファイル
     */
    public async processSharedImage(image: File): Promise<void> {
        try {
            console.log("共有画像を処理しています:", image.name);

            // タイトル入力フィールドにフォーカス
            setTimeout(() => {
                const titleInput = document.getElementById("post-title");
                if (titleInput) {
                    titleInput.focus();
                }
            }, 500);

            // ファイル選択UIに画像をセット
            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) {
                // ファイル選択要素に画像をセット
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(image);
                fileInput.files = dataTransfer.files;

                // change イベントを発火させる
                const event = new Event("change", { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        } catch (error) {
            console.error("共有画像の処理中にエラーが発生しました:", error);
        }
    }

    /**
     * URLパラメータから共有フラグを確認
     * @returns 共有からの起動かどうか
     */
    private checkIfOpenedFromShare(): boolean {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has("shared") && urlParams.get("shared") === "true";
    }

    /**
     * サービスワーカーに保存されている共有画像を取得
     * @returns 共有された画像ファイルとメタデータ、またはnull
     */
    private async getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
        // サービスワーカーがアクティブか確認
        if (!("serviceWorker" in navigator)) {
            console.log("Service Workerがサポートされていません");
            return null;
        }

        // コントローラーがなければ登録を待つ
        if (!navigator.serviceWorker.controller) {
            console.log("Service Workerコントローラーがありません、登録を待ちます");
            try {
                await new Promise<void>((resolve) => {
                    const timeout = setTimeout(() => resolve(), 3000);

                    navigator.serviceWorker.addEventListener(
                        "controllerchange",
                        () => {
                            clearTimeout(timeout);
                            resolve();
                        },
                        { once: true }
                    );
                });
            } catch (e) {
                console.error("Service Worker登録待機エラー:", e);
            }
        }

        if (!navigator.serviceWorker.controller) {
            console.log("Service Workerコントローラーが取得できませんでした");
            return null;
        }

        try {
            // 両方の方法を試す

            // 1. MessageChannelを使用する方法
            const messageChannelPromise = (async () => {
                const messageChannel = new MessageChannel();

                const promise = new Promise<SharedImageData | null>((resolve) => {
                    messageChannel.port1.onmessage = (event) => {
                        if (event.data && event.data.image) {
                            resolve({
                                image: event.data.image,
                                metadata: event.data.metadata || {},
                            });
                        } else {
                            resolve(null);
                        }
                    };
                });

                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage(
                        { action: "getSharedImage" },
                        [messageChannel.port2]
                    );
                } else {
                    // コントローラーがnullの場合はnullを返す
                    return null;
                }

                return promise;
            })();

            // 2. 通常のメッセージイベントリスナーを使用する方法
            const eventListenerPromise = (async () => {
                const promise = new Promise<SharedImageData | null>((resolve) => {
                    const handler = (event: MessageEvent) => {
                        navigator.serviceWorker.removeEventListener("message", handler);
                        if (event.data && event.data.image) {
                            resolve({
                                image: event.data.image,
                                metadata: event.data.metadata,
                            });
                        } else {
                            resolve(null);
                        }
                    };

                    navigator.serviceWorker.addEventListener("message", handler, {
                        once: true,
                    });
                });

                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        action: "getSharedImage",
                    });
                } else {
                    // コントローラーがnullの場合は何もしない
                    return null;
                }

                return promise;
            })();

            // タイムアウト設定
            const timeoutPromise = new Promise<null>((resolve) => {
                setTimeout(() => resolve(null), 5000);
            });

            // どれか一つが結果を返すのを待つ
            const result = await Promise.race([
                messageChannelPromise,
                eventListenerPromise,
                timeoutPromise,
            ]);

            return result;
        } catch (error) {
            console.error("共有画像の取得中にエラーが発生しました:", error);
            return null;
        }
    }
}
