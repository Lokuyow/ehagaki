import { i as r, f8 as t, f7 as e } from "./App-qNXS1jWJ.js";
class a {
  constructor(s, o = r) {
    this.isUploadAborted = o, this.context = s;
  }
  onProgress;
  context;
  /**
   * 進捗コールバックを設定
   */
  setProgressCallback(s) {
    this.onProgress = s;
  }
  /**
   * 中止フラグをチェック
   */
  checkAbort(s) {
    return t(s, this.context, this.onProgress, this.isUploadAborted);
  }
  isAborted() {
    return this.isUploadAborted();
  }
  /**
   * 進捗をリセット
   */
  resetProgress() {
    this.onProgress && this.onProgress(0);
  }
  /**
   * 進捗を更新
   */
  updateProgress(s) {
    this.onProgress && this.onProgress(Math.round(s));
  }
  /**
   * ログ出力
   */
  log(...s) {
    e(this.context, ...s);
  }
}
export {
  a as B
};
