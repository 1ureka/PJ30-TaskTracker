$("<style>")
  .text(
    `.custom-select {
  width: fit-content;
  cursor: pointer;
  position: relative;
  transition: 300ms;
  color: white;
  clip-path: inset(0 -10px -10px -10px);
}
.custom-select .custom-select-selected {
  background-color: hsl(240, 5%, 15%);
  padding: 5px;
  padding-left: 10px;
  margin-bottom: 3px;
  border-radius: 5px;
  position: relative;
  z-index: 10;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 2px,
    rgba(0, 0, 0, 0.8) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
}
.custom-select .arrow {
  position: relative;
  right: 0px;
  height: 10px;
  transform: rotate(-90deg);
  width: 20px;
  fill: white;
  z-index: 10;
  transition: 300ms;
  scale: 1.35;
}
.custom-select .custom-select-options {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 5px;
  background-color: hsl(240, 5%, 15%);
  position: relative;
  top: -100px;
  opacity: 0;
  transition: 300ms;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 2px,
    rgba(0, 0, 0, 0.8) 0px 4px 6px -1px,
    rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
}
.custom-select:hover > .custom-select-options {
  opacity: 1;
  top: 0;
}
.custom-select:hover > .custom-select-selected .arrow {
  transform: rotate(0deg);
}
.custom-select .custom-select-option {
  border-radius: 5px;
  padding: 5px;
  transition: 300ms;
  background-color: hsl(240, 5%, 15%);
  width: 100px;
  font-size: 17px;
}
.custom-select .custom-select-option:hover {
  color: rgb(10, 10, 10);
  font-weight: bold;
  background-color: #ea81af;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 2px 3px 0px inset,
    rgba(0, 0, 0, 0.15) 0px 3px 7px 3px inset;
}
.custom-select .custom-select-options input[type="radio"] {
  display: none;
}
.custom-select .custom-select-options label {
  display: inline-block;
}
.custom-select .custom-select-options label::before {
  content: attr(data-txt);
}
.custom-select .custom-select-options input[type="radio"]:checked + label {
  display: none;
}
`
  )
  .appendTo("head");

class CustomSelect {
  constructor(options) {
    const id = `id_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;

    this.element = this._createDOM(options, id);

    $("head").append(this._createStyle(options, id));
  }

  _createDOM(options, id) {
    // 創建主要的選擇框容器
    const selectContainer = $("<div>").addClass("custom-select");

    // 創建帶有數據屬性的已選擇 div
    const selectedDiv = $("<div>").addClass("custom-select-selected");
    selectedDiv.html(this._createIcon());
    options.forEach((option, index) =>
      selectedDiv.attr(`data-${index}`, option)
    );

    // 創建選項 div
    const optionsDiv = $("<div>").addClass("custom-select-options");

    // 透過迴圈處理選項標題，創建單選按鈕和標籤
    options.forEach((option, index) => {
      const optionDiv = $("<div>").attr("title", option);
      const inputRadio = $("<input>")
        .attr("id", `${id}_CS_${index}`)
        .attr("name", id)
        .attr("type", "radio");

      if (index === 0) inputRadio.attr("checked", "");

      const label = $("<label>")
        .addClass("custom-select-option")
        .attr("for", `${id}_CS_${index}`)
        .attr("data-txt", option);

      optionDiv.append(inputRadio, label);
      optionsDiv.append(optionDiv);
    });

    // 將已選擇和選項 div 附加到主容器
    selectContainer.append(selectedDiv, optionsDiv);

    return selectContainer;
  }

  _createIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" class="arrow">
    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
    </svg>
    `;
  }

  _createStyle(options, id) {
    const styleTextArray = options.map(
      (_, index) =>
        `
      .custom-select:has(.custom-select-options input[type="radio"]#${id}_CS_${index}:checked)
        .custom-select-selected::before {
        content: attr(data-${index});
      }
      `
    );

    const styleText = styleTextArray.join("");

    return $("<style>").text(styleText);
  }

  appendTo(selector) {
    this.element.appendTo(selector);
    return this;
  }

  onChange(handler) {
    if (this._handler) return;

    this._handler = handler;

    const radioButtons = this.element.find(
      '.custom-select-options input[type="radio"]'
    );

    radioButtons.on("change", (event) => {
      this._handler(event);
    });
  }

  off() {
    if (!this._handler) return;

    const radioButtons = this.element.find(
      '.custom-select-options input[type="radio"]'
    );

    radioButtons.off("change", this._handler);

    this._handler = null;
  }

  getVal() {
    return $(
      this.element.find('.custom-select-options input[type="radio"]:checked')
    )
      .parent()
      .attr("title");
  }

  reset() {
    this.element
      .find('.custom-select-options input[type="radio"]')
      .first()
      .prop("checked", true);
  }
}
