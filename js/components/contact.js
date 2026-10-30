/* Tombol salin nomor / email */
KR.initContact = function () {
  KR.$$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");

      function done() { KR.toast(KR.i18n.t("contact.copied") + " · " + value); }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }

      // Cadangan untuk file:// atau browser lama
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-100px;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });
};
