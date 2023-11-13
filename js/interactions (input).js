/**
 * 創建一個包裹指定元素的輪廓效果的時間軸。
 * @param {JQuery} inputElement - 目標元素的 jQuery 物件。
 * @param {number} outlineWidth - 輪廓的寬度（單位：px）。
 * @param {number} duration - 動畫的持續時間（秒）。
 * @returns {TimelineMax} - GSAP 時間軸物件，用於控制輪廓效果的動畫。
 */
function createOutlineTimeline(inputElement, outlineWidth, duration) {
  // 創建所需元素
  const outlineContainer = $("<div>").css({
    position: "absolute",
    padding: inputElement.css("padding"),
    minWidth: inputElement.width(),
    height: inputElement.height(),
    clipPath: `inset(-${outlineWidth}px round 10px)`,
  });
  const outline1 = $("<div>")
    .css({
      position: "absolute",
      backgroundColor: "white",
      borderRadius: "10px",
      bottom: -1 * outlineWidth,
      left: -1 * outlineWidth,
    })
    .appendTo(outlineContainer);
  const outline2 = $("<div>")
    .css({
      position: "absolute",
      backgroundColor: "white",
      borderRadius: "10px",
      top: -1 * outlineWidth,
      right: -1 * outlineWidth,
    })
    .appendTo(outlineContainer);

  // 放入實際DOM
  inputElement.before(outlineContainer);
  // 取得所需值
  const inputWidth = inputElement.innerWidth();
  const inputHeight = inputElement.innerHeight();

  // 返回時間軸
  return gsap
    .timeline({
      defaults: { duration: duration, ease: "set1" },
      paused: true,
    })
    .to(outline1, {
      width: inputWidth + outlineWidth * 2,
      height: inputHeight + outlineWidth * 2,
    })
    .to(
      outline2,
      {
        width: inputWidth + outlineWidth * 2,
        height: inputHeight + outlineWidth * 2,
      },
      "<"
    );
}

$(document).ready(function () {
  const searchFocus = createOutlineTimeline($("#search-input"), 2, 0.3);

  $("#search-container").hover(
    function () {
      searchFocus.play();
    },
    function () {
      searchFocus.reverse();
    }
  );

  const filterFocus = createOutlineTimeline($("#filter-select"), 2, 0.3);

  $("#filter-select").focus(function () {
    filterFocus.play();
  });
  $("#filter-select").blur(function () {
    filterFocus.reverse();
  });

  const yearFocus = createOutlineTimeline($("#year"), 2, 0.3);

  $("#year").focus(function () {
    yearFocus.play();
  });
  $("#year").blur(function () {
    yearFocus.reverse();
  });

  const monthFocus = createOutlineTimeline($("#month"), 2, 0.3);

  $("#month").focus(function () {
    monthFocus.play();
  });
  $("#month").blur(function () {
    monthFocus.reverse();
  });
});
