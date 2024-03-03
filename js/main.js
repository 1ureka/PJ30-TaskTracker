/** @type {TaskList} */
let taskList;

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

function createComponents() {
  const waveBackground = new WaveBackground(-1);
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

  Task.createStyle();

  const header = new Header();
  const sidebarTop = new SidebarTop();
  const sidebarBottom = new SidebarBottom();

  const copyPopup = new CopyPopup();
  const tempList = new TempList();
  const scrollBtns = new ScrollButtons();

  sidebarTop.appendTo("#sidebar-content");
  sidebarBottom.appendTo("#sidebar-content");

  copyPopup.appendTo("body");
  tempList.appendTo("body");
  scrollBtns.appendTo("body");

  return {
    waveBackground,
    loadingIcon,
    header,
    sidebarTop,
    sidebarBottom,
    copyPopup,
    tempList,
    scrollBtns,
  };
}

async function createContents(list) {
  if (taskList) await taskList.remove();

  taskList = new TaskList(list);

  taskList.onChange((list) => save.set(date, list)); // 主要是刪除與更新事件
  taskList.onSort((list) => save.set(date, list)); // 主要是新增與排序事件

  await delay(350);

  await taskList.show();
}

$(async function () {
  //
  // 創建組件
  //
  const {
    waveBackground,
    loadingIcon,
    header,
    sidebarTop,
    sidebarBottom,
    copyPopup,
    tempList,
    scrollBtns,
  } = createComponents();
  waveBackground.show();

  //
  // 等待登入
  //
  await login();
  $("body").css("pointerEvents", "none");
  loadingIcon.show();

  //
  // 載入存檔
  //
  let date = initDate();
  const save = new Save();
  const content = await loadFile(SAVEPATH);
  const data = JSON.parse(base64ToString(content));
  Object.keys(data).forEach((date) => save.set(date, data[date]));
  save.update();

  //
  // 事件監聽
  //
  header.onInput((e) => {
    taskList.filterTasks(e);
  });
  sidebarTop.onSelect(async (e) => {
    $("body").css("pointerEvents", "none");

    date = `${e.year}-${e.month}`;
    if (e.year !== "0000") localStorage.setItem("date", date);

    header.reset();

    await createContents(save.get(date));

    $("body").css("pointerEvents", "auto");
  });
  sidebarTop.onAdd((config) => {
    tempList.addTask(config);

    sidebarTop.clearText();
  });
  sidebarBottom.onSelect(async (type) => {
    $("body").css("pointerEvents", "none");

    if (type === "save") {
      showLoadingTl.play();

      const data = save.get("0");
      const str = JSON.stringify(data, null, 2);
      const file = stringToBase64(str);
      await uploadFile(file, SAVEPATH);
      save.update();

      showLoadingTl.reverse();
    }

    if (type === "load") {
      showLoadingTl.play();

      const content = await loadFile(SAVEPATH);
      const data = JSON.parse(base64ToString(content));
      Object.keys(data).forEach((date) => save.set(date, data[date]));
      save.update();

      showLoadingTl.reverse();

      await createContents(save.get(date));
    }

    $("body").css("pointerEvents", "auto");
  });
  scrollBtns.onClick((type) => {
    const tasksContainer = $("#tasks-container");

    if (!tasksContainer) return;

    // 根據容許值判斷現在畫面是否已在目標工作項目
    const isAtTask = (taskTop) => {
      const tolerance = window.innerHeight / 2.5;
      const currentTop = $("#content").scrollTop();

      return Math.abs(currentTop - taskTop) <= tolerance;
    };

    const { index, taskTop } = findFirstUnfinished(taskList.getList());
    const currentTop = $("#content").scrollTop();
    let targetTop;

    if (index === -1) {
      targetTop = type === "down" ? tasksContainer.height() : 0;
      // 若index === -1，代表沒有找到目標工作或是清單為空，則滑動至底/頂部
    } else if (type === "down") {
      // 判斷是否要滑動至底部 (目前畫面是否已在目標工作項目範圍 或是 下方)
      const isGoingToBottom = isAtTask(taskTop) || currentTop > taskTop;
      targetTop = isGoingToBottom ? tasksContainer.height() : taskTop;
    } else if (type === "up") {
      // 判斷是否要滑動至頂部 (目前畫面是否已在目標工作項目範圍 或是 上方)
      const isGoingToTop = isAtTask(taskTop) || currentTop < taskTop;
      targetTop = isGoingToTop ? 0 : taskTop;
    }

    $("#content").animate({ scrollTop: targetTop }, 500);
  });
  Task.onCopy((coordinate) => {
    copyPopup.show(coordinate);
  });

  //
  // 其他
  //
  $(".pages-btn-container")
    .find("input")
    .on("change", function () {
      if ($(this).is(":checked")) {
        $(":root").css("--sidebar-page", 1);
      } else {
        $(":root").css("--sidebar-page", 0);
      }
    });

  //
  // 全局動畫
  const hideLoadingTl = gsap
    .timeline({ defaults: { ease: "power2.out" } })
    .to("#loading-container", { autoAlpha: 0, duration: 0.3 }, "<");

  const showLoadingTl = gsap
    .timeline({ defaults: { ease: "power2.in" }, paused: true })
    .to("#loading-container", { autoAlpha: 1, duration: 0.3 }, "<");

  const showMenuTl = gsap
    .timeline({ defaults: { ease: "power2.out", duration: 0.6 } })
    .to("#header, #sidebar", {
      x: 0,
      y: 0,
      autoAlpha: 1,
      stagger: 0.35,
    });

  const showDefaultsComponentsTl = gsap
    .timeline({ defaults: { ease: "power2.out", duration: 0.6 } })
    .to("body", {
      onStart: async () => {
        scrollBtns.show();
        await createContents(save.get(date));
        $("body").css("pointerEvents", "auto");
      },
      duration: 0.65,
    });

  const opening = gsap.timeline({
    onComplete: () => $("#sidebar").css("transform", ""), // 避免子元素position:fixed不作用
    delay: 1,
    paused: true,
  });

  opening
    .add(hideLoadingTl)
    .add(showMenuTl)
    .add(showDefaultsComponentsTl, "<1.2")
    .play();
});
