const categorise = [
  "未分類",
  "PJ24",
  "PJ25",
  "PJ26",
  "PJ27",
  "PJ28",
  "PJ29",
  "PJ30",
];

const status = ["未完成", "跳過", "完成", "失敗"];

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
    if (this._isAppendTo) return this;
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

    this._handlers = {};

    this.element = this._create();
  }

  _create() {
    const container = $("<div>").addClass("sidebar-top-container");

    this._dateSelect = this._createDateSelect().appendTo(container);

    this._textarea = new TextArea({
      placeholder: "新增工作",
      width: 240,
      height: 210,
      outlineWidth: 2,
      duration: 0.2,
    });

    this._textarea.appendTo(container);

    this._categorySelect = new Select({
      options: categorise,
      outlineWidth: 2,
      duration: 0.2,
    });

    this._categorySelect.element.css("margin", "10px");
    this._categorySelect.appendTo(container);

    this._addBtn = this._createAddBtn().appendTo(container);

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
    icon.appendTo(container);
    timelines.push(...icon.timelines);

    const { year, month } = this._getLocalStorageDate();

    this._yearSelect = this._createYearSelect();
    this._yearSelect.appendTo(container).val(year);

    this._monthSelect = this._createMonthSelect();
    this._monthSelect.appendTo(container).val(month);

    this._bindHoverTimelines(container, timelines);

    return container;
  }

  _getLocalStorageDate() {
    const localStorageDate = formatLocalStorageDate();

    if (localStorageDate) return localStorageDate;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    return {
      year: currentYear,
      month: currentMonth.toString().padStart(2, "0"),
    };
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

    return select;
  }

  _createMonthSelect() {
    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(this._yearSelect.val());

    const endMonth =
      selectedYear === currentYear ? new Date().getMonth() + 1 : 12;

    const months = Array.from({ length: endMonth }, (_, index) =>
      (index + 1).toString().padStart(2, "0")
    );

    const select = new Select({
      options: months,
      outlineWidth: 2,
      duration: 0.2,
    });

    return select;
  }

  _resetMonthOptions() {
    const currentYear = new Date().getFullYear();
    const selectedYear = parseInt(this._yearSelect.val());

    const endMonth =
      selectedYear === currentYear ? new Date().getMonth() + 1 : 12;

    const months = Array.from({ length: endMonth }, (_, index) =>
      (index + 1).toString().padStart(2, "0")
    );

    const select = this._monthSelect._select;
    select.empty();

    months.forEach((month) => {
      select.append(`<option value="${month}">${month}</option>`);
    });

    return this;
  }

  _createAddBtn() {
    const btn = $("<button>").addClass("btn");

    const label = new DoubleColorLabel("新增");
    label.appendTo(btn);

    this._bindClickTimeline(btn);
    this._bindHoverTimelines(btn, [
      label.timeline,
      gsap
        .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
        .to(btn, { scale: 1.1 }),
    ]);

    return btn;
  }

  _bindClickTimeline(btn) {
    const tl = gsap
      .timeline({ defaults: { duration: 0.1, ease: "set1" }, paused: true })
      .to(btn, { scale: 0.7, yoyo: true, repeat: 1 });

    btn.on("click", () => tl.restart());
  }

  _bindHoverTimelines(element, timelines) {
    timelines.forEach((tl) => {
      element.on("mouseenter", () => tl.play());
      element.on("mouseleave", () => tl.reverse());
    });
  }

  onDateSelect(handler) {
    if (this._handlers.date) return this;

    const yearSelect = this._yearSelect.element;
    const monthSelect = this._monthSelect.element;

    const getDate = () => {
      return { year: this._yearSelect.val(), month: this._monthSelect.val() };
    };

    this._handlers.date = {
      year: () => {
        // 根據年份初始化月份
        this._resetMonthOptions();

        handler(getDate());
      },
      month: () => {
        handler(getDate());
      },
    };

    yearSelect.on("change", this._handlers.date.year);
    monthSelect.on("change", this._handlers.date.month);

    return this;
  }

  onAdd(handler) {
    if (this._handlers.add) return this;

    this._handlers.add = () => {
      const category = this._categorySelect.val();
      const content = this._textarea.val();

      if (content.trim()) handler({ category, content });
    };

    this._addBtn.on("click", this._handlers.add);
  }
}

class Header extends component {
  constructor() {
    super();

    this._handlers = {};

    this._create();
  }

  _create() {
    this.element = $("#header");

    const input = this._createSearchInput();
    const select = this._createCategorySelect();

    this.element.append(input, select);

    return this;
  }

  _createSearchInput() {
    const container = $("<div>").addClass("search-input");

    const timelines = [];

    const searchIcon = new SearchIcon();
    searchIcon.appendTo(container);
    timelines.push(...searchIcon.timelines);

    this._input = new TextInput({
      placeholder: "搜尋",
      width: 410,
      height: 40,
      outlineWidth: 2,
      duration: 0.2,
    });

    this._input.appendTo(container);
    const timeline = this._input.timeline;
    const hoverElement = container;
    const focusElement = this._input._input;

    hoverElement.on("mouseover", () => {
      timeline.play();
    });
    hoverElement.on("mouseleave", () => {
      if (!focusElement.is(":focus")) timeline.reverse();
    });
    focusElement.on("focus", () => {
      timeline.play();
    });
    focusElement.on("blur", () => {
      timeline.reverse();
    });

    this._eraserIcon = new EraserIcon();
    this._eraserIcon.appendTo(container);

    this._bindHoverTimelines(container, timelines);

    return container;
  }

  _createCategorySelect() {
    const container = $("<div>")
      .addClass("category-select")
      .css("width", $("#title").width());

    const label = $("<label>").text("篩選").appendTo(container);

    this._select = new Select({
      options: ["所有類別", ...categorise],
      outlineWidth: 2,
      duration: 0.2,
    });

    this._select.appendTo(container);

    return container;
  }

  _bindHoverTimelines(element, timelines) {
    timelines.forEach((tl) => {
      element.on("mouseenter", () => tl.play());
      element.on("mouseleave", () => tl.reverse());
    });
  }

  onInput(handler) {
    if (this._handlers.input) return this;

    this._handlers.input = (e) => {
      const words = this._input.val();
      const category = this._select.val();

      if (this._input.val()) {
        this._eraserIcon.show();
      } else {
        this._eraserIcon.hide();
      }

      handler({ words, category });
    };

    this._input._input.on("input", this._handlers.input);
    this._select._select.on("change", this._handlers.input);

    return this;
  }

  onClear(handler) {
    if (this._handlers.clear) return this;

    this._handlers.clear = () => {
      this._input.val("");

      handler();
    };

    this._eraserIcon.elements[0].on("click", this._handlers.clear);

    return this;
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
