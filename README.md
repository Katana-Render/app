# Katana Render — Website Promosi

Situs statis (HTML + CSS + JS murni, tanpa build, tanpa CDN). Buka `index.html` langsung di browser, atau unggah seluruh folder ke hosting statis apa pun.

## Struktur
```
index.html                 kerangka halaman (semua bagian)
css/base/                  fonts, tokens (warna terang/gelap), reset, typography, layout
css/components/            satu file per komponen: nav, hero, marquee, workflow, engines,
                           features, specs, pricing, humanity, download, faq, contact, footer, toast, buttons
js/core/                   theme-init (tanpa kedip), utils, theme, i18n, reveal
js/i18n/id.js, en.js       seluruh teks dua bahasa
js/components/             nav, hero, parallax, engines (tab), contact (salin), humanity (galeri, dialog QRIS)
js/main.js                 titik masuk
assets/img/                gambar (WebP) + ikon/favicon
assets/img/humanity/       banner Dukungan Kemanusiaan (1080x360)
assets/img/pay/            logo GoPay, QRIS, Bank Jago + kode QRIS
assets/fonts/              font lokal (Big Shoulders Display, Instrument Sans, JetBrains Mono)
```

## Mengubah isi
- **Teks / terjemahan:** edit `js/i18n/id.js` dan `js/i18n/en.js` (kunci harus sama di keduanya).
- **Warna:** `css/base/tokens.css`.
- **Link unduh:** cari `drive.google.com` di `index.html` (4 tombol, atribut `data-download`).
- **Pembayaran resmi:** bagian `#humanity` di `index.html`. Nomor GoPay dan rekening Bank Jago: ubah teks tampilan dan atribut `data-copy` (nilai yang disalin, tanpa spasi). QRIS: ganti `assets/img/pay/me-bar-code.webp` (persegi, latar putih).
- **Banner kemanusiaan:** ganti file di `assets/img/humanity/`; teks alt ada di kunci `hum.alt.*`.
- **Nomor WhatsApp:** `6285648545159` di `index.html` dan `js/core/i18n.js`.

## Catatan
- `og:image` memakai path relatif. Setelah situs punya domain, ganti dengan URL absolut agar pratinjau tautan tampil di WhatsApp/sosial media.
