$(document).ready(function () {
  // 有關懸停/點擊效果

  //
  // 搜尋符號(放大鏡)
  gsap.set(".search-inner", { rotate: 5, x: -10 });
  gsap.set($(".search-inner").eq(0), { x: -0 });
  const serachImgHover1 = gsap
    .timeline({ defaults: { ease: "set1", duration: 0.6 }, paused: true })
    .to(".search-inner", {
      x: "+=40",
      rotate: 20,
    });
  const serachImgHover2 = gsap
    .timeline({ defaults: { ease: "set1", duration: 0.3 }, paused: true })
    .to("#search-img-container", {
      scale: 1.1,
      rotate: "+=15",
      transformOrigin: "16.5px 17px",
    });

  $("#search-container").hover(
    function () {
      serachImgHover1.play();
      serachImgHover2.play();
    },
    function () {
      serachImgHover1.reverse();
      serachImgHover2.reverse();
    }
  );

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
  // 日期選單
  const calendarImgInners = $("#calendar-img-container")
    .children()
    .not($("#calendar-img-frame"));
  gsap.set(calendarImgInners, {
    autoAlpha: 0,
  });
  const dateHover1 = gsap
    .timeline({
      defaults: { duration: 0.15, ease: "set1" },
      paused: true,
    })
    .to("#date-select-container", {
      paddingTop: 10,
      paddingBottom: 10,
    });

  const dateHover2 = gsap
    .timeline({
      defaults: { duration: 0.15, ease: "set1" },
      paused: true,
    })
    .to(
      calendarImgInners,
      {
        stagger: 0.1,
        autoAlpha: 1,
      },
      "<"
    )
    .to(
      calendarImgInners,
      {
        stagger: 0.1,
        autoAlpha: 0,
      },
      "<0.4"
    );

  const dateHover3 = gsap
    .timeline({
      defaults: { duration: 0.3, ease: "set1" },
      paused: true,
    })
    .to($("#calendar-img-container"), {
      scale: 1.1,
    });

  $("#date-select-container").hover(
    function () {
      dateHover1.play();
      dateHover2.timeScale(1.5).play();
      dateHover3.play();
    },
    function () {
      dateHover1.reverse();
      dateHover2.timeScale(1.5).reverse();
      dateHover3.reverse();
    }
  );

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

  //
  // 刪除按鈕(個別)
  $(document).on("click", ".task-delete-inner", function () {
    gsap
      .timeline({
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this).parent().children(), { scale: 0.7, yoyo: true, repeat: 1 });
  });
  $(document).on("mouseenter", ".task-delete-inner", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        transformOrigin: "17px center",
        rotate: 270,
      });
  });
  $(document).on("mouseleave", ".task-delete-inner", function () {
    gsap
      .timeline({
        defaults: { duration: 0.4, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        transformOrigin: "17px center",
        rotate: 0,
      });
  });

  //
  // 右側選單按鈕
  const rightBtnClick = gsap
    .timeline({
      defaults: { duration: 0.05, ease: "set1" },
      paused: true,
    })
    .to("#right-panel-btn", { scale: 0.65, yoyo: true, repeat: 1 });
  const rightBtnHover = gsap.timeline({
    defaults: { duration: 0.5, ease: "set1" },
    paused: true,
  });

  // $("#right-panel-btn").hover(
  //   function () {
  //     rightBtnHover.play();
  //   },
  //   function () {
  //     rightBtnHover.reverse();
  //   }
  // );
  $("#right-panel-btn").on("click", function () {
    rightBtnClick.restart();
  });
});
