$(document).ready(function () {
  // 有關懸停/點擊效果

  //
  // 清空搜索欄按鈕
  gsap.set("#search-erase", { x: 10 });
  const EraserMove = gsap
    .timeline({
      defaults: { duration: 0.3, ease: "set1" },
      paused: true,
    })
    .to("#search-erase", { x: -5 });
  const EraserClick = gsap
    .timeline({
      defaults: { duration: 0.05, ease: "set1" },
      paused: true,
    })
    .to("#search-erase-container", { scale: 0.5, yoyo: true, repeat: 1 });

  $("#search-erase-container").hover(
    function () {
      EraserMove.play();
    },
    function () {
      EraserMove.reverse();
    }
  );

  $("#search-erase-container").on("click", function () {
    EraserClick.restart();
  });

  //
  // 複製內文按鈕
  $(document).on("click", ".task-copy-container", function () {
    gsap
      .timeline({
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this), { scale: 0.7, yoyo: true, repeat: 1 });
  });
  $(document).on("mouseenter", ".task-copy-container", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-copy-right"), {
        transformOrigin: "25px 15px",
        rotate: 270,
      });
  });
  $(document).on("mouseleave", ".task-copy-container", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-copy-right"), {
        transformOrigin: "25px 15px",
        rotate: 0,
      });
  });

  //
  // 工作塊本身
  $(document).on("mouseover", ".task-item", function () {
    gsap
      .timeline({
        defaults: { duration: 0.15, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        paddingTop: "1.5em",
        paddingBottom: "1.5em",
      });
  });
  $(document).on("mouseleave", ".task-item", function () {
    gsap
      .timeline({
        defaults: { duration: 0.15, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        paddingTop: "1em",
        paddingBottom: "1em",
      });
  });

  //
  // 切換工作狀態
  $(document).on("change", ".task-status-options", function () {
    const taskItem = $(this).closest(".task-item");
    const value = $(this).val();
    const targetElement = taskItem.find(`.task-status-display.${value}`);
    const otherElements = taskItem
      .find(".task-status-display")
      .not(targetElement);

    gsap.to(targetElement, {
      onStart: () => {
        gsap.set(otherElements, { zIndex: 2 });
        gsap.set(targetElement, { zIndex: 3 });
      },
      y: 0,
      onComplete: () => {
        gsap.set(otherElements, { y: -41 });
      },
    });
  });
  $(document).on("mouseenter", ".task-status-options", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-status-display-container"), {
        rotate: 360,
      });
  });
  $(document).on("mouseleave", ".task-status-options", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-status-display-container"), {
        rotate: 0,
      });
  });

  //
  // 編輯已有工作之類別
  $(document).on("change", ".task-category-select", function () {
    const taskItem = $(this).closest(".task-item");
    const value = $(this).val();
    const targetElement = taskItem.find(`.task-category-display.${value}`);
    const otherElements = taskItem
      .find(".task-category-display")
      .not(targetElement);

    gsap.to(targetElement, {
      onStart: () => {
        gsap.set(otherElements, { zIndex: 2 });
        gsap.set(targetElement, { zIndex: 3 });
      },
      y: 0,
      onComplete: () => {
        gsap.set(otherElements, { y: -41 });
      },
    });
  });
  $(document).on("mouseenter", ".task-category-select", function () {
    gsap
      .timeline({
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-category-display-container"), {
        scale: 1.1,
      });
  });
  $(document).on("mouseleave", ".task-category-select", function () {
    gsap
      .timeline({
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().find(".task-category-display-container"), {
        scale: 1,
      });
  });

  //
  // 新增按鈕
  gsap.set("#add-label-red", { y: -40 });
  const addClick = gsap
    .timeline({
      defaults: { duration: 0.1, ease: "set1" },
      paused: true,
    })
    .to("#add", { scale: 0.7, yoyo: true, repeat: 1 });
  const addHover = gsap
    .timeline({
      defaults: { duration: 0.1, ease: "set1" },
      paused: true,
    })
    .to("#add-label-white", { y: 40 })
    .to("#add-label-red", { y: 0 }, "<")
    .to("#add", { scale: 1.1 }, "<");

  $("#add").hover(
    function () {
      addHover.play();
    },
    function () {
      addHover.reverse();
    }
  );
  $("#add").on("click", function () {
    addClick.restart();
  });
});
