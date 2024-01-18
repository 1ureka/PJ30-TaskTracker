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

window.addEventListener("loadSave", async () => {
  const save = await loadSave();
  localStorage.setItem("save", save);
  window.dispatchEvent(new Event("saveLoaded"));
});

window.addEventListener("uploadSave", async () => {
  const save = localStorage.getItem("save");
  await uploadSave(save);
  window.dispatchEvent(new Event("saveUploaded"));
});
