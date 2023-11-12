$(window).on("load", function () {
  const savedTasks = localStorage.getItem("tasks");
  let date = localStorage.getItem("date");

  function getCurrentDate() {
    const year = new Date().getFullYear().toString();
    const month = new Date().getMonth() + 1;
    const currentMonth = month.toString().padStart(2, "0");
    const date = year + "-" + currentMonth;
    return date;
  }

  if (!date) {
    localStorage.setItem("date", getCurrentDate());
    date = getCurrentDate();
  }

  if (savedTasks) jsonToDOM(saveToJSON(savedTasks, date));
});

$(window).on("unload", function () {
  localStorage.setItem("date", getDate());

  localStorage.setItem("tasks", jsonToSave(domToJSON(), getDate()));
});
