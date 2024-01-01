/**
 * 作為整個網頁生命週期的保存狀態的管理
 */
class SaveStatus {
  constructor() {
    /** @type {string} */
    this.title = document.title;
    this.isRegister = false;
    /** @type {boolean} 只做為內部使用 */
    this._isChanged = false;

    /**
     * beforeunload 事件處理函數
     * @param {Event} event
     */
    this.handler = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };
  }

  /**
   * 新增離開網頁前提醒
   */
  addConfirmation() {
    if (this.isRegister) return;

    window.addEventListener("beforeunload", this.handler);
    this.isRegister = true;
  }

  /**
   * 刪除離開網頁前提醒
   */
  removeConfirmation() {
    if (!this.isRegister) return;

    window.removeEventListener("beforeunload", this.handler);
    this.isRegister = false;
  }

  /**
   * 更新保存狀態
   */
  set isChanged(value) {
    if (typeof value !== "boolean") {
      console.log("錯誤：isChanged應該要是布林值");
      return;
    }
    // 若沒有更改則不執行
    if (value === this._isChanged) return;

    this._isChanged = value;

    if (this._isChanged) {
      this.addConfirmation();
      document.title = "*" + this.title;
    } else {
      this.removeConfirmation();
      document.title = this.title;
    }
  }

  get isChanged() {
    return this._isChanged;
  }
}

const saveStatus = new SaveStatus();
