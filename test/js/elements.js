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
      .to(container, { scale: 1.25 })
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

    this._trail = $("<img>").attr("src", "icons/broom (trail).png");
    this._broom = $("<img>").attr("src", "icons/broom.png");

    container.append(this._trail, this._broom);

    return [container];
  }

  _createTimeline() {
    const container = this.elements[0];

    gsap.set(this._broom, { rotate: -90 });
    gsap.set(this._trail, { x: 22, y: -5, rotate: -90 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(container, { scale: 1.25 })
      .to([this._broom, this._trail], { rotate: 0 }, "<");

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

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(container, { scale: 1.1 }, "<")
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
      .to(container, { scale: 1.25 }, "<")
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

    const t2 = gsap
      .timeline({ defaults: { ease: "set1", duration: 0.3 }, paused: true })
      .to(container, {
        scale: 1.1,
        rotate: "+=15",
        transformOrigin: "16.5px 17px",
      });

    return [t1, t2];
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
        defaults: { duration: 0.35, ease: "back.out(4)" },
        paused: true,
      })
      .fromTo(
        container,
        { marginLeft: 0, width: 0, height: 0, autoAlpha: 0 },
        { marginLeft: 10, width: 40, height: 40, autoAlpha: 1 }
      );

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

  hide() {
    this._show.reverse();
  }
}

class ScrollIcon extends IconInterface {
  constructor() {
    super();
  }

  _createIcon() {
    const container = $("<div>")
      .addClass("icon-container")
      .css({
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
    const clonedSelect = this._select.clone().appendTo("body");

    // size可以利用onload後拿取
    const size = {
      innerWidth: clonedSelect.innerWidth(),
      innerHeight: clonedSelect.innerHeight(),
    };

    clonedSelect.remove();

    // 創建所需元素
    this._outlineContainer = $("<div>").css({
      position: "absolute",
      width: size.innerWidth,
      height: size.innerHeight,
      clipPath: `inset(-${this.outlineWidth}px round 10px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
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
      width: this.width,
      height: this.height,
      clipPath: `inset(-${this.outlineWidth}px round 10px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
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
    if (!value) return this._textarea.val();

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
      width: this.width,
      height: this.height,
      clipPath: `inset(-${this.outlineWidth}px round 10px)`,
    });

    this._outline1 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
        bottom: -1 * this.outlineWidth,
        left: -1 * this.outlineWidth,
      })
      .appendTo(this._outlineContainer);

    this._outline2 = $("<div>")
      .css({
        position: "absolute",
        backgroundColor: "white",
        borderRadius: "10px",
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
