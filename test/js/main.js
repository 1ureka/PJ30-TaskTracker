$(async function () {
  let inTransition = true;

  // 之後要Promise.All與載入存檔寫在一起

  const save = new Save();
  console.log(save.set("2023-10", [50, 6]));

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

  sidebarTop.onSelect(async (date) => {
    if (inTransition) {
      console.log("停止執行了sidebarTop.onSelect");
      return;
    }
    inTransition = true;

    console.log(date);

    localStorage.setItem("date", `${date.year}-${date.month}`);

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
      showLoadingTl.reverse();
    }

    if (type === "load") {
      showLoadingTl.play();
      await delay(1000);
      showLoadingTl.reverse();
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

  //
  // content
  //

  let taskList = new TaskList([
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
  ]); // 不需要inTransition
  taskList.onChange((e) => console.log(e)); // 之後可以加上對比資料來確定是否要存檔

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
        taskList.show();
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
