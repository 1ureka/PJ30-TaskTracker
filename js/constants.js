/**
 * 任務的分類列表。
 * @type {string[]}
 */
const CATEGORISE = [
  "未分類",
  "PJ24",
  "PJ25",
  "PJ26",
  "PJ27",
  "PJ28",
  "PJ29",
  "PJ30",
  "PJ32",
  "Extra",
];

/**
 * 將不同類別映射到相應顏色的對象。
 * @type {{ [key: string]: string }}
 */
const COLORMAP = {
  U: "#bbb",
  S: "#92e9ff",
  O: "#8ce197",
  F: "#ea81af",
  未分類: "#bbb",
  PJ24: "#ffff7a",
  PJ25: "#8ce197",
  PJ26: "#8ce197",
  PJ27: "#92e9ff",
  PJ28: "#92e9ff",
  PJ29: "#ea81af",
  PJ30: "#ea81af",
  PJ32: "#ea81af",
  Extra: "#a686f9",
};

/**
 * 將狀態縮寫映射到相應全名的對象。
 * @type {{ [key: string]: string }}
 */
const STATUSMAP = { U: "未完成", S: "跳過", O: "完成", F: "失敗" };

/**
 * 存檔在雲端庫的路徑。
 */
const SAVEPATH = "PJ30/save.json";
