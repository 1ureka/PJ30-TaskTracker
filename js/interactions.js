/**
 * 製作文字按鈕時間軸
 * @param {string} btnElement - 按鈕選擇器id
 * @param {number} duration - 動畫時間
 * @returns {{click: TimelineMax, hover: TimelineMax}} - 返回時間軸
 */
function createTextBtnTimeline(btnElement, clickDuration, hoverDuration) {
  gsap.set(`#${btnElement}-label-red`, { y: -40 });
  const click = gsap
    .timeline({
      defaults: { duration: clickDuration, ease: "set1" },
      paused: true,
    })
    .to(`#${btnElement}`, { scale: 0.7, yoyo: true, repeat: 1 });
  const hover = gsap
    .timeline({
      defaults: { duration: hoverDuration, ease: "set1" },
      paused: true,
    })
    .to(`#${btnElement}-label-white`, { y: 40 })
    .to(`#${btnElement}-label-red`, { y: 0 }, "<")
    .to(`#${btnElement}`, { scale: 1.1 }, "<");

  return { click, hover };
}

/**
 * 綁定文字按鈕時間軸
 * @param {string} Trigger - 觸發選擇器id
 * @param {TimelineMax} hover - 懸停時間軸
 * @param {TimelineMax} click - 點擊時間軸
 */
function bindTextBtnEvents(Trigger, click, hover) {
  $(`#${Trigger}`).hover(
    function () {
      hover.play();
    },
    function () {
      hover.reverse();
    }
  );
  $(`#${Trigger}`).on("click", function () {
    click.restart();
  });
}

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
      defaults: { duration: 0.2, ease: "set1" },
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
        paddingTop: 30,
        paddingBottom: 30,
      });
  });
  $(document).on("mouseleave", ".task-item", function () {
    gsap
      .timeline({
        defaults: { duration: 0.15, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        paddingTop: 20,
        paddingBottom: 20,
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
  // 刪除按鈕
  const garbageBinCover = $("#garbage-bin-container > img").slice(1);
  const garbageBinLineLeft = $("#garbage-bin-lines-container > img").slice(
    0,
    3
  );
  const garbageBinLineRight = $("#garbage-bin-lines-container > img").slice(3);

  gsap.set(garbageBinLineLeft, { x: -20 });

  const garbageBinHover = gsap
    .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
    .to("#garbage-bin-container", { scale: 1.25 })
    .to(garbageBinCover, { transformOrigin: "-5px 15px", rotate: -15 }, "<")
    .to(garbageBinLineLeft, { x: 0, stagger: -0.1 }, "<")
    .to(garbageBinLineRight, { x: 20, stagger: -0.1 }, "<");

  $("#delete").hover(
    function () {
      garbageBinHover.play();
    },
    function () {
      garbageBinHover.reverse();
    }
  );

  //
  // 掃把圖示
  const broomContainer = $("#broom-img-container ");
  const broomImg = $("#broom-img-container > img");
  const broomTrail = $("#broom-img-container > img")[0];
  gsap.set(broomImg, { rotate: -90 });
  gsap.set(broomTrail, { x: 22, y: -5 });

  const broomHover = gsap
    .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
    .to(broomContainer, { scale: 1.25 })
    .to(broomImg, { rotate: 0 }, "<");

  $("#clear").hover(
    function () {
      broomHover.play();
    },
    function () {
      broomHover.reverse();
    }
  );

  //
  // 所有文字按鈕
  const TextBtnelements = [
    {
      TextBtnId: "add",
      TriggerId: "add",
      clickDuration: 0.1,
      hoverDuration: 0.1,
    },
    {
      TextBtnId: "delete-done",
      TriggerId: "delete-done",
      clickDuration: 0.1,
      hoverDuration: 0.1,
    },
    {
      TextBtnId: "cleared-check",
      TriggerId: "cleared-check",
      clickDuration: 0.1,
      hoverDuration: 0.1,
    },
    {
      TextBtnId: "cleared-cancel",
      TriggerId: "cleared-cancel",
      clickDuration: 0.1,
      hoverDuration: 0.1,
    },
    {
      TextBtnId: "delete",
      TriggerId: "delete",
      clickDuration: 0.1,
      hoverDuration: 0.2,
    },
    {
      TextBtnId: "clear",
      TriggerId: "clear",
      clickDuration: 0.1,
      hoverDuration: 0.2,
    },
  ];

  TextBtnelements.forEach(
    ({ TextBtnId, TriggerId, clickDuration, hoverDuration }) => {
      // 創建時間軸
      const timeline = createTextBtnTimeline(
        TextBtnId,
        clickDuration,
        hoverDuration
      );

      // 綁定事件
      bindTextBtnEvents(TriggerId, timeline.click, timeline.hover);
    }
  );

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
    .to("#right-panel-img-container", { scale: 0.65, yoyo: true, repeat: 1 });
  const rightBtnHover = gsap
    .timeline({
      defaults: { duration: 0.2, ease: "set1" },
      paused: true,
    })
    .to("#right-panel-img-arrow", { y: -8 }, "<")
    .to("#right-panel-img-line", { y: -1.5, scale: 1.25 }, "<0.05");

  $("#right-panel-img-container").hover(
    function () {
      rightBtnHover.play();
    },
    function () {
      rightBtnHover.reverse();
    }
  );
  $("#right-panel-img-container").on("click", function () {
    rightBtnClick.restart();
  });

  //
  // 上下按鈕
  const upBtn = $("#up-btn");
  const downBtn = $("#down-btn");
  gsap.set(upBtn, { autoAlpha: 1 });
  gsap.set(downBtn, { autoAlpha: 1, rotate: 180 });
  gsap.set(upBtn.find("img")[1], { y: 40 });
  gsap.set(downBtn.find("img")[1], { y: 40 });
  const upBtnHover = gsap
    .timeline({
      defaults: { duration: 0.2, ease: "set1" },
      paused: true,
    })
    .to(upBtn.find("img")[0], { y: -40 })
    .to(upBtn.find("img")[1], { y: 0 }, "<")
    .to(upBtn, { backgroundColor: "#ea81af" }, "<")
    .to("#up-img-container", { scale: 1.2 }, "<");
  const downBtnHover = gsap
    .timeline({
      defaults: { duration: 0.2, ease: "set1" },
      paused: true,
    })
    .to(downBtn.find("img")[0], { y: -40 })
    .to(downBtn.find("img")[1], { y: 0 }, "<")
    .to(downBtn, { backgroundColor: "#ea81af" }, "<")
    .to("#down-img-container", { scale: 1.2 }, "<");
  const upBtnClick = gsap
    .timeline({
      defaults: { duration: 0.1, ease: "set1" },
      paused: true,
    })
    .to(upBtn, { scale: 0.6, yoyo: true, repeat: 1 });
  const downBtnClick = gsap
    .timeline({
      defaults: { duration: 0.1, ease: "set1" },
      paused: true,
    })
    .to(downBtn, { scale: 0.6, yoyo: true, repeat: 1 });

  upBtn.hover(
    function () {
      upBtnHover.play();
    },
    function () {
      upBtnHover.reverse();
    }
  );
  downBtn.hover(
    function () {
      downBtnHover.play();
    },
    function () {
      downBtnHover.reverse();
    }
  );
  upBtn.click(function () {
    upBtnClick.restart();
  });
  downBtn.click(function () {
    downBtnClick.restart();
  });
});
