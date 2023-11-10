/**
 * 讀取輸入並返回任務信息。
 * @returns {{ taskText: string, status: string, category: string }}
 */
function readInput() {
  const taskText = $("#task-input").val();
  const status = "U";
  const category = $("#category").val();

  // 讀取完成後清空輸入
  $("#task-input").val("");

  return { taskText, status, category };
}

/**
 * 添加任務到任務容器中。
 * @param {string} taskText - 任務文本
 * @param {string} status - 任務狀態
 * @param {string} category - 任務類別
 */
function addTask(taskText, status, category) {
  if (taskText === "--") {
    addSeparator();
  } else if (taskText !== "") {
    const taskItem = createTaskItem(taskText, status, category);
    $("#task-container").append(taskItem);
    taskItem.show(500);
  }
}

/**
 * 添加分隔符到任務容器中。
 */
function addSeparator() {
  const separator = $("<div>").addClass("separator");

  separator.hide();
  separator.addDeleteButton();

  $("#task-container").append(separator);
  separator.show(500);
}

/**
 * 創建任務項目。
 * @param {string} taskText - 任務文本
 * @param {string} status - 任務狀態
 * @param {string} category - 任務類別
 * @returns {JQuery}
 */
function createTaskItem(taskText, status, category) {
  const taskItem = $("<div>")
    .addClass("task-item")
    .data("text", taskText)
    .data("status", status)
    .data("category", category);

  taskItem.hide();

  taskItem
    .addDeleteButton()
    .addContent(taskText, category)
    .addTaskFunctions(status);

  return taskItem;
}

/**
 * 添加刪除按鈕到元素中。
 * @returns {JQuery}
 */
$.fn.addDeleteButton = function () {
  const btn = $("<button>").addClass("task-delete").text("X").appendTo(this);
  gsap.set(btn, { autoAlpha: 0 });
  return this;
};

/**
 * 設定類別字顏色
 * @param {string} category
 * @returns {JQuery}
 */
$.fn.setCategoryColor = function (category) {
  const colorMap = {
    未分類: "#bbb",
    PJ24: "#ffff7a",
    PJ25: "#8ce197",
    PJ26: "#8ce197",
    PJ27: "#92e9ff",
    PJ28: "#92e9ff",
    PJ29: "#ea81af",
    PJ30: "#ea81af",
  };

  return this.css("background-color", colorMap[category]).css("color", "black");
};

/**
 * 添加內容到元素中。
 * @param {string} taskText - 任務文本
 * @param {string} category - 任務類別
 * @returns {JQuery}
 */
$.fn.addContent = function (taskText, category) {
  const contentContainer = $("<div>").addClass("task-content").appendTo(this);

  const categoryContainer = $("<div>")
    .addClass("task-category-container")
    .appendTo(contentContainer);

  $("<div>")
    .addClass("task-category")
    .text(`${category}`)
    .setCategoryColor(category)
    .appendTo(categoryContainer);

  const categorySelect = $("<select>")
    .addClass("task-category-select")
    .appendTo(categoryContainer);

  const categories = [
    "未分類",
    "PJ24",
    "PJ25",
    "PJ26",
    "PJ27",
    "PJ28",
    "PJ29",
    "PJ30",
  ];

  categories.forEach((category) => {
    $("<option>").val(category).text(category).appendTo(categorySelect);
  });

  $("<p>").addClass("task-text").text(`${taskText}`).appendTo(contentContainer);

  return this;
};

/**
 * 添加任務功能到元素中。
 * @param {string} status - 任務狀態
 * @returns {JQuery}
 */
$.fn.addTaskFunctions = function (status) {
  const functionContainer = $("<div>")
    .addClass("task-function-container")
    .appendTo(this);

  const copyContainer = $("<div>")
    .addClass("task-copy-container")
    .appendTo(functionContainer);

  $("<img>")
    .attr("src", "icons/copy (left).png")
    .addClass("task-copy-left")
    .appendTo(copyContainer);

  $("<img>")
    .attr("src", "icons/copy (right).png")
    .addClass("task-copy-right")
    .appendTo(copyContainer);

  const statusContainer = $("<div>")
    .addClass("task-status-container")
    .appendTo(functionContainer);

  const displayContainer = $("<div>")
    .addClass("task-status-display-container")
    .appendTo(statusContainer);

  const statuses = ["U", "S", "O", "F"];
  const statusElements = {};

  statuses.forEach((status) => {
    const statusElement = $("<div>")
      .addClass("task-status-display")
      .addClass(status)
      .text(status)
      .appendTo(displayContainer);

    gsap.set(statusElement, { zIndex: 2, y: -41 });

    statusElements[status] = statusElement;
  });

  gsap.set(statusElements[status], { zIndex: 3, y: 0 });

  const statusOptions = $("<select>")
    .addClass("task-status-options")
    .appendTo(statusContainer);
  $("<option>").val("U").text("未完成").appendTo(statusOptions);
  $("<option>").val("S").text("跳過").appendTo(statusOptions);
  $("<option>").val("O").text("完成").appendTo(statusOptions);
  $("<option>").val("F").text("失敗").appendTo(statusOptions);

  statusOptions.val(status);

  return this;
};

/**
 * 清空任務容器，並返回一個Promise。
 * @returns {Promise<void>} - 當清空完成時解析的Promise
 */
function clearTasks() {
  return new Promise((resolve, reject) => {
    const callback = function () {
      $("#task-container").children().remove();
      setTimeout(() => {
        resolve();
      }, 100);
      console.log("clear container");
    };
    if ($("#task-container").children().length > 0) {
      $("#task-container").children().hide(500, callback);
    } else {
      console.log("skip clear");
      resolve();
    }
  });
}

/**
 * 從給定的任務項目中複製文本到剪貼板。
 * @param {JQuery} taskItem - 任務項目的JQuery對象
 * @param {number} mouseX - 鼠標的X坐標
 * @param {number} mouseY - 鼠標的Y坐標
 * @returns {Promise<void>} - 當複製完成時解析的Promise
 */
async function copyTaskText(taskItem, mouseX, mouseY) {
  const textToCopy = taskItem.data("text");

  const scrollLeft = $(document).scrollLeft();
  const scrollTop = $(document).scrollTop();

  await navigator.clipboard.writeText(textToCopy);

  // top 和 left 分別表示游標相對於元素頂部和左側的偏移
  gsap.set("#copied", {
    top: mouseY + scrollTop,
    left: mouseX + scrollLeft,
  });
}

/**
 * 切換任務的狀態。
 * @param {JQuery} taskItem - 任務項目的JQuery對象
 * @param {string} value - 新的狀態值
 */
function toggleTask(taskItem, value) {
  taskItem.data("status", value);
}

/**
 * 刪除給定的任務項目。
 * @param {JQuery} taskItem - 任務項目的JQuery對象
 */
function deleteTask(taskItem) {
  taskItem.hide(500, () => taskItem.remove());
}

/**
 * 搜索任務列表中包含特定文本的任務。
 * @param {string} text - 要搜索的文本
 * @returns {string[]} - 包含匹配的任務的JSON字符串數組
 */
function searchTasks(text) {
  const options = { shouldSort: false, keys: ["text"] };

  list = JSON.parse(domToJSON());
  const fuse = new Fuse(list, options);
  const result = fuse.search(text);

  const searchResult = [];
  result.forEach((item) => {
    searchResult.push(JSON.stringify(item.item));
  });

  return searchResult;
}

/**
 * 根據類別和搜索結果篩選任務項目並隱藏或顯示它們。
 * @param {string} category - 任務類別
 * @param {string[]} searchResult - 搜索結果的JSON字串數組
 */
function filterTasks(category, searchResult) {
  $("#task-container .task-item").each(function () {
    const taskItem = $(this);
    const task = JSON.stringify({
      text: taskItem.data("text"),
      category: taskItem.data("category"),
      status: taskItem.data("status"),
    });
    const isShow =
      (category === "all" && searchResult === "all") ||
      (taskItem.data("category") === category && searchResult.includes(task)) ||
      (taskItem.data("category") === category && searchResult === "all") ||
      (category === "all" && searchResult.includes(task));

    if (!isShow) {
      taskItem.hide(500);
    } else {
      taskItem.show(500);
    }
  });
}

/**
 * 將任務項目轉換為JSON字串。
 * @returns {string} - 包含任務訊息的JSON字串
 */
function domToJSON() {
  const tasks = $("#task-container")
    .children()
    .map(function () {
      if ($(this).hasClass("separator")) {
        return { type: "separator" };
      } else if ($(this).hasClass("task-item")) {
        return {
          text: $(this).data("text"),
          category: $(this).data("category"),
          status: $(this).data("status"),
        };
      }
    })
    .get();

  const jsonData = JSON.stringify(tasks, null, 2);
  return jsonData;
}

/**
 * 下載包含任務訊息的JSON文件。
 * @param {string} jsonData - 包含任務訊息的JSON字串
 */
function downloadJSON(jsonData) {
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = $("<a>")
    .attr({
      href: url,
      download: "tasks.json",
    })
    .appendTo("body");

  a[0].click();

  URL.revokeObjectURL(url);
  a.remove();
}

/**
 * 將JSON字串轉換為DOM元素以顯示任務列表。
 * @param {string} json - 包含任務訊息的JSON字串
 */
async function jsonToDOM(json) {
  // 轉成物件
  const tasks = JSON.parse(json);

  // 清空任務容器
  await clearTasks();

  // 遍歷 JSON 數據中的每個任務物件
  tasks.forEach((task) => {
    // 從任務物件獲取必要資訊
    const taskText = task.text || "--";
    const status = task.status;
    const category = task.category;

    // 調用 addTask 函數來在畫面增加任務項
    addTask(taskText, status, category);
  });
}
