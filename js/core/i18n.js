/* Dua bahasa: Indonesia (id) dan Inggris (en). Kamus ada di js/i18n/. */
(function () {
  var dict = KR.dict || {};
  var root = document.documentElement;

  function detect() {
    var saved = KR.store.get("kr-lang");
    if (saved === "id" || saved === "en") return saved;
    var nav = (navigator.language || "id").toLowerCase();
    return nav.indexOf("id") === 0 || nav.indexOf("ms") === 0 ? "id" : "en";
  }

  var lang = detect();

  function t(key) {
    var d = dict[lang] || {};
    return d[key] != null ? d[key] : (dict.id || {})[key];
  }

  function apply() {
    root.setAttribute("lang", lang);

    KR.$$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    KR.$$("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    KR.$$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        var v = t(p[1]);
        if (p[0] && v != null) el.setAttribute(p[0].trim(), v);
      });
    });

    // Tautan WhatsApp membawa pesan sesuai bahasa
    KR.$$("[data-wa]").forEach(function (a) {
      var msg = t(a.getAttribute("data-wa"));
      a.href = "https://wa.me/6285648545159?text=" + encodeURIComponent(msg);
    });

    // Meta halaman
    document.title = t("meta.title");
    var md = KR.$('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.desc"));
    var ogt = KR.$('meta[property="og:title"]');
    if (ogt) ogt.setAttribute("content", t("meta.title"));
    var ogd = KR.$('meta[property="og:description"]');
    if (ogd) ogd.setAttribute("content", t("meta.ogdesc"));

    KR.$$("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });

    document.dispatchEvent(new CustomEvent("kr:lang", { detail: lang }));
  }

  function set(next) {
    if (next === lang || !dict[next]) return;
    lang = next;
    KR.store.set("kr-lang", lang);
    apply();
  }

  KR.i18n = { t: t, apply: apply, set: set, get: function () { return lang; } };

  KR.$$("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { set(b.getAttribute("data-lang")); });
  });
})();
