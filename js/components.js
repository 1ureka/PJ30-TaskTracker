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

/**
 * 其他
 */
class ScrollButtons extends component {
  /**
   * 建構一個新的 `ScrollButtons` 實例。@constructor
   */
  constructor() {
    super();
    this._timelines = {};
    this._handlers = {};

    this.isShow = false;

    /**
     * 包含上下滾動按鈕的 jQuery 物件。
     * @type {jQuery}
     */
    const container = $("<div>").addClass("scroll-buttons-container");

    this._up = this._createScrollButton("up");
    this._down = this._createScrollButton("down");

    container.append(this._up, this._down);

    this.element = container;

    this._createTimelines();
  }

  /**
   * 創建上下滾動按鈕。
   * @private
   * @param {string} type - 按鈕類型，可以是 "up" 或 "down"。
   * @returns {jQuery} - 上下滾動按鈕的 jQuery 物件。
   */
  _createScrollButton(type) {
    const button = $("<button>").addClass("scroll-button").addClass(type);
    const icon = new ScrollIcon();

    if (type === "down") gsap.set(icon.elements[0], { rotate: 180 });

    icon.appendTo(button);

    const hoverTls = [
      gsap
        .timeline({ defaults: { duration: 0.2, ease: "set1" }, paused: true })
        .to(button, { backgroundColor: "#ea81af" }),
      ...icon.timelines,
    ];

    const clickTl = gsap
      .timeline({ defaults: { duration: 0.1, ease: "set1" }, paused: true })
      .to(button, { scale: 0.6, repeat: 1, yoyo: true });

    this._bindTimeline(button, hoverTls, clickTl);

    return button;
  }

  /**
   * 將時間軸綁定到按鈕的不同事件。
   * @param {jQuery} button - 要綁定的按鈕元素。
   * @param {TimelineMax[]} hover - 滑鼠進入時觸發的時間軸陣列。
   * @param {TimelineMax} click - 按鈕點擊時觸發的時間軸。
   */
  _bindTimeline(button, hover, click) {
    button.on("mouseenter", () => {
      hover.forEach((tl) => {
        tl.play();
      });
    });
    button.on("mouseleave", () => {
      hover.forEach((tl) => {
        tl.reverse();
      });
    });

    button.on("click", () => click.restart());
  }

  /**
   * 創建並初始化上滾動按鈕的時間軸效果。
   * @private
   * @returns {ScrollButtons} - 回傳 `ScrollButtons` 實例，以便進行方法鏈結。
   */
  _createTimelines() {
    this._timelines.show = gsap
      .timeline({
        defaults: { ease: "back.out(4)", duration: 0.35 },
        paused: true,
      })
      .from(this.element.children(), { scale: 0.5, stagger: 0.15 })
      .from(
        this.element.children(),
        { ease: "set1", autoAlpha: 0, stagger: 0.15 },
        "<"
      );

    return this;
  }

  /**
   * 設置點擊事件處理函式，當上滾動或下滾動按鈕被點擊時觸發。
   * @param {function} handler - 點擊事件處理函式，傳遞一個字串參數，代表點擊的按鈕類型 ("up" 或 "down")。
   * @returns {ScrollButtons} - 回傳 `ScrollButtons` 實例，以便進行方法鏈結。
   */
  onClick(handler) {
    if (this._handlers.up || this._handlers.down) return this;

    this._handlers.up = () => {
      handler("up");
    };
    this._handlers.down = () => {
      handler("down");
    };

    this._up.on("click", this._handlers.up);
    this._down.on("click", this._handlers.down);

    return this;
  }

  /**
   * 顯示上滾動按鈕。
   */
  show() {
    if (this.isShow) return this;

    this.isShow = true;
    this._timelines.show.play();

    return this;
  }

  /**
   * 隱藏上滾動按鈕。
   */
  async hide() {
    if (!this.isShow) return this;

    this.isShow = false;
    this._timelines.show.reverse();

    this._timelines.show.eventCallback("onReverseComplete", null);

    await new Promise((resolve) => {
      this._timelines.show.eventCallback("onReverseComplete", resolve);
    });

    return this;
  }
}

class CopyPopup extends component {
  constructor() {
    super();

    this._timelines = {};

    this.element = this._create();
    this._createTimelines();
  }

  _create() {
    const container = $("<div>")
      .addClass("popup")
      .text("已複製內文")
      .css({ pointerEvents: "none", padding: 7, fontSize: 18 });

    return container;
  }

  _createTimelines() {
    this._timelines.show = gsap
      .timeline({ defaults: { ease: "set1" }, paused: true })
      .from(this.element, {
        ease: "back.out(2)",
        duration: 0.3,
        scale: 0.1,
        autoAlpha: 0,
      })
      .to(
        this.element,
        { ease: "power3.out", duration: 0.3, autoAlpha: 1 },
        "<"
      )
      .to(this.element, { delay: 0.5, duration: 1, autoAlpha: 0 });

    return this;
  }

  show(coordinate) {
    gsap.set(this.element, coordinate);

    this._timelines.show.restart();
  }
}

/**
 * 側邊欄
 */
class SidebarBottom extends component {
  constructor() {
    super();

    const container = $("<section>").addClass("sidebar-bottom-container");
    const inner = $("<div>").addClass("sidebar-bottom-inner");

    const left = $("<div>")
      .addClass("sidebar-bottom-flex")
      .append(this._createAddBtn());

    const right = $("<div>")
      .addClass("sidebar-bottom-flex")
      .append(this._createSaveBtn(), this._createLoadBtn());

    inner.append(left, right);
    inner.appendTo(container);

    this.element = container;
  }

  _createAddBtn() {
    const icon = new AddIcon();
    const tl = icon.timelines[0];
    const btn = $("<button>")
      .addClass("sidebar-add-button")
      .append(icon.elements[0], $("<p>").text(" 新 增 "));

    btn.on("mouseenter", () => tl.play());
    btn.on("mouseleave", () => tl.reverse());

    return btn;
  }

  _createSaveBtn() {
    const icon = new SaveIcon();
    const tl = icon.timelines[0];
    const btn = $("<button>")
      .addClass("sidebar-save-button")
      .append(icon.elements[0]);

    btn.on("mouseenter", () => tl.play());
    btn.on("mouseleave", () => tl.reverse());

    return btn;
  }

  _createLoadBtn() {
    const icon = new LoadIcon();
    const tl = icon.timelines[0];
    const btn = $("<button>")
      .addClass("sidebar-load-button")
      .append(icon.elements[0]);

    btn.on("mouseenter", () => tl.play());
    btn.on("mouseleave", () => tl.reverse());

    return btn;
  }

  onSelect(handler) {
    if (this._handler) return this;

    this._handler = async (e) => {
      const element = $(e.target);
      const className = element.attr("class");

      const map = {
        "sidebar-add-button": "add",
        "sidebar-save-button": "save",
        "sidebar-load-button": "load",
      };

      handler(map[className]);
    };

    this.element.on("click", "button", this._handler);
  }
}

class SidebarTop extends component {
  constructor() {
    super();

    const section = $("<section>").addClass("sidebar-top-container");
    const content = $("<nav>").addClass("sidebar-top-content");

    const navList = this._createList();

    navList.forEach((config) => {
      if (config.type === "separator")
        this._createSeparator(config.title).appendTo(content);
      if (config.type === "option")
        this._createOption(config.title, config.id).appendTo(content);
    });

    const mask = $("<div>")
      .addClass("sidebar-top-mask")
      .appendTo("#sidebar-content");

    this.element = section.append(content);
  }

  _createList() {
    const navList = [
      { type: "separator", title: "其他" },
      { type: "option", title: "靈感", id: "0000-00" },
      { type: "option", title: "檢討與筆記", id: "1111-11" },
    ];

    // 取得當前年份和月份
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 月份是從0開始的，所以需要加1

    // 設定起始年份
    const startYear = 2020;

    // 生成年份範圍
    for (let year = currentYear; year >= startYear; year--) {
      navList.push({ type: "separator", title: `${year}年` });

      // 生成月份
      const endMonth = year === currentYear ? currentMonth : 12;
      for (let month = endMonth; month >= 1; month--) {
        const monthString = month < 10 ? `0${month}` : `${month}`;
        const id = `${year}-${monthString}`;
        const title = `${year}年${month}月`;
        navList.push({ type: "option", title, id });
      }
    }

    return navList;
  }

  _createSeparator(title) {
    return $("<div>").addClass("sidebar-top-sep").append(
      $("<span>").addClass("sidebar-top-sep-1"), // 固定寬度 whatever
      $("<p>").text(title), // 自動寬度 inline-block
      $("<span>").addClass("sidebar-top-sep-2") // 剩下寬度 block或flex-grow
    );
  }

  _createOption(title, id) {
    return $("<button>").addClass("sidebar-top-opt").text(title).attr("id", id);
  }

  onSelect(handler) {
    if (this._handler) return this;

    this._handler = (e) => {
      const id = $(e.target).attr("id");
      handler(id);
    };

    this.element.on("click", ".sidebar-top-opt", this._handler);

    return this;
  }
}

/**
 * 標頭
 */
class Header extends component {
  constructor() {
    super();

    this._handlers = {};

    this._create();
  }

  _create() {
    this.element = $("#header");

    const bar = $("<div>").addClass("filter-bar");

    const input = this._createSearchInput();
    const select = this._createCategorySelect();
    bar.append(input, select);

    bar
      .on("mouseenter", (e) => {
        const except = $(e.target).filter(
          ".custom-select-options, .custom-select-option"
        );

        if (except.length) return;

        select.css("pointerEvents", "auto");
      })
      .on("mouseleave", (e) => {
        select.css("pointerEvents", "none");
      });

    this.element.append(bar);

    return this;
  }

  _createSearchInput() {
    const container = $("<div>").addClass("search-input-container");
    container.html(
      `<input type="text" class="search-input" required="" placeholder="搜尋" />`
    );

    const searchIcon = new SearchIcon();
    searchIcon.elements[0].addClass("search-input-icon");
    searchIcon.appendTo(container);

    this._bindHoverTimelines(container, searchIcon.timelines);
    this._input = container.find("input");

    return container;
  }

  _createCategorySelect() {
    const container = $("<div>").addClass("category-select");

    this._select = new CustomSelect(["所有類別", ...CATEGORISE]);
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
      const text = this._input.val();
      const category = this._select.getVal();

      handler({ text, category });
    };

    this._input.on("input", this._handlers.input);
    this._select.onChange(this._handlers.input);

    return this;
  }

  async reset() {
    this._input.val("");
    this._select.reset();

    await delay(100);

    return this;
  }
}

/**
 * 內容
 */
class TaskList extends component {
  constructor(list) {
    super();

    this._handlers = {};
    this._timelines = {};

    this.isShow = false;

    this.element = this._create(list);
    gsap.set(this.element.children(), { autoAlpha: 0 });
    this._bindEvents();
  }

  _create(list) {
    const container = $("#tasks-container");

    const instances = list.map((config) => {
      if (config.type === "separator") return new Separator();

      return new Task(config);
    });

    instances.forEach((instance) => {
      instance.appendTo(container);
    });

    this._sortable = new Sortable(container[0], {
      group: "shared",
      animation: 150,
      onStart: () => {
        document.documentElement.style.setProperty(
          "--is-task-list-hovable",
          "0"
        );
      },
      onEnd: () => {
        document.documentElement.style.setProperty(
          "--is-task-list-hovable",
          "1"
        );
      },
    });

    return container;
  }

  _createTimelines() {
    this._timelines.show = gsap
      .timeline({ defaults: { ease: "set1" }, paused: true })
      .to(this.element.children(), {
        autoAlpha: 1,
        stagger: { from: "random", amount: 0.5 },
      });

    this._timelines.hide = gsap
      .timeline({ defaults: { ease: "set1" }, paused: true })
      .to(this.element.children(), {
        autoAlpha: 0,
        stagger: { from: "random", amount: 0.5 },
      });

    return this;
  }

  _bindEvents() {
    this._handlers._inner1 = () => {
      this._sortable.option("disabled", true);
    };

    this._handlers._inner2 = async () => {
      this._sortable.option("disabled", false);
    };

    this.element.on(
      "task-edit-focus",
      ".task-container",
      this._handlers._inner1
    );
    this.element.on(
      "task-edit-blur",
      ".task-container",
      this._handlers._inner2
    );

    return this;
  }

  getList() {
    const elements = this.element.children().get();

    const list = elements.map((element) => {
      element = $(element);

      if (element.attr("class") === "separator") return { type: "separator" };

      return JSON.parse(element.data("info"));
    });

    return list;
  }

  onChange(handler) {
    if (this._handlers.change) return this;

    this._handlers.change = async (e) => {
      if (e.type === "task-delete") await delay(100);
      const list = this.getList();
      handler(list);
    };

    this.element.on("task-change", ".task-container", this._handlers.change);
    this.element.on("task-delete", ".task-container", this._handlers.change);
    this.element.on("task-delete", ".separator", this._handlers.change);
  }

  onSort(handler) {
    if (this._handlers.sort) return this;

    this._handlers.sort = () => {
      const list = this.getList();

      handler(list);
    };

    this._sortable.option("onSort", this._handlers.sort);
  }

  async show() {
    if (this.isShow) return this;

    this.isShow = true;
    this._createTimelines();
    this._timelines.show.play();

    this._timelines.show.eventCallback("onComplete", null);

    await new Promise((resolve) => {
      this._timelines.show.eventCallback("onComplete", resolve);
    });

    return this;
  }

  async hide() {
    if (!this.isShow) return this;

    this.isShow = false;
    this._createTimelines();
    this._timelines.hide.play();

    this._timelines.hide.eventCallback("onComplete", null);

    await new Promise((resolve) => {
      this._timelines.hide.eventCallback("onComplete", resolve);
    });

    return this;
  }

  async remove() {
    await this.hide();

    this.element
      .children()
      .get()
      .forEach((element) => $(element).remove());

    this.element.off();
    this._sortable.destroy();
    Object.keys(this).forEach((key) => (this[key] = null));
  }

  filterTasks(criteria) {
    const list = this.getList();

    // 獲取分隔符的索引
    const separatorIndex = list
      .map((val, index) => (val.type === "separator" ? index : -1))
      .filter((val) => val !== -1);

    // 獲取搜索條件的索引
    let searchIndex;
    if (criteria.text) {
      const options = { shouldSort: false, keys: ["text"] };
      const fuse = new Fuse(list, options);
      searchIndex = fuse.search(criteria.text).map((val) => val.refIndex);
    } else {
      searchIndex = list.map((_, index) => index);
    }

    // 獲取類別條件的索引
    let categoryIndex;
    if (criteria.category && criteria.category !== "所有類別") {
      categoryIndex = list
        .map((val, index) => (val.category === criteria.category ? index : -1))
        .filter((val) => val !== -1);
    } else {
      categoryIndex = list.map((_, index) => index);
    }

    // 獲取搜索條件和類別條件的交集索引
    const intersectIndex = searchIndex.filter((val) =>
      categoryIndex.includes(val)
    );

    // 去除分隔符索引
    const finalIndex = intersectIndex.filter(
      (val) => !separatorIndex.includes(val)
    );

    // 去重複
    const result = Array.from(new Set([...finalIndex]));

    // 根據最終的索引獲取對應的元素
    let elements = this.element.children();
    if (result.length > 0) {
      elements = result.map((val) => elements[val]);
    } else {
      elements = [];
    }

    const tasks = this.element.children(".task-container");
    const complements = tasks.not(elements);
    gsap.to(elements, {
      autoAlpha: 1,
      height: "auto",
      padding: "12px 15px 15px 15px",
      ease: "set1",
      duration: 0.2,
    });
    gsap.to(complements, {
      autoAlpha: 0,
      height: 0,
      padding: 0,
      ease: "set1",
      duration: 0.2,
    });
  }
}

class TempList extends component {
  constructor() {
    super();

    this._timelines = {};

    this._isOpen = false;

    this.element = this._create();
    this._createTimelines()._bindEvents();
  }

  _create() {
    const container = $("<div>").addClass("temp-list-container");

    const icon = new ArrowIcon();
    icon.appendTo(container).addClass("temp-list-icon");
    this._icon = icon.elements[0];

    const scroller = $("<div>")
      .addClass("temp-list-scroller")
      .appendTo(container);

    const list = $("<div>").addClass("temp-list").appendTo(scroller);
    this._list = list;

    this._sortable = new Sortable(list[0], {
      group: {
        name: "shared",
        put: false,
      },
      animation: 150,
      sort: false,
    });

    return container;
  }

  _createTimelines() {
    this._timelines.show = gsap
      .timeline({ defaults: { ease: "set1", duration: 0.5 }, paused: true })
      .fromTo(this.element.children(), { autoAlpha: 0 }, { autoAlpha: 1 });

    this._timelines.open = gsap
      .timeline({ defaults: { ease: "set1", duration: 0.5 }, paused: true })
      .fromTo(this.element, { y: 230 }, { y: 0 })
      .to(this._icon, { y: 55, scaleY: -1 }, "<");

    return this;
  }

  _bindEvents() {
    this.element.on("mouseover", () => {
      this.show();
    });
    this.element.on("mouseleave", () => {
      if (!this._isOpen) this.hide();
    });

    this._sortable.option("onStart", () => {
      document.documentElement.style.setProperty("--is-task-list-hovable", "0");
    });
    this._sortable.option("onEnd", () => {
      document.documentElement.style.setProperty("--is-task-list-hovable", "1");

      if (this._list.children().length === 0) this.close().hide();
    });

    this.element.on("click", ".temp-list-icon", async () => {
      await delay(100);
      if (this._isOpen) {
        this.close().hide();
      } else {
        this.open();
      }
    });

    return this;
  }

  open() {
    this._timelines.open.play();

    this._isOpen = true;

    return this;
  }

  close() {
    this._timelines.open.reverse();

    this._isOpen = false;

    return this;
  }

  show() {
    this._timelines.show.play();

    return this;
  }

  hide() {
    this._timelines.show.reverse();

    return this;
  }

  addTask(config) {
    this.show().open();

    const create = (config) => {
      if (config.text === "--") return new Separator();

      config.status = "U";
      return new Task(config);
    };

    const task = create(config);

    task.element.hide();
    task.appendTo(this._list);
    task.element.show(500);

    return this;
  }
}
