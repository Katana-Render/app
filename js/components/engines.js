/* Tab mesin: klik + navigasi keyboard (panah, Home, End) */
KR.initEngines = function () {
  var tabs = KR.$$('.engines__tabs [role="tab"]');
  if (!tabs.length) return;

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    // Pada layar sempit tab bisa digulir: pastikan yang aktif terlihat
    if (tab.scrollIntoView && tab.parentElement.scrollWidth > tab.parentElement.clientWidth) {
      tab.scrollIntoView({ block: "nearest", inline: "center", behavior: KR.reducedMotion ? "auto" : "smooth" });
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
};
