$(async function () {
  const sidebarTop = new SidebarTop();
  sidebarTop.appendTo("#sidebar");

  const sidebarBottom = new SidebarBottom();
  sidebarBottom.appendTo("#sidebar").onSelect((type) => console.log(type));
});
