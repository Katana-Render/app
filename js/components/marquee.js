/* Marquee mesin: tiap teks berwarna beda. Begitu sebuah teks lewat (keluar di kiri),
   ia berganti warna sebelum muncul lagi di putaran berikutnya.
   Warna = (indeks + 3 * putaran) mod 4. Langkah 3 menjamin dua teks bersebelahan
   tidak pernah sama, termasuk di sambungan antar-daftar. */
KR.initMarquee = function () {
  var track = KR.$(".marquee__track");
  var viewport = KR.$(".marquee__viewport");
  var lists = KR.$$(".marquee__list", track || document);
  if (!track || !viewport || lists.length < 2) return;

  var A = KR.$$("li", lists[0]);
  var B = KR.$$("li", lists[1]);
  var loop = 0;

  function paint(items, round) {
    items.forEach(function (li, i) { li.dataset.c = ((i + 3 * round) % 4 + 4) % 4; });
  }
  paint(A, 0);
  paint(B, 1);

  // Daftar A bergeser keluar lebih dulu: ganti warna tiap teks begitu ia lewat batas kiri
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var left = viewport.getBoundingClientRect().left;
      entries.forEach(function (e) {
        if (e.isIntersecting || e.boundingClientRect.right > left + 1) return;
        var i = A.indexOf(e.target);
        if (i > -1) e.target.dataset.c = ((i + 3 * (loop + 1)) % 4 + 4) % 4;
      });
    }, { root: viewport, threshold: 0 });
    A.forEach(function (li) { io.observe(li); });
  }

  // Setiap putaran, A menggantikan posisi B. Samakan warnanya lebih dulu, lalu siapkan B (di luar layar).
  track.addEventListener("animationiteration", function (e) {
    if (e.target !== track) return;
    loop++;
    paint(A, loop);
    paint(B, loop + 1);
  });
};
