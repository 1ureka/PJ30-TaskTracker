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
      .to($(this), { scale: 0.5, yoyo: true, repeat: 1 });
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
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        paddingTop: 10,
        paddingBottom: 10,
      });
  });
  $(document).on("mouseleave", ".task-item", function () {
    gsap
      .timeline({
        defaults: { duration: 0.1, ease: "set1", overwrite: "auto" },
      })
      .to($(this), {
        paddingTop: 0,
        paddingBottom: 0,
      });
  });
});
