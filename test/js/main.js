$(async function () {
  let inTransition = true;

  // 之後要Promise.All與載入存檔寫在一起

  let date =
    localStorage.getItem("date") ||
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

  const save = new Save();
  save.set(
    "2024-01",
    [
      {
        text: "test \n hi",
        category: "未分類",
        status: "O",
      },
      {
        text: "test \n hi",
        category: "未分類",
        status: "S",
      },
      { type: "separator" },
    ],
    true
  );

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
    if (inTransition) {
      console.log("停止執行了sidebarTop.onSelect");
      return;
    }
    inTransition = true;

    date = `${e.year}-${e.month}`;
    localStorage.setItem("date", date);

    await createContents(save.get(date));

    inTransition = false;
  });

  sidebarTop.onAdd((data) => {
    // 不需要inTransition
    console.log(data);

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
    }

    if (type === "done") {
      taskList.switchMode("normal");
    }

    if (type === "check") {
      await taskList.clear();
    }

    inTransition = false;
  });

  //
  // aside
  //

  const scrollBtns = new ScrollButtons();
  scrollBtns.appendTo("body").onClick((type) => console.log(type)); // 不需要inTransition
  const copyPopup = new CopyPopup();
  copyPopup.appendTo("body");

  //
  // content
  //

  let taskList;

  const createContents = async (list) => {
    if (taskList) await taskList.remove();

    taskList = new TaskList(list);

    taskList.onChange((list) => save.set(date, list));
    taskList.onDelete((list) => save.set(date, list));
    taskList.onSort((list) => save.set(date, list));

    taskList.onCopy((e) => copyPopup.show(e));

    await taskList.show();
  };

  //
  // 全局動畫
  const hideLoadingTl = gsap
    .timeline({ defaults: { ease: "power2.out", duration: 0.4 } })
    .to("#loading-container", { autoAlpha: 0, duration: 0.6 }, "<");

  const showLoadingTl = gsap
    .timeline({ defaults: { ease: "power2.in", duration: 0.4 }, paused: true })
    .to("#loading-container", { autoAlpha: 1, duration: 0.6 }, "<");

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
      onStart: () => {
        scrollBtns.show();
        createContents(save.get(date));
      },
      duration: 0.65,
    });

  const opening = gsap.timeline({
    onComplete: () => {
      $("#sidebar").css("transform", ""); // 避免子元素position:fixed不作用
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
