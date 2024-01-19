// test: [k'j(b'j)k"506"]
// 可能的新功能：新增按下tab可以新增4個空格
// 已知的問題：Crtl+Z無法復原
class TextEditor {
  /**
   * TextEditor類別的建構子，初始化TextEditor實例的屬性。
   * @param {JQuery} element - 用於操作的 jQuery 物件。
   * @param {Object} config - 用於配置的物件。
   * @param {number} config.delay - 操作的節流延遲時間（以毫秒為單位）。
   */
  constructor(element, config) {
    /** @type {JQuery} */
    this.element = element;
    this.selectedText = "";
    this.deletedText = "";
    this.delay = config.delay;
    // 記錄上一次執行每個方法的時間戳
    this.lastTime = {
      getSelection: 0,
      gstDeletion: 0,
      autoCompleteBrackets: 0,
      autoDeleteBrackets: 0,
    };
    // 節流函數，用於確保某個方法在一定時間內只執行一次
    this.throttle = (id) => {
      const now = new Date().getTime();
      // 如果距離上一次執行的時間小於節流延遲，返回 true，表示需要節流
      if (now - this.lastTime[id] <= this.delay) return true;

      // 更新上一次執行的時間戳，返回 false，表示不需要節流
      this.lastTime[id] = now;
      return false;
    };
  }

  /**
   * 設置元素的值為指定文本。
   * @param {string} text - 要設置的文本。
   */
  setText(text) {
    return this.element.val(text);
  }

  /**
   * 獲取元素的當前文本值。
   * @returns {string} - 元素的當前文本值。
   */
  getText() {
    return this.element.val();
  }

  /**
   * 獲取元素選擇區域的起始位置。
   * @returns {number} - 選擇區域的起始位置。
   */
  getSelectionStart() {
    return this.element[0].selectionStart;
  }

  /**
   * 獲取元素選擇區域的結束位置。
   * @returns {number} - 選擇區域的結束位置。
   */
  getSelectionEnd() {
    return this.element[0].selectionEnd;
  }

  /**
   * 獲取元素中選中的文本。
   * 如果在一定時間內重複調用，會被節流。
   */
  getSelection() {
    // 如果該方法被節流（throttle），則中止執行
    if (this.throttle("getSelection")) return;

    // 獲取選擇區域的起始和結束位置
    const start = this.getSelectionStart();
    const end = this.getSelectionEnd();

    // 根據選擇區域的位置獲取選中的文本
    this.selectedText = this.getText().substring(start, end);
  }

  /**
   * 處理文本區域的刪除操作，並記錄被刪除的文本。
   * 如果在一定時間內重複調用，會被節流。
   */
  gstDeletion() {
    // 如果該方法被節流（throttle），則中止執行
    if (this.throttle("gstDeletion")) return;

    // 獲取選擇區域的起始和結束位置
    const start = this.getSelectionStart();
    const end = this.getSelectionEnd();

    // 檢查是否有選擇的文本，如果有，記錄被刪除的文本
    if (end - start > 0) {
      this.deletedText = this.getText().substring(start, end);
      return;
    }

    // 如果沒有選擇文本，則記錄起始位置前一個字符作為被刪除的文本
    this.deletedText = this.getText().substring(start - 1, end);
  }

  /**
   * 過濾字符陣列，刪除與給定字符相同的字符。
   * 如果字符對相同，則保留第一個字符，刪除其餘相同字符。
   * @param {string[]} arr - 要過濾的字符陣列。
   * @param {Object.<string, string>} ruleSet - 一個包含字符對應的括號的物件。
   * @static
   */
  static filterKeys(arr, ruleSet) {
    $.map(ruleSet, function (value, key) {
      if (value === key) {
        TextEditor.filterQuotes(arr, key);
      } else {
        TextEditor.filterPairs(arr, key, value);
      }
    });
  }

  /**
   * 過濾字符陣列，刪除與指定引號相同的字符。
   * 如果堆疊中已經有一個開始的引號，則刪除該引號對及堆疊中的引號。
   * @param {string[]} arr - 要過濾的字符陣列。
   * @param {string} symbol - 要過濾的引號字符。
   * @static
   */
  static filterQuotes(arr, symbol) {
    const stack = [];
    let index = 0;

    for (const char of arr) {
      if (char === symbol) {
        // 遇到引號，判斷堆疊是否為空
        if (stack.length === 0) {
          stack.push(index); // 將引號的指標加入堆疊
        } else {
          // 堆疊不為空，表示已經有一個開始的引號，刪除引號對及堆疊中的引號
          const prevIndex = stack[0];
          arr[prevIndex] = "";
          arr[index] = "";
          stack.pop();
        }
      }
      index += 1;
    }
  }

  /**
   * 過濾字符陣列，刪除成對的括號字符。
   * @param {string[]} arr - 要過濾的字符陣列。
   * @param {string} pair1 - 左括號字符。
   * @param {string} pair2 - 右括號字符。
   * @static
   */
  static filterPairs(arr, pair1, pair2) {
    const stack = [];
    let index = 0;

    for (const char of arr) {
      if (char === pair1) {
        // 遇到左括號，將其指針加入堆疊
        stack.push(index);
      } else if (char === pair2) {
        // 遇到右括號，如果堆疊不為空，表示有成對的括號，將其刪除
        if (stack.length > 0) {
          const prevIndex = stack[0];
          arr[prevIndex] = "";
          arr[index] = "";
          stack.pop();
        }
      }
      index += 1;
    }
  }

  /**
   * 自動補全括號，根據提供的規則集。
   * 如果在一定時間內重複調用，會被節流。
   * @param {Object.<string, string>} ruleSet - 一個包含字符對應的括號的物件。
   */
  autoCompleteBrackets(ruleSet) {
    // 如果該方法被節流（throttle），則中止執行
    if (this.throttle("autoCompleteBrackets")) return;

    // 獲取選擇區域的起始和結束位置，以及當前文本值
    const start = this.getSelectionStart();
    const end = this.getSelectionEnd();
    const value = this.getText();

    // 獲取選中區域前一個字符
    const key = value.charAt(start - 1);

    // 如果規則集中包含這個字符，則補全括號
    if (ruleSet.hasOwnProperty(key)) {
      this.element.val(
        value.substring(0, start) +
          this.selectedText +
          ruleSet[key] +
          value.substring(end)
      );
      // 向後退一格
      this.element[0].setSelectionRange(start, start);
    }
  }

  /**
   * 在文本中尋找第一個指定符號的索引。
   * @param {string} symbol - 要尋找的符號。
   * @returns {number} - 如果找到符號，則返回該符號在文本中的索引；如果找不到，則返回 -1。
   */
  findFirstBracket(symbol) {
    // 獲取當前文本
    const text = this.getText();
    // 從目前選擇的位置開始，截取剩餘的文本
    const substring = text.slice(this.getSelectionEnd());
    // 在剩餘文本中查找符號的索引，並加上選擇的起始位置
    const index = substring.indexOf(symbol) + this.getSelectionEnd();

    // 保險機制：確認找到的索引處的字符是否為指定的符號
    if (this.getText()[index] !== symbol) {
      console.log(
        `錯誤：符號(${symbol})不相同，${this.getText()}的第${index}是${
          this.getText()[index]
        }`
      );
      return -1;
    }

    // 如果在剩餘文本中找到符號，返回索引；否則返回 -1
    return substring.indexOf(symbol) !== -1 ? index : -1;
  }

  /**
   * 自動刪除符合規則集中的字符對應的括號。
   * 這個方法會檢查刪除的文本，將其中與規則集中字符對應的括號進行自動刪除。
   * @param {Object.<string, string>} ruleSet - 一個物件，包含要刪除的字符和其對應的括號。
   */
  autoDeleteBrackets(ruleSet) {
    // 如果該方法被節流（throttle），則中止執行
    if (this.throttle("autoDeleteBrackets")) return;

    // 將已刪除的文本拆分為字符陣列
    let characters = this.deletedText.split("");
    // 使用提供的規則集過濾字符陣列
    TextEditor.filterKeys(characters, ruleSet);

    // 過濾成要刪除的字符的陣列
    const deletedKeys = [];
    characters.forEach((char, index) => {
      // 如果字符不在規則集中，則跳過(過濾掉)
      if (!(char in ruleSet)) return;
      deletedKeys.push(char);
    });

    // 如果沒有要刪除的字符，則中止執行
    if (deletedKeys.length === 0) return;

    // 反向遍歷要刪除的字符，找到它們對應的括號的位置
    deletedKeys.reverse().forEach((symbol) => {
      const index = this.findFirstBracket(ruleSet[symbol]);
      // 如果找不到括號的索引，則跳過
      if (index === -1) return;

      // 獲取字串並返回刪除後的字串
      const text =
        this.getText().slice(0, index) + this.getText().slice(index + 1);

      // 獲取選擇區域在刪除前的起始位置
      const start = this.getSelectionStart();

      // 將刪除後的字串指派回去，並且移動指標
      this.setText(text);
      this.element[0].setSelectionRange(start, start);
    });
  }

  /**
   * 啟動文本編輯器的事件處理。
   * @param {Object.<string, string>} ruleSet - 一個包含字符對應的括號的物件。
   */
  start(ruleSet) {
    // 綁定 keydown 事件，以獲取選擇區域
    this.element.on("keydown", () => {
      this.getSelection();
    });

    // 綁定 keydown 事件，以在 Backspace 鍵時獲取刪除區域
    this.element.on("keydown", (e) => {
      if (e.key !== "Backspace") return;
      this.gstDeletion();
    });

    // 綁定 keyup 事件，以處理特定字符的自動補全括號
    this.element.on("keyup", (e) => {
      if (!(e.key in ruleSet)) return;
      this.autoCompleteBrackets(ruleSet);
    });

    // 綁定 keyup 事件，以處理 Backspace 鍵的自動刪除括號
    this.element.on("keyup", (e) => {
      if (e.key !== "Backspace") return;
      this.autoDeleteBrackets(ruleSet);
    });
  }

  /**
   * 清除綁定在該元素的TextEditor實例
   */
  destroy() {
    // 解除事件綁定
    this.element.off("keydown");
    this.element.off("keyup");

    // 將實例屬性設置為 null
    this.element = null;
    this.selectedText = null;
    this.deletedText = null;
    this.delay = null;
    this.lastTime = null;
    this.throttle = null;
  }
}

class Save {
  constructor() {
    this._originalSave = {};
    this._currentSave = {};

    this._initSave();

    this._title = document.title;
    this._isRegister = false;
    this._isChanged = false;

    /** beforeunload 事件處理函數 @param {Event} event */
    this._handler = (event) => {
      event.preventDefault();
      event.returnValue = true;
    };
  }

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

    keys.forEach((key) => {
      this._originalSave[key] = [];
      this._currentSave[key] = [];
    });
  }

  _addConfirmation() {
    if (this._isRegister) return;

    window.addEventListener("beforeunload", this._handler);
    this._isRegister = true;
  }

  _removeConfirmation() {
    if (!this._isRegister) return;

    window.removeEventListener("beforeunload", this._handler);
    this._isRegister = false;
  }

  update() {
    this._originalSave = lodash.cloneDeep(this._currentSave);
    this.isChanged = false;
  }

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

  get(date = "0") {
    if (date === "0") return this._currentSave;

    return this._currentSave[date];
  }

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
