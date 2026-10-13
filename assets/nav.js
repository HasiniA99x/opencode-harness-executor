(function () {
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (!path || path === "") path = "index.html";
  document.querySelectorAll("nav.site a.tab").forEach(function (a) {
    var href = (a.getAttribute("href") || "").replace("./", "").toLowerCase();
    if (href === path) a.classList.add("active");
  });
})();
