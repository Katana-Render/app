/* Karakter bergeser pelan saat di-scroll. Memakai properti `translate`
   sehingga tidak bentrok dengan `transform` di CSS. */
KR.initParallax = function () {
  var els = KR.$$("[data-parallax]");
  if (!els.length || KR.reducedMotion) return;

  var visible = new Set();
  var ticking = false;

  function update() {
    var vh = window.innerHeight;
    visible.forEach(function (el) {
      var r = el.parentElement.getBoundingClientRect();
      var k = parseFloat(el.getAttribute("data-parallax")) || 0.05;
      var offset = (r.top + r.height / 2 - vh / 2) * k;
      el.style.translate = "0 " + offset.toFixed(1) + "px";
    });
    ticking = false;
  }
  function request() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
      request();
    }, { rootMargin: "20% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
};
