/**
 * 表示一個圖示的介面，包含圖示元素和時間軸。 @class
 */
class IconInterface {
  constructor() {
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

class DoubleColorLabel {
  constructor(text = "未定義") {
    this.element = this._create(text);
    this.timeline = this._createTimeline();
  }

  _create(text) {
    const container = $("<div>").addClass("label-container");

    this._whiteLabel = $("<label>").text(text);
    this._redLabel = $("<label>").text(text);

    container.append(this._whiteLabel, this._redLabel);

    return container;
  }

  _createTimeline() {
    gsap.set(this._redLabel, { y: -40 });

    const tl = gsap
      .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
      .to(this._whiteLabel, { y: 40 })
      .to(this._redLabel, { y: 0 }, "<");

    return tl;
  }
}
