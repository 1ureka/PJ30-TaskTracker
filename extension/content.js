// content.js (Content Script)

async function loadSave() {
  await chrome.runtime.sendMessage({ action: "GET" });

  const response = await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener(resolve);
  });

  const save = response.save;

  console.log("載入完成");

  return JSON.stringify(save, null, 2);
}

async function uploadSave(save) {
  const data = JSON.stringify(save, null, 2);

  await chrome.runtime.sendMessage({
    action: "POST",
    data,
  });

  await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener(resolve);
  });

  console.log("上傳完成");
}

const handleLoadSave = async () => {
  window.removeEventListener("loadSave", handleLoadSave);

  try {
    const save = await loadSave();
    localStorage.setItem("save", save);
    window.dispatchEvent(new Event("saveLoaded"));
  } catch (error) {
    console.error("loadSave 發生錯誤:", error);
  } finally {
    window.addEventListener("loadSave", handleLoadSave);
  }
};
const handleUploadSave = async () => {
  window.removeEventListener("uploadSave", handleUploadSave);

  try {
    const save = localStorage.getItem("save");
    await uploadSave(save);
    window.dispatchEvent(new Event("saveUploaded"));
  } catch (error) {
    console.error("uploadSave 發生錯誤:", error);
  } finally {
    window.addEventListener("uploadSave", handleUploadSave);
  }
};

window.addEventListener("loadSave", handleLoadSave);
window.addEventListener("uploadSave", handleUploadSave);
