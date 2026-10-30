/* Hero: banner bergeser tipis mengikuti kursor (hanya perangkat dengan mouse) */
KR.initHero = function () {
  var art = KR.$("#hero-art");
  var hero = KR.$(".hero");
  if (!art || !hero || KR.reducedMotion) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var raf = 0;
  hero.addEventListener("pointermove", function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      var r = hero.getBoundingClientRect();
      art.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      art.style.setProperty("--my", ((e.clientY - r.top) / Math.min(r.height, 700) - 0.5).toFixed(3));
      raf = 0;
    });
  });
  hero.addEventListener("pointerleave", function () {
    art.style.setProperty("--mx", 0);
    art.style.setProperty("--my", 0);
  });
};

/* Kabut hero: tekstur noise fBm yang bisa di-tile, digambar sekali di canvas kecil (tanpa file gambar).
   Animasi hanya transform + opacity; dijeda saat banner di luar layar. */
KR.initFog = function () {
  var fog = KR.$(".hero__fog");
  var stage = KR.$(".hero__stage");
  if (!fog || !stage) return;

  var W = 512, H = 128, seed = 20260;
  function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }

  // Value noise periodik (lattice membungkus) -> sambungan kiri-kanan dan atas-bawah mulus
  function octave(gx, gy) {
    var g = new Float32Array(gx * gy), out = new Float32Array(W * H), i, x, y;
    for (i = 0; i < g.length; i++) g[i] = rnd();
    for (y = 0; y < H; y++) {
      var fy = y / H * gy, y0 = Math.floor(fy), ty = fy - y0; ty = ty * ty * (3 - 2 * ty);
      var ya = (y0 % gy) * gx, yb = ((y0 + 1) % gy) * gx;
      for (x = 0; x < W; x++) {
        var fx = x / W * gx, x0 = Math.floor(fx), tx = fx - x0; tx = tx * tx * (3 - 2 * tx);
        var xa = x0 % gx, xb = (x0 + 1) % gx;
        var top = g[ya + xa] + (g[ya + xb] - g[ya + xa]) * tx;
        var bot = g[yb + xa] + (g[yb + xb] - g[yb + xa]) * tx;
        out[y * W + x] = top + (bot - top) * ty;
      }
    }
    return out;
  }

  var c = document.createElement("canvas");
  c.width = W; c.height = H;
  var ctx = c.getContext("2d");
  if (!ctx) return;

  var n = new Float32Array(W * H), amp = 0.5, total = 0, k, i;
  for (k = 0; k < 5; k++) {
    var o = octave(4 << k, Math.max(2, 1 << k));
    for (i = 0; i < n.length; i++) n[i] += o[i] * amp;
    total += amp; amp *= 0.55;
  }
  var img = ctx.createImageData(W, H), d = img.data;
  for (i = 0; i < n.length; i++) {
    var v = Math.min(1, Math.max(0, (n[i] / total - 0.36) * 2.6)); // celah + gumpalan
    d[i * 4] = 175; d[i * 4 + 1] = 238; d[i * 4 + 2] = 244;
    d[i * 4 + 3] = Math.pow(v, 1.5) * 255;
  }
  ctx.putImageData(img, 0, 0);

  function apply(url) { fog.style.setProperty("--fog-url", 'url("' + url + '")'); }
  if (c.toBlob && window.URL) c.toBlob(function (b) { apply(b ? URL.createObjectURL(b) : c.toDataURL("image/png")); });
  else apply(c.toDataURL("image/png"));

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      fog.classList.toggle("is-off", !entries[entries.length - 1].isIntersecting);
    }).observe(stage);
  }
};
