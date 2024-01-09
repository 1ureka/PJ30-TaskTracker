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
