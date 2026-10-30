/* Dukungan Kemanusiaan: galeri banner (scroll-snap), dialog QRIS, umpan balik tombol salin.
   Teks tombol salin sendiri ditangani contact.js; di sini hanya keadaan visualnya. */
KR.initHumanity = function () {
  var root = KR.$("#humanity");
  if (!root) return;

  /* ---------------- Galeri (loop tanpa putus) ----------------
     Susunan track: [salinan terakhir] [1 … n] [salinan pertama].
     Setelah berhenti di salinan, posisi dilompatkan diam-diam ke slide aslinya. */
  var frame = KR.$(".hum__frame", root);
  var track = KR.$(".hum__track", root);
  var slides = KR.$$(".hum__slide", root);
  var dots = KR.$$(".hum__dot", root);
  var prev = KR.$("[data-hum-prev]", root);
  var next = KR.$("[data-hum-next]", root);

  if (frame && track && slides.length > 1) {
    var n = slides.length;
    var idx = 0;
    var timer = 0, settleTimer = 0;
    var inView = false, hovering = false, focused = false, pressed = false;
    var DELAY = 5500;

    // Gerak galeri termasuk gerak ambient (seperti kabut hero & marquee): tetap jalan
    // saat "kurangi animasi" aktif.
    KR.$$("img", track).forEach(function (im) { im.classList.add("keep-motion"); });

    var cLast = slides[n - 1].cloneNode(true);
    var cFirst = slides[0].cloneNode(true);
    [cLast, cFirst].forEach(function (c) {
      c.setAttribute("aria-hidden", "true");
      c.removeAttribute("role");
      c.removeAttribute("aria-label");
      c.removeAttribute("aria-roledescription");
    });
    track.insertBefore(cLast, slides[0]);
    track.appendChild(cFirst);
    var all = [cLast].concat(slides, [cFirst]);

    var curPos = function () { return Math.round(track.scrollLeft / (track.clientWidth || 1)); };
    var logical = function (pos) { return pos <= 0 ? n - 1 : pos >= n + 1 ? 0 : pos - 1; };

    // Lompat tanpa animasi dan tanpa memicu snap di tengah jalan
    function jump(pos) {
      track.style.scrollSnapType = "none";
      track.scrollLeft = pos * track.clientWidth;
      requestAnimationFrame(function () { track.style.scrollSnapType = ""; });
    }
    function normalize() {
      var p = curPos();
      if (p <= 0) { jump(n); return n; }
      if (p >= n + 1) { jump(1); return 1; }
      return p;
    }
    function settle() {
      if (pressed) return;
      normalize();
    }

    function labels() {
      var tpl = KR.i18n.t("hum.dot") || "{n} / {m}";
      dots.forEach(function (d, i) {
        d.setAttribute("aria-label", tpl.replace("{n}", i + 1).replace("{m}", n));
      });
    }

    function paint(i) {
      idx = i;
      dots.forEach(function (d, k) {
        if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
      // Slide aktif (dan salinannya) bergerak pelan: kesan hidup
      all.forEach(function (sl, p) { sl.classList.toggle("is-active", logical(p) === i); });
    }

    function goPos(pos) {
      pos = Math.max(0, Math.min(n + 1, pos));
      track.scrollTo({ left: pos * track.clientWidth, behavior: "smooth" });
    }
    function step(dir) { goPos(normalize() + dir); }

    function canPlay() {
      return inView && !document.hidden && !hovering && !focused && !pressed;
    }
    function sync() {
      clearInterval(timer);
      timer = 0;
      if (canPlay()) timer = setInterval(function () { step(1); }, DELAY);
    }

    // Posisi awal: slide asli pertama
    jump(1);
    paint(0);

    // Slide aktif = yang tampil >= 60% di dalam track
    if ("IntersectionObserver" in window) {
      var slideIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) paint(logical(all.indexOf(e.target)));
        });
      }, { root: track, threshold: 0.6 });
      all.forEach(function (sl) { slideIO.observe(sl); });

      // Autoplay hanya saat galeri terlihat
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        sync();
      }, { threshold: 0.25 }).observe(frame);
    }

    track.addEventListener("scroll", function () {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 120);
    }, { passive: true });

    dots.forEach(function (d, i) { d.addEventListener("click", function () { normalize(); goPos(i + 1); sync(); }); });
    if (prev) prev.addEventListener("click", function () { step(-1); sync(); });
    if (next) next.addEventListener("click", function () { step(1); sync(); });

    // Jeda saat pengguna berinteraksi
    frame.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse") { hovering = true; sync(); }
    });
    frame.addEventListener("pointerleave", function () { hovering = false; sync(); });
    frame.addEventListener("pointerdown", function () { pressed = true; sync(); });
    ["pointerup", "pointercancel"].forEach(function (t) {
      window.addEventListener(t, function () {
        if (!pressed) return;
        pressed = false;
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 200);
        sync();
      });
    });
    var bar = KR.$(".hum__bar", root);
    [frame, bar].forEach(function (el) {
      if (!el) return;
      el.addEventListener("focusin", function () { focused = true; sync(); });
      el.addEventListener("focusout", function () { focused = false; sync(); });
    });
    document.addEventListener("visibilitychange", sync);

    // Jaga posisi slide saat ukuran berubah (rotasi layar, resize)
    if ("ResizeObserver" in window) {
      var lastW = track.clientWidth;
      new ResizeObserver(function () {
        var w = track.clientWidth;
        if (w !== lastW) { lastW = w; jump(idx + 1); }
      }).observe(track);
    }

    labels();
    document.addEventListener("kr:lang", labels);
  }

  /* ---------------- Dialog QRIS ---------------- */
  var dlg = KR.$("#qr-dialog");
  var canModal = dlg && typeof dlg.showModal === "function";

  KR.$$("[data-qr-open]", root).forEach(function (b) {
    b.addEventListener("click", function () {
      if (canModal) dlg.showModal();
      else window.open(b.getAttribute("data-qr-src"), "_blank", "noopener");
    });
  });
  if (canModal) {
    KR.$$("[data-qr-close]", dlg).forEach(function (b) {
      b.addEventListener("click", function () { dlg.close(); });
    });
    // Klik di luar kotak (backdrop) menutup dialog
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------------- Umpan balik tombol salin ---------------- */
  KR.$$("[data-copy]", root).forEach(function (btn) {
    var label = KR.$("[data-i18n]", btn);
    var timer = 0;
    btn.addEventListener("click", function () {
      btn.classList.add("is-copied");
      if (label) label.textContent = KR.i18n.t("contact.copied");
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.classList.remove("is-copied");
        if (label) label.textContent = KR.i18n.t(label.getAttribute("data-i18n"));
      }, 1800);
    });
  });
};
