gsap.registerPlugin(ScrollTrigger);

gsap.registerPlugin(CustomEase);

CustomEase.create("set1", "0.455, 0.03, 0.515, 0.955");

$(document).ready(function () {
  //
  // 有關進出刪除狀態動畫
  gsap.set("#delete-done", { autoAlpha: 0 });
  let isDeleting = false;
  const enterDeleting = () => {
    isDeleting = true;
    gsap
      .timeline({
        defaults: { duration: 0.3, ease: "set1", overwrite: "auto" },
      })
      .to(".task-item, .separator", { left: 50 })
      .to(".task-delete", { autoAlpha: 1 }, "<0.1")
      .to("#delete-done", { autoAlpha: 1 }, "<");
  };
  const exitDeleting = () => {
    isDeleting = false;
    gsap
      .timeline({
        defaults: { duration: 0.3, ease: "set1", overwrite: "auto" },
      })
      .to("#delete-done", { autoAlpha: 0 })
      .to(".task-delete", { autoAlpha: 0 }, "<")
      .to(".task-item, .separator", { left: 0 }, "<0.1");
  };

  $("#delete").on("click", function () {
    if (isDeleting) {
      exitDeleting();
    } else {
      enterDeleting();
    }
  });

  $("#delete-done").on("click", function () {
    exitDeleting();
  });

  // 滑鼠右鍵
  $(document).on("contextmenu", function (e) {
    if (isDeleting) {
      e.preventDefault();
      exitDeleting();
    }
  });

  //
  // 彈出清空確認視窗
  let isCheckClear = false;
  const enterCheckClear = gsap.to("#cleared", {
    paused: true,
    duration: 0.5,
    ease: "set1",
    autoAlpha: 1,
  });

  $("#clear").on("click", function () {
    isCheckClear = true;
    enterCheckClear.timeScale(2).play();
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
    .to("#copied", { ease: "power3.out", duration: 0.5, autoAlpha: 1 })
    .to("#copied", { delay: 0.5, duration: 1, autoAlpha: 0 })
    .to("#copied", { top: 0, left: 0, duration: 0.1 });

  $(document).on("click", ".task-copy-container", function (e) {
    enterCopied.restart();
  });
});