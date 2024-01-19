$(async function () {
  let inTransition = true;

  //
  // 初始化
  //
  const initDate = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const monthString = currentMonth.toString().padStart(2, "0");

    return localStorage.getItem("date") || `${currentYear}-${monthString}`;
  };

  let date = initDate();

  const save = new Save();

  const loadSave = async () => {
    const timeoutDuration = 5000;

    await new Promise((resolve) => {
      const interval = setInterval(
        () => window.dispatchEvent(new Event("loadSave")),
        500
      );

      const timeout = setTimeout(() => {
        clearInterval(interval);
        console.error("無法載入雲端存檔，使用本地存檔");
        window.dispatchEvent(new Event("saveLoaded"));
      }, timeoutDuration);

      window.addEventListener(
        "saveLoaded",
        () => {
          clearInterval(interval);
          clearTimeout(timeout);
          resolve();
        },
        { once: true }
      );
    });

    const str = localStorage.getItem("save");
    const obj = JSON.parse(str);

    Object.keys(obj).forEach((date) => save.set(date, obj[date]));

    save.update();
  };

  const uploadSave = async () => {
    const timeoutDuration = 5000;

    const obj = save.get();
    const str = JSON.stringify(obj, null, 2);

    localStorage.setItem("save", str);

    window.dispatchEvent(new Event("uploadSave"));

    const timeout = setTimeout(() => {
      console.error("無法存入雲端存檔，暫存於本地存檔");
      window.dispatchEvent(new Event("saveUploaded"));
    }, timeoutDuration);

    await new Promise((resolve) =>
      window.addEventListener(
        "saveUploaded",
        () => {
          clearTimeout(timeout);
          resolve();
        },
        { once: true }
      )
    );
  };

  //
  // 載入存檔
  //
  await loadSave();

  //
  // header
  //
  const header = new Header();
  header
    .onInput((e) => taskList.filterTasks(e)) // 不需要inTransition
    .onClear((e) => taskList.filterTasks(e)); // 不需要inTransition

  //
  // sidebar
  //
  const sidebarTop = new SidebarTop();
  const sidebarBottom = new SidebarBottom();
  sidebarTop.appendTo("#sidebar");
  sidebarBottom.appendTo("#sidebar");

  sidebarTop.onSelect(async (e) => {
    date = `${e.year}-${e.month}`;
    localStorage.setItem("date", date);

    header.reset();

    await createContents(save.get(date));
  });

  sidebarTop.onAdd((config) => {
    tempList.addTask(config);

    sidebarTop.clearText();
  });

  sidebarBottom.onSelect(async (type) => {
    if (inTransition) {
      console.log("停止執行了sidebarBottom.onSelect");
      return;
    }
    inTransition = true;

    if (type === "save") {
      showLoadingTl.play();

      await delay(1000);
      save.update();

      showLoadingTl.reverse(); // 從Save拿取
    }

    if (type === "load") {
      showLoadingTl.play();

      await delay(1000);

      showLoadingTl.reverse(); // 記得更新Save
    }

    if (type === "delete") {
      taskList.switchMode("delete");
      sidebarBottom.showDoneBtn();
    }

    if (type === "done") {
      taskList.switchMode("normal");
      sidebarBottom.hideDownBtn();
    }

    if (type === "check") {
      await taskList.clear();
    }

    inTransition = false;
  });

  //
  // aside
  //

  const copyPopup = new CopyPopup();
  copyPopup.appendTo("body");
  const tempList = new TempList();
  tempList.appendTo("body");
  const scrollBtns = new ScrollButtons();
  scrollBtns.appendTo("body").onClick((type) => {
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

  //
  // content
  //

  /** @type {TaskList} */
  let taskList;

  const createContents = async (list) => {
    if (taskList) await taskList.remove();

    taskList = new TaskList(list);

    taskList.onChange((list) => save.set(date, list));
    taskList.onDelete((list) => save.set(date, list));
    taskList.onSort((list) => save.set(date, list));

    taskList.onCopy((e) => copyPopup.show(e));

    await delay(350);

    await taskList.show();
  };

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
    .to("#header, #sidebar, #version-display", {
      x: 0,
      y: 0,
      autoAlpha: 1,
      stagger: 0.35,
    });

  const showDefaultsComponentsTl = gsap
    .timeline({ defaults: { ease: "power2.out", duration: 0.6 } })
    .to("body", {
      onStart: () => scrollBtns.show(),
      duration: 0.65,
    });

  const opening = gsap.timeline({
    onComplete: () => {
      $("#sidebar").css("transform", ""); // 避免子元素position:fixed不作用
      createContents(save.get(date));
      inTransition = false;
    },
    delay: 1,
    paused: true,
  });

  opening
    .add(hideLoadingTl)
    .add(showMenuTl)
    .add(showDefaultsComponentsTl, "<0.6")
    .play();
});
