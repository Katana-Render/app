/* Navigasi: status saat di-scroll, menu mobile, penanda bagian aktif */
KR.initNav = function () {
  var nav = KR.$("#nav");
  var burger = KR.$("#burger");
  var links = KR.$$("#nav-links a");
  if (!nav) return;

  function onScroll() { nav.classList.toggle("is-stuck", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger) burger.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
  links.forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  window.matchMedia("(min-width: 1020px)").addEventListener("change", function (e) { if (e.matches) setOpen(false); });

  // Scrollspy
  if (!("IntersectionObserver" in window)) return;
  var map = {};
  links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var a = map[e.target.id];
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(map).forEach(function (id) {
    var s = document.getElementById(id);
    if (s) io.observe(s);
  });
};
