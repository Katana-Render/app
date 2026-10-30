/* Dijalankan di <head>, sebelum CSS dirender: tema langsung benar, tanpa kedip. */
(function () {
  var root = document.documentElement;
  var theme = null;
  try { theme = localStorage.getItem("kr-theme"); } catch (e) {}
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  root.setAttribute("data-theme", theme);
  root.classList.add("js");
})();
