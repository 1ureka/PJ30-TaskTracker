// background.js

chrome.runtime.onMessage.addListener(async function (request, sender) {
  // 取得來源頁面id，以在執行完畢後傳回resolve
  const id = sender.tab.id;

  // Discord API 的目標 URL
  const url =
    "https://discord.com/api/v10/channels/1183187774178873487/messages";

  // 提取金鑰
  const authorizationResponse = await fetch("authorization.json");
  const authorization = await authorizationResponse.json();
  if (!authorization.key) {
    console.log("無法驗證使用者");
    chrome.tabs.sendMessage(id, { status: "error" });
    return;
  }

  // 請求的標頭，包括 Bot 的授權令牌
  const headers = new Headers({
    Authorization: authorization.key,
  });

  // 用於存儲 API 響應數據的變數
  let responseData;

  try {
    //
    if (request.action === "GET") {
      // 如果是 GET 請求
      // 發送請求以獲取主要數據
      const mainDataResponse = await fetch(url, { headers: headers });

      // 將主要數據轉換為 JSON 格式
      responseData = await mainDataResponse.json();
      console.log("主要回應資料：", responseData);

      // 從主要數據中獲取存檔的 URL
      const saveFileUrl = responseData[0].attachments[0].url;

      // 發送請求以獲取存檔數據
      const saveFileResponse = await fetch(saveFileUrl);

      // 將存檔數據轉換為 JSON 格式
      responseData = await saveFileResponse.json();
      console.log("最新存檔為：", responseData);

      chrome.tabs.sendMessage(id, { status: "ok", save: responseData });

      //
    } else if (request.action === "POST") {
      // 如果是 POST 請求
      // 將請求數據轉換為 Blob 對象
      const blob = new Blob([request.data], { type: "application/json" });

      // 創建 FormData 對象，用於 POST 請求的數據
      const formData = new FormData();
      formData.append("file", blob, "task.json");

      // 發送 POST 請求
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      // 將 POST 請求的回應轉換為 JSON 格式印出
      responseData = await response.json();
      console.log("回應資料為：", responseData);

      chrome.tabs.sendMessage(id, { status: "ok" });
      //
    }
    //
  } catch (error) {
    //
    console.error(error);

    chrome.tabs.sendMessage(id, { status: "error" });
    //
  }
});
