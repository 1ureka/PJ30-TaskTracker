$(window).on("load", function () {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) jsonToDOM(savedTasks);
});

$(window).on("unload", function () {
  localStorage.setItem("tasks", domToJSON());
});
