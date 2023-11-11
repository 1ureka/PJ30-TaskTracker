// 事件偵測註冊
$(document).ready(function () {
  createYearSelect();
  initYear(); // 初始化年份

  createMonthSelect($("#year").val());
  initMonth(); // 初始化月份

  // 使清單可拖動
  new Sortable($("#task-container").get()[0], {
    animation: 150,
  });

  // 新增工作相關
  $("#add").on("click", function () {
    const { taskText, status, category } = readInput();
    addTask(taskText, status, category);
  });

  $("#task-input").on("keyup", function (e) {
    if (e.key === "Enter") {
      const { taskText, status, category } = readInput();
      addTask(taskText, status, category);
    }
  });

  // 刪除工作相關(動態)
  $(document).on("click", ".task-delete", function () {
    const taskItem = $(this).closest(".task-item");
    const separator = $(this).closest(".separator");

    if (taskItem.length > 0) {
      deleteTask(taskItem);
      console.log("刪除工作");
    } else if (separator.length > 0) {
      deleteTask(separator);
      console.log("刪除分割線");
    } else {
      console.log("找不到刪除物件");
    }
  });

  // 切換工作狀態相關(動態)
  $(document).on("change", ".task-status-options", function () {
    const taskItem = $(this).closest(".task-item");
    const value = $(this).val();
    toggleTask(taskItem, value);
  });

  // 複製內文(動態)
  $(document).on("click", ".task-copy-container", function (e) {
    const taskItem = $(this).closest(".task-item");
    copyTaskText(taskItem, e.clientX, e.clientY);
  });

  // 編輯類別(動態)
  $(document).on("change", ".task-category-select", function (e) {
    const taskItem = $(this).closest(".task-item");
    const category = $(this).val();
    taskItem.data("category", category);
  });

  // 編輯內文(動態)
  $(document).on("dblclick", ".task-text", function (e) {
    const taskItem = $(this).closest(".task-item");
    $(this).attr("contenteditable", true).addClass("editing").focus();
  });

  $(document).on("keyup", ".task-text", function (e) {
    const taskItem = $(this).closest(".task-item");
    const text = $(this).text();
    taskItem.data("text", text);
  });

  $(document).on("blur", ".task-text", function (e) {
    const taskItem = $(this).closest(".task-item");
    $(this).attr("contenteditable", false).removeClass("editing");
    const text = $(this).text();
    taskItem.data("text", text);
  });

  // 清空工作相關
  $("#cleared-check").on("click", clearTasks);

  // 搜尋/篩選功能相關
  $("#search-input").keyup(function () {
    const category = $("#filter-category").val();
    const text = $("#search-input").val();
    const searchResult = text ? searchTasks(text) : "all";
    if (text) {
      $("#search-erase-container").show(500);
    } else {
      $("#search-erase-container").hide(500);
    }
    filterTasks(category, searchResult);
  });

  $("#search-erase-container").click(function () {
    $("#search-input").val("");
    const category = $("#filter-category").val();
    const searchResult = "all";
    $("#search-erase-container").hide(500);
    filterTasks(category, searchResult);
  });

  $("#filter-category").change(function () {
    const category = $("#filter-category").val();
    const text = $("#search-input").val();
    const searchResult = text ? searchTasks(text) : "all";
    filterTasks(category, searchResult);
  });

  // 存檔工作相關
  $("#save").on("click", function () {
    const jsonData = domToJSON();
    const save = jsonToSave(jsonData, getDate());
    downloadJSON(save);
  });

  // 上傳工作相關
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
      } catch (error) {
        alert("錯誤：JSON 解析失敗。");
      }
    };

    // 清空文件输入元素的值，以便允许相同文件的變化
    $("#file-input").val("");

    // 開始讀取所選文件的内容
    reader.readAsText(file);
  });

  // 監聽年份選擇改變事件
  $("#year").on("change", function () {
    // 根據年份初始化月份
    createMonthSelect($(this).val());

    // 存檔
    const tasksToSave = domToJSON();
    const save = jsonToSave(tasksToSave, localStorage.getItem("date"));
    localStorage.setItem("tasks", save);

    // 讀取
    const tasksToUpdate = saveToJSON(localStorage.getItem("tasks"), getDate());
    console.log(`讀取: ${tasksToUpdate}`);

    if (tasksToUpdate) {
      jsonToDOM(tasksToUpdate);
    } else {
      clearTasks();
    }

    localStorage.setItem("date", getDate());
  });

  // 監聽月份選擇改變事件
  $("#month").on("change", function () {
    // 存檔
    const tasksToSave = domToJSON();
    const save = jsonToSave(tasksToSave, localStorage.getItem("date"));
    localStorage.setItem("tasks", save);

    // 讀取
    const tasksToUpdate = saveToJSON(localStorage.getItem("tasks"), getDate());
    console.log(`讀取: ${tasksToUpdate}`);

    if (tasksToUpdate) {
      jsonToDOM(tasksToUpdate);
    } else {
      clearTasks();
    }

    localStorage.setItem("date", getDate());
  });

  // 開啟/關閉頁面相關
  $(window).on("beforeunload", function (e) {
    if ($("#task-container .task-item").length > 0) {
      return "未保存的資料將會遺失，確定要離開頁面嗎？";
    }
  });
});
