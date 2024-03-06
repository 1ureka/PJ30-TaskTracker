// component
/** @type {TaskList}      */ let TASKLIST;
/** @type {Header}        */ let HEADER;
/** @type {SidebarTop}    */ let SIDEBAR_TOP;
/** @type {SidebarBottom} */ let SIDEBAR_BOTTOM;
/** @type {ScrollButtons} */ let SCROLL_BUTTONS;
/**                       */ let LOADICON;

// var
/** @type {"YYYY-MM"} */ let DATE = initDate();
/** @type {Save}      */ let SAVE = new Save();

interact = {
  disable: () => $("body").css("pointerEvents", "none"),
  enable: () => $("body").css("pointerEvents", "auto"),
};

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

async function loadSave() {
  const content = await loadFile(SAVEPATH);
  const data = JSON.parse(base64ToString(content));

  Object.keys(data).forEach((date) => SAVE.set(date, data[date]));
  SAVE.update();
}

function createBackground() {
  const waveBackground = new WaveBackground(-1);
  waveBackground.show();

  LOADICON = {
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
}

function createComponents() {
  Task.createStyle();

  HEADER = new Header();
  SIDEBAR_TOP = new SidebarTop();
  SIDEBAR_BOTTOM = new SidebarBottom();
  SCROLL_BUTTONS = new ScrollButtons();

  SIDEBAR_TOP.appendTo("#sidebar-content");
  SIDEBAR_BOTTOM.appendTo("#sidebar-content");
  SCROLL_BUTTONS.appendTo("body");
  SIDEBAR_TOP.setActive(DATE);

  const copyPopup = new CopyPopup();
  copyPopup.appendTo("body");
  Task.onCopy((coordinate) => {
    copyPopup.show(coordinate);
  });
}

async function createContents(list) {
  if (TASKLIST) await TASKLIST.remove();

  $("#content").toggleClass("current-month", isCurrentMonth(DATE));
  $("#content").toggleClass("is-note-page", DATE === "1111-11");

  TASKLIST = new TaskList(list);

  TASKLIST.onChange((list) => SAVE.set(DATE, list)); // 主要是刪除與更新事件
  TASKLIST.onSort((list) => SAVE.set(DATE, list)); // 主要是新增與排序事件
  TASKLIST.onTransfer((list, info) => {
    const currentList = list;
    const targetList = SAVE.get(getCurrentDate());

    targetList.push(info);

    SAVE.set(DATE, currentList);
    SAVE.set(getCurrentDate(), targetList);
  });

  await delay(350);

  await TASKLIST.show();
  SAVE.set(DATE, TASKLIST.getList());
  SCROLL_BUTTONS.setScrollTarget(TASKLIST);
}

function bindEvents() {
  HEADER.onInput((e) => {
    TASKLIST.filterTasks(e);
  });
  SIDEBAR_TOP.onSelect(async (id) => {
    interact.disable();

    DATE = id;
    SIDEBAR_TOP.setActive(DATE);
    localStorage.setItem("date", DATE);

    await HEADER.reset();
    await createContents(SAVE.get(DATE));

    interact.enable();
  });
  SIDEBAR_BOTTOM.onSelect(async (type) => {
    interact.disable();

    if (type === "save") {
      LOADICON.show();

      const data = SAVE.get("0");
      const str = JSON.stringify(data, null, 2);
      const file = stringToBase64(str);
      await uploadFile(file, SAVEPATH);
      SAVE.update();

      LOADICON.hide();
    }

    if (type === "load") {
      LOADICON.show();

      const content = await loadFile(SAVEPATH);
      const data = JSON.parse(base64ToString(content));
      Object.keys(data).forEach((date) => SAVE.set(date, data[date]));
      SAVE.update();

      LOADICON.hide();

      await createContents(SAVE.get(DATE));
    }

    interact.enable();
  });
}

$(async function () {
  createBackground();

  await login();

  LOADICON.show();
  interact.disable();

  await loadSave();

  createComponents();
  bindEvents();

  LOADICON.hide();

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
  await Promise.all([SCROLL_BUTTONS.show(), createContents(SAVE.get(DATE))]);

  interact.enable();
});
