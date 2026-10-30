/* Elemen [data-reveal] muncul sekali saat masuk layar */
(function () {
  var items = KR.$$("[data-reveal]");
  if (!("IntersectionObserver" in window) || KR.reducedMotion) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();
