$(async function () {
  console.log("1");

  await delay(500); // 避免資源還未載入好導致自動生成之元素樣式錯誤
  // 之後要Promise.All與載入存檔寫在一起

  console.log("2");

  const sidebarTop = new SidebarTop();
  sidebarTop
    .appendTo("#sidebar")
    .onDateSelect((date) => console.log(date))
    .onAdd((data) => console.log(data));

  const sidebarBottom = new SidebarBottom();
  sidebarBottom.appendTo("#sidebar").onSelect((type) => console.log(type));
});
