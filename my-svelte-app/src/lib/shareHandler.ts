import { FileUploadManager } from './fileUploadManager';

/**
 * 外部アプリからの共有画像を処理するハンドラークラス
 */
export class ShareHandler {
  private isProcessingSharedImage: boolean = false;
  private sharedImageFile: File | null = null;
  private sharedImageMetadata: any = null;

  constructor() {
    // サービスワーカーからのメッセージをリッスン
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));
      console.log('ShareHandler: サービスワーカーのメッセージリスナーを設定しました');
    }
  }

  /**
   * サービスワーカーからのメッセージを処理
   */
  private async handleServiceWorkerMessage(event: MessageEvent): Promise<void> {
    console.log('ShareHandler: メッセージ受信', event.data);

    // 共有画像データを含むメッセージかチェック
    if (event.data && event.data.type === 'SHARED_IMAGE' && event.data.data) {
      console.log('ShareHandler: 共有画像データを受信しました');
      const sharedData = event.data.data;

      if (sharedData.image) {
        this.isProcessingSharedImage = true;
        this.sharedImageFile = sharedData.image;
        this.sharedImageMetadata = sharedData.metadata;

        try {
          // 受信した画像を処理 (カスタムイベントとして発火)
          const sharedImageEvent = new CustomEvent('shared-image-received', {
            detail: {
              file: this.sharedImageFile,
              metadata: this.sharedImageMetadata
            }
          });
          
          window.dispatchEvent(sharedImageEvent);
          console.log('ShareHandler: shared-image-receivedイベントを発行しました');
        } catch (error) {
          console.error('ShareHandler: 画像処理エラー', error);
        } finally {
          this.isProcessingSharedImage = false;
        }
      }
    }
  }

  /**
   * アプリ起動時に共有された画像をチェック
   */
  public async checkForSharedImageOnLaunch(): Promise<void> {
    console.log('ShareHandler: 起動時の共有画像チェック');
    
    // URLパラメータで共有から起動されたかチェック
    if (FileUploadManager.checkIfOpenedFromShare()) {
      console.log('ShareHandler: 共有から起動されました');
      this.isProcessingSharedImage = true;
      
      try {
        // サービスワーカーから共有画像を取得
        const sharedImageData = await FileUploadManager.getSharedImageFromServiceWorker();
        
        if (sharedImageData && sharedImageData.image) {
          console.log('ShareHandler: サービスワーカーから画像を取得しました', 
            sharedImageData.image.name,
            `${Math.round(sharedImageData.image.size / 1024)}KB`
          );
          
          this.sharedImageFile = sharedImageData.image;
          this.sharedImageMetadata = sharedImageData.metadata;
          
          // カスタムイベントとして発火
          const sharedImageEvent = new CustomEvent('shared-image-received', {
            detail: {
              file: this.sharedImageFile,
              metadata: this.sharedImageMetadata
            }
          });
          
          window.dispatchEvent(sharedImageEvent);
          console.log('ShareHandler: shared-image-receivedイベントを発行しました');
        } else {
          console.log('ShareHandler: 共有画像が見つかりませんでした');
        }
      } catch (error) {
        console.error('ShareHandler: 共有画像取得エラー', error);
      } finally {
        this.isProcessingSharedImage = false;
      }
    }
  }

  /**
   * 処理中かどうかを返す
   */
  public isProcessing(): boolean {
    return this.isProcessingSharedImage;
  }

  /**
   * 共有された画像ファイルを返す
   */
  public getSharedImageFile(): File | null {
    return this.sharedImageFile;
  }
}

/**
 * SharedImageData型の定義（必要に応じて調整してください）
 */
export interface SharedImageData {
    image: File;
    metadata?: any;
}

/**
 * URLパラメータから共有フラグを確認
 * @returns 共有からの起動かどうか
 */
export function checkIfOpenedFromShare(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("shared") && urlParams.get("shared") === "true";
}

/**
 * サービスワーカーに保存されている共有画像を取得
 * @returns 共有された画像ファイルとメタデータ、またはnull
 */
export async function getSharedImageFromServiceWorker(): Promise<SharedImageData | null> {
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

    try {
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
