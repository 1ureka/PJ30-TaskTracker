$(async function () {
  const sidebarTop = new SidebarTop();
  sidebarTop.appendTo("#sidebar").onDateSelect((date) => console.log(date));

  const sidebarBottom = new SidebarBottom();
  sidebarBottom.appendTo("#sidebar").onSelect((type) => console.log(type));
});
