/* Namespace tunggal + utilitas kecil */
window.KR = window.KR || {};

KR.$ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
KR.$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

KR.store = {
  get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};

KR.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

KR.toast = (function () {
  var timer;
  return function (msg) {
    var el = KR.$("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(timer);
    timer = setTimeout(function () { el.classList.remove("is-on"); }, 1800);
  };
})();
