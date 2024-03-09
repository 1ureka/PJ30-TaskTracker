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
  constructor() {
    super();
    this._timelines = {};
    this.isShow = false;

    /** 包含上下滾動按鈕的 jQuery 物件。 @type {jQuery} */
    const container = $("<div>").addClass("scroll-buttons-container");

    this._up = this._createScrollButton("up");
    this._down = this._createScrollButton("down");

    container.append(this._up, this._down);

    this.element = container;

    this._createTimelines();
  }
  /** 創建上下滾動按鈕。 @private @param {string} type - 按鈕類型，可以是 "up" 或 "down"。  */
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
  /** @private */
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
  /** 創建並初始化上滾動按鈕的時間軸效果。@private */
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
  /** 綁定上下按鈕功能 @param {TaskList} taskList*/
  setScrollTarget(taskList) {
    if (this._scrollUp) {
      this._up.off("click", this._scrollUp);
      this._down.off("click", this._scrollDown);
    }

    const init = () => {
      const { index, taskTop } = findFirstUnfinished(taskList.getList());
      const currentTop = $("#content").scrollTop();

      const tolerance = window.innerHeight / 2.5;
      const isAtTask = Math.abs(currentTop - taskTop) <= tolerance;

      return { index, taskTop, currentTop, isAtTask };
    };

    this._scrollUp = () => {
      const { index, taskTop, currentTop, isAtTask } = init();
      let targetTop = 0;

      if (index !== -1) {
        const isGoingToTop = isAtTask || currentTop < taskTop;
        targetTop = isGoingToTop ? 0 : taskTop;
      }

      $("#content").animate({ scrollTop: targetTop }, 500);
    };

    this._scrollDown = () => {
      const { index, taskTop, currentTop, isAtTask } = init();
      let targetTop = taskList.element.height();

      if (index !== -1) {
        const isGoingToBottom = isAtTask || currentTop > taskTop;
        targetTop = isGoingToBottom ? taskList.element.height() : taskTop;
      }

      $("#content").animate({ scrollTop: targetTop }, 500);
    };

    this._up.on("click", this._scrollUp);
    this._down.on("click", this._scrollDown);
  }

  show() {
    if (this.isShow) return this;

    this.isShow = true;
    this._timelines.show.play();

    return this;
  }

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
  /** @private */
  _create() {
    const container = $("<div>")
      .addClass("popup")
      .text("已複製內文")
      .css({ pointerEvents: "none", padding: 7, fontSize: 18 });

    return container;
  }
  /** @private */
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

    inner.append(
      this._createAddBtn(),
      this._createSaveBtn(),
      this._createLoadBtn()
    );

    inner.appendTo(container);

    this.element = container;
  }
  /** @private */
  _createAddBtn() {
    const btn = $("<label>")
      .addClass("hamburger")
      .append(
        $("<input>").attr("type", "checkbox"),
        $(`<svg viewBox="0 0 32 32">
          <path class="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
          <path class="line" d="M7 16 27 16"></path>
          </svg>`)
      );

    return btn;
  }
  /** @private */
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
  /** @private */
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

    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);
    styleTag.sheet.insertRule(`
      .sidebar-top-opt.active::after {
        background: url("icons/play.png");
        background-size: 20px 20px;
      }
      `);

    this.element = section.append(content);
  }
  /** @private */
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
  /** @private */
  _createSeparator(title) {
    return $("<div>").addClass("sidebar-top-sep").append(
      $("<span>").addClass("sidebar-top-sep-1"), // 固定寬度 whatever
      $("<p>").text(title), // 自動寬度 inline-block
      $("<span>").addClass("sidebar-top-sep-2") // 剩下寬度 block或flex-grow
    );
  }
  /** @private */
  _createOption(title, id) {
    return $("<button>").addClass("sidebar-top-opt").text(title).attr("id", id);
  }

  setActive(id) {
    $(".sidebar-top-opt.active").removeClass("active");
    $(`#${id}`).addClass("active");
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
  /** @private */
  _create() {
    this.element = $("#header");

    const input = this._createSearchInput();
    const select = this._createCategorySelect();
    this.element.append(input, select);

    this.element
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

    return this;
  }
  /** @private */
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
  /** @private */
  _createCategorySelect() {
    const container = $("<div>").addClass("category-select");

    this._select = new CustomSelect(["所有類別", ...CATEGORISE]);
    this._select.appendTo(container);

    return container;
  }
  /** @private */
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
    gsap.set(this.element.children(), { filter: "blur(10px)", autoAlpha: 0 });
    this._bindEvents();
  }
  /**  @param {Array} list   */
  _create(list) {
    const container = $("#tasks-container");

    const instances = list.map((config) => {
      if (config.type === "separator") return new Separator();

      return new Task(config);
    });

    if (instances.length === 0)
      instances.push(
        new Task({
          category: "未分類",
          status: "U",
          text: "這是預設工作區，如果你想要它是空的，請刪除此工作塊。",
        })
      );

    instances.forEach((instance) => {
      instance.appendTo(container);
    });

    this._sortable = new Sortable(container[0], {
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
  /** @private */
  _createTimelines() {
    this._timelines.show = gsap
      .timeline({ defaults: { ease: "set1" }, paused: true })
      .to(this.element.children(), {
        filter: "blur(0px)",
        autoAlpha: 1,
        stagger: { from: "random", amount: 0.5 },
      });

    this._timelines.hide = gsap
      .timeline({ defaults: { ease: "set1" }, paused: true })
      .to(this.element.children(), {
        filter: "blur(10px)",
        autoAlpha: 0,
        stagger: { from: "random", amount: 0.5 },
      });

    return this;
  }
  /** @private */
  _bindEvents() {
    this._handlers._inner1 = () => {
      this._sortable.option("disabled", true);
    };
    this._handlers._inner2 = () => {
      this._sortable.option("disabled", false);
    };
    this._handlers._inner3 = (e, type) => {
      this._addTask(e, type, "after");
    };
    this._handlers._inner4 = (e, type) => {
      this._addTask(e, type, "before");
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
    this.element.on(
      "task-add-right",
      ".task-container",
      this._handlers._inner3
    );
    this.element.on("task-add-left", ".task-container", this._handlers._inner4);

    return this;
  }

  _addTask(e, type, position) {
    let content;
    if (type === "分割線") {
      content = new Separator();
    } else if (type === "工作塊") {
      content = new Task({
        category: "未分類",
        text: "新的塊",
        status: "U",
      });
    }
    gsap.fromTo(content.element, { autoAlpha: 0 }, { autoAlpha: 1 });

    if (position === "after") {
      $(e.target).after(content.element);
    } else if (position === "before") {
      $(e.target).before(content.element);
    }
  }

  _tagLarge() {
    this.element
      .find(".task-container")
      .toArray()
      .forEach(function (element) {
        const isTall =
          $(element).find(".task-p-container")[0].scrollHeight > 350;
        $(element).toggleClass("task-tall", isTall);
      });
  }

  getList() {
    const elements = this.element.children().get();

    const list = elements.map((element) => {
      element = $(element);

      if (element.hasClass("separator")) return { type: "separator" };

      if (element.hasClass("task-container"))
        return JSON.parse(element.data("info"));

      return null;
    });

    return list.filter((element) => element);
  }

  onChange(handler) {
    if (this._handlers.change) return this;

    this._handlers.change = async (e) => {
      this._tagLarge();

      if (["task-delete", "task-add-left", "task-add-right"].includes(e.type))
        await delay(100);

      const list = this.getList();
      handler(list);
    };

    this.element.on("task-add-left", ".task-container", this._handlers.change);
    this.element.on("task-add-right", ".task-container", this._handlers.change);
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

  onTransfer(handler) {
    if (this._handlers.transfer) return this;

    this._handlers.transfer = async (e) => {
      const info = $(e.target).data("info");
      await delay(100);
      const list = this.getList();

      handler(list, JSON.parse(info));
    };

    this.element.on(
      "task-transfer",
      ".task-container",
      this._handlers.transfer
    );
  }

  async show() {
    if (this.isShow) return this;

    this.isShow = true;
    this._createTimelines();
    this._tagLarge();
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
