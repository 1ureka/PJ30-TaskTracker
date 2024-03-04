/** @type {TaskList} */
let taskList;
/** @type {"YYYY-MM"} */
let date;
/** @type {Save} */
let save;

async function login() {
  // 如果已經認證過則認證完成
  if (await checkInfo()) {
    $("#login-container").remove();
    return;
  }

  // 沒有認證過則顯示登入選單
  $("html").css("--is-login", "0");

  // 開始監聽submit事件，並等待認證完成
  $("#login-container").on("submit", async function (e) {
    e.preventDefault();

    let username = $(this).find("input[type='text']").val();
    let password = $(this).find("input[type='password']").val();

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);

    username = null;
    password = null;

    if (await checkInfo()) {
      $("html").css("--is-login", "1");
      $(this).off("submit");
      window.dispatchEvent(new Event("login"));
      return;
    }

    if ($("#login-fail-message").length) {
      $("#login-fail-message").css("rotate", "15deg");
      await delay(100);
      $("#login-fail-message").css("rotate", "-15deg");
      await delay(100);
      $("#login-fail-message").css("rotate", "");
      return;
    }

    $("<span>錯誤的名稱或密碼</span>")
      .hide()
      .attr("id", "login-fail-message")
      .insertAfter($(this).find("button"))
      .slideDown(500);
  });

  // 等待認證完成
  await new Promise((resolve) =>
    window.addEventListener("login", resolve, { once: true })
  );

  // 等待login退出CSS動畫完成
  await delay(1500);
  $("#login-container").remove();
}

function createBackground() {
  const waveBackground = new WaveBackground(-1);
  waveBackground.show();

  const loadingIcon = {
    show: () =>
      gsap.to("#loading-container", {
        ease: "power2.in",
        autoAlpha: 1,
        duration: 0.3,
      }),
    hide: () =>
      gsap.to("#loading-container", {
        ease: "power2.out",
        autoAlpha: 0,
        duration: 0.3,
      }),
  };

  return { loadingIcon };
}

function createComponents() {
  Task.createStyle();

  const header = new Header();
  const sidebarTop = new SidebarTop();
  const sidebarBottom = new SidebarBottom();
  const addMenu = new AddMenu();

  const copyPopup = new CopyPopup();
  const scrollButtons = new ScrollButtons();

  sidebarTop.appendTo("#sidebar-content");
  sidebarBottom.appendTo("#sidebar-content");
  addMenu.appendTo("#content");

  copyPopup.appendTo("body");
  scrollButtons.appendTo("body");

  sidebarTop.setActive(date);

  Task.onCopy((coordinate) => {
    copyPopup.show(coordinate);
  });

  return {
    header,
    sidebarTop,
    sidebarBottom,
    addMenu,
    scrollButtons,
  };
}

async function createContents(list) {
  if (taskList) await taskList.remove();

  $("#content").toggleClass("current-month", isCurrentMonth(date));

  taskList = new TaskList(list);

  taskList.onChange((list) => save.set(date, list)); // 主要是刪除與更新事件
  taskList.onSort((list) => save.set(date, list)); // 主要是新增與排序事件

  await delay(350);

  await taskList.show();
}

$(async function () {
  const { loadingIcon } = createBackground();

  await login();

  loadingIcon.show();

  $("body").css("pointerEvents", "none");

  //
  // 載入存檔
  //
  date = initDate();
  save = new Save();

  const content = await loadFile(SAVEPATH);
  const data = JSON.parse(base64ToString(content));

  Object.keys(data).forEach((date) => save.set(date, data[date]));
  save.update();

  //
  // 創建組件與事件監聽
  //
  const { header, sidebarTop, sidebarBottom, addMenu, scrollButtons } =
    createComponents();

  header.onInput((e) => {
    taskList.filterTasks(e);
  });
  sidebarTop.onSelect(async (id) => {
    $("body").css("pointerEvents", "none");

    date = id;

    if (!["0000-00", "1111-11"].includes(date))
      localStorage.setItem("date", date);

    sidebarTop.setActive(date);
    await header.reset();
    await createContents(save.get(date));
    scrollButtons.bindEvents(taskList.getList());

    $("body").css("pointerEvents", "auto");
  });
  sidebarBottom.onSelect(async (type) => {
    $("body").css("pointerEvents", "none");

    if (type === "add") {
      addMenu.show();
    }

    if (type === "save") {
      loadingIcon.show();

      const data = save.get("0");
      const str = JSON.stringify(data, null, 2);
      const file = stringToBase64(str);
      await uploadFile(file, SAVEPATH);
      save.update();

      loadingIcon.hide();
    }

    if (type === "load") {
      loadingIcon.show();

      const content = await loadFile(SAVEPATH);
      const data = JSON.parse(base64ToString(content));
      Object.keys(data).forEach((date) => save.set(date, data[date]));
      save.update();

      loadingIcon.hide();

      await createContents(save.get(date));
    }

    $("body").css("pointerEvents", "auto");
  });

  //
  // 開場動畫
  //
  loadingIcon.hide();

  const opening = gsap
    .timeline({ delay: 1, defaults: { ease: "power2.out", duration: 0.6 } })
    .to("#header, #sidebar", {
      x: 0,
      y: 0,
      autoAlpha: 1,
      stagger: 0.35,
      onComplete: () => $("#sidebar").css("transform", ""), // 避免子元素position:fixed不作用
    });

  await new Promise((resolve) => opening.eventCallback("onComplete", resolve));
  await Promise.all([scrollButtons.show(), createContents(save.get(date))]);

  scrollButtons.bindEvents(taskList.getList());

  $("body").css("pointerEvents", "auto");
});
