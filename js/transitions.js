$(document).ready(function () {
  //
  //
  // 開場動畫
  //
  //
  async function opening() {
    await delay(100);

    const opening = gsap
      .timeline({
        defaults: { ease: "set1", duration: 0.75 },
        paused: true,
        delay: 0.75,
      })
      .to("#header", { y: 0, autoAlpha: 1 })
      .to("#left-panel", { x: 0, autoAlpha: 1 }, "<37.5%")
      .fromTo(
        "#up-btn, #down-btn",
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, ease: "back.out(4)", stagger: 0.25 },
        "<50%"
      )
      .to("#task-container-scroller", { autoAlpha: 1, duration: 0.5 }, "<")
      .fromTo(
        $("#task-container").children(),
        { autoAlpha: 0 },
        { autoAlpha: 1, stagger: { from: "random", amount: 0.5 } },
        "<"
      );

    opening.play().then(() => $("#left-panel").css("transform", "")); // 避免子元素position:fixed不作用
  }

  opening();

  //
  //
  // 使清單可拖動
  //
  //
  sortableTempList = new Sortable($("#temp-task-container").get()[0], {
    group: {
      name: "shared",
      put: false,
    },
    animation: 150,
    sort: false,
    onEnd: () => {
      if ($("#temp-task-container").children().length === 0) {
        enterRightPanel.reverse();
      }
    },
  });
  sortableTaskList = new Sortable($("#task-container").get()[0], {
    group: "shared",
    animation: 150,
    onSort: () => {
      saveStatus.isChanged = true;
    },
  });

  //
  // 有關進出刪除狀態動畫
  gsap.set("#delete-done", { autoAlpha: 0 });
  let isDeleting = false;
  const popupDeleteDone = gsap
    .timeline({
      defaults: { ease: "set1", duration: 0.35 },
      paused: true,
    })
    .from("#delete-done", {
      ease: "back.out(4.5)",
      scale: 0.1,
    })
    .to(
      "#delete-done",
      {
        autoAlpha: 1,
      },
      "<"
    );

  const enterDeleting = () => {
    isDeleting = true;
    gsap
      .timeline({
        defaults: { duration: 0.3, ease: "set1", overwrite: "auto" },
      })
      .to(".task-item, .separator", { left: 50 })
      .to(".task-delete", { autoAlpha: 1 }, "<0.1");
  };
  const exitDeleting = () => {
    isDeleting = false;
    gsap
      .timeline({
        defaults: { duration: 0.3, ease: "set1", overwrite: "auto" },
      })
      .to(".task-delete", { autoAlpha: 0 }, "<")
      .to(".task-item, .separator", { left: 0 }, "<0.1");
  };

  $("#delete").on("click", function () {
    if (isDeleting) {
      popupDeleteDone.reverse();
      exitDeleting();
    } else {
      popupDeleteDone.play();
      enterDeleting();
    }
  });

  $("#delete-done").on("click", function () {
    popupDeleteDone.reverse();
    exitDeleting();
  });

  // 滑鼠右鍵
  $(document).on("contextmenu", function (e) {
    if (isDeleting) {
      e.preventDefault();
      popupDeleteDone.reverse();
      exitDeleting();
    }
  });

  //
  // 彈出清空確認視窗
  let isCheckClear = false;
  const enterCheckClear = gsap
    .timeline({
      defaults: { ease: "set1", duration: 0.35 },
      paused: true,
    })
    .from("#cleared", {
      ease: "back.out(2)",
      scale: 0.1,
    })
    .to(
      "#cleared",
      {
        autoAlpha: 1,
      },
      "<"
    );

  $("#clear").on("click", function () {
    isCheckClear = true;
    enterCheckClear.timeScale(1.5).play();
  });

  $("#cleared-cancel").on("click", function () {
    isCheckClear = false;
    enterCheckClear.timeScale(1).reverse();
  });

  $("#cleared-check").on("click", function () {
    isCheckClear = false;
    enterCheckClear.timeScale(1).reverse();
  });

  // 滑鼠右鍵
  $(document).on("contextmenu", function (e) {
    if (isCheckClear) {
      e.preventDefault();
      enterCheckClear.timeScale(1).reverse();
    }
  });

  //
  // 彈出已複製視窗
  const enterCopied = gsap
    .timeline({
      defaults: { ease: "set1" },
      paused: true,
    })
    .from("#copied", { ease: "back.out(2)", duration: 0.3, scale: 0.1 })
    .to("#copied", { ease: "power3.out", duration: 0.3, autoAlpha: 1 }, "<")
    .to("#copied", { delay: 0.5, duration: 1, autoAlpha: 0 })
    .to("#copied", { top: 0, left: 0, duration: 0.1 });

  $(document).on("click", ".task-copy-container", function (e) {
    enterCopied.restart();
  });

  //
  // 右側選單
  gsap.set($("#right-panel-container > *"), { autoAlpha: 0 });
  const rightPanelHover = gsap
    .timeline({
      defaults: { duration: 0.5, ease: "set1" },
      paused: true,
    })
    .to($("#right-panel-container > *"), { autoAlpha: 1 });

  $("#right-panel-container").hover(
    function () {
      rightPanelHover.play();
    },
    function () {
      if (enterRightPanel.paused() || enterRightPanel.reversed()) {
        rightPanelHover.reverse();
      }
    }
  );

  gsap.set("#right-panel-container", { y: 230 });
  const enterRightPanel = gsap
    .timeline({
      defaults: { ease: "set1", duration: 0.5 },
      paused: true,
    })
    .to("#right-panel-container", { y: 0 })
    .to("#right-panel-img-container", { y: 55, scaleY: -1 }, "<");

  $("#right-panel-img-container").on("click", function () {
    if (enterRightPanel.paused() || enterRightPanel.reversed()) {
      enterRightPanel.play();
    } else {
      enterRightPanel.reverse().then(() => $("#right-panel").scrollTop(0));
    }
  });

  $("#add").on("click", function () {
    if ($("#temp-task-container").children().length !== 0) {
      rightPanelHover.play();
      enterRightPanel.play();
    }
  });
});
