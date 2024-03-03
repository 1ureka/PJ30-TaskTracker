/**
 * 表示一個圖示的介面，包含圖示元素和時間軸。 @class
 */
class IconInterface {
  constructor() {
    this._isAppendTo = false;
    /** 用於存儲圖示元素的陣列。 @type {JQuery[] | JQuery} */
    this.elements = this._createIcon();
    /** 於存儲時間軸的陣列。 @type {TimelineMax[] | TimelineMax} */
    this.timelines = this._createTimeline();
  }

  /**
   * 創建圖示元素的方法，應該由子類實現。
   * @private @abstract @returns {JQuery[] | JQuery} 一個包含圖示元素的陣列。
   */
  _createIcon() {
    return [];
  }

  /**
   * 創建時間軸的方法，應該由子類實現。
   * @private @abstract @returns {TimelineMax[] | TimelineMax} 一個包含時間軸的陣列。
   */
  _createTimeline() {
    return [];
  }

  /**
   * @param {string|HTMLElement|jQuery} selector - 要附加到的 DOM 元素。
   * 附加實例元素到指定的 DOM 選擇器。
   */
  appendTo(selector) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.elements.forEach((element) => element.appendTo($(selector)));

    return this;
  }
}

class DeleteIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._bin = $("<img>").attr("src", "icons/garbage bin.png");
    this._cover = $("<img>").attr("src", "icons/garbage bin (cover).png");

    container.append(this._bin, this._cover);

    this._linesContainer = $("<div>").css({
      position: "absolute",
      display: "flex",
      width: "40px",
      height: "40px",
      clipPath: "inset(0px 0px 0px 25px)",
    });

    container.append(this._linesContainer);

    this._lines = [];

    for (let index = 0; index < 2; index++) {
      for (let index = 1; index < 4; index++) {
        this._lines.push(
          $("<img>").attr("src", `icons/garbage bin (line${index}).png`)
        );
      }
    }

    this._lines = [...this._lines];

    this._lines.forEach((element) => element.appendTo(this._linesContainer));

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];
    const leftLines = this._lines.slice(0, 3);
    const rightLines = this._lines.slice(3);

    gsap.set(leftLines, { x: -20 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(container, { scale: 1.1 })
      .to(this._cover, { transformOrigin: "-5px 15px", rotate: -15 }, "<")
      .to(leftLines, { x: 0, stagger: -0.067 }, "<")
      .to(rightLines, { x: 20, stagger: -0.067 }, "<");

    return [tl];
  }
}

class ClearIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._broom = $("<img>").attr("src", "icons/broom.png");

    container.append(this._broom);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._broom, { rotate: -90 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(container, { scale: 1.1 })
      .to(this._broom, { rotate: 0 }, "<");

    return [tl];
  }
}

class SaveIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._frame1 = $("<img>").attr("src", "icons/save (frame).png");
    this._frame2 = $("<img>").attr("src", "icons/save (frame).png");
    this._inner = $("<img>").attr("src", "icons/save (inner).png");

    container.append(this._frame1, this._frame2, this._inner);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._frame2, { y: -40, rotateY: 180 });
    gsap.set(container, { x: -3, y: 1 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(container, { scale: 1.05 }, "<")
      .to(this._frame1, { rotateY: 180, y: 40 }, "<")
      .to(this._frame2, { rotateY: 0, y: 0 }, "<")
      .to(
        this._inner,
        {
          keyframes: {
            scale: [1, 0, 1],
          },
        },
        "<"
      );

    return [tl];
  }
}

class LoadIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._frame = $("<img>").attr("src", "icons/upload (frame).png");
    this._dot = $("<img>").attr("src", "icons/upload (dot).png");
    this._arrow1 = $("<img>").attr("src", "icons/upload (arrow).png");
    this._arrow2 = $("<img>").attr("src", "icons/upload (arrow).png");

    container.append(this._frame, this._dot, this._arrow1, this._arrow2);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._dot, { transformOrigin: "30.6px 30.8px" });
    gsap.set(this._arrow2, { y: 40 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(this._arrow1, { y: -40 })
      .to(this._arrow2, { y: 0 }, "<")
      .to(container, { scale: 1.1 }, "<")
      .to(
        this._dot,
        {
          keyframes: {
            scale: [1, 2, 1],
          },
        },
        "<"
      );

    return [tl];
  }
}

class CalendarIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._frame = $("<img>")
      .attr("src", "icons/calendar (frame).png")
      .appendTo(container);

    this._inners = Array.from({ length: 6 }, (_, index) =>
      $("<img>").attr("src", `icons/calendar (inner${index + 1}).png`)
    );

    this._inners.forEach((inner) => inner.appendTo(container));

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._inners, {
      autoAlpha: 0,
    });

    const t1 = gsap
      .timeline({
        defaults: { duration: 0.15, ease: "set1" },
        paused: true,
      })
      .to(
        this._inners,
        {
          stagger: 0.1,
          autoAlpha: 1,
        },
        "<"
      )
      .to(
        this._inners,
        {
          stagger: 0.1,
          autoAlpha: 0,
        },
        "<0.4"
      )
      .timeScale(1.5);

    const t2 = gsap
      .timeline({
        defaults: { duration: 0.3, ease: "set1" },
        paused: true,
      })
      .to(container, {
        scale: 1.1,
      });

    return [t1, t2];
  }
}

class SearchIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._clipPath = $("<div>")
      .css({
        position: "absolute",
        width: "100%",
        height: "100%",
        clipPath: "circle(10px at 16.5px 17px)",
        pointerEvents: "none",
      })
      .appendTo(container);

    this._inner1 = $("<div>")
      .css({
        position: "absolute",
        width: "12%",
        height: "150%",
        backgroundColor: "#ffff7a",
      })
      .appendTo(this._clipPath);

    this._inner2 = $("<div>")
      .css({
        position: "absolute",
        width: "12%",
        height: "150%",
        backgroundColor: "#ffff7a",
      })
      .appendTo(this._clipPath);

    this._magnifier = $("<img>")
      .attr("src", "icons/search.png")
      .appendTo(container);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set([this._inner1, this._inner2], { rotate: 5 });
    gsap.set(this._inner2, { x: -10 });

    const t1 = gsap
      .timeline({ defaults: { ease: "set1", duration: 0.6 }, paused: true })
      .to([this._inner1, this._inner2], {
        x: "+=40",
        rotate: 20,
      });

    return [t1];
  }
}

class EraserIcon extends IconInterface {
  constructor() {
    super();

    this._bindTimeline();
  }

  _createIcon() {
    const container = $("<div>")
      .addClass("icon-container")
      .css({ clipPath: "none", pointerEvents: "auto", cursor: "pointer" });

    this._line = $("<img>")
      .attr("src", "icons/erase (line).png")
      .appendTo(container);
    this._eraser = $("<img>")
      .attr("src", "icons/erase.png")
      .appendTo(container);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    this._show = gsap
      .timeline({
        defaults: { duration: 0.15, ease: "set1" },
        paused: true,
      })
      .fromTo(container, { autoAlpha: 0 }, { autoAlpha: 1 });

    this._click = gsap
      .timeline({ defaults: { duration: 0.1, ease: "set1" }, paused: true })
      .to(container, { scale: 0.5, yoyo: true, repeat: 1 });

    this._hover = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .fromTo(this._eraser, { x: 10 }, { x: -5 });

    return [];
  }

  _bindTimeline() {
    const container = this.elements[0];

    container.on("mouseenter", () => this._hover.play());
    container.on("mouseleave", () => this._hover.reverse());
    container.on("click", async () => {
      this._click.restart();
      await delay(150);

      this._show.reverse();
    });
  }

  show() {
    this._show.play();
  }

  async hide() {
    await delay(100);
    this._show.reverse();
  }
}

class ScrollIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container").css({
      width: "30px",
      height: "30px",
      clipPath: "circle(17.5px at center)",
    });

    this._white = $("<img>")
      .attr("src", "icons/up (white).png")
      .css({ width: "30px", height: "30px" });
    this._dark = $("<img>")
      .attr("src", "icons/up (dark).png")
      .css({ width: "30px", height: "30px" });

    container.append(this._white, this._dark);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._dark, { y: 40 });

    const tl = gsap
      .timeline({
        defaults: { duration: 0.2, ease: "set1" },
        paused: true,
      })
      .to(this._white, { y: -40 })
      .to(this._dark, { y: 0 }, "<")
      .to(container, { scale: 1.2 }, "<");

    return [tl];
  }
}

class CopyIcon extends IconInterface {
  constructor() {
    super();

    this._bindTimeline();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    this._left = $("<img>")
      .attr("src", "icons/copy (left).png")
      .css("pointerEvents", "none");
    this._right = $("<img>")
      .attr("src", "icons/copy (right).png")
      .css("pointerEvents", "none");

    container
      .append(this._left, this._right)
      .css({ cursor: "pointer", pointerEvents: "all", userSelect: "none" });

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    const t1 = gsap.timeline({ paused: "true" }).to(this._right, {
      duration: 0.4,
      ease: "set1",
      transformOrigin: "25px 15px",
      rotate: 270,
    });

    const t2 = gsap.timeline({ paused: "true" }).to(container, {
      duration: 0.1,
      ease: "set1",
      scale: 0.7,
      yoyo: true,
      repeat: 1,
    });

    return [t1, t2];
  }

  _bindTimeline() {
    const container = this.elements[0];

    container.on("mouseenter", () => this.timelines[0].play());
    container.on("mouseleave", () => this.timelines[0].reverse());

    container.on("click", () => this.timelines[1].restart());
  }
}

class ArrowIcon extends IconInterface {
  constructor() {
    super();

    this._bindTimeline();
  }

  _createIcon() {
    const container = $("<div>").addClass("icon-container");

    const container2 = $("<div>")
      .addClass("icon-container")
      .appendTo(container);

    this._arrow = $("<img>").attr("src", "icons/top (arrow).png");
    this._line = $("<img>").attr("src", "icons/top (line).png");

    container2.append(this._arrow, this._line);

    return [container];
  }

  _createTimeline() {
    this._timelines = {};

    const container = this.elements[0];

    this._timelines.click = () =>
      gsap
        .timeline({ defaults: { duration: 0.05, ease: "set1" } })
        .to(container.children(), { scale: 0.65, yoyo: true, repeat: 1 });

    this._timelines.hover = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(this._arrow, { y: -8 }, "<")
      .to(this._line, { y: -1.5, scale: 1.25 }, "<0.05");

    return [];
  }

  _bindTimeline() {
    const container = this.elements[0];

    container.on("click", () => this._timelines.click());
    container.on("mouseover", () => this._timelines.hover.play());
    container.on("mouseleave", () => this._timelines.hover.reverse());
  }

  addClass(className) {
    this.elements[0].addClass(className);
  }
}

//
//
//

/**
 * DoubleColorLabel 類別用於創建具有雙色標籤效果的元素。
 * @class
 */
class DoubleColorLabel {
  /**
   * DoubleColorLabel 類別的建構子。
   * @constructor
   * @param {string} - 標籤的初始文本內容。
   */
  constructor(text = "未定義") {
    this._isAppendTo = false;
    /**
     * 元素的根容器。
     * @type {jQuery}
     */
    this.element = this._create(text);
    /**
     * GSAP 時間軸，用於處理標籤的動畫效果。
     * @type {TimelineMax}
     */
    this.timeline = this._createTimeline();
  }

  /**
   * 私有方法，用於創建標籤元素。
   * @private
   * @param {string} text - 標籤的文本內容。
   * @returns {jQuery} - 創建的標籤元素的 jQuery 物件。
   */
  _create(text) {
    const container = $("<div>").addClass("label-container");

    this._whiteLabel = $("<label>").text(text);
    this._redLabel = $("<label>").text(text);

    container.append(this._whiteLabel, this._redLabel);

    return container;
  }

  /**
   * 私有方法，用於創建 GSAP 時間軸。
   * @private
   * @returns {TimelineMax} - 創建的 GSAP 時間軸。
   */
  _createTimeline() {
    gsap.set(this._redLabel, { y: -40 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(this._whiteLabel, { y: 40 })
      .to(this._redLabel, { y: 0 }, "<");

    return tl;
  }

  /**
   * 公開方法，用於附加元素進DOM。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {DoubleColorLabel} - DoubleColorLabel 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
}

/**
 * Select 類別用於創建自定義樣式的下拉選單。
 * @class
 */
class Select {
  /**
   * Select 類別的建構子。
   * @constructor
   * @param {Object} config - 選單的配置項。
   * @param {Array<string>} config.options - 選單的選項。
   * @param {number} config.outlineWidth - 選單輪廓的寬度。
   * @param {number} config.duration - 選單動畫的持續時間。
   */
  constructor(config) {
    this._isAppendTo = false;
    /**
     * 選單的根容器。
     * @type {jQuery}
     */
    this.element = this._create(config);
  }

  /**
   * 私有方法，用於創建選單元素。
   * @private
   * @param {Object} config - 選單的配置項。
   * @param {Array<string>} config.options - 選單的選項。
   * @param {number} config.outlineWidth - 選單輪廓的寬度。
   * @param {number} config.duration - 選單動畫的持續時間。
   * @returns {jQuery} - 創建的選單元素的 jQuery 物件。
   */
  _create(config) {
    // 取出所需變數
    this.options = config.options;
    this.outlineWidth = config.outlineWidth;
    this.duration = config.duration;

    const container = $("<div>").addClass("select-container");

    this._select = $("<select>").appendTo(container);

    this.options.forEach((option) => {
      $(`<option value="${option}">${option}</option>`).appendTo(this._select);
    });

    this._createOutline()._createTimeline()._bindTimeline();

    return container;
  }

  /**
   * 私有方法，用於創建選單的外框。
   * @private
   * @returns {Select} - Select 類別的實例。
   */
  _createOutline() {
    // 創建所需元素
    this._outlineContainer = $("<div>").css({
      position: "absolute",
      width: "100%",
      height: "100%",
      clipPath: `inset(-${this.outlineWidth}px round 5px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        top: -1 * this.outlineWidth,
        right: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._select.before(this._outlineContainer);

    return this;
  }

  /**
   * 私有方法，用於創建 GSAP 時間軸。
   * @private
   * @returns {Select} - Select 類別的實例。
   */
  _createTimeline() {
    this._timeline = gsap
      .timeline({
        defaults: { duration: this.duration, ease: "set1" },
        paused: true,
      })
      .to(this._outline1, {
        width: `calc(100% + ${this.outlineWidth * 2}px)`,
        height: `calc(100% + ${this.outlineWidth * 2}px)`,
      })
      .to(
        this._outline2,
        {
          width: `calc(100% + ${this.outlineWidth * 2}px)`,
          height: `calc(100% + ${this.outlineWidth * 2}px)`,
        },
        "<"
      );

    return this;
  }

  /**
   * 私有方法，用於綁定事件和時間軸。
   * @private
   * @returns {Select} - Select 類別的實例。
   */
  _bindTimeline() {
    const hoverElement = this._select;
    const focusElement = this._select;

    hoverElement.on("mouseover", () => {
      this._timeline.play();
    });
    hoverElement.on("mouseleave", () => {
      if (!focusElement.is(":focus")) this._timeline.reverse();
    });
    focusElement.on("focus", () => {
      this._timeline.play();
    });
    focusElement.on("blur", () => {
      this._timeline.reverse();
    });

    return this;
  }

  /**
   * 公開方法，用於設置或獲取選中的值。
   * @param {string} [value] - 要設置的值。如果未提供，則返回當前選中的值。
   * @returns {string | Select} - Select 類別的實例。
   */
  val(value) {
    if (!value) return this._select.val();

    this._select.val(value);

    return this;
  }

  /**
   * 公開方法，用於附加元素進DOM。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {Select} - Select 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
}

/**
 * TextArea 類別用於創建具有自定義樣式的文字區域。
 * @class
 */
class TextArea {
  /**
   * TextArea 類別的建構子。
   * @constructor
   * @param {Object} config - 文字區域的配置項。
   * @param {number} config.width - 文字區域的寬度。
   * @param {number} config.height - 文字區域的高度。
   * @param {string} config.placeholder - 文字區域的預設提示文字。
   * @param {number} config.outlineWidth - 文字區域輪廓的寬度。
   * @param {number} config.duration - 文字區域動畫的持續時間。
   */
  constructor(config) {
    this._isAppendTo = false;
    /**
     * 選單的根容器。
     * @type {jQuery}
     */
    this.element = this._create(config);
  }

  /**
   * 私有方法，用於創建文字區域元素。
   * @private
   * @param {Object} config - 文字區域的配置項。
   * @returns {jQuery} - 創建的文字區域元素的 jQuery 物件。
   */
  _create(config) {
    this.width = config.width;
    this.height = config.height;
    this.placeholder = config.placeholder;
    this.outlineWidth = config.outlineWidth;
    this.duration = config.duration;

    const container = $("<div>")
      .addClass("textarea-container")
      .css({ width: this.width, height: this.height });

    this._textarea = $("<textarea>")
      .appendTo(container)
      .attr("placeholder", this.placeholder);

    this._createOutline()._createTimeline()._bindTimeline();

    return container;
  }

  /**
   * 私有方法，用於創建文字區域的輪廓。
   * @private
   * @returns {TextArea} - TextArea 類別的實例。
   */
  _createOutline() {
    this._outlineContainer = $("<div>").css({
      position: "absolute",
      width: "100%",
      height: "100%",
      clipPath: `inset(-${this.outlineWidth}px round 5px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        top: -1 * this.outlineWidth,
        right: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._textarea.before(this._outlineContainer);

    return this;
  }

  /**
   * 私有方法，用於創建 GSAP 時間軸。
   * @private
   * @returns {TextArea} - TextArea 類別的實例。
   */
  _createTimeline() {
    this._timeline = gsap
      .timeline({
        defaults: { duration: this.duration, ease: "set1" },
        paused: true,
      })
      .to(this._outline1, {
        width: `calc(100% + ${this.outlineWidth * 2}px)`,
        height: `calc(100% + ${this.outlineWidth * 2}px)`,
      })
      .to(
        this._outline2,
        {
          width: `calc(100% + ${this.outlineWidth * 2}px)`,
          height: `calc(100% + ${this.outlineWidth * 2}px)`,
        },
        "<"
      );

    return this;
  }

  /**
   * 私有方法，用於綁定事件和時間軸。
   * @private
   * @returns {TextArea} - TextArea 類別的實例。
   */
  _bindTimeline() {
    const hoverElement = this._textarea;
    const focusElement = this._textarea;

    hoverElement.on("mouseover", () => {
      this._timeline.play();
    });
    hoverElement.on("mouseleave", () => {
      if (!focusElement.is(":focus")) this._timeline.reverse();
    });
    focusElement.on("focus", () => {
      this._timeline.play();
    });
    focusElement.on("blur", () => {
      this._timeline.reverse();
    });

    return this;
  }

  /**
   * 公開方法，用於設置或獲取文字區域的值。
   * @param {string} [value] - 要設置的值。如果未提供，則返回當前文字區域的值。
   * @returns {TextArea} - TextArea 類別的實例。
   */
  val(value) {
    if (!value && value !== "") return this._textarea.val();

    this._textarea.val(value);

    return this;
  }

  /**
   * 公開方法，用於將文字區域元素附加到指定的 DOM 元素。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {TextArea} - TextArea 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
}

/**
 * TextInput 類別用於創建具有自定義樣式的文字輸入框。
 * @class
 */
class TextInput {
  /**
   * TextInput 類別的建構子。
   * @constructor
   * @param {Object} config - 文字輸入框的配置項。
   * @param {number} config.width - 文字輸入框的寬度。
   * @param {number} config.height - 文字輸入框的高度。
   * @param {string} config.placeholder - 文字輸入框的預設提示文字。
   * @param {number} config.outlineWidth - 文字輸入框輪廓的寬度。
   * @param {number} config.duration - 文字輸入框動畫的持續時間。
   */
  constructor(config) {
    this._isAppendTo = false;
    /**
     * 選單的根容器。
     * @type {jQuery}
     */
    this.element = this._create(config);
  }

  /**
   * 私有方法，用於創建文字輸入框元素。
   * @private
   * @param {Object} config - 文字輸入框的配置項。
   * @returns {jQuery} - 創建的文字輸入框元素的 jQuery 物件。
   */
  _create(config) {
    this.width = config.width;
    this.height = config.height;
    this.placeholder = config.placeholder;
    this.outlineWidth = config.outlineWidth;
    this.duration = config.duration;

    const container = $("<div>")
      .addClass("input-container")
      .css({ width: this.width, height: this.height });

    this._input = $("<input>")
      .attr("type", "text")
      .appendTo(container)
      .attr("placeholder", this.placeholder);

    this._createOutline()._createTimeline();

    return container;
  }

  /**
   * 私有方法，用於創建文字輸入框的輪廓。
   * @private
   * @returns {TextInput} - TextInput 類別的實例。
   */
  _createOutline() {
    this._outlineContainer = $("<div>").css({
      position: "absolute",
      width: "100%",
      height: "100%",
      clipPath: `inset(-${this.outlineWidth}px round 5px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "5px",
        top: -1 * this.outlineWidth,
        right: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._input.before(this._outlineContainer);

    return this;
  }

  /**
   * 私有方法，用於創建 GSAP 時間軸。
   * @private
   * @returns {TextInput} - TextInput 類別的實例。
   */
  _createTimeline() {
    this.timeline = gsap
      .timeline({
        defaults: { duration: this.duration, ease: "set1" },
        paused: true,
      })
      .to(this._outline1, {
        width: `calc(100% + ${this.outlineWidth * 2}px)`,
        height: `calc(100% + ${this.outlineWidth * 2}px)`,
      })
      .to(
        this._outline2,
        {
          width: `calc(100% + ${this.outlineWidth * 2}px)`,
          height: `calc(100% + ${this.outlineWidth * 2}px)`,
        },
        "<"
      );

    return this;
  }

  /**
   * 公開方法，用於設置或獲取文字輸入框的值。
   * @param {string} [value] - 要設置的值。如果未提供，則返回當前文字輸入框的值。
   * @returns {TextInput} - TextInput 類別的實例。
   */
  val(value) {
    if (!value && value !== "") return this._input.val();

    this._input.val(value);

    return this;
  }

  /**
   * 公開方法，用於將文字輸入框元素附加到指定的 DOM 元素。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {TextInput} - TextInput 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
}

/**
 * Task 類別用於創建任務元素，包含刪除、分類、狀態和文字內容。
 * @class
 */
class Task {
  /** Task 類別的建構子。 */
  constructor(config) {
    /** 是否已附加到 DOM 的標誌。 @type {boolean} @private */
    this._isAppendTo = false;
    /** 任務資訊。 @type {Object} @private */
    this._info = config;
    /** 任務元素的根容器。 @type {jQuery} */
    this.element = this._create(config);

    // 綁定各種事件
    this._bindDeleteEvents();
    this._bindTagsEvents();
    this._bindTextEvents();
    this._bindCopyEvents();
    this._bindHoverEvents();
  }

  _create(config) {
    // 主容器
    const container = $("<div>").addClass("task-container");
    container.data("info", JSON.stringify(config));

    // 上半部容器
    const infoContainer = $("<div>").addClass("task-info-container");
    const tagsContainer = $("<div>").addClass("task-tags-container");
    const menuContainer = $("<div>").addClass("task-menu-container");
    infoContainer.append(tagsContainer, menuContainer).appendTo(container);

    // 上半部內容
    const tags = this._createTags(config.category, config.status);
    tags.forEach((span) => span.appendTo(tagsContainer));
    const buttons = this._createButtons();
    buttons.forEach((btn) => btn.appendTo(menuContainer));

    // 下半部
    $("<div>")
      .addClass("task-p-container")
      .append($("<p>").text(config.text))
      .appendTo(container);

    return container;
  }

  _createTags(category, status) {
    return [
      $("<span>")
        .addClass("task-tag")
        .addClass(`task-${category}`)
        .text(`•${category}`),
      $("<span>")
        .addClass("task-tag")
        .addClass(`task-${status}`)
        .text(`•${STATUSMAP[status]}`),
    ];
  }

  _createButtons() {
    return [
      $("<button>")
        .addClass("task-edit-button")
        .append(
          $("<img>").attr("src", "icons/pencil.png"),
          $("<span>").addClass("tip").text("編輯")
        ),
      $("<button>")
        .addClass("task-copy-button")
        .append(
          $("<img>").attr("src", "icons/copy (left).png"),
          $("<img>").attr("src", "icons/copy (right).png"),
          $("<span>").addClass("tip").text("複製")
        ),
      $("<button>")
        .addClass("task-delete-button")
        .append(this._createSVG(), $("<span>").addClass("tip").text("刪除")),
    ];
  }

  _createSVG() {
    return $(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 50 59"
    ><path
      fill="#B5BAC1"
      d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"
    ></path>
    <path
      fill="#B5BAC1"
      d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"
    ></path>
    <path
      fill="#B5BAC1"
      d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
      clip-rule="evenodd"
      fill-rule="evenodd"
    ></path>
    <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
    </svg>
    `);
  }

  _bindDeleteEvents() {
    this.element.on("click", ".task-delete-button", async () => {
      gsap.to(this.element, {
        duration: 0.1,
        ease: "set1",
        y: "+=5",
        yoyo: true,
        repeat: 1,
      });

      await delay(100);

      this.element.fadeOut(500, () => {
        this.element.trigger("task-delete");
        this.destroy();
      });
    });
  }

  _bindTagsEvents() {
    const tags = this.element.find(".task-tag");

    this.element.on("click", ".task-tag:first", (e) => {
      const select = $("<div>").addClass("task-options popup");

      CATEGORISE.forEach((category) =>
        select.append($("<div>").addClass("task-option").text(category))
      );

      select.one("click", ".task-option", (e) => {
        const option = $(e.target).text();

        const originalClass = $(tags[0]).attr("class").split(" ")[1];

        this._info.category = option;
        this.element.data("info", JSON.stringify(this._info));

        $(tags[0])
          .removeClass(originalClass)
          .addClass(`task-${option}`)
          .text(`•${option}`);

        this.element.trigger("task-change");

        select.blur();
      });

      if (e.clientY > window.innerHeight / 2) {
        gsap.set(select, { top: e.clientY - 20, left: e.clientX, y: "-100%" });
      } else {
        gsap.set(select, { top: e.clientY + 20, left: e.clientX });
      }

      select.attr("tabindex", "0").appendTo("body").focus();

      select.on("blur", async () => {
        await delay(350);
        select.remove();
      });
    });

    this.element.on("click", ".task-tag:last", (e) => {
      const select = $("<div>").addClass("task-options popup");

      Object.values(STATUSMAP).forEach((status) =>
        select.append($("<div>").addClass("task-option").text(status))
      );

      select.one("click", ".task-option", (e) => {
        const option = $(e.target).text();

        const originalClass = $(tags[1]).attr("class").split(" ")[1];

        const reversedStatusMap = Object.entries(STATUSMAP).reduce(
          (reversedMap, [key, value]) => {
            reversedMap[value] = key;
            return reversedMap;
          },
          {}
        );

        this._info.status = reversedStatusMap[option];
        this.element.data("info", JSON.stringify(this._info));

        $(tags[1])
          .removeClass(originalClass)
          .addClass(`task-${reversedStatusMap[option]}`)
          .text(`•${option}`);

        this.element.trigger("task-change");

        select.blur();
      });

      if (e.clientY > window.innerHeight / 2) {
        gsap.set(select, { top: e.clientY - 20, left: e.clientX, y: "-100%" });
      } else {
        gsap.set(select, { top: e.clientY + 20, left: e.clientX });
      }

      select.attr("tabindex", "0").appendTo("body").focus();

      select.on("blur", async () => {
        await delay(350);
        select.remove();
      });
    });
  }

  _bindTextEvents() {
    let textarea;

    this.element.on("click", ".task-edit-button", async () => {
      const p = this.element.find("p");
      if (p.length === 0) return;

      await delay(100);

      // 停止選單編輯行為
      $(":root").css("--is-task-list-hovable", "0");
      $(":root").css("--is-task-menu-usable", "none");

      // 創建一個 textarea 元素
      textarea = $("<textarea></textarea>")
        .val(p.text())
        .css("width", p.width())
        .css("height", p.height() + 10);

      // 取得最小寬度
      this.element.css("min-width", "40%");
      const minWidth = p.width();
      this.element.css("min-width", "");

      // 替換 p 元素為 textarea
      p.replaceWith(textarea);
      textarea.focus();

      // 給足夠空間編輯
      textarea.css("width", minWidth);

      this.element.trigger("task-edit-focus");
    });

    this.element.on("keyup", "textarea", (e) => {
      this._info.text = textarea.val();
      this.element.data("info", JSON.stringify(this._info));
      this.element.trigger("task-change");
    });

    this.element.on("blur", "textarea", (e) => {
      this._info.text = textarea.val();
      this.element.data("info", JSON.stringify(this._info));
      this.element.trigger("task-change");

      // 替換 textarea 元素為 p
      const p = $("<p></p>").text(this._info.text);
      textarea.replaceWith(p);

      // 恢復選單編輯行為
      $(":root").css("--is-task-list-hovable", "1");
      $(":root").css("--is-task-menu-usable", "auto");

      this.element.trigger("task-edit-blur");
    });

    this.element.on("input", "textarea", (e) => {
      const currentHeight = textarea.height();

      gsap.set(textarea, { height: "auto" });
      const targetHeight = textarea[0].scrollHeight;

      gsap.fromTo(
        textarea,
        { height: currentHeight },
        { ease: "set1", duration: 0.1, height: targetHeight }
      );
    });
  }

  _bindCopyEvents() {
    this.element.on("click", ".task-copy-button", () => {
      const info = JSON.parse(this.element.data("info"));
      const textToCopy = info.text;
      navigator.clipboard.writeText(textToCopy);
    });

    return this;
  }

  _bindHoverEvents() {
    this.element.on("mouseover", (e) => {
      if (
        $(e.target).hasClass("task-options") ||
        $(e.target).hasClass("task-option")
      )
        $(":root").css("--is-task-list-hovable", "0");
    });
    this.element.on("mouseout", (e) => {
      if (
        $(e.target).hasClass("task-options") ||
        $(e.target).hasClass("task-option")
      )
        $(":root").css("--is-task-list-hovable", "1");
    });
  }
  /** @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。 @returns {Task} - Task 類別的實例。 */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
  /** 用於銷毀 Task 類別的實例。 */
  destroy() {
    this.element.remove();
    this._info = null;
  }

  static createStyle() {
    const styleText = Object.keys(COLORMAP)
      .map(
        (key) =>
          `.task-${key}{background-color:${COLORMAP[key]}}.task-${key}:hover{outline:3px solid ${COLORMAP[key]}90}`
      )
      .join("");

    $("<style>").text(styleText).appendTo("head");
  }

  static onCopy(handler) {
    if (this._copyHandler) return;

    this._copyHandler = (e) => {
      const coordinate = {
        top: e.clientY,
        left: e.clientX,
      };

      handler(coordinate);
    };

    $("body").on("click", ".task-copy-button", this._copyHandler);
  }
}

/**
 * Separator 類別用於創建分隔線元素，包含刪除圖標。
 * @class
 */
class Separator {
  /**
   * Separator 類別的建構子。
   * @constructor
   */
  constructor() {
    this._isAppendTo = false;

    this.element = this._create();
    this._bindDeleteEvents();
  }

  /**
   * 私有方法，用於創建分隔線元素。
   * @private
   * @returns {jQuery} - 創建的分隔線元素的 jQuery 物件。
   */
  _create() {
    const separator = $("<div>")
      .addClass("separator")
      .append(
        $("<button>").append(
          this._createSVG(),
          $("<span>").addClass("tip").text("刪除")
        )
      );

    return separator;
  }

  _createSVG() {
    return $(`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 50 59"
    ><path
      fill="#B5BAC1"
      d="M0 7.5C0 5.01472 2.01472 3 4.5 3H45.5C47.9853 3 50 5.01472 50 7.5V7.5C50 8.32843 49.3284 9 48.5 9H1.5C0.671571 9 0 8.32843 0 7.5V7.5Z"
    ></path>
    <path
      fill="#B5BAC1"
      d="M17 3C17 1.34315 18.3431 0 20 0H29.3125C30.9694 0 32.3125 1.34315 32.3125 3V3H17V3Z"
    ></path>
    <path
      fill="#B5BAC1"
      d="M2.18565 18.0974C2.08466 15.821 3.903 13.9202 6.18172 13.9202H43.8189C46.0976 13.9202 47.916 15.821 47.815 18.0975L46.1699 55.1775C46.0751 57.3155 44.314 59.0002 42.1739 59.0002H7.8268C5.68661 59.0002 3.92559 57.3155 3.83073 55.1775L2.18565 18.0974ZM18.0003 49.5402C16.6196 49.5402 15.5003 48.4209 15.5003 47.0402V24.9602C15.5003 23.5795 16.6196 22.4602 18.0003 22.4602C19.381 22.4602 20.5003 23.5795 20.5003 24.9602V47.0402C20.5003 48.4209 19.381 49.5402 18.0003 49.5402ZM29.5003 47.0402C29.5003 48.4209 30.6196 49.5402 32.0003 49.5402C33.381 49.5402 34.5003 48.4209 34.5003 47.0402V24.9602C34.5003 23.5795 33.381 22.4602 32.0003 22.4602C30.6196 22.4602 29.5003 23.5795 29.5003 24.9602V47.0402Z"
      clip-rule="evenodd"
      fill-rule="evenodd"
    ></path>
    <path fill="#B5BAC1" d="M2 13H48L47.6742 21.28H2.32031L2 13Z"></path>
    </svg>
    `);
  }

  /**
   * 私有方法，綁定刪除相關事件。
   * @private
   * @returns {Separator} - Separator 類別的實例。
   */
  _bindDeleteEvents() {
    this.element.on("click", "button", async () => {
      gsap.to(this.element, {
        duration: 0.1,
        ease: "set1",
        y: "+=5",
        yoyo: true,
        repeat: 1,
      });

      await delay(100);

      this.element.fadeOut(500, () => {
        this.element.trigger("task-delete");
        this.destroy();
      });
    });

    return this;
  }

  /**
   * 公開方法，用於將分隔線元素附加到指定的 DOM 元素。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {Separator} - Separator 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }

  /**
   * 公開方法，用於銷毀 Separator 類別的實例。
   */
  destroy() {
    this.element.remove();
  }
}

/**
 * Bulb 類別用於創建可控制顏色和強度的燈泡元素。
 * @class
 */
class Bulb {
  /**
   * Bulb 類別的建構子。
   * @constructor
   * @param {number} width - 燈泡的寬度。
   * @param {number} height - 燈泡的高度。
   */
  constructor(width, height) {
    this._isAppendTo = false;

    this.element = this._createBulb(width, height);
  }

  /**
   * 私有方法，用於創建燈泡元素。
   * @private
   * @param {number} width - 燈泡的寬度。
   * @param {number} height - 燈泡的高度。
   * @returns {jQuery} - 燈泡元素的 jQuery 對象。
   */
  _createBulb(width, height) {
    const container = $("<div>")
      .addClass("bulb-container")
      .css({
        width: `${width + 20}px`,
        height: `${height + 20}px`,
      });

    const bulb = $("<div>")
      .addClass("bulb")
      .css({ width: `${width}px`, height: `${height}px` });
    const bulbFilter = $("<div>")
      .addClass("bulb-filter")
      .css({ width: `${width}px`, height: `${height}px` });

    bulbFilter.appendTo(bulb);

    bulb.appendTo(container);

    return container;
  }

  /**
   * 創建控制顏色和強度的動畫時間軸。
   * @param {string} toColor - 目標顏色。
   * @param {number} [toIntensity=1] - 目標強度，預設值為 1。
   * @returns {gsap.timeline} - GSAP 時間軸對象。
   */
  createTimeline(toColor, toIntensity = 1) {
    const i = toIntensity;
    const c = toColor;

    const bulb = this.element.find(".bulb");
    const bulbFilter = this.element.find(".bulb-filter");

    const tl = gsap
      .timeline({
        defaults: { duration: 0.2, ease: "set1" },
        paused: true,
      })
      .to(bulb, { backgroundColor: c }, "<")
      .to(bulbFilter, { filter: "blur(3px)" }, "<")
      .to(bulb, { boxShadow: `0 0 20px ${i * 5}px ${c}` }, "<")
      .to(bulb, { boxShadow: `0 0 20px 0px ${c}` });

    return tl;
  }

  /**
   * 公開方法，用於將元素附加到指定的 DOM 元素。
   * @param {string|HTMLElement|jQuery} element - 要附加到的 DOM 元素。
   * @returns {Bulb} - Bulb 類別的實例。
   */
  appendTo(element) {
    if (this._isAppendTo) return this;

    this._isAppendTo = true;

    this.element.appendTo($(element));

    return this;
  }
}
