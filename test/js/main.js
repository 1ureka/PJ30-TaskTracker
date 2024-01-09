$(async function () {
  const sidebarBottom = new SidebarBottom();
  sidebarBottom.appendTo("#sidebar").onSelect((type) => console.log(type));
});
