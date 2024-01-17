$(async function () {
  let inTransition = true;

  // 之後要Promise.All與載入存檔寫在一起

  const header = new Header();
  header.onInput((e) => console.log(e)).onClear(() => console.log("clear"));

  const sidebarTop = new SidebarTop();
  sidebarTop
    .appendTo("#sidebar")
    .onDateSelect((date) => {
      console.log(date);

      localStorage.setItem("date", `${date.year}-${date.month}`);
    })
    .onAdd((data) => {
      console.log(data);

      sidebarTop.clearText();
    });

  const sidebarBottom = new SidebarBottom();
  sidebarBottom.appendTo("#sidebar").onSelect(async (type) => {
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

    if (type === "delete") {
      taskList.switchMode("delete");
    }

    if (type === "done") {
      taskList.switchMode("normal");
    }

    inTransition = false;
  });

  const scrollBtns = new ScrollButtons();
  scrollBtns.appendTo("body").onClick((type) => console.log(type));

  const taskList = new TaskList([
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
  ]);

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
    .to("body", { onStart: () => scrollBtns.show(), duration: 0.65 });

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
