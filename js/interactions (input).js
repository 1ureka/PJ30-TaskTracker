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

/**
 * 綁定自定義外框動畫至事件偵測
 * @param {JQuery} focusElement - 觸發焦點事件之元素
 * @param {JQuery} hoverElement - 觸發懸停事件之元素
 * @param {TimelineMax} timeline - 外框動畫
 */
function bindOutlineEvents(focusElement, hoverElement, timeline) {
  hoverElement.on("mouseover", function () {
    timeline.play();
  });
  hoverElement.on("mouseleave", function () {
    if (!focusElement.is(":focus")) timeline.reverse();
  });
  focusElement.focus(function () {
    timeline.play();
  });
  focusElement.blur(function () {
    timeline.reverse();
  });
}

$(document).ready(function () {
  // 創建包含物件的陣列
  const elements = [
    {
      focusSelector: "#search-input",
      hoverSelector: "#search-container",
      outlineWidth: 2,
      duration: 0.3,
    },
    {
      focusSelector: "#filter-select",
      hoverSelector: "#filter-select",
      outlineWidth: 2,
      duration: 0.3,
    },
    {
      focusSelector: "#year",
      hoverSelector: "#year",
      outlineWidth: 2,
      duration: 0.3,
    },
    {
      focusSelector: "#month",
      hoverSelector: "#month",
      outlineWidth: 2,
      duration: 0.3,
    },
    {
      focusSelector: "#task-input",
      hoverSelector: "#task-input",
      outlineWidth: 2,
      duration: 0.3,
    },
  ];

  // 循環遍歷陣列
  elements.forEach(
    ({ focusSelector, hoverSelector, outlineWidth, duration }) => {
      const focusElement = $(focusSelector);
      const hoverElement = $(hoverSelector);

      // 創建時間軸
      const timeline = createOutlineTimeline(
        focusElement,
        outlineWidth,
        duration
      );

      // 綁定事件
      bindOutlineEvents(focusElement, hoverElement, timeline);
    }
  );
});
