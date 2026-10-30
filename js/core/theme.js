/* Mode terang / gelap. Tema awal sudah diatur oleh theme-init.js */
(function () {
  var root = document.documentElement;
  var btn = KR.$("#theme-toggle");

  function set(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) KR.store.set("kr-theme", theme);
  }

  if (btn) {
    btn.addEventListener("click", function () {
      set(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  // Ikuti perubahan tema sistem selama pengguna belum memilih sendiri
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (e) {
      if (!KR.store.get("kr-theme")) set(e.matches ? "light" : "dark", false);
    });
  }
})();
