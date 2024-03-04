/**
 * Save 類別用於處理保存、檢查更改狀態並提供頁面離開確認功能。
 * @class
 */
class Save {
  /**
   * Save 類別的建構子。
   * @constructor
   */
  constructor() {
    /** 原始保存的數據。 @type {Object} @private */
    this._originalSave = {};
    /** 當前保存的數據。 @type {Object} @private */
    this._currentSave = {};

    // 初始化保存數據
    this._initSave();

    /** 頁面標題的原始值。 @type {string} @private */
    this._title = document.title;
    this._isRegister = false;
    this._isChanged = false;

    /** beforeunload 事件處理函數 @param {Event} event */
    this._handler = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };
  }

  /**
   * 私有方法，用於初始化保存數據。
   * @private
   */
  _initSave() {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - 2019 },
      (_, index) => 2020 + index
    );

    const keys = years
      .map((year) => {
        const endMonth = year === currentYear ? new Date().getMonth() + 1 : 12;

        return Array.from(
          { length: endMonth },
          (_, index) => `${year}-${(index + 1).toString().padStart(2, "0")}`
        );
      })
      .flat();

    keys.push("0000-00");
    keys.push("1111-11");

    keys.forEach((key) => {
      this._originalSave[key] = [];
      this._currentSave[key] = [];
    });
  }

  /**
   * 私有方法，用於添加頁面離開確認。
   * @private
   */
  _addConfirmation() {
    if (this._isRegister) return;

    window.addEventListener("beforeunload", this._handler);
    this._isRegister = true;
  }

  /**
   * 私有方法，用於移除頁面離開確認。
   * @private
   */
  _removeConfirmation() {
    if (!this._isRegister) return;

    window.removeEventListener("beforeunload", this._handler);
    this._isRegister = false;
  }

  /**
   * 更新原始保存數據，標記更改狀態為未更改。
   */
  update() {
    this._originalSave = lodash.cloneDeep(this._currentSave);
    this.isChanged = false;
  }

  /**
   * 設置指定日期的保存數據。
   * @param {string} date - 日期字符串。
   * @param {Array} list - 要保存的列表數據。
   * @param {boolean} isInit - 是否為初始化。
   * @returns {Save} - Save 類別的實例。
   */
  set(date, list, isInit = false) {
    this._currentSave[date] = list;

    if (isInit) {
      this.update();
    }

    if (lodash.isEqual(this._currentSave, this._originalSave)) {
      this.isChanged = false;
    } else {
      this.isChanged = true;
    }

    return this;
  }

  /**
   * 獲取指定日期的保存數據或全部保存數據。
   * @param {string} [date="0"] - 日期字符串。如果為 "0"，則返回全部保存數據。
   * @returns {Object|Array} - 保存數據對象或列表數據。
   */
  get(date = "0") {
    if (date === "0") return this._currentSave;

    return this._currentSave[date];
  }

  /**
   * 設置是否有未保存的更改。
   * @param {boolean} value - 是否有未保存的更改。
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
      this._addConfirmation();
      document.title = "*" + this._title;
    } else {
      this._removeConfirmation();
      document.title = this._title;
    }
  }

  /**
   * 獲取是否有未保存的更改。
   * @returns {boolean} - 是否有未保存的更改。
   */
  get isChanged() {
    return this._isChanged;
  }
}

/**
 * 延遲執行的 Promise 函式，用於等待一定的時間。
 * @param {number} ms - 要延遲的時間（毫秒）。
 * @returns {Promise<void>} 一個 Promise，在指定時間後被解析。
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 如果本地存儲中存在日期，則返回存儲的日期；否則，返回當前年份和月份的組合，格式為 'YYYY-MM'。
 * @returns {string} 初始日期，格式為 'YYYY-MM'。
 */
function initDate() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthString = currentMonth.toString().padStart(2, "0");

  return localStorage.getItem("date") || `${currentYear}-${monthString}`;
}

/**
 * 用於判斷YYYY-MM是否為當前日期。
 * @param {string} dateString
 * @returns {boolean}
 */
function isCurrentMonth(dateString) {
  const inputDate = new Date(dateString + "-01"); // 添加 "-01" 表示日期為該月的第一天
  const currentDate = new Date();

  return (
    inputDate.getFullYear() === currentDate.getFullYear() &&
    inputDate.getMonth() === currentDate.getMonth()
  );
}

/**
 * 格式化瀏覽器紀錄之時間資訊，若無則回傳null
 * @returns {{year: string; month: string;} | null}
 */
function formatLocalStorageDate() {
  if (!localStorage.getItem("date")) return null;

  const dateString = localStorage.getItem("date");
  const [year, month] = dateString.split("-");
  return { year, month };
}

/**
 * 找到"U"工作狀態的第一個匹配工作指標
 * @returns {{index: number, taskTop: number}} - 第一個未完成工作的指標，若沒找到則返回-1
 */
function findFirstUnfinished(list) {
  const tasks = list.filter((element) => element.type !== "separator");

  if (tasks.length === 0) return { index: -1, taskTop: 0 };

  let low = 0;
  let high = tasks.length - 1;
  let index = -1;
  let skip = 0;

  while (low <= high) {
    const mid = skip
      ? Math.floor((low + high) / 2) + skip
      : Math.floor((low + high) / 2);
    const status = tasks[mid].status;

    if (status === "U") {
      // 如果中間位置對應的工作是未完成的，更新結果指標，並縮小搜索範圍到前半部分
      index = mid;
      high = mid - 1;
      skip = 0;
    } else if (status === "O" || status === "F") {
      // 如果中間位置對應的工作是已完成或失敗的，縮小搜索範圍到後半部分
      low = mid + 1;
      skip = 0;
    } else {
      // 如果中間位置對應的工作是跳過的，無法得知任何訊息，移動中間值
      skip += 1;
    }
  }

  const tasksElements = $("#tasks-container > .task-container");
  const height = tasksElements.eq(index).position().top;
  const windowHeight = window.innerHeight / 2;
  const taskTop = height - windowHeight;

  return { index, taskTop };
}

/**
 * 用於驗證身份，自動從session拿取資料
 * @returns {Promise<boolean>} 驗證是否通過
 */
async function checkInfo() {
  const username = sessionStorage.getItem("username");
  const password = sessionStorage.getItem("password");

  if (!username || !password) return false;

  window.dispatchEvent(new Event("check"));

  const result = await new Promise((resolve) =>
    window.addEventListener("checkedResult", (e) => resolve(e.detail.result), {
      once: true,
    })
  );

  return result;
}

/**
 * 上傳具有指定編碼的文件至指定路徑。
 * @param {string} file - 文件內容的 Base64 編碼。
 * @param {string} path - 欲上傳的路徑。
 * @param {string} [message="Upload file"] - 上傳的提交訊息。
 * @returns {Promise<void>} 當上傳完成時解析的 Promise。
 */
async function uploadFile(file, path, message = "Upload file") {
  const currentDate = new Date().toISOString().split("T")[0];
  message += ` ${currentDate}`;

  const detail = { file, path, message };
  window.dispatchEvent(new CustomEvent("uploadFile", { detail }));

  await new Promise((resolve) => {
    window.addEventListener("uploadFileComplete", resolve, {
      once: true,
    });
  });
}

/**
 * 加載指定路徑的文件。
 * @param {string} path - 文件的路徑。
 * @returns {Promise<string>} 包含文件內容編碼而成的Base64的 Promise。
 */
async function loadFile(path) {
  const detail = { path };
  window.dispatchEvent(new CustomEvent("loadFile", { detail }));

  const { content } = await new Promise((resolve) => {
    window.addEventListener("loadFileComplete", (e) => resolve(e.detail), {
      once: true,
    });
  });

  return content;
}

/**
 * 將字符串轉換為 Base64 編碼。
 * @param {string} str - 要進行編碼的字符串。
 * @returns {string} - 返回 Base64 編碼的結果。
 */
function stringToBase64(str) {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(str);
  return btoa(String.fromCharCode.apply(null, utf8Bytes));
}

/**
 * 將 Base64 編碼的字符串轉換為原始字符串。
 * @param {string} encodedStr - 要進行解碼的 Base64 編碼字符串。
 * @returns {string} - 返回解碼後的原始字符串。
 */
function base64ToString(encodedStr) {
  const decoder = new TextDecoder();
  const utf8Bytes = new Uint8Array(
    atob(encodedStr)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  return decoder.decode(utf8Bytes);
}
