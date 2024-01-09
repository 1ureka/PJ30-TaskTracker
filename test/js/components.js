/**
 * 組件的預設空白類
 */
class component {
  constructor() {
    this._isAppendTo = false;
  }

  /**
   * 附加實例元素到指定的 DOM 選擇器。
   * @param {string} selector - DOM 選擇器。
   */
  appendTo(selector) {
    if (this._isAppendTo) return;
    this._isAppendTo = true;
    this.parent = selector;
    this.element = this.element.appendTo(selector);
    return this;
  }
}

class SidebarBottom extends component {
  constructor() {
    super();

    this._timelines = {};
    this._timelines.show = {};

    this.element = this._create();

    this._createTimelines();
  }

  _create() {
    const container = $("<div>").addClass("sidebar-bottom-container");

    const buttons = [
      { id: "delete", icon: new DeleteIcon(), label: "刪除" },
      { id: "clear", icon: new ClearIcon(), label: "清空" },
      { id: "save", icon: new SaveIcon(), label: "儲存" },
      { id: "load", icon: new LoadIcon(), label: "讀取" },
    ];

    buttons.forEach((config) => {
      this._createBtns(config).appendTo(container);
    });

    this._doneBtn = this._createExtraBtn().appendTo(container);

    this._createVersionDisplay().appendTo(container);

    return container;
  }

  _createBtns(config) {
    const btn = $("<button>").addClass("btn").data("type", config.id);

    const timelines = [
      gsap
        .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
        .to(btn, { scale: 1.1 }),
    ];

    const icon = config.icon;
    timelines.push(...icon.timelines);

    const label = new DoubleColorLabel(config.label);
    timelines.push(label.timeline);

    btn.append(icon.elements[0], label.element);

    this._bindClickTimeline(btn);
    this._bindHoverTimelines(btn, timelines);

    return btn;
  }

  _createExtraBtn() {
    const btn = $("<button>").addClass("done").data("type", "done");

    const timelines = [
      gsap
        .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
        .to(btn, { scale: 1.1 }),
    ];

    const label = new DoubleColorLabel("完成");
    timelines.push(label.timeline);

    btn.append(label.element);

    this._bindClickTimeline(btn);
    this._bindHoverTimelines(btn, timelines);

    return btn;
  }

  _createVersionDisplay() {
    const container = $("<div>")
      .attr("id", "version-display")
      .append($("<p>").text("版本： @1.1.0"));

    return container;
  }

  _bindClickTimeline(btn) {
    const tl = gsap
      .timeline({ defaults: { duration: 0.1, ease: "set1" }, paused: true })
      .to(btn, { scale: 0.7, yoyo: true, repeat: 1 });

    btn.on("click", () => tl.restart());
  }

  _bindHoverTimelines(btn, timelines) {
    timelines.forEach((tl) => {
      btn.on("mouseenter", () => tl.play());
      btn.on("mouseleave", () => tl.reverse());
    });
  }

  // 製作"直接"關於該組件的時間軸
  _createTimelines() {
    this._timelines.show.done = gsap
      .timeline({ defaults: { duration: 0.35 }, paused: true })
      .fromTo(
        this._doneBtn,
        {
          scale: 0.1,
          autoAlpha: 0,
        },
        {
          ease: "back.out(4.5)",
          scale: 1,
          autoAlpha: 1,
        }
      );
  }

  onSelect(handler) {
    if (this._handler) return this;

    this._handler = async (e) => {
      const element = $(e.target);
      const type = element.data("type");

      handler(type);

      const tl = this._timelines.show.done;

      if (type === "delete") {
        if (tl.paused()) {
          tl.play();
        } else {
          tl.reversed(!tl.reversed());
        }
      }

      if (type === "done") {
        await delay(100);
        tl.reverse();
      }
    };

    this.element.on("click", this._handler);
  }
}

class SidebarTop extends component {
  constructor() {
    super();

    this.element = this._create();
  }

  _create() {
    const container = $("<div>").addClass("sidebar-top-container");

    this._dateSelect = this._createDateSelect().appendTo(container);

    return container;
  }

  _createDateSelect() {
    const container = $("<div>").addClass("date-select");

    const timelines = [
      gsap.timeline({ paused: true }).to(container, {
        paddingTop: 10,
        paddingBottom: 10,
        duration: 0.15,
        ease: "set1",
      }),
    ];

    const icon = new CalendarIcon();
    timelines.push(...icon.timelines);

    const yearSelect = this._createYearSelect();

    container.append(icon.elements[0], yearSelect);

    this._bindHoverTimelines(container, timelines);

    return container;
  }

  _createYearSelect() {
    const currentYear = new Date().getFullYear();
    const years = Array.from(
      { length: currentYear - 2019 },
      (_, index) => 2020 + index
    );

    const select = new Select({
      options: years.map((number) => number.toString()),
      outlineWidth: 2,
      duration: 0.2,
    });

    if (formatLocalStorageDate()) {
      select.val(formatLocalStorageDate().year);
    } else {
      select.val(currentYear.toString());
    }

    return select.element;
  }

  _bindHoverTimelines(element, timelines) {
    timelines.forEach((tl) => {
      element.on("mouseenter", () => tl.play());
      element.on("mouseleave", () => tl.reverse());
    });
  }
}

class Header extends component {
  constructor() {
    super();
  }
}

class TaskList extends component {
  constructor() {
    super();

    this.mode = "normal";
  }

  switchMode(mode) {
    if (this.mode != "normal") return this;

    if (mode === "normal") {
      this.mode = "normal";

      return this;
    } else if (mode === "delete") {
      this.mode = "delete";

      // 之後可以一次選取所有deleteBtnB，並用GSAP出現，增進效能
    }
  }
}
