# SEL — Kecil, tapi menyusun segalanya.

Website edukasi materi **Sel** (Biologi kelas XI) — proyek akhir Web Development
Kelompok 4, XI-A5, Kolese Kanisius Jakarta, tahun pelajaran 2025/2026.

## Isi website
1. **Beranda** — menyelam ke laguna, dari ikan sampai sel.
2. **Lab Sel** — sel hewan dan sel tumbuhan beserta organelnya.
3. **Gerbang Sel** — membran plasma dan transpor zat.
4. **Lab Osmosis** — sel di larutan hipotonik, isotonik, dan hipertonik.
5. **Kuis** — mode latihan dan mode ujian dengan laporan nilai.
6. **Rangkuman** — ringkasan materi, sumber, kredit, dan anggota kelompok.

## Cara menjalankan
Butuh Node.js versi 20 atau lebih baru.

```
npm install
npm run dev
```

Buka alamat yang muncul (biasanya http://localhost:5173). Untuk membuat versi siap online: `npm run build`.

## Struktur folder
- `*.html` — enam halaman website.
- `src/styles/` — warna, huruf, dan gaya komponen.
- `src/core/` — kode yang dipakai bersama (navigasi, footer, Mode Tenang).
- `src/pages/` — kode khusus tiap halaman.
- `src/data/` — semua teks materi dan daftar sumber dalam format JSON.
- `public/` — model 3D, video, dan gambar.
- `tools/` — alat bantu untuk memeriksa dan mengompres model 3D.
- `docs/` — materi, penjelasan kode, log pembuatan, dan audit aset.

## Sumber dan kredit
Semua sumber materi, model 3D, gambar, font, dan library dicantumkan di halaman **Rangkuman**
dan di file `src/data/credits.json`.
