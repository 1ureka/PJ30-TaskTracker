//
//
//
// 以下為與DOM有關函數
//
//
//
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
    const separator = createSeparator();
    $("#task-container").append(separator);
    separator.fadeIn(500);
  } else if (taskText !== "") {
    const taskItem = createTaskItem(taskText, status, category);
    $("#task-container").append(taskItem);
    taskItem.fadeIn(500);
  }
}

/**
 * 添加任務到暫存任務容器中。
 * @param {string} taskText - 任務文本
 * @param {string} status - 任務狀態
 * @param {string} category - 任務類別
 */
function addTempTask(taskText, status, category) {
  if (taskText === "--") {
    const separator = createSeparator();
    $("#temp-task-container").append(separator);
    separator.show(500);
  } else if (taskText !== "") {
    const taskItem = createTaskItem(taskText, status, category);
    $("#temp-task-container").append(taskItem);
    taskItem.show(500);
  }
}

/**
 * 創建分隔符。
 * @returns {JQuery}
 */
function createSeparator() {
  const separator = $("<div>").addClass("separator");

  separator.hide();
  separator.addDeleteButton();

  return separator;
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
  const frame = $("<img>")
    .addClass("task-delete")
    .addClass("task-delete-frame")
    .attr("src", "icons/delete (frame).png")
    .appendTo(this);
  const inner = $("<img>")
    .addClass("task-delete")
    .addClass("task-delete-inner")
    .attr("src", "icons/delete (inner).png")
    .appendTo(this);

  gsap.set(frame, { autoAlpha: 0 });
  gsap.set(inner, { autoAlpha: 0 });

  return this;
};

/**
 * 添加內容(類別、內文)到元素中。
 * @param {string} taskText - 任務文本
 * @param {string} category - 任務類別
 * @returns {JQuery}
 */
$.fn.addContent = function (taskText, category) {
  const contentContainer = $("<div>").addClass("task-content").appendTo(this);

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

  const categoryContainer = $("<div>")
    .addClass("task-category-container")
    .appendTo(contentContainer);

  const categoryDisplayContainer = $("<div>")
    .addClass("task-category-display-container")
    .appendTo(categoryContainer);

  const categoryDisplayElements = {};

  categories.forEach((category) => {
    const categoryDisplay = $("<div>")
      .addClass("task-category-display")
      .addClass(category)
      .text(`${category}`)
      .appendTo(categoryDisplayContainer);

    gsap.set(categoryDisplay, { zIndex: 2, y: -41 });

    categoryDisplayElements[category] = categoryDisplay;
  });

  gsap.set(categoryDisplayElements[category], { zIndex: 3, y: 0 });

  const categorySelect = $("<select>")
    .addClass("task-category-select")
    .appendTo(categoryContainer);

  categories.forEach((category) => {
    $("<option>").val(category).text(category).appendTo(categorySelect);
  });

  categorySelect.val(category);

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
  return new Promise((resolve) => {
    const callback = function () {
      $(this).remove();
      setTimeout(() => {
        resolve();
      }, 100);
    };
    if ($("#task-container").children().length > 0) {
      $("#task-container").children().fadeOut(500, callback);
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
 * 找到"U"工作狀態的第一個匹配工作指標
 * @returns {number} - 第一個未完成工作的指標，若沒找到則返回-1
 */
function findFirstUnfinished() {
  const tasks = $("#task-container .task-item");

  let low = 0;
  let high = tasks.length - 1;
  let index = -1;
  let skip = 0;

  while (low <= high) {
    const mid = skip
      ? Math.floor((low + high) / 2) + skip
      : Math.floor((low + high) / 2);
    const status = $(tasks[mid]).data("status");

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

  console.log(`findFirstUnfinished(): 找到指標為${index}`);
  return index;
}

/**
 * 返回對應指標的工作之所在螢幕正中央對於父元素之高度
 * @param {number} index - 工作指標
 * @return {number}
 */
function getTaskTop(index) {
  const tasks = $("#task-container .task-item");
  const height = tasks.eq(index).position().top;
  const windowHeight = window.innerHeight / 2;
  const scrollTo = height - windowHeight;

  return scrollTo;
}

//
//
//
// 以下為與DOM與json的橋梁或是與DOM無關函數
//
//
//
/**
 * 將任務項目轉換為JSON字串。
 * @returns {string} - 包含任務訊息的JSON字串
 */
function domToJSON() {
  const dom = $("#task-container")
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

  const tasks = JSON.stringify(dom, null, 2);
  return tasks;
}

/**
 * 將包含任務訊息的JSON字串放入當前所在的日期分類
 * @param {string} tasks - 包含任務訊息的JSON字串
 * @param {string} date - ISO 8601 格式的日期字符串，例如 "2023-11"。
 * @returns {string} - 包含時間標記的存檔JSON字串
 */
function jsonToSave(tasks, date) {
  const save = localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : {};
  save[date] = JSON.parse(tasks);
  return JSON.stringify(save, null, 2);
}

/**
 * 根據輸入的JSON字串下載對應JSON文件。
 * @param {string} save - 包含時間標記的存檔JSON字串
 */
function downloadJSON(save) {
  const blob = new Blob([save], { type: "application/json" });
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
 * 根據包含時間的存檔JSON字串，提取出指定時間分類的包含任務訊息的JSON字串
 * @param {string} save - 包含時間標記的存檔JSON字串
 * @param {string} date - ISO 8601 格式的日期字符串，例如 "2023-11"。
 * @returns {string | null} - 包含任務訊息的JSON字串
 */
function saveToJSON(save, date) {
  if (!save) return null;
  const saveObj = JSON.parse(save);
  const tasks = JSON.stringify(saveObj[date]);
  return tasks;
}

/**
 * 將JSON字串轉換為DOM元素以顯示任務列表。
 * @param {string} tasks - 包含任務訊息的JSON字串
 */
async function jsonToDOM(tasks) {
  // 若輸入json沒有資料，直接退出
  if (!tasks) {
    await clearTasks();
    console.log("jsonToDOM: 該清單無資料");
    return;
  }
  // 轉成物件
  const tasksArray = JSON.parse(tasks);

  // 清空任務容器
  await clearTasks();

  // 遍歷 JSON 數據中的每個任務物件
  tasksArray.forEach((task) => {
    // 從任務物件獲取必要資訊
    const taskText = task.text || "--";
    const status = task.status;
    const category = task.category;

    // 調用 addTask 函數來在畫面增加任務項
    addTask(taskText, status, category);
  });
}

/**
 * 更新目前所在清單
 * @param {string} saveDate - 要存入的日期，ISO 8601 格式的日期字符串
 * @param {string} loadDate - 要讀取的日期，ISO 8601 格式的日期字符串
 */
function changeDOM(saveDate, loadDate) {
  // 存檔
  const tasksToSave = domToJSON();
  const save = jsonToSave(tasksToSave, saveDate);
  localStorage.setItem("tasks", save);

  // 清空搜索與篩選
  $("#search-input").val("");
  $("#search-erase-container").hide(500);
  $("#filter-select").val("all");

  // 讀取
  const tasksToUpdate = saveToJSON(localStorage.getItem("tasks"), loadDate);
  tasksToUpdate ? jsonToDOM(tasksToUpdate) : clearTasks();

  // 更新所在日期
  localStorage.setItem("date", loadDate);
}

//
//
//
// 以下為與時間相關函數
//
//
//
/**
 * 創建年選擇框，提供選擇範圍為 2020 到當前年份。
 */
function createYearSelect() {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 },
    (_, index) => 2020 + index
  );

  years.forEach((year) => {
    $("#year").append(`<option value="${year}">${year}</option>`);
  });
}

/**
 * 根據選擇的年份初始化月份選擇框。
 * @param {string} year - 選擇的年份。
 */
function createMonthSelect(year) {
  $("#month").empty(); // 清空原有的月份選項
  const selectedYear = parseInt(year);
  const currentYear = new Date().getFullYear();
  const endMonth =
    selectedYear === currentYear ? new Date().getMonth() + 1 : 12;

  const months = Array.from({ length: endMonth }, (_, index) =>
    (index + 1).toString().padStart(2, "0")
  );

  months.forEach((month) => {
    $("#month").append(`<option value="${month}">${month}</option>`);
  });
}

/**
 * 初始化年份選擇
 */
function initYear() {
  const currentYear = new Date().getFullYear();
  if (formatLocalStorageDate()) {
    $("#year").val(formatLocalStorageDate().year);
  } else {
    $("#year").val(currentYear.toString());
  }
}

/**
 * 初始化月份選擇
 */
function initMonth() {
  const endMonth = new Date().getMonth() + 1;
  if (formatLocalStorageDate()) {
    $("#month").val(formatLocalStorageDate().month);
  } else {
    $("#month").val(endMonth);
  }
}

/**
 * 獲取選擇的日期，返回 ISO 8601 格式的日期字符串（僅包含年和月）。
 * @returns {string} ISO 8601 格式的日期字符串，例如 "2023-11"。
 */
function getDate() {
  const selectedYear = $("#year").val();
  const selectedMonth = $("#month").val();
  const isoDate = `${selectedYear}-${selectedMonth}`;
  return isoDate;
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

//
//
//
// 以下為其他
//
//
//
/**
 * 延遲執行的 Promise 函式，用於等待一定的時間。
 * @param {number} ms - 要延遲的時間（毫秒）。
 * @returns {Promise<void>} 一個 Promise，在指定時間後被解析。
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
