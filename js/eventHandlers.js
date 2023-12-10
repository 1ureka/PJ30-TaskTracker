$(document).ready(function () {
  //
  //
  // 初始化時間選擇
  //
  //
  createYearSelect();
  initYear(); // 初始化年份

  createMonthSelect($("#year").val());
  initMonth(); // 初始化月份

  //
  // 左側選單上方
  // 新增工作
  //
  //
  // 新增按鈕
  $("#add").on("click", function () {
    const { taskText, status, category } = readInput();
    addTempTask(taskText, status, category);
  });

  //
  // 工作欄選單
  // 編輯工作#1
  //
  //
  // 刪除按鈕(動態) (流程在觸發過場至刪除頁面後)
  $(document).on("click", ".task-delete", function () {
    const taskItem = $(this).closest(".task-item");
    const separator = $(this).closest(".separator");

    if (taskItem.length > 0) {
      deleteTask(taskItem);
      console.log("刪除工作");
      saveStatus.isChanged = true;
    } else if (separator.length > 0) {
      deleteTask(separator);
      console.log("刪除分割線");
      saveStatus.isChanged = true;
    } else {
      console.log("找不到刪除物件");
    }
  });

  // 切換狀態(動態)
  $(document).on("change", ".task-status-options", function () {
    const taskItem = $(this).closest(".task-item");
    const value = $(this).val();
    toggleTask(taskItem, value);
    saveStatus.isChanged = true;
  });

  // 複製內文(動態)
  $(document).on("click", ".task-copy-container", function (e) {
    const taskItem = $(this).closest(".task-item");
    copyTaskText(taskItem, e.clientX, e.clientY);
  });

  //
  // 工作欄編輯
  // 編輯工作#2
  //
  //
  // 編輯類別(動態)
  $(document).on("change", ".task-category-select", function (e) {
    const taskItem = $(this).closest(".task-item");
    const category = $(this).val();
    taskItem.data("category", category);
    saveStatus.isChanged = true;
  });

  // 編輯內文(動態)
  /** @type {TextEditor | null} */
  let textEditor;

  $(document).on("dblclick", ".task-text", function (e) {
    // 避免重複雙擊事件發生
    if ($(this).is("textarea")) return;

    // 創建一個 textarea 元素
    const textarea = $("<textarea></textarea>")
      .val($(this).text())
      .attr("class", $(this).attr("class"))
      .css("width", $(this).width())
      .css("height", $(this).height() + 30);

    // 為該 textarea 元素新增 TextEditor 實例
    textEditor = new TextEditor(textarea, { delay: 10 });
    textEditor.start({
      "(": ")",
      "[": "]",
      "{": "}",
      "<": ">",
      '"': '"',
      "'": "'",
    });

    // 替換 p 元素為 textarea
    $(this).replaceWith(textarea);

    // 讓 textarea 獲取焦點
    textarea.focus();
  });

  $(document).on("keyup", ".task-text", function (e) {
    const taskItem = $(this).closest(".task-item");
    const text = $(this).val();
    taskItem.data("text", text);
    saveStatus.isChanged = true;
  });

  $(document).on("blur", ".task-text", function (e) {
    // 清除 TextEditor 實例
    console.log(
      `刪除${textEditor.element
        .closest(".task-item")
        .index()}的 TextEditor 實例`
    );
    textEditor.destroy();
    textEditor = null;

    const taskItem = $(this).closest(".task-item");
    const text = $(this).val();
    taskItem.data("text", text);

    // 創建一個 p 元素
    const p = $("<p></p>").text(text).attr("class", $(this).attr("class"));

    // 替換 textarea 元素為 p
    $(this).replaceWith(p);
    saveStatus.isChanged = true;
  });

  //
  // 左側選單下方
  // 清單操作
  //
  //
  // 清空按鈕
  $("#cleared-check").on("click", () => {
    clearTasks();
    saveStatus.isChanged = true;
  });

  // 存檔按鈕
  $("#save").on("click", function () {
    const jsonData = domToJSON();
    const save = jsonToSave(jsonData, getDate());
    downloadJSON(save);
    saveStatus.isChanged = false;
  });
  Mousetrap.bind("ctrl+s", function () {
    const jsonData = domToJSON();
    const save = jsonToSave(jsonData, getDate());
    downloadJSON(save);
    saveStatus.isChanged = false;
    return false;
  });

  // 上傳按鈕
  $("#upload").on("click", function () {
    $("#file-input").click();
  });

  $("#file-input").on("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        localStorage.setItem("tasks", e.target.result);
        const save = saveToJSON(e.target.result, getDate());
        jsonToDOM(save);
        saveStatus.isChanged = false;
      } catch (error) {
        alert("錯誤：JSON 解析失敗。");
      }
    };

    // 清空文件输入元素的值，以便允许相同文件的變化
    $("#file-input").val("");

    // 開始讀取所選文件的内容
    reader.readAsText(file);
  });

  //
  // 上方選單
  // 過濾工作
  //
  //
  // 搜尋/篩選功能
  $("#search-input").keyup(function () {
    const category = $("#filter-select").val();
    const text = $("#search-input").val();
    const searchResult = text ? searchTasks(text) : "all";
    if (text) {
      $("#search-erase-container").show(500);
    } else {
      $("#search-erase-container").hide(500);
    }
    filterTasks(category, searchResult);
  });

  $("#filter-select").change(function () {
    const category = $("#filter-select").val();
    const text = $("#search-input").val();
    const searchResult = text ? searchTasks(text) : "all";
    filterTasks(category, searchResult);
  });

  // 清空搜索欄按鈕
  $("#search-erase-container").click(function () {
    $("#search-input").val("");
    const category = $("#filter-select").val();
    const searchResult = "all";
    $("#search-erase-container").hide(500);
    filterTasks(category, searchResult);
  });

  //
  // 日期選單
  // 分類工作清單
  //
  //
  // 監聽年份選擇改變事件
  $("#year").on("change", function () {
    // 根據年份初始化月份
    createMonthSelect($(this).val());

    changeDOM(localStorage.getItem("date"), getDate());
  });

  // 監聽月份選擇改變事件
  $("#month").on("change", function () {
    changeDOM(localStorage.getItem("date"), getDate());
  });

  //
  //
  // 上下按鈕
  //
  //
  // 向下按鈕
  $("#down-btn").on("click", function () {
    const tasksContainer = $("#task-container");
    const duration = 500;

    const index = findFirstUnfinished();

    if (index === -1) {
      // 若index === -1，代表沒有找到目標工作或是清單為空，則滑動至底部
      const targetTop = tasksContainer.height();
      $("#task-container-scroller").animate({ scrollTop: targetTop }, duration);
    } else {
      const tolerance = window.innerHeight / 2.5;
      const currentTop = $("#task-container-scroller").scrollTop();
      const taskTop = getTaskTop(index);

      // 根據容許值判斷現在畫面是否已在目標工作項目
      const isAtTask = Math.abs(currentTop - taskTop) <= tolerance;

      // 判斷是否要滑動至底部 (目前畫面是否已在目標工作項目範圍 或是 下方)
      const isGoingToBottom = isAtTask || currentTop > taskTop;
      const targetTop = isGoingToBottom ? tasksContainer.height() : taskTop;

      $("#task-container-scroller").animate({ scrollTop: targetTop }, duration);

      console.log(
        `按下時高度為${currentTop}，滑動至${targetTop}，容許值為${tolerance}`
      );
    }
  });

  // 向上按鈕
  $("#up-btn").on("click", function () {
    const duration = 500;

    const index = findFirstUnfinished();

    if (index === -1) {
      // 若index === -1，代表沒有找到目標工作或是清單為空，則滑動至頂部
      const targetTop = 0;
      $("#task-container-scroller").animate({ scrollTop: targetTop }, duration);
    } else {
      const tolerance = window.innerHeight / 2.5;
      const currentTop = $("#task-container-scroller").scrollTop();
      const taskTop = getTaskTop(index);

      // 根據容許值判斷現在畫面是否已在目標工作項目
      const isAtTask = Math.abs(currentTop - taskTop) <= tolerance;

      // 判斷是否要滑動至頂部 (目前畫面是否已在目標工作項目範圍 或是 上方)
      const isGoingToBottom = isAtTask || currentTop < taskTop;
      const targetTop = isGoingToBottom ? 0 : taskTop;

      $("#task-container-scroller").animate({ scrollTop: targetTop }, duration);

      console.log(
        `按下時高度為${currentTop}，滑動至${targetTop}，容許值為${tolerance}`
      );
    }
  });
});
